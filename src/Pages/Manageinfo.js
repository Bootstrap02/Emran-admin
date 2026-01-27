// src/pages/admin/AllNotifications.jsx
import React, { useState, useEffect } from 'react';
import { FiX, FiEdit, FiTrash2 } from 'react-icons/fi';

export const AllNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    // Fetch real data later
    // const fetchData = async () => {
    //   const res = await axios.get('/api/admin/notifications');
    //   setNotifications(res.data);
    // };
    // fetchData();

    // Dummy data
    setNotifications([
      { id: 1, title: 'Dues Reminder', body: 'Your dues expire soon', image: 'https://via.placeholder.com/150' },
      { id: 2, title: 'AGM Announcement', body: 'Annual General Meeting next month', image: null },
    ]);
    setLoading(false);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Delete this notification?')) {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setEditModalOpen(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // Update logic here (API call)
    alert('Notification updated!');
    setEditModalOpen(false);
  };

  if (loading) return <div className="text-center py-20 text-2xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-[#001F5B] mb-10 text-center">
          All Notifications
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition border border-gray-200"
            >
              {notif.image && (
                <img
                  src={notif.image}
                  alt={notif.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
              )}
              <h2 className="text-2xl font-bold text-[#001F5B] mb-3">{notif.title}</h2>
              <p className="text-gray-700 mb-6 line-clamp-3">{notif.body}</p>

              <div className="flex gap-6 justify-end">
                <button
                  onClick={() => openEditModal(notif)}
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  <FiEdit className="text-3xl" />
                </button>
                <button
                  onClick={() => handleDelete(notif.id)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <FiTrash2 className="text-3xl" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editModalOpen && editItem && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-[#001F5B]">Edit Notification</h2>
                <button onClick={() => setEditModalOpen(false)} className="text-3xl text-gray-600 hover:text-[#E30613]">
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                <input
                  type="text"
                  value={editItem.title}
                  onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                  className="w-full px-6 py-4 border rounded-xl focus:border-[#E30613]"
                  placeholder="Title"
                />
                <textarea
                  value={editItem.body}
                  onChange={(e) => setEditItem({ ...editItem, body: e.target.value })}
                  rows="6"
                  className="w-full px-6 py-4 border rounded-xl focus:border-[#E30613]"
                  placeholder="Body"
                />
                {/* Image preview or upload */}
                {editItem.image && (
                  <img src={editItem.image} alt="Current" className="w-48 h-48 object-cover rounded-xl" />
                )}
                <input type="file" accept="image/*" className="w-full" />

                <button type="submit" className="w-full py-5 bg-[#E30613] text-white font-bold rounded-xl hover:bg-[#c20511]">
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

export const AllNewsevents = () => {
  const [newsevents, setNewsevents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    // Fetch real data later
    // const fetchData = async () => {
    //   const res = await axios.get('/api/admin/newsevents');
    //   setNewsevents(res.data);
    // };
    // fetchData();

    // Dummy data
    setNewsevents([
      { id: 1, title: 'Dues Reminder', body: 'Your dues expire soon', image: 'https://via.placeholder.com/150' },
      { id: 2, title: 'AGM Announcement', body: 'Annual General Meeting next month', image: null },
    ]);
    setLoading(false);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Delete this newsevent?')) {
      setNewsevents(prev => prev.filter(n => n.id !== id));
    }
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setEditModalOpen(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // Update logic here (API call)
    alert('Newsevent updated!');
    setEditModalOpen(false);
  };

  if (loading) return <div className="text-center py-20 text-2xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-[#001F5B] mb-10 text-center">
          All Newsevents
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsevents.map(notif => (
            <div
              key={notif.id}
              className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition border border-gray-200"
            >
              {notif.image && (
                <img
                  src={notif.image}
                  alt={notif.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
              )}
              <h2 className="text-2xl font-bold text-[#001F5B] mb-3">{notif.title}</h2>
              <p className="text-gray-700 mb-6 line-clamp-3">{notif.body}</p>

              <div className="flex gap-6 justify-end">
                <button
                  onClick={() => openEditModal(notif)}
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  <FiEdit className="text-3xl" />
                </button>
                <button
                  onClick={() => handleDelete(notif.id)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <FiTrash2 className="text-3xl" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editModalOpen && editItem && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-[#001F5B]">Edit Newsevent</h2>
                <button onClick={() => setEditModalOpen(false)} className="text-3xl text-gray-600 hover:text-[#E30613]">
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                <input
                  type="text"
                  value={editItem.title}
                  onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                  className="w-full px-6 py-4 border rounded-xl focus:border-[#E30613]"
                  placeholder="Title"
                />
                <textarea
                  value={editItem.body}
                  onChange={(e) => setEditItem({ ...editItem, body: e.target.value })}
                  rows="6"
                  className="w-full px-6 py-4 border rounded-xl focus:border-[#E30613]"
                  placeholder="Body"
                />
                {/* Image preview or upload */}
                {editItem.image && (
                  <img src={editItem.image} alt="Current" className="w-48 h-48 object-cover rounded-xl" />
                )}
                <input type="file" accept="image/*" className="w-full" />

                <button type="submit" className="w-full py-5 bg-[#E30613] text-white font-bold rounded-xl hover:bg-[#c20511]">
                  Update Newsevent
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
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    // Fetch real data later
    // const fetchData = async () => {
    //   const res = await axios.get('/api/admin/nlerts');
    //   setAlerts(res.data);
    // };
    // fetchData();

    // Dummy data
    setAlerts([
      { id: 1, title: 'Dues Reminder', body: 'Your dues expire soon', image: 'https://via.placeholder.com/150' },
      { id: 2, title: 'AGM Announcement', body: 'Annual General Meeting next month', image: null },
    ]);
    setLoading(false);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Delete this alert?')) {
      setAlerts(prev => prev.filter(n => n.id !== id));
    }
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setEditModalOpen(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // Update logic here (API call)
    alert('Alert updated!');
    setEditModalOpen(false);
  };

  if (loading) return <div className="text-center py-20 text-2xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-[#001F5B] mb-10 text-center">
          All Alerts
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {alerts.map(notif => (
            <div
              key={notif.id}
              className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition border border-gray-200"
            >
              {notif.image && (
                <img
                  src={notif.image}
                  alt={notif.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
              )}
              <h2 className="text-2xl font-bold text-[#001F5B] mb-3">{notif.title}</h2>
              <p className="text-gray-700 mb-6 line-clamp-3">{notif.body}</p>

              <div className="flex gap-6 justify-end">
                <button
                  onClick={() => openEditModal(notif)}
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  <FiEdit className="text-3xl" />
                </button>
                <button
                  onClick={() => handleDelete(notif.id)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <FiTrash2 className="text-3xl" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editModalOpen && editItem && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-[#001F5B]">Edit Alert</h2>
                <button onClick={() => setEditModalOpen(false)} className="text-3xl text-gray-600 hover:text-[#E30613]">
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                <input
                  type="text"
                  value={editItem.title}
                  onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                  className="w-full px-6 py-4 border rounded-xl focus:border-[#E30613]"
                  placeholder="Title"
                />
                <textarea
                  value={editItem.body}
                  onChange={(e) => setEditItem({ ...editItem, body: e.target.value })}
                  rows="6"
                  className="w-full px-6 py-4 border rounded-xl focus:border-[#E30613]"
                  placeholder="Body"
                />
                {/* Image preview or upload */}
                {editItem.image && (
                  <img src={editItem.image} alt="Current" className="w-48 h-48 object-cover rounded-xl" />
                )}
                <input type="file" accept="image/*" className="w-full" />

                <button type="submit" className="w-full py-5 bg-[#E30613] text-white font-bold rounded-xl hover:bg-[#c20511]">
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


