// src/pages/ConfirmedPayments.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, } from 'react-icons/fi';
import axios from "axios";


export const ConfirmedPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const admin = JSON.parse(localStorage.getItem('admin'));
  const navigate = useNavigate();

   useEffect(() => {
    const admin= JSON.parse(localStorage.getItem("adminData"))
    const adminToken= JSON.parse(localStorage.getItem("adminToken"))
    if (!admin && !adminToken) {
      navigate('/');
      return;
    }
  }, [navigate]);

  // Fetch confirmed payments (dummy data for now)
  useEffect(() => {
    const fetchConfirmedPayments = async () => {
      try {
        const dummy = admin.paymentApprovals
        setPayments(dummy);
        setLoading(false);
      } catch (err) {
        setError('Failed to load confirmed payments');
        setLoading(false);
        console.error(err);
      }
    };

    fetchConfirmedPayments();
  }, [admin.paymentApprovals]);


const handleConfirm = async (paymentId) => {
  if (!window.confirm('Confirm this payment?')) return;

  try {
    console.log('Confirming payment for userId:', paymentId);

    const response = await axios.put(
      'https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin/approvepayment',
      { userId: paymentId }  // ← FIXED
    );
    console.log(response.data.message)
    alert(`Confirmed payment for user: ${paymentId}`);

    // Optional: update UI (mark as confirmed)
    setPayments(prev =>
      prev.map(p => p.userId === paymentId ? { ...p, status: 'Confirmed' } : p)
    );
  } catch (err) {
    console.error('Confirm error:', err.response?.data || err.message);
    alert(err.response?.data?.message || 'Failed to confirm payment');
  }
};

const handleReject = async (paymentId) => {
  if (!window.confirm('Reject this payment?')) return;

  try {
    console.log('Rejecting payment for userId:', paymentId);

    const response = await axios.put(
      'https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin/disapprovepayment',
      { userId: paymentId }  // ← FIXED
    );
    console.log(response.data.message)

    alert(`Rejected payment for user: ${paymentId}`);

    // Remove from list
    setPayments(prev => prev.filter(p => p.userId !== paymentId));
  } catch (err) {
    console.error('Reject error:', err.response?.data || err.message);
    alert(err.response?.data?.message || 'Failed to reject payment');
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-[#001F5B] animate-pulse">Loading confirmed payments...</div>
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
            Confirmed Payments
          </h1>
          <p className="text-xl text-gray-600">
            View and manage verified dues and subscription payments
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
                  <th className="px-6 py-5 text-left text-lg font-semibold">Payment Token</th>
                  <th className="px-6 py-5 text-left text-lg font-semibold">Request Time</th>
                  <th className="px-6 py-5 text-center text-lg font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-16 text-center text-gray-500 text-xl">
                      No confirmed payments yet
                    </td>
                  </tr>
                ) : (
                  payments.map(payment => (
                    <tr key={payment._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-6 whitespace-nowrap font-medium text-gray-900">
                        {payment.fullname}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-gray-600">
                        {payment.email}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-gray-600">
                        {payment.phone}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-gray-700 font-medium">
                        {payment.paymentToken}
                      </td> 
                      <td className="px-6 py-6 whitespace-nowrap text-gray-600">
                        {new Date(payment.requestedAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-6">
                          {/* Confirm Button */}
                          <button
                            onClick={() => handleConfirm(payment.userId)}
                            className="text-green-600 hover:text-green-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-green-50"
                            title="Confirm Payment"
                          >
                            <FiCheckCircle className="text-3xl" />
                          </button>

                          {/* Reject Button */}
                          <button
                            onClick={() => handleReject(payment.userId)}
                            className="text-red-600 hover:text-red-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-red-50"
                            title="Reject / Flag Issue"
                          >
                            <FiXCircle className="text-3xl" />
                          </button>

                          {/* Refund Button */}
                          {/* <button
                            onClick={() => handleRefund(payment._id)}
                            className="text-blue-600 hover:text-blue-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-blue-50"
                            title="Initiate Refund"
                          >
                            <FiRefreshCw className="text-3xl" />
                          </button> */}
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


export const AllPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const navigate = useNavigate();


   useEffect(() => {
    const admin= JSON.parse(localStorage.getItem("adminData"))
    const adminToken= JSON.parse(localStorage.getItem("adminToken"))
    if (!admin && !adminToken) {
      navigate('/');
      return;
    }
  }, [navigate]);
  // Fetch all payments (dummy for now — replace with real API)
  useEffect(() => {
    const fetchAllPayments = async () => {
      try {
        const pendingPayments= JSON.parse(localStorage.getItem("adminData"))
       await setPayments(pendingPayments.paymentApprovals);
        setLoading(false);
      } catch (err) {
        setError('Failed to load payment records');
        setLoading(false);
        console.error(err);
      }
    };

    fetchAllPayments();
  }, []);

  // Action handlers (replace with real API calls later)
  const handleConfirm = async (paymentId) => {
    if (!window.confirm('Confirm this payment?')) return;
    try {
      // await axios.put(`/api/admin/payments/${paymentId}/confirm`);
      alert(`Payment ${paymentId} confirmed`);
      setPayments(prev =>
        prev.map(p => p._id === paymentId ? { ...p, status: 'Confirmed' } : p)
      );
    } catch (err) {
      alert('Failed to confirm payment');
    }
  };

  const handleReject = async (paymentId) => {
    if (!window.confirm('Reject this payment?')) return;
    try {
      // await axios.put(`/api/admin/payments/${paymentId}/reject`);
      alert(`Payment ${paymentId} rejected`);
      setPayments(prev =>
        prev.map(p => p._id === paymentId ? { ...p, status: 'Rejected' } : p)
      );
    } catch (err) {
      alert('Failed to reject payment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-[#001F5B] animate-pulse">Loading payment records...</div>
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
            All Processed Payments
          </h1>
          <p className="text-xl text-gray-600">
            View and manage all confirmed dues and subscription payments
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white">
                <tr>
                  <th className="px-6 py-5 text-left text-lg font-semibold">Name</th>
                  <th className="px-6 py-5 text-left text-lg font-semibold">Email</th>
                  <th className="px-6 py-5 text-left text-lg font-semibold">Phone</th>
                  <th className="px-6 py-5 text-left text-lg font-semibold">Type</th>
                  <th className="px-6 py-5 text-left text-lg font-semibold">Receipt Code</th>
                  <th className="px-6 py-5 text-left text-lg font-semibold">Amount (₦)</th>
                  <th className="px-6 py-5 text-left text-lg font-semibold">Paid On</th>
                  <th className="px-6 py-5 text-center text-lg font-semibold">Status</th>
                  <th className="px-6 py-5 text-center text-lg font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-16 text-center text-gray-500 text-xl">
                      No payment records found
                    </td>
                  </tr>
                ) : (
                  payments.map(payment => (
                    <tr key={payment._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-6 whitespace-nowrap font-medium text-gray-900">
                        {payment.fullname}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-gray-600">
                        {payment.email}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-gray-600">
                        {payment.phone}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          payment.paymentType === 'Subscription' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {payment.paymentType}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap font-mono text-gray-700">
                        {payment.receiptCode}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap font-bold text-gray-900">
                        ₦{payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-gray-600">
                        {new Date(payment.paidDate).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-center">
                        <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${
                          payment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                          payment.status === 'Refunded' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-6">
                          <button
                            onClick={() => handleConfirm(payment._id)}
                            className="text-green-600 hover:text-green-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-green-50"
                            title="Confirm / Verify"
                          >
                            <FiCheckCircle className="text-3xl" />
                          </button>

                          <button
                            onClick={() => handleReject(payment._id)}
                            className="text-red-600 hover:text-red-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-red-50"
                            title="Reject / Flag Issue"
                          >
                            <FiXCircle className="text-3xl" />
                          </button>

                          {/* <button
                            onClick={() => handleRefund(payment._id)}
                            className="text-blue-600 hover:text-blue-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-blue-50"
                            title="Process Refund"
                          >
                            <FiRefreshCw className="text-3xl" />
                          </button> */}
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

