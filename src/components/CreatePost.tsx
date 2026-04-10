import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth, OperationType, handleFirestoreError } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon, X, Send } from 'lucide-react';

export const CreatePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setLoading(true);
    try {
      let imageUrl = '';
      if (image) {
        const storageRef = ref(storage, `posts/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      const postsPath = 'posts';
      await addDoc(collection(db, postsPath), {
        title,
        content,
        imageUrl,
        authorId: auth.currentUser?.uid,
        authorName: auth.currentUser?.displayName || 'Anonymous',
        timestamp: serverTimestamp()
      });

      navigate('/');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'posts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title"
          className="w-full text-xl font-bold border-none focus:ring-0 placeholder-gray-300 p-0 mb-4"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full min-h-[200px] border-none focus:ring-0 placeholder-gray-300 p-0 resize-none text-gray-700"
          required
        />
      </div>

      {imagePreview ? (
        <div className="relative rounded-xl overflow-hidden shadow-sm border border-gray-100">
          <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
          <button
            type="button"
            onClick={() => { setImage(null); setImagePreview(null); }}
            className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer group">
          <div className="flex flex-col items-center text-gray-400 group-hover:text-indigo-500">
            <ImageIcon size={32} className="mb-2" />
            <span className="text-sm font-medium">Add an image (optional)</span>
          </div>
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>
      )}

      <button
        type="submit"
        disabled={loading || !title || !content}
        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <>
            <Send size={20} className="mr-2" />
            Publish Post
          </>
        )}
      </button>
    </form>
  );
};
