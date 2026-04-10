import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../firebase';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Clock, User } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  imageUrl?: string;
  timestamp: Timestamp;
}

export const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postsPath = 'posts';
    const q = query(collection(db, postsPath), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, postsPath);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
        <p className="text-gray-500">Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Link
          key={post.id}
          to={`/post/${post.id}`}
          className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow active:scale-[0.99]"
        >
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-48 object-cover"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.content}</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center">
                <User size={12} className="mr-1" />
                <span className="font-medium text-gray-500">{post.authorName || 'Anonymous'}</span>
              </div>
              <div className="flex items-center">
                <Clock size={12} className="mr-1" />
                <span>{post.timestamp ? formatDistanceToNow(post.timestamp.toDate(), { addSuffix: true }) : 'Just now'}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
