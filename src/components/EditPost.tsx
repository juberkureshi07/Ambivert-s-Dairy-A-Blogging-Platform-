import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth, handleFirestoreError } from '../firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { Image as ImageIcon, X, Save, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Page404 } from './Page404';

export const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [postFound, setPostFound] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const docSnap = await getDoc(doc(db, 'posts', id));
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Security check: only author can edit
          if (data.authorId !== auth.currentUser?.uid) {
            navigate('/');
            return;
          }
          setPostFound(true);
          setTitle(data.title);
          setContent(data.content);
          setExistingImageUrl(data.imageUrl || null);
          setImagePreview(data.imageUrl || null);
        } else {
          setPostFound(false);
        }
      } catch (err) {
        handleFirestoreError(err, 'FETCH_POST_FOR_EDIT', `posts/${id}`);
        setPostFound(false);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setExistingImageUrl(null); // Mark for replacement
    }
  };

  const handleRemovePreview = () => {
    setImage(null);
    setImagePreview(null);
    setExistingImageUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !id) return;

    setSaving(true);
    setError(null);
    try {
      let imageUrl = existingImageUrl || '';
      
      // If a new image was selected, upload it
      if (image) {
        const storageRef = ref(storage, `posts/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      } else if (!imagePreview) {
        // Image was removed
        imageUrl = '';
      }

      await updateDoc(doc(db, 'posts', id), {
        title,
        content,
        imageUrl,
        updatedAt: serverTimestamp()
      });

      navigate(`/post/${id}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to update post. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!postFound) {
    return <Page404 />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span className="text-sm font-medium">Cancel</span>
        </button>
        <h2 className="text-lg font-bold text-gray-900">Edit Diary Entry</h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
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
            placeholder="Update your thoughts..."
            className="w-full min-h-[250px] border-none focus:ring-0 placeholder-gray-300 p-0 resize-none text-gray-700 leading-relaxed"
            required
          />
        </div>

        {imagePreview ? (
          <div className="relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
            <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <label className="cursor-pointer bg-white/90 px-4 py-2 rounded-xl text-sm font-bold text-gray-900 shadow-lg">
                Change Image
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
            <button
              type="button"
              onClick={handleRemovePreview}
              className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors shadow-lg"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer group">
            <div className="flex flex-col items-center text-gray-400 group-hover:text-indigo-500">
              <ImageIcon size={40} className="mb-2" />
              <span className="text-sm font-bold tracking-tight">Add a cover image</span>
              <span className="text-xs opacity-60 mt-1">PNG, JPG up to 5MB</span>
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        )}

        {error && (
          <div className="text-red-500 text-sm font-medium bg-red-50 p-4 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving || !title || !content}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center group"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Save size={20} className="mr-2 group-hover:-translate-y-0.5 transition-transform" />
              Save Changes
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};
