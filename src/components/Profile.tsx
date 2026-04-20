import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError } from '../firebase';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Clock, User as UserIcon, Calendar, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { Page404 } from './Page404';

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  imageUrl?: string;
  timestamp: Timestamp;
}

interface UserProfile {
  uid: string;
  displayName?: string;
  email: string;
  photoURL?: string;
  createdAt?: Timestamp;
}

export const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    // Fetch user profile info
    const fetchProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    // Fetch user's posts
    const postsPath = 'posts';
    const q = query(
      collection(db, postsPath),
      where('authorId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    const unsubscribePosts = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, 'LIST_USER_POSTS', postsPath);
    });

    fetchProfile();
    return () => unsubscribePosts();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!profile && !loading) {
    return <Page404 />;
  }

  return (
    <div className="space-y-6">
      {/* Profile Header Block */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="px-6 pb-6 text-center -mt-12">
          <div className="inline-block p-1 bg-white rounded-full shadow-lg mb-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-white">
              {profile?.photoURL ? (
                <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={40} className="text-gray-300" />
              )}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{profile?.displayName || 'Anonymous User'}</h2>
          
          <div className="mt-4 flex flex-col items-center space-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <Mail size={14} className="mr-2" />
              <span>{profile?.email}</span>
            </div>
            {profile?.createdAt && (
              <div className="flex items-center">
                <Calendar size={14} className="mr-2" />
                <span>Joined {formatDistanceToNow(profile.createdAt.toDate(), { addSuffix: true })}</span>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center space-x-8 border-t border-gray-50 pt-6">
            <div>
              <div className="text-xl font-bold text-indigo-600">{posts.length}</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Posts</div>
            </div>
          </div>
        </div>
      </div>

      {/* User's Posts Feed */}
      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Timeline</h3>
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-200">
              <MessageSquare size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500 text-sm">No thoughts shared yet.</p>
            </div>
          ) : (
            posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={`/post/${post.id}`}
                  className="block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all active:scale-[0.98]"
                >
                  {post.imageUrl && (
                    <img src={post.imageUrl} alt={post.title} className="w-full h-32 object-cover" />
                  )}
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">{post.title}</h4>
                    <p className="text-gray-500 text-xs line-clamp-2 mb-3">{post.content}</p>
                    <div className="flex items-center text-[10px] text-gray-400 font-medium">
                      <Clock size={10} className="mr-1" />
                      <span>{post.timestamp ? formatDistanceToNow(post.timestamp.toDate(), { addSuffix: true }) : 'Just now'}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
