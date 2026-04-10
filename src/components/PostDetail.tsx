import React, { useEffect, useState } from 'react';
import { doc, getDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from '../firebase';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Trash2, User, Clock, Share2, Check } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  imageUrl?: string;
  timestamp: Timestamp;
}

export const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      const postPath = `posts/${id}`;
      try {
        const docSnap = await getDoc(doc(db, postPath));
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as Post);
        } else {
          navigate('/');
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, postPath);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!post || !id) return;
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    const postPath = `posts/${id}`;
    try {
      await deleteDoc(doc(db, postPath));
      navigate('/');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, postPath);
    }
  };

  const handleShare = async () => {
    if (!post) return;
    const shareUrl = `${window.location.origin}/post/${post.id}`;
    const shareData = {
      title: post.title,
      text: `Check out this post on Ambivert’s Diary: ${post.title}`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!post) return null;

  const isAuthor = auth.currentUser?.uid === post.authorId;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-64 object-cover"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                <User size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{post.authorName}</p>
                <div className="flex items-center text-xs text-gray-400">
                  <Clock size={12} className="mr-1" />
                  <span>{post.timestamp ? formatDistanceToNow(post.timestamp.toDate(), { addSuffix: true }) : 'Just now'}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 relative">
              <button
                onClick={handleShare}
                className={`p-2 rounded-full transition-all ${copied ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
              >
                {copied ? <Check size={20} /> : <Share2 size={20} />}
              </button>
              {copied && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
                  Link copied!
                </div>
              )}
              {isAuthor && (
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>
          <div className="prose prose-indigo max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>
        </div>
      </div>
    </div>
  );
};
