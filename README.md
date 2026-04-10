# Ambivert’s Diary 📔

**Ambivert’s Diary** is a sophisticated, full-stack blogging application designed for those who find balance between social expression and private reflection. Built with a modern tech stack and an Android-inspired aesthetic, it provides a seamless experience for sharing thoughts, stories, and images.

---

## 🚀 Features

### 🔐 Secure Authentication
- **User Registration & Login**: Powered by Firebase Authentication.
- **Profile Management**: Users can set their display names during registration.
- **Protected Routes**: Only authenticated users can access the feed and create posts.

### 📝 Blogging Experience
- **Real-time Feed**: A dynamic list of blog posts that updates instantly as new content is published.
- **Rich Content**: Support for long-form text and high-quality image uploads.
- **Image Integration**: Seamlessly integrated with Firebase Storage for hosting post images.
- **Detailed View**: Deep-dive into any post to read the full content and see high-resolution images.

### 🛠️ User Control
- **Personal FAB**: A Floating Action Button (FAB) for quick post creation.
- **Ownership Management**: Authors have exclusive rights to delete their own posts.
- **Relative Timestamps**: Posts show "time ago" formatting (e.g., "2 hours ago") for a modern feel.

### 📱 Android-Inspired Design
- **Material UI**: Clean, card-based layouts following Material Design principles.
- **Responsive Layout**: Optimized for mobile-first viewing with a maximum width container for desktop.
- **Smooth Transitions**: Powered by `motion` for elegant route changes and interactions.

---

## 💻 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4
- **Backend/Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Auth
- **Storage**: Firebase Cloud Storage
- **Animations**: Motion (formerly Framer Motion)
- **Icons**: Lucide React
- **Date Handling**: date-fns

---

## 📂 Project Structure

### Web Application (Root)
- `/src/App.tsx`: Main routing and application logic.
- `/src/firebase.ts`: Firebase SDK initialization and error handling utilities.
- `/src/AuthContext.tsx`: Global authentication state management.
- `/src/components/`: Reusable UI components (Feed, CreatePost, Login, etc.).
- `/src/index.css`: Global styles with Tailwind CSS and custom typography.

### Android Project (`/android`)
This repository includes a complete **Android Studio Project** written in **Java**.
- `models/Post.java`: Data model for blog entries.
- `adapters/PostAdapter.java`: RecyclerView adapter for the feed.
- `activities/`: Java activities for Login, Register, Main Feed, and Post Details.
- `res/layout/`: XML layout files for all screens.

---

## 🛠️ Setup & Installation

### Web Development
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Environment Variables**:
   Ensure `GEMINI_API_KEY` and `APP_URL` are set in your environment (automatically handled in AI Studio).
3. **Run Dev Server**:
   ```bash
   npm run dev
   ```

### Android Development
1. Open the `/android` folder in **Android Studio**.
2. Add your `google-services.json` to the `app/` directory.
3. Sync Gradle and run on an emulator or physical device.

---

## 🛡️ Security Rules
The application uses strict Firestore Security Rules to ensure:
- Users can only write to their own profile.
- Only the author of a post can delete or modify it.
- Public read access is granted for the blog feed.

---

## 📝 License
This project is licensed under the Apache-2.0 License.
