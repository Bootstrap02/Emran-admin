// src/pages/admin/AllUsers.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, } from 'react-router-dom';
import { FiMessageSquare, FiEdit, FiTrash2, FiDownload, FiLoader, FiUser, FiX, FiSend, FiArrowLeft, FiSave, FiMail, FiSearch, FiPhone, FiCalendar } from 'react-icons/fi';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const AllUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Message modal states
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState('');

  // Detail modal states
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDetailUser, setSelectedDetailUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Replace with your real API when ready
        // const res = await axios.get('YOUR_ALL_USERS_API', {
        //   headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        // });
        // setUsers(res.data);

        // Dummy data for now
        const dummy = [
          {
            _id: 'u1',
            fullname: 'Adebayo Johnson',
            email: 'adebayo.johnson@gmail.com',
            phone: '+234 812 345 6789',
            duesPaid: true,
            subscriptionPaid: false,
            role: 'prospectiveMember',
            createdAt: '2025-01-10T10:00:00Z',
          },
          {
            _id: 'u2',
            fullname: 'Fatima Ibrahim',
            email: 'fatima.ibrahim@yahoo.com',
            phone: '+234 803 456 7890',
            duesPaid: true,
            subscriptionPaid: true,
            role: 'member',
            createdAt: '2025-01-12T14:30:00Z',
          },
          {
            _id: 'u3',
            fullname: 'Chukwuma Okeke',
            email: 'chukwuma.okeke@outlook.com',
            phone: '+234 706 789 0123',
            duesPaid: false,
            subscriptionPaid: false,
            role: 'prospect',
            createdAt: '2025-01-15T09:15:00Z',
          },
        ];

        setUsers(dummy);
        setLoading(false);
      } catch (err) {
        setError('Failed to load users');
        setLoading(false);
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = (userId) => {
    if (!window.confirm('Delete this user permanently?')) return;

    // Real API: await axios.delete(`/api/admin/users/${userId}`);
    setUsers(prev => prev.filter(u => u._id !== userId));
    alert('User deleted');
  };

  // Open message modal
  const openMessageModal = (user) => {
    setSelectedUser(user);
    setMessageText('');
    setMessageModalOpen(true);
  };

  // Send message (dummy for now)
  const sendMessage = () => {
    if (!messageText.trim()) return;
    alert(`Message sent to ${selectedUser.fullname}: "${messageText}"`);
    setMessageModalOpen(false);
    setMessageText('');
    // Real API: axios.post('/api/messages', { to: selectedUser._id, text: messageText });
  };

  // Open user detail modal
  const openDetailModal = (user) => {
    setSelectedDetailUser(user);
    setDetailModalOpen(true);
  };

  if (loading) return <div className="text-center py-20 text-2xl text-[#001F5B] animate-pulse">Loading users...</div>;
  if (error) return <div className="text-center py-20 text-2xl text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#001F5B] mb-4">
            All Registered Users
          </h1>
          <p className="text-xl text-gray-600">
            Manage members, send messages, edit profiles, or remove accounts
          </p>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white">
                <tr>
                  <th className="px-6 py-5 text-left text-lg font-semibold">Name</th>
                  <th className="px-6 py-5 text-left text-lg font-semibold">Email</th>
                  <th className="px-6 py-5 text-left text-lg font-semibold">Phone</th>
                  <th className="px-6 py-5 text-left text-lg font-semibold">Dues Paid</th>
                  <th className="px-6 py-5 text-left text-lg font-semibold">Subscription</th>
                  <th className="px-6 py-5 text-center text-lg font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center text-gray-500 text-xl">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr 
                      key={user._id}
                      onClick={() => openDetailModal(user)}
                      className="hover:bg-gray-50 transition cursor-pointer"
                    >
                      <td className="px-6 py-6 whitespace-nowrap font-medium text-gray-900">
                        {user.fullname}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-gray-600">
                        {user.phone}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-center">
                        <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${
                          user.duesPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.duesPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-center">
                        <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${
                          user.subscriptionPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.subscriptionPaid ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-6">
                          {/* Message */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openMessageModal(user);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-blue-50"
                            title="Send Message"
                          >
                            <FiMessageSquare className="text-3xl" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/useredit/${user._id}`);
                            }}
                            className="text-green-600 hover:text-green-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-green-50"
                            title="Edit User"
                          >
                            <FiEdit className="text-3xl" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(user._id);
                            }}
                            className="text-red-600 hover:text-red-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-red-50"
                            title="Delete User"
                          >
                            <FiTrash2 className="text-3xl" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {messageModalOpen && selectedUser && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
          onClick={() => setMessageModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FiUser className="text-4xl" />
                <div>
                  <h2 className="text-2xl font-bold">Message to {selectedUser.fullname}</h2>
                  <p className="text-sm opacity-90">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setMessageModalOpen(false)} className="text-white hover:text-[#E30613] text-3xl">
                <FiX />
              </button>
            </div>

            {/* Message Input */}
            <div className="p-8 flex-1">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message here..."
                rows="8"
                className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition resize-none"
              />
            </div>

            {/* Send Button */}
            <div className="bg-gray-50 px-8 py-6 border-t flex justify-end">
              <button
                onClick={sendMessage}
                disabled={!messageText.trim()}
                className={`px-10 py-4 rounded-xl font-bold transition ${
                  messageText.trim()
                    ? 'bg-[#E30613] text-white hover:bg-[#c20511]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FiSend className="inline mr-2" />
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {detailModalOpen && selectedDetailUser && (
  <div
    className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
    onClick={() => setDetailModalOpen(false)}
  >
    <div
      className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10 shadow-2xl relative"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={() => setDetailModalOpen(false)}
        className="absolute top-6 right-6 text-gray-600 hover:text-[#E30613] transition text-3xl z-10"
      >
        <FiX />
      </button>

      {/* Header with Avatar & Name */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
        {/* Avatar / Profile Image */}
        <div className="flex-shrink-0">
          {selectedDetailUser.profilePic || selectedDetailUser.image ? (
            <img
              src={selectedDetailUser.profilePic || selectedDetailUser.image}
              alt={selectedDetailUser.fullname}
              className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-[#E30613] shadow-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/150?text=No+Image'; // fallback
              }}
            />
          ) : (
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gray-200 flex items-center justify-center border-4 border-[#E30613] shadow-xl">
              <FiUser className="text-6xl text-gray-500" />
            </div>
          )}
        </div>

        {/* User Info Header */}
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-bold text-[#001F5B] mb-2">
            {selectedDetailUser.fullname}
          </h2>
          <p className="text-xl text-gray-600 mb-1">{selectedDetailUser.role || 'Member'}</p>
          <p className="text-sm text-gray-500">
            Joined: {new Date(selectedDetailUser.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <FiMail className="text-2xl text-[#E30613]" />
            <div>
              <strong className="text-gray-700 block">Email</strong>
              <span>{selectedDetailUser.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <FiPhone className="text-2xl text-[#E30613]" />
            <div>
              <strong className="text-gray-700 block">Phone</strong>
              <span>{selectedDetailUser.phone || 'Not provided'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <FiCalendar className="text-2xl text-[#E30613]" />
            <div>
              <strong className="text-gray-700 block">Last Login</strong>
              <span>{selectedDetailUser.lastLogin 
                ? new Date(selectedDetailUser.lastLogin).toLocaleString() 
                : 'Never'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <strong className="text-gray-700 block">Dues Paid</strong>
            <span className={`font-bold ${selectedDetailUser.duesPaid ? 'text-green-600' : 'text-red-600'}`}>
              {selectedDetailUser.duesPaid ? 'Yes' : 'No'}
            </span>
          </div>

          <div>
            <strong className="text-gray-700 block">Subscription Active</strong>
            <span className={`font-bold ${selectedDetailUser.subscriptionPaid ? 'text-green-600' : 'text-red-600'}`}>
              {selectedDetailUser.subscriptionPaid ? 'Yes' : 'No'}
            </span>
          </div>

          <div>
            <strong className="text-gray-700 block">Address</strong>
            <span>{selectedDetailUser.address || 'Not provided'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-end">
        <button
          onClick={() => {
            setDetailModalOpen(false);
            navigate(`/useredit/${selectedDetailUser._id}`);
          }}
          className="px-10 py-4 bg-[#E30613] text-white rounded-xl hover:bg-[#c20511] transition font-bold flex items-center justify-center gap-3 shadow-lg"
        >
          <FiEdit /> Edit Profile
        </button>

        <button
          onClick={() => {
            setDetailModalOpen(false);
            openMessageModal(selectedDetailUser);
          }}
          className="px-10 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold flex items-center justify-center gap-3 shadow-lg"
        >
          <FiMessageSquare /> Send Message
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};


export const UserEdit = () => {
  const { id } = useParams(); // Get user ID from URL
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    duesPaid: false,
    subscriptionPaid: false,
    role: '',
    profilePic: '',
  });

  // Fetch single user (dummy data for now)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Replace with real API when ready
        // const res = await axios.get(`/api/admin/users/${id}`, {
        //   headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        // });
        // setUser(res.data);

        // Dummy user data
        const dummyUser = {
          _id: id,
          fullname: 'Adebayo Johnson',
          email: 'adebayo.johnson@gmail.com',
          phone: '+234 812 345 6789',
          duesPaid: true,
          subscriptionPaid: false,
          role: 'prospectiveMember',
          profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
          createdAt: '2025-01-10T10:00:00Z',
          address: '12 Adeola Odeku Street, Victoria Island, Lagos',
          duesAmount: 40000,
          lastPaymentDate: '2025-01-05',
        };

        setUser(dummyUser);
        setFormData({
          fullname: dummyUser.fullname,
          email: dummyUser.email,
          phone: dummyUser.phone,
          duesPaid: dummyUser.duesPaid,
          subscriptionPaid: dummyUser.subscriptionPaid,
          role: dummyUser.role,
          profilePic: dummyUser.profilePic,
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load user details');
        setLoading(false);
        console.error(err);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm('Save changes to this user?')) return;

    try {
      // Replace with real API
      // await axios.put(`/api/admin/users/${id}`, formData, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      // });

      alert('User updated successfully!');
      navigate('/admin/users'); // Back to all users
    } catch (err) {
      alert('Failed to update user');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20 text-2xl text-[#001F5B] animate-pulse">Loading user details...</div>;
  if (error) return <div className="text-center py-20 text-2xl text-red-600">{error}</div>;
  if (!user) return <div className="text-center py-20 text-2xl text-gray-600">User not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/users')}
          className="flex items-center gap-3 text-[#E30613] hover:text-[#c20511] font-bold text-xl mb-10 transition"
        >
          <FiArrowLeft className="text-2xl" />
          Back to All Users
        </button>

        {/* User Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-t-8 border-[#E30613]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white px-10 py-12 text-center">
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt={user.fullname}
                className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <FiUser className="w-32 h-32 mx-auto mb-6 text-white opacity-80" />
            )}
            <h1 className="text-4xl font-bold mb-2">{user.fullname}</h1>
            <p className="text-xl opacity-90">{user.role}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            {/* Full Name */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
              />
            </div>

            {/* Dues Paid */}
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                name="duesPaid"
                checked={formData.duesPaid}
                onChange={handleChange}
                className="w-6 h-6 text-[#E30613] border-gray-300 rounded focus:ring-[#E30613]"
              />
              <label className="text-lg font-medium text-gray-700">Dues Paid</label>
            </div>

            {/* Subscription Paid */}
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                name="subscriptionPaid"
                checked={formData.subscriptionPaid}
                onChange={handleChange}
                className="w-6 h-6 text-[#E30613] border-gray-300 rounded focus:ring-[#E30613]"
              />
              <label className="text-lg font-medium text-gray-700">Subscription Active</label>
            </div>

            {/* Role */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
              >
                <option value="prospect">Prospect</option>
                <option value="prospectiveMember">Prospective Member</option>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Joined On</label>
                <p className="text-gray-700 text-lg">
                  {new Date(user.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={user.address || ''}
                  onChange={handleChange}
                  className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
                />
              </div>
            </div>

            {/* CAC & Constitution (reference) */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-[#001F5B] mb-4">Association Reference</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <img
                  src="https://i.imgur.com/EXAMPLE_CAC.jpg" // Replace with your CAC image URL
                  alt="CAC Certificate"
                  className="w-full h-auto rounded-xl shadow"
                />
                <img
                  src="https://i.imgur.com/EXAMPLE_CONSTITUTION.jpg" // Replace with Constitution PDF/image
                  alt="Constitution"
                  className="w-full h-auto rounded-xl shadow"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-6 mt-10">
              <button
                type="button"
                onClick={() => navigate('/admin/users')}
                className="px-10 py-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-10 py-4 bg-[#E30613] text-white rounded-xl hover:bg-[#c20511] transition font-bold flex items-center gap-3"
              >
                <FiSave /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


// src/pages/admin/FindUser.jsx

export const FindUser = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('name'); // Default to 'name'
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]); // All users (dummy fetch)
  const [results, setResults] = useState([]); // Filtered search results
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Message modal states
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState('');

  // Detail modal states
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDetailUser, setSelectedDetailUser] = useState(null);

  // Fetch all users on mount (dummy data for now)
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        // Replace with real API
        // const res = await axios.get('YOUR_ALL_USERS_API', {
        //   headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        // });
        // setUsers(res.data);

        // Dummy data
        const dummy = [
          {
            _id: 'u1',
            fullname: 'Adebayo Johnson',
            email: 'adebayo.johnson@gmail.com',
            phone: '+234 812 345 6789',
            duesPaid: true,
            subscriptionPaid: false,
            role: 'prospectiveMember',
            createdAt: '2025-01-10T10:00:00Z',
          },
          {
            _id: 'u2',
            fullname: 'Fatima Ibrahim',
            email: 'fatima.ibrahim@yahoo.com',
            phone: '+234 803 456 7890',
            duesPaid: true,
            subscriptionPaid: true,
            role: 'member',
            createdAt: '2025-01-12T14:30:00Z',
          },
          {
            _id: 'u3',
            fullname: 'Chukwuma Okeke',
            email: 'chukwuma.okeke@outlook.com',
            phone: '+234 706 789 0123',
            duesPaid: false,
            subscriptionPaid: false,
            role: 'prospect',
            createdAt: '2025-01-15T09:15:00Z',
          },
          {
            _id: 'u4',
            fullname: 'Aisha Mohammed',
            email: 'aisha.mohammed@gmail.com',
            phone: '+234 809 876 5432',
            duesPaid: true,
            subscriptionPaid: true,
            role: 'member',
            createdAt: '2025-01-18T16:45:00Z',
          },
        ];

        setUsers(dummy);
      } catch (err) {
        setError('Failed to load user data');
        console.error(err);
      }
    };

    fetchAllUsers();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      // Filter users based on search type (case-insensitive)
      const filtered = users.filter(user => {
        const value = searchQuery.toLowerCase().trim();
        switch (searchType) {
          case 'name':
            return user.fullname.toLowerCase().includes(value);
          case 'email':
            return user.email.toLowerCase().includes(value);
          case 'phone':
            return user.phone.toLowerCase().includes(value);
          default:
            return false;
        }
      });

      setResults(filtered);
    } catch (err) {
      setError('Search failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDelete = (userId) => {
    if (!window.confirm('Delete this user?')) return;
    // Real API: await axios.delete(`/api/admin/users/${userId}`);
    setResults(prev => prev.filter(u => u._id !== userId));
    setUsers(prev => prev.filter(u => u._id !== userId));
  };

  // Open message modal
  const openMessageModal = (user) => {
    setSelectedUser(user);
    setMessageText('');
    setMessageModalOpen(true);
  };

  // Send message (dummy)
  const sendMessage = () => {
    if (!messageText.trim()) return;
    alert(`Message sent to ${selectedUser.fullname}`);
    setMessageModalOpen(false);
    // Real API: axios.post('/api/messages', { to: selectedUser._id, text: messageText });
  };

  // Open detail modal
  const openDetailModal = (user) => {
    setSelectedDetailUser(user);
    setDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#001F5B] mb-4">
            Find a User
          </h1>
          <p className="text-xl text-gray-600">
            Search members by name, email, or phone number
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          {/* Tick Boxes (Radio for single selection) */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="searchType"
                value="name"
                checked={searchType === 'name'}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-5 h-5 text-[#E30613] border-gray-300 rounded focus:ring-[#E30613]"
              />
              <span className="text-lg font-medium text-gray-700">By Name</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="searchType"
                value="email"
                checked={searchType === 'email'}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-5 h-5 text-[#E30613] border-gray-300 rounded focus:ring-[#E30613]"
              />
              <span className="text-lg font-medium text-gray-700">By Email</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="searchType"
                value="phone"
                checked={searchType === 'phone'}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-5 h-5 text-[#E30613] border-gray-300 rounded focus:ring-[#E30613]"
              />
              <span className="text-lg font-medium text-gray-700">By Phone</span>
            </label>
          </div>

          {/* Search Input */}
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                searchType === 'name' ? 'Enter full name...' :
                searchType === 'email' ? 'Enter email address...' :
                'Enter phone number...'
              }
              className="flex-1 px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-4 bg-[#E30613] text-white rounded-xl hover:bg-[#c20511] transition font-bold flex items-center gap-3"
            >
              <FiSearch /> Search
            </button>
          </div>
        </form>

        {/* Results Table */}
        {loading ? (
          <div className="text-center py-16 text-2xl text-[#001F5B] animate-pulse">
            Searching...
          </div>
        ) : error ? (
          <div className="text-center py-16 text-2xl text-red-600">
            {error}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16 text-xl text-gray-500">
            No users found matching your search
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white">
                  <tr>
                    <th className="px-6 py-5 text-left text-lg font-semibold">Name</th>
                    <th className="px-6 py-5 text-left text-lg font-semibold">Email</th>
                    <th className="px-6 py-5 text-left text-lg font-semibold">Phone</th>
                    <th className="px-6 py-5 text-left text-lg font-semibold">Dues</th>
                    <th className="px-6 py-5 text-left text-lg font-semibold">Subscription</th>
                    <th className="px-6 py-5 text-center text-lg font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.map(user => (
                    <tr
                      key={user._id}
                      onClick={() => openDetailModal(user)}
                      className="hover:bg-gray-50 transition cursor-pointer"
                    >
                      <td className="px-6 py-6 whitespace-nowrap font-medium text-gray-900">
                        {user.fullname}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-gray-600">
                        {user.phone}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-center">
                        <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${
                          user.duesPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.duesPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-center">
                        <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${
                          user.subscriptionPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.subscriptionPaid ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-6">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openMessageModal(user);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-blue-50"
                            title="Send Message"
                          >
                            <FiMessageSquare className="text-3xl" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/useredit/${user._id}`);
                            }}
                            className="text-green-600 hover:text-green-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-green-50"
                            title="Edit User"
                          >
                            <FiEdit className="text-3xl" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(user._id);
                            }}
                            className="text-red-600 hover:text-red-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-red-50"
                            title="Delete User"
                          >
                            <FiTrash2 className="text-3xl" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Message Modal */}
        {messageModalOpen && selectedUser && (
          <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
            onClick={() => setMessageModalOpen(false)}
          >
            <div 
              className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FiUser className="text-4xl" />
                  <div>
                    <h2 className="text-2xl font-bold">Message to {selectedUser.fullname}</h2>
                    <p className="text-sm opacity-90">{selectedUser.email}</p>
                  </div>
                </div>
                <button onClick={() => setMessageModalOpen(false)} className="text-white hover:text-[#E30613] text-3xl">
                  <FiX />
                </button>
              </div>

              {/* Input */}
              <div className="p-8 flex-1">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  rows="8"
                  className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition resize-none"
                />
              </div>

              {/* Send */}
              <div className="bg-gray-50 px-8 py-6 border-t flex justify-end">
                <button
                  onClick={sendMessage}
                  disabled={!messageText.trim()}
                  className={`px-10 py-4 rounded-xl font-bold transition ${
                    messageText.trim() ? 'bg-[#E30613] text-white hover:bg-[#c20511]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FiSend className="inline mr-2" /> Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Detail Modal */}
        {detailModalOpen && selectedDetailUser && (
          <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
            onClick={() => setDetailModalOpen(false)}
          >
            <div 
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-[#001F5B]">
                  User Details: {selectedDetailUser.fullname}
                </h2>
                <button onClick={() => setDetailModalOpen(false)} className="text-3xl text-gray-600 hover:text-[#E30613]">
                  <FiX />
                </button>
              </div>

              <div className="space-y-6 text-lg">
                <div>
                  <strong className="text-gray-700">Email:</strong> {selectedDetailUser.email}
                </div>
                <div>
                  <strong className="text-gray-700">Phone:</strong> {selectedDetailUser.phone}
                </div>
                <div>
                  <strong className="text-gray-700">Dues Paid:</strong>{' '}
                  <span className={selectedDetailUser.duesPaid ? 'text-green-600' : 'text-red-600'}>
                    {selectedDetailUser.duesPaid ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <strong className="text-gray-700">Subscription Active:</strong>{' '}
                  <span className={selectedDetailUser.subscriptionPaid ? 'text-green-600' : 'text-red-600'}>
                    {selectedDetailUser.subscriptionPaid ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <strong className="text-gray-700">Role:</strong> {selectedDetailUser.role}
                </div>
                <div>
                  <strong className="text-gray-700">Joined:</strong>{' '}
                  {new Date(selectedDetailUser.createdAt).toLocaleDateString('en-GB')}
                </div>
              </div>

              <div className="mt-10 flex justify-end gap-6">
                <button
                  onClick={() => navigate(`/useredit/${selectedDetailUser._id}`)}
                  className="px-8 py-4 bg-[#E30613] text-white rounded-xl hover:bg-[#c20511] transition"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    setDetailModalOpen(false);
                    openMessageModal(selectedDetailUser);
                  }}
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



export const DuesStatus = () => {
  const navigate = useNavigate();
  const [duesStatus, setDuesStatus] = useState('paid'); // 'paid' or 'unpaid'
  const [users, setUsers] = useState([]); // All users
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered by dues status
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Message modal states
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState('');

  // Detail modal states
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDetailUser, setSelectedDetailUser] = useState(null);

  // Fetch all users on mount (dummy for now)
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        // Replace with real API later
        // const res = await axios.get('YOUR_ALL_USERS_API');
        // setUsers(res.data);

        // Dummy data
        const dummy = [
          { _id: 'u1', fullname: 'Adebayo Johnson', email: 'adebayo@gmail.com', phone: '+2348123456789', duesPaid: true, subscriptionPaid: false, role: 'prospectiveMember', createdAt: '2025-01-10T10:00:00Z' },
          { _id: 'u2', fullname: 'Fatima Ibrahim', email: 'fatima@yahoo.com', phone: '+2348034567890', duesPaid: true, subscriptionPaid: true, role: 'member', createdAt: '2025-01-12T14:30:00Z' },
          { _id: 'u3', fullname: 'Chukwuma Okeke', email: 'chukwuma@outlook.com', phone: '+2347067890123', duesPaid: false, subscriptionPaid: false, role: 'prospect', createdAt: '2025-01-15T09:15:00Z' },
          { _id: 'u4', fullname: 'Aisha Mohammed', email: 'aisha@gmail.com', phone: '+2348098765432', duesPaid: false, subscriptionPaid: true, role: 'member', createdAt: '2025-01-18T16:45:00Z' },
          { _id: 'u5', fullname: 'Emeka Nwosu', email: 'emeka@yahoo.com', phone: '+2347012345678', duesPaid: true, subscriptionPaid: true, role: 'member', createdAt: '2025-01-20T08:55:00Z' },
        ];

        setUsers(dummy);
        // Default: show paid users
        setFilteredUsers(dummy.filter(u => u.duesPaid));
      } catch (err) {
        setError('Failed to load users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users when duesStatus changes
  useEffect(() => {
    setLoading(true);
    setTimeout(() => { // Simulate loader delay
      const filtered = users.filter(u => u.duesPaid === (duesStatus === 'paid'));
      setFilteredUsers(filtered);
      setLoading(false);
    }, 800); // 800ms loader for realism
  }, [duesStatus, users]);

  // Delete user
  const handleDelete = (userId) => {
    if (!window.confirm('Delete this user?')) return;
    setUsers(prev => prev.filter(u => u._id !== userId));
    setFilteredUsers(prev => prev.filter(u => u._id !== userId));
  };

  // Message modal
  const openMessageModal = (user) => {
    setSelectedUser(user);
    setMessageText('');
    setMessageModalOpen(true);
  };

  const sendMessage = () => {
    if (!messageText.trim()) return;
    alert(`Message sent to ${selectedUser.fullname}`);
    setMessageModalOpen(false);
  };

  // Detail modal
  const openDetailModal = (user) => {
    setSelectedDetailUser(user);
    setDetailModalOpen(true);
  };

  // Download PDF
  const downloadPDF = (status) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`EMRAN ${status === 'paid' ? 'Paid' : 'Unpaid'} Dues Members`, 20, 20);

    const tableColumn = ["Name", "Email", "Phone", "Dues Paid", "Joined"];
    const tableRows = (status === 'paid' ? users.filter(u => u.duesPaid) : users.filter(u => !u.duesPaid))
      .map(user => [
        user.fullname,
        user.email,
        user.phone,
        user.duesPaid ? 'Yes' : 'No',
        new Date(user.createdAt).toLocaleDateString('en-GB'),
      ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [0, 31, 91] }, // #001F5B
      styles: { fontSize: 10 },
    });

    doc.save(`${status === 'paid' ? 'Paid' : 'Unpaid'}_Dues_Members.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#001F5B] mb-4">
            Dues Status
          </h1>
          <p className="text-xl text-gray-600">
            View members by dues payment status
          </p>
        </div>

        {/* Filter Checkboxes */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            <label className="flex items-center gap-4 cursor-pointer">
              <input
                type="radio"
                name="duesStatus"
                value="paid"
                checked={duesStatus === 'paid'}
                onChange={() => setDuesStatus('paid')}
                className="w-6 h-6 text-[#E30613] border-gray-300 rounded focus:ring-[#E30613]"
              />
              <span className="text-xl font-medium text-gray-700">Dues Paid</span>
            </label>

            <label className="flex items-center gap-4 cursor-pointer">
              <input
                type="radio"
                name="duesStatus"
                value="unpaid"
                checked={duesStatus === 'unpaid'}
                onChange={() => setDuesStatus('unpaid')}
                className="w-6 h-6 text-[#E30613] border-gray-300 rounded focus:ring-[#E30613]"
              />
              <span className="text-xl font-medium text-gray-700">Dues Unpaid</span>
            </label>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-10">
            <button
              onClick={() => downloadPDF('paid')}
              className="flex items-center gap-3 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-bold"
            >
              <FiDownload /> Download Paid Dues PDF
            </button>
            <button
              onClick={() => downloadPDF('unpaid')}
              className="flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-bold"
            >
              <FiDownload /> Download Unpaid Dues PDF
            </button>
          </div>
        </div>

        {/* Results Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FiLoader className="text-6xl text-[#E30613] animate-spin" />
            <span className="ml-4 text-2xl text-gray-600">Loading {duesStatus === 'paid' ? 'paid' : 'unpaid'} users...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-2xl text-red-600">{error}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20 text-xl text-gray-500">
            No {duesStatus === 'paid' ? 'paid' : 'unpaid'} dues users found
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white">
                  <tr>
                    <th className="px-6 py-5 text-left text-lg font-semibold">Name</th>
                    <th className="px-6 py-5 text-left text-lg font-semibold">Email</th>
                    <th className="px-6 py-5 text-left text-lg font-semibold">Phone</th>
                    <th className="px-6 py-5 text-center text-lg font-semibold">Dues</th>
                    <th className="px-6 py-5 text-center text-lg font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map(user => (
                    <tr
                      key={user._id}
                      onClick={() => openDetailModal(user)}
                      className="hover:bg-gray-50 transition cursor-pointer"
                    >
                      <td className="px-6 py-6 whitespace-nowrap font-medium text-gray-900">
                        {user.fullname}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-gray-600">
                        {user.phone}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-center">
                        <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${
                          user.duesPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.duesPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-6">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openMessageModal(user);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-blue-50"
                            title="Send Message"
                          >
                            <FiMessageSquare className="text-3xl" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/useredit/${user._id}`);
                            }}
                            className="text-green-600 hover:text-green-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-green-50"
                            title="Edit User"
                          >
                            <FiEdit className="text-3xl" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(user._id);
                            }}
                            className="text-red-600 hover:text-red-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-red-50"
                            title="Delete User"
                          >
                            <FiTrash2 className="text-3xl" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Message Modal */}
        {messageModalOpen && selectedUser && (
          <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
            onClick={() => setMessageModalOpen(false)}
          >
            <div 
              className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FiUser className="text-4xl" />
                  <div>
                    <h2 className="text-2xl font-bold">Message to {selectedUser.fullname}</h2>
                    <p className="text-sm opacity-90">{selectedUser.email}</p>
                  </div>
                </div>
                <button onClick={() => setMessageModalOpen(false)} className="text-white hover:text-[#E30613] text-3xl">
                  <FiX />
                </button>
              </div>

              <div className="p-8 flex-1">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  rows="8"
                  className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition resize-none"
                />
              </div>

              <div className="bg-gray-50 px-8 py-6 border-t flex justify-end">
                <button
                  onClick={sendMessage}
                  disabled={!messageText.trim()}
                  className={`px-10 py-4 rounded-xl font-bold transition ${
                    messageText.trim() ? 'bg-[#E30613] text-white hover:bg-[#c20511]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FiSend className="inline mr-2" /> Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Detail Modal */}
        {detailModalOpen && selectedDetailUser && (
        <div
    className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
    onClick={() => setDetailModalOpen(false)}
  >
    <div
      className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10 shadow-2xl relative"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={() => setDetailModalOpen(false)}
        className="absolute top-6 right-6 text-gray-600 hover:text-[#E30613] transition text-3xl z-10"
      >
        <FiX />
      </button>

      {/* Header with Avatar & Name */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
        {/* Avatar / Profile Image */}
        <div className="flex-shrink-0">
          {selectedDetailUser.profilePic || selectedDetailUser.image ? (
            <img
              src={selectedDetailUser.profilePic || selectedDetailUser.image}
              alt={selectedDetailUser.fullname}
              className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-[#E30613] shadow-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/150?text=No+Image'; // fallback
              }}
            />
          ) : (
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gray-200 flex items-center justify-center border-4 border-[#E30613] shadow-xl">
              <FiUser className="text-6xl text-gray-500" />
            </div>
          )}
        </div>

        {/* User Info Header */}
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-bold text-[#001F5B] mb-2">
            {selectedDetailUser.fullname}
          </h2>
          <p className="text-xl text-gray-600 mb-1">{selectedDetailUser.role || 'Member'}</p>
          <p className="text-sm text-gray-500">
            Joined: {new Date(selectedDetailUser.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <FiMail className="text-2xl text-[#E30613]" />
            <div>
              <strong className="text-gray-700 block">Email</strong>
              <span>{selectedDetailUser.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <FiPhone className="text-2xl text-[#E30613]" />
            <div>
              <strong className="text-gray-700 block">Phone</strong>
              <span>{selectedDetailUser.phone || 'Not provided'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <FiCalendar className="text-2xl text-[#E30613]" />
            <div>
              <strong className="text-gray-700 block">Last Login</strong>
              <span>{selectedDetailUser.lastLogin 
                ? new Date(selectedDetailUser.lastLogin).toLocaleString() 
                : 'Never'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <strong className="text-gray-700 block">Dues Paid</strong>
            <span className={`font-bold ${selectedDetailUser.duesPaid ? 'text-green-600' : 'text-red-600'}`}>
              {selectedDetailUser.duesPaid ? 'Yes' : 'No'}
            </span>
          </div>

          <div>
            <strong className="text-gray-700 block">Subscription Active</strong>
            <span className={`font-bold ${selectedDetailUser.subscriptionPaid ? 'text-green-600' : 'text-red-600'}`}>
              {selectedDetailUser.subscriptionPaid ? 'Yes' : 'No'}
            </span>
          </div>

          <div>
            <strong className="text-gray-700 block">Address</strong>
            <span>{selectedDetailUser.address || 'Not provided'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-end">
        <button
          onClick={() => {
            setDetailModalOpen(false);
            navigate(`/useredit/${selectedDetailUser._id}`);
          }}
          className="px-10 py-4 bg-[#E30613] text-white rounded-xl hover:bg-[#c20511] transition font-bold flex items-center justify-center gap-3 shadow-lg"
        >
          <FiEdit /> Edit Profile
        </button>

        <button
          onClick={() => {
            setDetailModalOpen(false);
            openMessageModal(selectedDetailUser);
          }}
          className="px-10 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold flex items-center justify-center gap-3 shadow-lg"
        >
          <FiMessageSquare /> Send Message
        </button>
      </div>
    </div>
  </div>
        )}
      </div>
    </div>
  );
};
