package com.example.blogapp.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import com.example.blogapp.R;
import com.example.blogapp.models.Post;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Locale;

public class PostAdapter extends RecyclerView.Adapter<PostAdapter.PostViewHolder> {
    private List<Post> postList;
    private OnPostClickListener listener;

    public interface OnPostClickListener {
        void onPostClick(Post post);
    }

    public PostAdapter(List<Post> postList, OnPostClickListener listener) {
        this.postList = postList;
        this.listener = listener;
    }

    @NonNull
    @Override
    public PostViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_post, parent, false);
        return new PostViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull PostViewHolder holder, int position) {
        Post post = postList.get(position);
        holder.bind(post, listener);
    }

    @Override
    public int getItemCount() {
        return postList.size();
    }

    static class PostViewHolder extends RecyclerView.ViewHolder {
        TextView title, preview, author, date;
        ImageView image;

        public PostViewHolder(@NonNull View itemView) {
            super(itemView);
            title = itemView.findViewById(R.id.post_title);
            preview = itemView.findViewById(R.id.post_preview);
            author = itemView.findViewById(R.id.post_author);
            date = itemView.findViewById(R.id.post_date);
            image = itemView.findViewById(R.id.post_image);
        }

        public void bind(final Post post, final OnPostClickListener listener) {
            title.setText(post.getTitle());
            preview.setText(post.getContent());
            author.setText("By " + post.getAuthorName());
            
            if (post.getTimestamp() != null) {
                SimpleDateFormat sdf = new SimpleDateFormat("MMM dd, yyyy", Locale.getDefault());
                date.setText(sdf.format(post.getTimestamp().toDate()));
            }

            if (post.getImageUrl() != null && !post.getImageUrl().isEmpty()) {
                image.setVisibility(View.VISIBLE);
                Glide.with(itemView.getContext()).load(post.getImageUrl()).into(image);
            } else {
                image.setVisibility(View.GONE);
            }

            itemView.setOnClickListener(v -> listener.onPostClick(post));
        }
    }
}
