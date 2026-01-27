// src/pages/admin/CreateNotification.jsx
import React, { useState } from 'react';

export const CreateNotification = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files[0]) setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Replace with your real API
      // const formData = new FormData();
      // formData.append('title', title);
      // formData.append('body', body);
      // if (image) formData.append('image', image);
      // await axios.post('/api/admin/notifications', formData);

      alert('Notification created successfully!');
      setTitle('');
      setBody('');
      setImage(null);
    } catch (err) {
      alert('Failed to create notification');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-bold text-[#001F5B] mb-8 text-center">
          Create New Notification
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Notification Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Dues Reminder"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
              required
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Message Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write the notification message here..."
              rows="6"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
              required
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Upload Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl file:mr-6 file:py-3 file:px-8 file:rounded-full file:border-0 file:bg-[#E30613]/10 file:text-[#E30613] file:font-medium hover:file:bg-[#E30613]/20 transition"
            />
            {image && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-48 h-48 object-cover rounded-xl border border-gray-200"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-xl text-white font-bold text-xl transition ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#E30613] hover:bg-[#c20511]'
            }`}
          >
            {loading ? 'Creating...' : 'Create Notification'}
          </button>
        </form>
      </div>
    </div>
  );
};

export const CreateNewsevent = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files[0]) setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Replace with your real API
      // const formData = new FormData();
      // formData.append('title', title);
      // formData.append('body', body);
      // if (image) formData.append('image', image);
      // await axios.post('/api/admin/newsevents', formData);

      alert('Newsevent created successfully!');
      setTitle('');
      setBody('');
      setImage(null);
    } catch (err) {
      alert('Failed to create newsevent');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-bold text-[#001F5B] mb-8 text-center">
          Create New Newsevent
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Newsevent Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Dues Reminder"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
              required
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Message Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write the newsevent message here..."
              rows="6"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
              required
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Upload Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl file:mr-6 file:py-3 file:px-8 file:rounded-full file:border-0 file:bg-[#E30613]/10 file:text-[#E30613] file:font-medium hover:file:bg-[#E30613]/20 transition"
            />
            {image && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-48 h-48 object-cover rounded-xl border border-gray-200"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-xl text-white font-bold text-xl transition ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#E30613] hover:bg-[#c20511]'
            }`}
          >
            {loading ? 'Creating...' : 'Create Newsevent'}
          </button>
        </form>
      </div>
    </div>
  );
};


export const CreateAlert = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files[0]) setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Replace with your real API
      // const formData = new FormData();
      // formData.append('title', title);
      // formData.append('body', body);
      // if (image) formData.append('image', image);
      // await axios.post('/api/admin/alerts', formData);

      alert('Alert created successfully!');
      setTitle('');
      setBody('');
      setImage(null);
    } catch (err) {
      alert('Failed to create alert');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-bold text-[#001F5B] mb-8 text-center">
          Create New Alert
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Alert Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Dues Reminder"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
              required
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Message Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write the nlert message here..."
              rows="6"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
              required
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Upload Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl file:mr-6 file:py-3 file:px-8 file:rounded-full file:border-0 file:bg-[#E30613]/10 file:text-[#E30613] file:font-medium hover:file:bg-[#E30613]/20 transition"
            />
            {image && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-48 h-48 object-cover rounded-xl border border-gray-200"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-xl text-white font-bold text-xl transition ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#E30613] hover:bg-[#c20511]'
            }`}
          >
            {loading ? 'Creating...' : 'Create Alert'}
          </button>
        </form>
      </div>
    </div>
  );
};

