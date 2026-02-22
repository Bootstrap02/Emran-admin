import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import axios from "axios";

export const PendingSignups = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch pending signups (with real API + localStorage fallback)
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        // Parse admin once inside effect (stable reference)
        const admin = JSON.parse(localStorage.getItem('admin')) || { pendingApprovals: [] };
        setPendingUsers(admin.pendingApprovals || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load pending signups');
        setLoading(false);
        console.error(err);
      }
    };

    fetchPendingUsers();
  }, []); // Empty dependency: Runs only on mount (no loop)

  // Auth check (unchanged, fine as is)
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("adminData"));
    const adminToken = JSON.parse(localStorage.getItem("adminToken"));
    if (!admin || !adminToken) {
      navigate('/');
    }
  }, [navigate]);

  const handleApprove = async (userId) => {
    if (!window.confirm('Approve this signup?')) return;

    try {
      await axios.put('https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin/approve', userId);
      alert(`Approved user: ${userId.fullname}`); // Temporary feedback

      // Refresh list (in real app, remove approved user or refetch)
      setPendingUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      alert('Failed to approve');
      console.error(err);
    }
  };

  const handleDisapprove = async (userId) => {
    if (!window.confirm('Disapprove this signup?')) return;

    try {
      await axios.put('https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin/disapprove', userId);
      alert(`Disapproved user: ${userId.fullname}`);

      // Refresh list
      setPendingUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      alert('Failed to disapprove');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-[#001F5B] animate-pulse">Loading pending signups...</div>
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#001F5B] mb-4">
            Pending Membership Requests
          </h1>
          <p className="text-xl text-gray-600">
            Review and approve/disapprove new signup requests
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white">
                <tr>
                  <th className="px-6 py-5 text-left text-lg font-semibold">Full Name</th>
                  <th className="px-6 py-5 text-left text-lg font-semibold">Email</th>
                  <th className="px-6 py-5 text-left text-lg font-semibold">Phone</th>
                  <th className="px-6 py-5 text-left text-lg font-semibold">Requested On</th>
                  <th className="px-6 py-5 text-center text-lg font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center text-gray-500 text-xl">
                      No pending signups at the moment
                    </td>
                  </tr>
                ) : (
                  pendingUsers.map(user => (
                    <tr key={user._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-6 whitespace-nowrap font-medium text-gray-900">
                        {user.fullname}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-gray-600">
                        {user.phone}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-gray-600">
                        {new Date(user.requestedAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-6">
                          <button
                            onClick={() => handleApprove(user)}
                            className="text-green-600 hover:text-green-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-green-50"
                            title="Approve"
                          >
                            <FiCheckCircle className="text-3xl" />
                          </button>

                          <button
                            onClick={() => handleDisapprove(user)}
                            className="text-red-600 hover:text-red-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-red-50"
                            title="Disapprove"
                          >
                            <FiXCircle className="text-3xl" />
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
    </div>
  );
};