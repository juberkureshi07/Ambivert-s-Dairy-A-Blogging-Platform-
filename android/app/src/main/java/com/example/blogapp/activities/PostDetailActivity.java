package com.example.blogapp.activities;

import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.bumptech.glide.Glide;
import com.example.blogapp.R;
import com.example.blogapp.models.Post;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;
import java.text.SimpleDateFormat;
import java.util.Locale;

public class PostDetailActivity extends AppCompatActivity {
    private TextView title, content, author, date;
    private ImageView image;
    private FloatingActionButton deleteFab;
    private ProgressBar progressBar;
    private FirebaseFirestore db;
    private String postId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_post_detail);

        db = FirebaseFirestore.getInstance();
        postId = getIntent().getStringExtra("postId");

        title = findViewById(R.id.detail_title);
        content = findViewById(R.id.detail_content);
        author = findViewById(R.id.detail_author);
        date = findViewById(R.id.detail_date);
        image = findViewById(R.id.detail_image);
        deleteFab = findViewById(R.id.detail_delete_fab);
        progressBar = findViewById(R.id.detail_progress);

        loadPost();
    }

    private void loadPost() {
        progressBar.setVisibility(View.VISIBLE);
        db.collection("posts").document(postId).get().addOnSuccessListener(documentSnapshot -> {
            progressBar.setVisibility(View.GONE);
            Post post = documentSnapshot.toObject(Post.class);
            if (post != null) {
                title.setText(post.getTitle());
                content.setText(post.getContent());
                author.setText("By " + post.getAuthorName());
                
                if (post.getTimestamp() != null) {
                    SimpleDateFormat sdf = new SimpleDateFormat("MMM dd, yyyy HH:mm", Locale.getDefault());
                    date.setText(sdf.format(post.getTimestamp().toDate()));
                }

                if (post.getImageUrl() != null && !post.getImageUrl().isEmpty()) {
                    image.setVisibility(View.VISIBLE);
                    Glide.with(this).load(post.getImageUrl()).into(image);
                }

                if (post.getAuthorId().equals(FirebaseAuth.getInstance().getUid())) {
                    deleteFab.setVisibility(View.VISIBLE);
                    deleteFab.setOnClickListener(v -> deletePost());
                }
            }
        });
    }

    private void deletePost() {
        db.collection("posts").document(postId).delete().addOnSuccessListener(aVoid -> {
            Toast.makeText(PostDetailActivity.this, "Post deleted", Toast.LENGTH_SHORT).show();
            finish();
        });
    }
}
