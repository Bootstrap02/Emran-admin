// src/pages/NewsEvents.jsx - COMPLETELY REBUILT WITH TEMPLATES
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus, FiUpload, FiX } from 'react-icons/fi';
import NewsEventTemplateSelector from '../Components/NewsEventTemplateSelector';

const NewsEvents = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    title: '',
    body: '',
    templateType: null,
    templateId: null,
    templateData: {},
    images: [],
    id: null,
  });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [imagePreview, setImagePreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adminId] = useState(localStorage.getItem('adminId') || ''); // Get from localStorage

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get('/api/news-events');
      setItems(res.data.newsEvent || []);
    } catch (error) {
      console.error('Failed to fetch news events:', error);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setForm({
      ...form,
      templateId: template._id,
      templateType: template.templateType,
      templateData: template.templateData || {},
    });

    // Auto-generate title from template name
    setForm(prev => ({
      ...prev,
      title: template.templateName,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = selectedTemplate?.maxImages || 5;

    if (files.length + imagePreview.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed for this template`);
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(prev => [...prev, reader.result]);
        setForm(prev => ({
          ...prev,
          images: [...prev.images, file],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.body) {
      alert('Title and body are required');
      return;
    }

    setLoading(true);

    try {
      let newsEventId;

      // Create news event
      if (form.id) {
        await axios.put(`/api/news-events/${form.id}`, {
          title: form.title,
          body: form.body,
          templateType: form.templateType,
          templateId: form.templateId,
          templateData: form.templateData,
          adminId,
        });
        newsEventId = form.id;
      } else {
        const res = await axios.post(`/api/news-events/${adminId}`, {
          title: form.title,
          body: form.body,
          templateType: form.templateType,
          templateId: form.templateId,
          templateData: form.templateData,
        });
        newsEventId = res.data.newsEvent._id;
      }

      // Upload images if any
      if (form.images.length > 0) {
        const formData = new FormData();
        form.images.forEach(img => formData.append('images', img));

        await axios.put(`/api/news-events/image/${newsEventId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      fetchItems();
      resetForm();
      alert('News event created/updated successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save news event');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (item) => {
    setForm({
      title: item.title,
      body: item.body,
      templateType: item.templateType,
      templateId: item.templateId,
      templateData: item.templateData || {},
      images: [],
      id: item._id,
    });

    // Set image preview from existing images
    if (item.image && item.image.length > 0) {
      setImagePreview(item.image);
    }

    // Load template if exists
    if (item.templateId) {
      try {
        const res = await axios.get(`/api/news-templates/${item.templateId}`);
        setSelectedTemplate(res.data.template);
      } catch (error) {
        console.error('Failed to load template:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this news event?')) {
      try {
        await axios.delete(`/api/news-events/${id}`, {
          data: { adminId },
        });
        fetchItems();
        alert('Deleted successfully!');
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete');
      }
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      body: '',
      templateType: null,
      templateId: null,
      templateData: {},
      images: [],
      id: null,
    });
    setSelectedTemplate(null);
    setImagePreview([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-[#001F5B] mb-8">Manage News & Events with Templates</h1>

      {/* Template Selector */}
      <NewsEventTemplateSelector
        onTemplateSelect={handleTemplateSelect}
        selectedTemplate={selectedTemplate}
        adminId={adminId}
      />

      {/* News Event Form */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-[#001F5B] mb-6">
          {form.id ? 'Edit News Event' : 'Create News Event'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-lg font-semibold text-[#001F5B] mb-2">Title</label>
            <input
              type="text"
              placeholder="Event title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-[#E30613] focus:outline-none"
              required
            />
          </div>

          {/* Body/Description */}
          <div>
            <label className="block text-lg font-semibold text-[#001F5B] mb-2">Description</label>
            <textarea
              placeholder="Event description"
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              className="w-full p-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-[#E30613] focus:outline-none h-32"
              required
            />
          </div>

          {/* Images Upload */}
          <div>
            <label className="block text-lg font-semibold text-[#001F5B] mb-2">
              Images (Max {selectedTemplate?.maxImages || 5})
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center mb-4 hover:border-[#E30613] transition cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <FiUpload className="mx-auto text-4xl text-gray-400 mb-2" />
                <p className="text-gray-600 text-lg">Click to upload or drag images</p>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB each</p>
              </label>
            </div>

            {/* Image Preview */}
            {imagePreview.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreview.map((preview, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${idx}`}
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-[#E30613] hover:bg-[#c20511] disabled:bg-gray-400 text-white text-xl font-bold px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105"
          >
            <FiPlus /> {loading ? 'Saving...' : form.id ? 'Update Event' : 'Create Event'}
          </button>

          {form.id && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg font-bold px-6 py-3 rounded-2xl transition"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* News Events List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[#001F5B]">All News Events</h2>
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No news events yet</p>
        ) : (
          items.map(item => (
            <div key={item._id} className="bg-white rounded-3xl shadow-xl p-8 flex gap-6 hover:shadow-2xl transition">
              {/* Image */}
              {item.image && item.image.length > 0 && (
                <img
                  src={item.image[0]}
                  alt={item.title}
                  className="w-32 h-32 object-cover rounded-xl flex-shrink-0"
                />
              )}

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#001F5B] mb-2">{item.title}</h3>
                {item.templateType && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-2 capitalize">
                    {item.templateType}
                  </span>
                )}
                <p className="text-lg text-gray-700 mb-2">{item.body.substring(0, 150)}...</p>
                <p className="text-sm text-gray-500">
                  {item.image?.length || 0} images • Created {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 flex-shrink-0">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-3 rounded-lg transition"
                >
                  <FiEdit className="text-2xl" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50 p-3 rounded-lg transition"
                >
                  <FiTrash2 className="text-2xl" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsEvents;