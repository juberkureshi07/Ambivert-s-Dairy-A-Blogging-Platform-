package com.example.blogapp.activities;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.Toast;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import com.example.blogapp.R;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FieldValue;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import java.util.HashMap;
import java.util.Map;

public class CreatePostActivity extends AppCompatActivity {
    private EditText titleEdit, contentEdit;
    private ImageView imageView;
    private Button uploadBtn, postBtn;
    private ProgressBar progressBar;
    private Uri imageUri;
    private static final int PICK_IMAGE_REQUEST = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create_post);

        titleEdit = findViewById(R.id.create_title);
        contentEdit = findViewById(R.id.create_content);
        imageView = findViewById(R.id.create_image_preview);
        uploadBtn = findViewById(R.id.create_upload_button);
        postBtn = findViewById(R.id.create_post_button);
        progressBar = findViewById(R.id.create_progress);

        uploadBtn.setOnClickListener(v -> openFileChooser());
        postBtn.setOnClickListener(v -> uploadPost());
    }

    private void openFileChooser() {
        Intent intent = new Intent();
        intent.setType("image/*");
        intent.setAction(Intent.ACTION_GET_CONTENT);
        startActivityForResult(intent, PICK_IMAGE_REQUEST);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == PICK_IMAGE_REQUEST && resultCode == RESULT_OK && data != null && data.getData() != null) {
            imageUri = data.getData();
            imageView.setVisibility(View.VISIBLE);
            imageView.setImageURI(imageUri);
        }
    }

    private void uploadPost() {
        String title = titleEdit.getText().toString().trim();
        String content = contentEdit.getText().toString().trim();

        if (TextUtils.isEmpty(title) || TextUtils.isEmpty(content)) {
            Toast.makeText(this, "Title and Content are required", Toast.LENGTH_SHORT).show();
            return;
        }

        progressBar.setVisibility(View.VISIBLE);
        if (imageUri != null) {
            StorageReference storageRef = FirebaseStorage.getInstance().getReference("posts/" + System.currentTimeMillis() + ".jpg");
            storageRef.putFile(imageUri).addOnSuccessListener(taskSnapshot -> storageRef.getDownloadURL().addOnSuccessListener(uri -> saveToFirestore(title, content, uri.toString()))).addOnFailureListener(e -> {
                progressBar.setVisibility(View.GONE);
                Toast.makeText(CreatePostActivity.this, "Upload failed: " + e.getMessage(), Toast.LENGTH_SHORT).show();
            });
        } else {
            saveToFirestore(title, content, null);
        }
    }

    private void saveToFirestore(String title, String content, String imageUrl) {
        Map<String, Object> post = new HashMap<>();
        post.put("title", title);
        post.put("content", content);
        post.put("imageUrl", imageUrl);
        post.put("authorId", FirebaseAuth.getInstance().getUid());
        post.put("authorName", FirebaseAuth.getInstance().getCurrentUser().getDisplayName());
        post.put("timestamp", FieldValue.serverTimestamp());

        FirebaseFirestore.getInstance().collection("posts").add(post).addOnSuccessListener(documentReference -> {
            progressBar.setVisibility(View.GONE);
            finish();
        }).addOnFailureListener(e -> {
            progressBar.setVisibility(View.GONE);
            Toast.makeText(CreatePostActivity.this, "Error: " + e.getMessage(), Toast.LENGTH_SHORT).show();
        });
    }
}
