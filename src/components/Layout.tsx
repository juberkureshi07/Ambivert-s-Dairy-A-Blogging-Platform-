import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuth } from '../AuthContext';
import { LogOut, Plus, ArrowLeft, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, title = "BlogApp", showBack = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden border-x border-gray-200">
      {/* Android-style Toolbar */}
      <header className="bg-indigo-600 text-white h-16 flex items-center px-4 shadow-md sticky top-0 z-50">
        {showBack ? (
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-indigo-700 rounded-full transition-colors mr-2">
            <ArrowLeft size={24} />
          </button>
        ) : (
          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
            <UserIcon size={20} />
          </div>
        )}
        <h1 className="text-xl font-medium flex-1 truncate">{title}</h1>
        {user && (
          <button onClick={handleLogout} className="p-2 hover:bg-indigo-700 rounded-full transition-colors">
            <LogOut size={20} />
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4"
        >
          {children}
        </motion.div>
      </main>

      {/* Floating Action Button (FAB) */}
      {user && location.pathname === '/' && (
        <Link
          to="/create"
          className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-all active:scale-95 z-50"
          style={{ left: 'calc(50% + 120px)' }} // Adjust for max-width container
        >
          <Plus size={28} />
        </Link>
      )}
    </div>
  );
};
