// src/pages/PendingSignups.jsx
import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

export const PendingSignups = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pending signups (dummy data for now)
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        // Replace with your real API when ready
        // const res = await axios.get('/api/admin/pending-signups');
        // setPendingUsers(res.data);

        // Dummy data (remove when API is ready)
        const dummy = [
          {
            _id: '1',
            fullname: 'Adebayo Johnson',
            email: 'adebayo.johnson@gmail.com',
            phone: '+234 812 345 6789',
            createdAt: '2025-01-15T10:30:00Z',
          },
          {
            _id: '2',
            fullname: 'Fatima Ibrahim',
            email: 'fatima.ibrahim@yahoo.com',
            phone: '+234 803 456 7890',
            createdAt: '2025-01-20T14:15:00Z',
          },
          {
            _id: '3',
            fullname: 'Chukwuma Okeke',
            email: 'chukwuma.okeke@outlook.com',
            phone: '+234 706 789 0123',
            createdAt: '2025-01-22T09:45:00Z',
          },
        ];

        setPendingUsers(dummy);
        setLoading(false);
      } catch (err) {
        setError('Failed to load pending signups');
        setLoading(false);
        console.error(err);
      }
    };

    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId) => {
    if (!window.confirm('Approve this signup?')) return;

    try {
      // Replace with real API
      // await axios.put(`/api/admin/approve/${userId}`);
      alert(`Approved user: ${userId}`); // Temporary feedback

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
      // Replace with real API
      // await axios.put(`/api/admin/disapprove/${userId}`);
      alert(`Disapproved user: ${userId}`);

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
                        {new Date(user.createdAt).toLocaleDateString('en-GB', {
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
                            onClick={() => handleApprove(user._id)}
                            className="text-green-600 hover:text-green-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-green-50"
                            title="Approve"
                          >
                            <FiCheckCircle className="text-3xl" />
                          </button>

                          <button
                            onClick={() => handleDisapprove(user._id)}
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



export const RejectedMembers = () => {
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch rejected signups (dummy data for now)
  useEffect(() => {
    const fetchRejectedUsers = async () => {
      try {
        // Replace with your real API when ready
        // const res = await axios.get('/api/admin/rejected-signups', {
        //   headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        // });
        // setRejectedUsers(res.data);

        // Dummy data (remove when API is ready)
        const dummy = [
          {
            _id: '101',
            fullname: 'Aisha Mohammed',
            email: 'aisha.mohammed@gmail.com',
            phone: '+234 809 876 5432',
            rejectedAt: '2025-01-10T14:20:00Z',
            reason: 'Incomplete documents', // optional field
          },
          {
            _id: '102',
            fullname: 'Emeka Nwosu',
            email: 'emeka.nwosu@yahoo.com',
            phone: '+234 701 234 5678',
            rejectedAt: '2025-01-12T09:30:00Z',
            reason: 'Duplicate application',
          },
          {
            _id: '103',
            fullname: 'Sani Bello',
            email: 'sani.bello@outlook.com',
            phone: '+234 812 987 6543',
            rejectedAt: '2025-01-18T16:45:00Z',
            reason: 'Not eligible criteria',
          },
        ];

        setRejectedUsers(dummy);
        setLoading(false);
      } catch (err) {
        setError('Failed to load rejected members');
        setLoading(false);
        console.error(err);
      }
    };

    fetchRejectedUsers();
  }, []);

  const handleApprove = async (userId) => {
    if (!window.confirm('Approve this previously rejected member?')) return;

    try {
      // Replace with real API
      // await axios.put(`/api/admin/approve/${userId}`, {}, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      // });

      alert(`Approved user: ${userId}`); // Temporary feedback

      // Remove from rejected list (or refetch)
      setRejectedUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      alert('Failed to approve');
      console.error(err);
    }
  };

  const handleDisapprove = async (userId) => {
    if (!window.confirm('Keep this member rejected?')) return;

    try {
      // Replace with real API if needed (e.g., to confirm rejection again)
      // await axios.put(`/api/admin/disapprove/${userId}`, {}, { ... });

      alert(`Kept rejected: ${userId}`);

      // Optional: could add a "rejection reason" update here
    } catch (err) {
      alert('Failed to process');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-[#001F5B] animate-pulse">Loading rejected members...</div>
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
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#001F5B] mb-4">
            Rejected Membership Requests
          </h1>
          <p className="text-xl text-gray-600">
            View and manage previously rejected signups. You can re-approve if needed.
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
                  <th className="px-6 py-5 text-left text-lg font-semibold">Rejected On</th>
                  <th className="px-6 py-5 text-center text-lg font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rejectedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center text-gray-500 text-xl">
                      No rejected members at the moment
                    </td>
                  </tr>
                ) : (
                  rejectedUsers.map(user => (
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
                        {new Date(user.rejectedAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-6">
                          {/* Approve Button */}
                          <button
                            onClick={() => handleApprove(user._id)}
                            className="text-green-600 hover:text-green-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-green-50"
                            title="Re-Approve"
                          >
                            <FiCheckCircle className="text-3xl" />
                          </button>

                          {/* Disapprove Button (keep rejected) */}
                          <button
                            onClick={() => handleDisapprove(user._id)}
                            className="text-red-600 hover:text-red-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-red-50"
                            title="Keep Rejected"
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

