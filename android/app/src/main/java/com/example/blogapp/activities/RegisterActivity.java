package com.example.blogapp.activities;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.example.blogapp.R;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserProfileChangeRequest;

public class RegisterActivity extends AppCompatActivity {
    private EditText nameEdit, emailEdit, passwordEdit;
    private Button registerBtn;
    private ProgressBar progressBar;
    private FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        mAuth = FirebaseAuth.getInstance();
        nameEdit = findViewById(R.id.reg_name);
        emailEdit = findViewById(R.id.reg_email);
        passwordEdit = findViewById(R.id.reg_password);
        registerBtn = findViewById(R.id.reg_button);
        progressBar = findViewById(R.id.reg_progress);

        registerBtn.setOnClickListener(v -> registerUser());
    }

    private void registerUser() {
        String name = nameEdit.getText().toString().trim();
        String email = emailEdit.getText().toString().trim();
        String password = passwordEdit.getText().toString().trim();

        if (TextUtils.isEmpty(name) || TextUtils.isEmpty(email) || TextUtils.isEmpty(password)) {
            Toast.makeText(this, "All fields are required", Toast.LENGTH_SHORT).show();
            return;
        }

        progressBar.setVisibility(View.VISIBLE);
        mAuth.createUserWithEmailAndPassword(email, password).addOnCompleteListener(task -> {
            if (task.isSuccessful()) {
                UserProfileChangeRequest profileUpdates = new UserProfileChangeRequest.Builder()
                        .setDisplayName(name).build();
                task.getResult().getUser().updateProfile(profileUpdates).addOnCompleteListener(t -> {
                    progressBar.setVisibility(View.GONE);
                    startActivity(new Intent(RegisterActivity.this, MainActivity.class));
                    finish();
                });
            } else {
                progressBar.setVisibility(View.GONE);
                Toast.makeText(RegisterActivity.this, "Error: " + task.getException().getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
