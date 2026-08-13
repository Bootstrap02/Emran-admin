// src/pages/admin/AllNotifications.jsx
import React, { useState, useEffect } from 'react';
import { FiX, FiEdit, FiTrash2, FiLoader, FiImage} from 'react-icons/fi';
import axios from "axios";


export const AllNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const allNotifications= JSON.parse(localStorage.getItem("notifications"))
  useEffect(() => {
    // Fetch real data later
    setNotifications(allNotifications)
  }, [allNotifications]);

  // Delete notification
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification? This cannot be undone.')) return;

    try {
      await axios.delete(`https://campusbuy-backend-nkmx.onrender.com/mobilcreatenotifications/${id}`);
      
      // Remove from local state
      await setNotifications(prev => prev.filter(n => n._id !== id));
      await localStorage.setItem('notifications', JSON.stringify(notifications));
      alert('Notification deleted successfully');
    } catch (err) {
      alert('Failed to delete notification: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  // Open edit modal with selected item
  const openEditModal = (item) => {
    setEditItem({ ...item }); // Deep copy to avoid mutating original
    setEditModalOpen(true);
  };

  // Handle update (PUT request)
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editItem.title.trim() || !editItem.content.trim()) {
      alert('Title and content cannot be empty');
      return;
    }

    try {
      const res = await axios.put(
        `https://campusbuy-backend-nkmx.onrender.com/mobilcreatenotifications/${editItem._id}`,
        {
          title: editItem.title,
    content: editItem.content,
        }
      );

      // Update local state with new data
      await setNotifications(prev =>
        prev.map(n => (n._id === editItem._id ? res.data.updatedNotification || editItem : n))
      );
      await localStorage.setItem('notifications', JSON.stringify(notifications));
      alert('Notification updated successfully');
      setEditModalOpen(false);
    } catch (err) {
      alert('Failed to update notification: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#001F5B] mb-12 text-center">
          All Notifications
        </h1>

        {notifications.length === 0 ? (
          <div className="text-center py-20 text-xl text-gray-600">
            No notifications found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notifications.map(notif => (
              <div
                key={notif._id}
                className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition border border-gray-200"
              >
                <h2 className="text-2xl font-bold text-[#001F5B] mb-4">{notif.title}</h2>
                <p className="text-gray-700 mb-8 line-clamp-4">{notif.content}</p>

                <div className="flex gap-6 justify-end">
                  <button
                    onClick={() => openEditModal(notif)}
                    className="text-blue-600 hover:text-blue-800 transition transform hover:scale-110"
                    title="Edit Notification"
                  >
                    <FiEdit className="text-3xl" />
                  </button>
                  <button
                    onClick={() => handleDelete(notif._id)}
                    className="text-red-600 hover:text-red-800 transition transform hover:scale-110"
                    title="Delete Notification"
                  >
                    <FiTrash2 className="text-3xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editModalOpen && editItem && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-[#001F5B]">Edit Notification</h2>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="text-3xl text-gray-600 hover:text-[#E30613] transition"
                >
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={editItem.title || ''}
                    onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
                    placeholder="Enter notification title"
                    required
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Body / Message</label>
                  <textarea
                    value={editItem.content || ''}
                    onChange={(e) => setEditItem({ ...editItem, content: e.target.value })}
                    rows="6"
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition resize-none"
                    placeholder="Enter the notification message"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-5 bg-[#E30613] text-white font-bold rounded-xl hover:bg-[#c20511] transition shadow-lg"
                >
                  Update Notification
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


      // src/pages/admin/AllNewsevents.jsx
//
// UPDATE: brought the edit modal up to parity with the Create form. The
// backend model supports `category` (enum), `eventDate`, and up to 4
// `images` — but the edit modal only ever exposed title/body/one photo.
// Now it exposes all of them.
//
// One real backend constraint to be aware of: `uploadNewseventImage`
// REPLACES the entire images array with whatever new files are sent — it
// doesn't append to the existing gallery. So "Replace Images" here uploads
// up to 4 new files and swaps out the whole gallery, rather than adding to
// it. The UI makes that explicit so it's not a surprise.


const API_BASE = 'https://campusbuy-backend-nkmx.onrender.com';
const NEWS_API = `${API_BASE}/mobilcreatenewsevents`;
const IMAGE_API = `${API_BASE}/mobilcreatenewseventsimage`;
const MAX_IMAGES = 4;

const CATEGORY_OPTIONS = [
  { value: 'general',  label: 'General' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'wedding',  label: 'Wedding' },
  { value: 'funeral',  label: 'Funeral' },
  { value: 'obituary', label: 'Obituary' },
  { value: 'event',    label: 'Event' },
  { value: 'custom',   label: 'Custom' },
];

// Normalize eventDate (ISO string from backend) to yyyy-mm-dd for <input type="date">
const toDateInputValue = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

export const AllNewsevents = () => {
  const [newsevents, setNewsevents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editImages, setEditImages] = useState([]); // new File objects, up to 4
  const [saving, setSaving] = useState(false);

  const adminData = JSON.parse(localStorage.getItem('admin') || localStorage.getItem('adminData') || '{}');
  const adminId = adminData?._id || adminData?.id || null;

  const loadNewsevents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(NEWS_API);
      const list = res.data.newsEvents || [];
      setNewsevents(list);
      localStorage.setItem('newsevents', JSON.stringify(list));
    } catch (err) {
      setError('Failed to load news & events. Pull down to refresh or try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewsevents();
  }, []);

  // Delete news/event
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this news/event? This cannot be undone.')) return;

    try {
      await axios.delete(`${NEWS_API}/${id}`, { data: { adminId } });
      const updated = newsevents.filter(n => n._id !== id);
      setNewsevents(updated);
      localStorage.setItem('newsevents', JSON.stringify(updated));
      alert('News/Event deleted successfully');
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  // Open edit modal
  const openEditModal = (item) => {
    setEditItem({
      ...item,
      category: item.category || 'general',
      eventDate: toDateInputValue(item.eventDate),
    });
    setEditImages([]);
    setEditModalOpen(true);
  };

  const handleImagePick = (e) => {
    const files = Array.from(e.target.files || []).slice(0, MAX_IMAGES);
    setEditImages(files);
  };

  // Handle update (title/body/category/eventDate first, then new images if any)
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editItem.title.trim() || !editItem.body.trim()) {
      alert('Title and body cannot be empty');
      return;
    }

    setSaving(true);

    try {
      // Step 1: Update title, body, category, eventDate
      const updateRes = await axios.put(`${NEWS_API}/${editItem._id}`, {
        title: editItem.title,
        body: editItem.body,
        category: editItem.category,
        eventDate: editItem.eventDate || null,
        adminId,
      });
      let finalDoc = updateRes.data.newsEvent || editItem;

      // Step 2: Replace images if new ones were picked
      if (editImages.length > 0) {
        const imageFormData = new FormData();
        editImages.forEach(file => imageFormData.append('images', file));
        imageFormData.append('adminId', adminId || '');

        const imgRes = await axios.put(`${IMAGE_API}/${editItem._id}`, imageFormData);
        if (imgRes.data.newsEvent) finalDoc = imgRes.data.newsEvent;
      }

      const updatedList = newsevents.map(n => (n._id === finalDoc._id ? finalDoc : n));
      setNewsevents(updatedList);
      localStorage.setItem('newsevents', JSON.stringify(updatedList));

      alert('News/Event updated successfully');
      setEditModalOpen(false);
    } catch (err) {
      alert('Failed to update: ' + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-[#001F5B] animate-pulse flex items-center gap-3">
          <FiLoader className="animate-spin" /> Loading news/events...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#001F5B] mb-12 text-center">
          All News & Events
        </h1>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 rounded-xl px-6 py-4 text-center">
            {error}
            <button onClick={loadNewsevents} className="ml-3 underline font-semibold">Retry</button>
          </div>
        )}

        {newsevents.length === 0 ? (
          <div className="text-center py-20 text-xl text-gray-600">
            No news or events found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsevents.map(event => {
              const gallery = Array.isArray(event.images) && event.images.length > 0
                ? event.images
                : (event.image ? [event.image] : []);
              return (
                <div
                  key={event._id}
                  className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition border border-gray-200"
                >
                  {gallery.length > 0 && (
                    <div className={`grid gap-2 mb-4 ${gallery.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {gallery.slice(0, 4).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={event.title}
                          className={`w-full object-cover rounded-xl ${gallery.length === 1 ? 'h-48' : 'h-24'}`}
                        />
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    {event.category && (
                      <span className="text-xs font-bold uppercase tracking-wide bg-[#001F5B]/10 text-[#001F5B] px-3 py-1 rounded-full">
                        {event.category}
                      </span>
                    )}
                    {event.eventDate && (
                      <span className="text-xs text-gray-400">
                        {new Date(event.eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-[#001F5B] mb-4">{event.title}</h2>
                  <p className="text-gray-700 mb-8 line-clamp-4">{event.body}</p>

                  <div className="flex gap-6 justify-end">
                    <button
                      onClick={() => openEditModal(event)}
                      className="text-blue-600 hover:text-blue-800 transition transform hover:scale-110"
                      title="Edit"
                    >
                      <FiEdit className="text-3xl" />
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="text-red-600 hover:text-red-800 transition transform hover:scale-110"
                      title="Delete"
                    >
                      <FiTrash2 className="text-3xl" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Edit Modal */}
        {editModalOpen && editItem && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-[#001F5B]">Edit News/Event</h2>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="text-3xl text-gray-600 hover:text-[#E30613] transition"
                >
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                {/* Category */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={editItem.category}
                    onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition bg-white"
                  >
                    {CATEGORY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={editItem.title || ''}
                    onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
                    placeholder="Enter title"
                    required
                  />
                </div>

                {/* Body */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Body / Description</label>
                  <textarea
                    value={editItem.body || ''}
                    onChange={(e) => setEditItem({ ...editItem, body: e.target.value })}
                    rows="6"
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition resize-none"
                    placeholder="Enter full content"
                    required
                  />
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Event Date (optional)</label>
                  <input
                    type="date"
                    value={editItem.eventDate}
                    onChange={(e) => setEditItem({ ...editItem, eventDate: e.target.value })}
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
                  />
                </div>

                {/* Images */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiImage /> Images (up to {MAX_IMAGES})
                  </label>

                  {(() => {
                    const currentGallery = Array.isArray(editItem.images) && editItem.images.length > 0
                      ? editItem.images
                      : (editItem.image ? [editItem.image] : []);
                    return currentGallery.length > 0 ? (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-2">Current images:</p>
                        <div className="grid grid-cols-4 gap-2">
                          {currentGallery.map((img, i) => (
                            <img key={i} src={img} alt="" className="w-full h-20 object-cover rounded-lg border border-gray-200" />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 mb-3">No images uploaded yet.</p>
                    );
                  })()}

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagePick}
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl file:mr-6 file:py-3 file:px-8 file:rounded-full file:border-0 file:bg-[#E30613]/10 file:text-[#E30613] file:font-medium hover:file:bg-[#E30613]/20 transition"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Selecting new images replaces the entire gallery above — it doesn't add to it. Leave empty to keep the current images.
                  </p>
                  {editImages.length > 0 && (
                    <p className="text-xs text-green-600 font-medium mt-1">
                      {editImages.length} new image{editImages.length > 1 ? 's' : ''} selected — will replace current gallery on save.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full py-5 rounded-xl text-white font-bold text-xl transition flex items-center justify-center gap-3 ${
                    saving ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#E30613] hover:bg-[#c20511]'
                  }`}
                >
                  {saving ? <><FiLoader className="animate-spin" /> Updating...</> : 'Update News/Event'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


                  

    




export const AllAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Fetch all alerts from real API
const allAlerts= JSON.parse(localStorage.getItem("alerts"))
  useEffect(() => {
    // Fetch real data later
    setAlerts(allAlerts)
  }, [allAlerts]);

  // Delete alert
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this alert? This cannot be undone.')) return;

    try {
      await axios.delete(`https://campusbuy-backend-nkmx.onrender.com/mobilcreatealert/${id}`);
      
      // Remove from local state
      setAlerts(prev => prev.filter(a => a._id !== id));
      await localStorage.setItem('alerts', JSON.stringify(alerts));
      alert('Alert deleted successfully');
    } catch (err) {
      alert('Failed to delete alert: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  // Open edit modal
  const openEditModal = (item) => {
    setEditItem({ ...item }); // Deep copy
    setEditModalOpen(true);
  };

  // Handle update (PUT request - no image)
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editItem.title.trim() || !editItem.content.trim()) {
      alert('Title and content cannot be empty');
      return;
    }

    try {
      const res = await axios.put(
        `https://campusbuy-backend-nkmx.onrender.com/mobilcreatealert/${editItem._id}`,
        {
          title: editItem.title,
          content: editItem.content,
        }
      );

      // Update local state
      setAlerts(prev =>
        prev.map(a => (a._id === editItem._id ? res.data.updatedAlert || editItem : a))
      );
      await localStorage.setItem('alerts', JSON.stringify(alerts));
      alert('Alert updated successfully');
      setEditModalOpen(false);
    } catch (err) {
      alert('Failed to update alert: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#001F5B] mb-12 text-center">
          All Alerts
        </h1>

        {alerts.length === 0 ? (
          <div className="text-center py-20 text-xl text-gray-600">
            No alerts found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {alerts.map(alert => (
              <div
                key={alert._id}
                className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition border border-gray-200"
              >
                <h2 className="text-2xl font-bold text-[#001F5B] mb-4">{alert.title}</h2>
                <p className="text-gray-700 mb-8 line-clamp-4">{alert.content}</p>

                <div className="flex gap-6 justify-end">
                  <button
                    onClick={() => openEditModal(alert)}
                    className="text-blue-600 hover:text-blue-800 transition transform hover:scale-110"
                    title="Edit Alert"
                  >
                    <FiEdit className="text-3xl" />
                  </button>
                  <button
                    onClick={() => handleDelete(alert._id)}
                    className="text-red-600 hover:text-red-800 transition transform hover:scale-110"
                    title="Delete Alert"
                  >
                    <FiTrash2 className="text-3xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editModalOpen && editItem && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-[#001F5B]">Edit Alert</h2>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="text-3xl text-gray-600 hover:text-[#E30613] transition"
                >
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Alert Title</label>
                  <input
                    type="text"
                    value={editItem.title || ''}
                    onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
                    placeholder="Enter alert title"
                    required
                  />
                </div>

                {/* content */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Alert Message</label>
                  <textarea
                    value={editItem.content || ''}
                    onChange={(e) => setEditItem({ ...editItem, content: e.target.value })}
                    rows="6"
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition resize-none"
                    placeholder="Enter the alert message"
                    required
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-5 bg-[#E30613] text-white font-bold rounded-xl hover:bg-[#c20511] transition shadow-lg"
                >
                  Update Alert
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


