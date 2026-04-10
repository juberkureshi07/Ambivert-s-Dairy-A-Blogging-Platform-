import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Feed } from './components/Feed';
import { CreatePost } from './components/CreatePost';
import { PostDetail } from './components/PostDetail';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={
        <Layout title="Login">
          <Login />
        </Layout>
      } />
      <Route path="/register" element={
        <Layout title="Register" showBack>
          <Register />
        </Layout>
      } />
      <Route path="/" element={
        <PrivateRoute>
          <Layout title="Blog Feed">
            <Feed />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/create" element={
        <PrivateRoute>
          <Layout title="New Post" showBack>
            <CreatePost />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/post/:id" element={
        <PrivateRoute>
          <Layout title="Post Detail" showBack>
            <PostDetail />
          </Layout>
        </PrivateRoute>
      } />
    </Routes>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
