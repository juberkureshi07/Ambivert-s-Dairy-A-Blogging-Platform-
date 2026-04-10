# Android Blogging App (Java + Firebase)

This folder contains the complete Android Studio project source code for the Blogging Application.

## Project Structure
- `app/src/main/java/com/example/blogapp/`: Java source code (Activities, Adapters, Models).
- `app/src/main/res/layout/`: XML layout files for the UI.
- `app/build.gradle`: Project dependencies and configuration.
- `app/src/main/AndroidManifest.xml`: App manifest and activity declarations.

## Setup Instructions
1. **Open in Android Studio**: Import this project into Android Studio.
2. **Firebase Setup**:
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Create a new project.
   - Add an Android app with package name `com.example.blogapp`.
   - Download the `google-services.json` file and place it in the `app/` directory of this project.
3. **Enable Services**:
   - Enable **Authentication** (Email/Password).
   - Enable **Cloud Firestore** (Start in test mode or use the provided `firestore.rules`).
   - Enable **Firebase Storage** (For image uploads).
4. **Build and Run**: Sync Gradle and run the app on an emulator or physical device.

## Features
- User Authentication (Login/Register).
- Real-time Blog Feed using Firestore.
- Create Post with Image Upload to Firebase Storage.
- Post Detail view with Delete functionality for authors.
- Clean Material Design UI.
