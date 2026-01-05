// src/pages/Dashboard.jsx — FIXED VERSION
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTrash2, FiEdit, FiCheckCircle, FiXCircle, FiSearch } from 'react-icons/fi';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Sample API
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/admin/users/${id}/approve`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // FIXED: Added handleDisapprove
  const handleDisapprove = async (id) => {
    try {
      await axios.put(`/api/admin/users/${id}/disapprove`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete user?')) {
      try {
        await axios.delete(`/api/admin/users/${id}`);
        fetchUsers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.fullname.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center py-20 text-2xl text-gray-600">Loading members...</div>;

  return (
    <div>
      <h1 className="text-5xl font-extrabold text-[#001F5B] mb-8">Member Management</h1>
      
      {/* Recent Updates */}
      <div className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white rounded-3xl shadow-2xl p-10 mb-12">
        <h2 className="text-3xl font-bold mb-6">Pending Actions</h2>
        <p className="text-xl opacity-90">
          3 new membership requests • 2 profile updates pending • 1 support ticket
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-10">
        <input 
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-6 pl-16 border-2 border-gray-200 rounded-3xl text-xl focus:border-[#E30613] transition shadow-lg"
        />
        <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl text-gray-400" />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white">
              <tr>
                <th className="px-10 py-8 text-left text-lg">Full Name</th>
                <th className="px-10 py-8 text-left text-lg">Email</th>
                <th className="px-10 py-8 text-left text-lg">Phone</th>
                <th className="px-10 py-8 text-left text-lg">Status</th>
                <th className="px-10 py-8 text-center text-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-16 text-gray-500 text-xl">
                    No members found
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-10 py-8 font-medium text-lg">{user.fullname}</td>
                    <td className="px-10 py-8 text-gray-600">{user.email}</td>
                    <td className="px-10 py-8 text-gray-600">{user.phone}</td>
                    <td className="px-10 py-8">
                      <span className={`px-6 py-3 rounded-full font-bold text-lg ${
                        user.approved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.approved ? 'Approved' : 'Pending Approval'}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex justify-center gap-6">
                        {user.approved ? (
                          <button 
                            onClick={() => handleDisapprove(user.id)}
                            className="text-red-600 hover:text-red-800 transition transform hover:scale-125"
                            title="Disapprove"
                          >
                            <FiXCircle className="text-3xl" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleApprove(user.id)}
                            className="text-green-600 hover:text-green-800 transition transform hover:scale-125"
                            title="Approve"
                          >
                            <FiCheckCircle className="text-3xl" />
                          </button>
                        )}
                        <button className="text-blue-600 hover:text-blue-800 transition transform hover:scale-125" title="Edit">
                          <FiEdit className="text-3xl" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-800 transition transform hover:scale-125"
                          title="Delete"
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
  );
};

export default Dashboard;