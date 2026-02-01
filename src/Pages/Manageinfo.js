// src/pages/admin/AllNotifications.jsx
import React, { useState, useEffect } from 'react';
import { FiX, FiEdit, FiTrash2 } from 'react-icons/fi';


export const AllNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const allNotifications= JSON.parse(localStorage.getItem("notifications"))
  useEffect(() => {
    // Fetch real data later
    setNotifications(allNotifications)
  }, []);

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

    if (!editItem.title.trim() || !editItem.body.trim()) {
      alert('Title and body cannot be empty');
      return;
    }

    try {
      const res = await axios.put(
        `https://campusbuy-backend-nkmx.onrender.com/mobilcreatenotifications/${editItem._id}`,
        {
          title: editItem.title,
          body: editItem.body,
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-[#001F5B] animate-pulse">Loading notifications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-red-600">{error}</div>
      </div>
    );
  }

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
                <p className="text-gray-700 mb-8 line-clamp-4">{notif.body}</p>

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

                {/* Body */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Body / Message</label>
                  <textarea
                    value={editItem.body || ''}
                    onChange={(e) => setEditItem({ ...editItem, body: e.target.value })}
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


export const AllNewsevents = () => {
  const [newsevents, setNewsevents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editImage, setEditImage] = useState(null); // For new image upload during edit

  const allNewsevents= JSON.parse(localStorage.getItem("newsevents"))
  useEffect(() => {
    // Fetch real data later
    setNewsevents(allNewsevents)
  }, []);


  // Delete news/event
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this news/event? This cannot be undone.')) return;

    try {
      await axios.delete(`https://campusbuy-backend-nkmx.onrender.com/mobilcreatenewsevents/${id}`);
      
      // Remove from local state
      await setNewsevents(prev => prev.filter(n => n._id !== id));
      await localStorage.setItem('newsevents', JSON.stringify(newsevents));
      alert('News/Event deleted successfully');
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  // Open edit modal
  const openEditModal = (item) => {
    setEditItem({ ...item }); // Copy to avoid mutating original
    setEditImage(null); // Reset any new image selection
    setEditModalOpen(true);
  };

  // Handle update (two API calls: title/body first, then image if uploaded)
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editItem.title.trim() || !editItem.body.trim()) {
      alert('Title and body cannot be empty');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Update title & body
      const updateRes = await axios.put(
        `https://campusbuy-backend-nkmx.onrender.com/mobilcreatenewsevents/${editItem._id}`,
        {
          title: editItem.title,
          body: editItem.body,
        }
      );

      // Step 2: Upload new image if selected
      if (editImage) {
        const imageFormData = new FormData();
        imageFormData.append('image', editImage);

        await axios.put(
          `https://campusbuy-backend-nkmx.onrender.com/mobilcreatenewsevents/image/${editItem._id}`,
          imageFormData
        );
      }

      // Update local state with new data
      setNewsevents(prev =>
        prev.map(n => (n._id === editItem._id ? updateRes.data.updatedNewsEvent || editItem : n))
      );
      await localStorage.setItem('newsevents', JSON.stringify(newsevents));

      alert('News/Event updated successfully');
      setEditModalOpen(false);
    } catch (err) {
      alert('Failed to update: ' + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setEditImage(e.target.files[0]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-[#001F5B] animate-pulse">Loading news/events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#001F5B] mb-12 text-center">
          All News & Events
        </h1>

        {newsevents.length === 0 ? (
          <div className="text-center py-20 text-xl text-gray-600">
            No news or events found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsevents.map(event => (
              <div
                key={event._id}
                className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition border border-gray-200"
              >
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                )}
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
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editModalOpen && editItem && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-[#001F5B]">
                  Edit {editItem.type === 'event' ? 'Event' : 'News'}
                </h2>
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

                {/* Image Replacement (optional) */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Replace Image (optional)
                  </label>
                  {editItem.image && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Current image:</p>
                      <img
                        src={editItem.image}
                        alt="Current"
                        className="w-48 h-48 object-cover rounded-xl border border-gray-200 mt-2"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditImage(e.target.files[0])}
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl file:mr-6 file:py-3 file:px-8 file:rounded-full file:border-0 file:bg-[#E30613]/10 file:text-[#E30613] file:font-medium hover:file:bg-[#E30613]/20 transition"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-5 rounded-xl text-white font-bold text-xl transition ${
                    loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#E30613] hover:bg-[#c20511]'
                  }`}
                >
                  {loading ? 'Updating...' : 'Update News/Event'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};








// export const AllAlerts = () => {
//   const [alerts, setAlerts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [editItem, setEditItem] = useState(null);

//   useEffect(() => {
//     // Fetch real data later
//     // const fetchData = async () => {
//     //   const res = await axios.get('/api/admin/nlerts');
//     //   setAlerts(res.data);
//     // };
//     // fetchData();

//     // Dummy data
//     setAlerts([
//       { id: 1, title: 'Dues Reminder', body: 'Your dues expire soon', image: 'https://via.placeholder.com/150' },
//       { id: 2, title: 'AGM Announcement', body: 'Annual General Meeting next month', image: null },
//     ]);
//     setLoading(false);
//   }, []);

//   const handleDelete = (id) => {
//     if (window.confirm('Delete this alert?')) {
//       setAlerts(prev => prev.filter(n => n.id !== id));
//     }
//   };

//   const openEditModal = (item) => {
//     setEditItem(item);
//     setEditModalOpen(true);
//   };

//   const handleUpdate = (e) => {
//     e.preventDefault();
//     // Update logic here (API call)
//     alert('Alert updated!');
//     setEditModalOpen(false);
//   };

//   if (loading) return <div className="text-center py-20 text-2xl">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-4xl font-bold text-[#001F5B] mb-10 text-center">
//           All Alerts
//         </h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {alerts.map(notif => (
//             <div
//               key={notif.id}
//               className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition border border-gray-200"
//             >
//               {notif.image && (
//                 <img
//                   src={notif.image}
//                   alt={notif.title}
//                   className="w-full h-48 object-cover rounded-xl mb-4"
//                 />
//               )}
//               <h2 className="text-2xl font-bold text-[#001F5B] mb-3">{notif.title}</h2>
//               <p className="text-gray-700 mb-6 line-clamp-3">{notif.body}</p>

//               <div className="flex gap-6 justify-end">
//                 <button
//                   onClick={() => openEditModal(notif)}
//                   className="text-blue-600 hover:text-blue-800 transition"
//                 >
//                   <FiEdit className="text-3xl" />
//                 </button>
//                 <button
//                   onClick={() => handleDelete(notif.id)}
//                   className="text-red-600 hover:text-red-800 transition"
//                 >
//                   <FiTrash2 className="text-3xl" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Edit Modal */}
//         {editModalOpen && editItem && (
//           <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
//             <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10">
//               <div className="flex justify-between items-center mb-8">
//                 <h2 className="text-3xl font-bold text-[#001F5B]">Edit Alert</h2>
//                 <button onClick={() => setEditModalOpen(false)} className="text-3xl text-gray-600 hover:text-[#E30613]">
//                   <FiX />
//                 </button>
//               </div>

//               <form onSubmit={handleUpdate} className="space-y-6">
//                 <input
//                   type="text"
//                   value={editItem.title}
//                   onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
//                   className="w-full px-6 py-4 border rounded-xl focus:border-[#E30613]"
//                   placeholder="Title"
//                 />
//                 <textarea
//                   value={editItem.body}
//                   onChange={(e) => setEditItem({ ...editItem, body: e.target.value })}
//                   rows="6"
//                   className="w-full px-6 py-4 border rounded-xl focus:border-[#E30613]"
//                   placeholder="Body"
//                 />
//                 {/* Image preview or upload */}
//                 {editItem.image && (
//                   <img src={editItem.image} alt="Current" className="w-48 h-48 object-cover rounded-xl" />
//                 )}
//                 <input type="file" accept="image/*" className="w-full" />

//                 <button type="submit" className="w-full py-5 bg-[#E30613] text-white font-bold rounded-xl hover:bg-[#c20511]">
//                   Update Alert
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

const AllAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Fetch all alerts from real API
  const allAlerts= JSON.parse(localStorage.getItem("alerts"))
  useEffect(() => {
    // Fetch real data later
    setAlerts(allAlerts)
  }, []);

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

    if (!editItem.title.trim() || !editItem.body.trim()) {
      alert('Title and body cannot be empty');
      return;
    }

    try {
      const res = await axios.put(
        `https://campusbuy-backend-nkmx.onrender.com/mobilcreatealert/${editItem._id}`,
        {
          title: editItem.title,
          body: editItem.body,
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-[#001F5B] animate-pulse">Loading alerts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-red-600">{error}</div>
      </div>
    );
  }

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
                <p className="text-gray-700 mb-8 line-clamp-4">{alert.body}</p>

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

                {/* Body */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Alert Message</label>
                  <textarea
                    value={editItem.body || ''}
                    onChange={(e) => setEditItem({ ...editItem, body: e.target.value })}
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

export default AllAlerts;

