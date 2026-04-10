# Ambivert’s Diary

Ambivert’s Diary is a sophisticated, full-stack blogging platform designed for seamless content creation and sharing. Built with a modern tech stack, it offers a clean, Android-inspired user interface and robust real-time features.

## 🚀 Features

- **Secure Authentication**: Complete user lifecycle management with email and password authentication.
- **Real-time Feed**: Instant updates for new blog posts without page refreshes.
- **Image Hosting**: Integrated support for uploading and displaying high-quality images.
- **Responsive Design**: A mobile-first, Material Design-inspired UI that looks great on all devices.
- **Content Management**: Authors have full control over their posts, including the ability to delete content.
- **Social Sharing**: Built-in sharing capabilities to spread your thoughts across the web.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4, Lucide Icons
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Animations**: Motion (formerly Framer Motion)
- **State Management**: React Context API

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/juberkureshi07/Ambivert-s-Dairy-A-Blogging-Platform-.git
   cd ambivert-diary
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Firebase**:
   - Create a new project in the [Firebase Console](https://console.firebase.google.com/).
   - Enable Authentication, Firestore, and Storage.
   - Create a `firebase-config.json` file in the root directory with your project credentials.

4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

## 📖 Usage

- **Register**: Create a new account to start blogging.
- **Feed**: Browse the latest posts from the community.
- **Create**: Use the Floating Action Button (FAB) to draft and publish new entries.
- **Detail**: Click on any post to view the full content and share it with others.

## 👤 Author

**Juber Kureshi**
- Website: [juberkureshi.me](https://juberkureshi.me)
- App URL: [ambivert-diary.juberkureshi.me](https://ambivert-diary.juberkureshi.me)

## 📄 License

This project is licensed under the MIT License.
