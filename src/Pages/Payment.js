
// src/pages/ConfirmedPayments.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiMessageSquare } from 'react-icons/fi';
import axios from "axios";

const API = 'https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin';

export const ConfirmedPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Auth check
  useEffect(() => {
    const adminData  = JSON.parse(localStorage.getItem('adminData'));
    const adminToken = JSON.parse(localStorage.getItem('adminToken'));
    if (!adminData || !adminToken) { navigate('/'); return; }

    try {
      // FIX: was reading from 'admin' — correct key is 'adminData'
      setPayments(adminData.paymentApprovals || []);
    } catch (err) {
      setError('Failed to load confirmed payments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  
  const handleConfirm = async (payment) => {
    if (!window.confirm(`Confirm payment for ${payment.fullname}?`)) return;
    try {
      // payment.year === true means this is a renewal (next year dues)
      // payment.year === false/undefined means this is first-time membership payment (current year)
      const url = payment.year ? `${API}/approvenextpayment` : `${API}/approvepayment`;
      const response = await axios.put(url, { userId: payment.userId });
      alert(response.data.message || `Payment confirmed for ${payment.fullname}`);
      setPayments(prev => prev.map(p =>
        p.userId === payment.userId ? { ...p, status: 'Confirmed' } : p
      ));
    } catch (err) {
      const errRes = err.response;
      console.error('Confirm error:', errRes?.data || err.message);
      if (errRes?.status === 400) {
        alert(errRes.data?.message || `Payment for ${payment.fullname} was rejected or already recorded.`);
        setPayments(prev => prev.map(p =>
          p.userId === payment.userId ? { ...p, status: 'Already Recorded' } : p
        ));
      } else {
        alert(errRes?.data?.message || 'Failed to confirm payment');
      }
    }
  };


  const handleReject = async (payment) => {
    if (!window.confirm(`Reject payment for ${payment.fullname}?`)) return;
    try {
      const response = await axios.put(`${API}/disapprovepayment`, { userId: payment.userId });
      alert(response.data.message || `Payment rejected for ${payment.fullname}`);
      setPayments(prev => prev.filter(p => p.userId !== payment.userId));
    } catch (err) {
      console.error('Reject error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to reject payment');
    }
  };

  const resendWelcomeEmail = async (payment) => {
    try {
      // FIX: send payment.userId — that's the MongoDB _id of the User document
      const response = await axios.post(`${API}/resendwelcomeemail`, { id: payment.userId });
      alert(response.data.message || 'Welcome email resent successfully!');
    } catch (err) {
      console.error('Resend welcome email error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to resend welcome email');
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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#001F5B] mb-4">
            Confirmed Payments
          </h1>
          <p className="text-xl text-gray-600">
            View and manage verified dues and subscription payments
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white">
                <tr>
                  <th className="px-6 py-5 text-left text-lg font-semibold">Full Name</th>
                  <th className="px-6 py-5 text-left text-lg font-semibold">Email</th>
                  <th className="px-6 py-5 text-left text-lg font-semibold">Phone</th>
                  <th className="px-6 py-5 text-left text-lg font-semibold">Payment Token</th>
                  <th className="px-6 py-5 text-left text-lg font-semibold">Type</th>
                  <th className="px-6 py-5 text-left text-lg font-semibold">Request Time</th>
                  <th className="px-6 py-5 text-center text-lg font-semibold">Status</th>
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
                    <tr key={payment.userId} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-6 whitespace-nowrap font-medium text-gray-900">{payment.fullname}</td>
                      <td className="px-6 py-6 whitespace-nowrap text-gray-600">{payment.email}</td>
                      <td className="px-6 py-6 whitespace-nowrap text-gray-600">{payment.phone}</td>
                      <td className="px-6 py-6 whitespace-nowrap font-mono text-gray-700">{payment.paymentToken}</td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          payment.year
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {payment.year ? 'Renewal' : 'New Member'}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-gray-600">
                        {payment.requestedAt
                          ? new Date(payment.requestedAt).toLocaleString('en-GB', {
                              day: 'numeric', month: 'short', year: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            })
                          : '—'}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-center">
                        {payment.status && (
                          <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                            payment.status === 'Confirmed'        ? 'bg-green-100 text-green-800' :
                            payment.status === 'Already Recorded' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {payment.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-6">
                          {/* ✅ Approve — confirms dues payment in the backend */}
                          <button
                            onClick={() => handleConfirm(payment)}
                            className="text-green-600 hover:text-green-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-green-50"
                            title="Confirm Payment"
                          >
                            <FiCheckCircle className="text-3xl" />
                          </button>

                          {/* ✕ Reject payment */}
                          <button
                            onClick={() => handleReject(payment)}
                            className="text-red-600 hover:text-red-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-red-50"
                            title="Reject Payment"
                          >
                            <FiXCircle className="text-3xl" />
                          </button>

                          {/* 💬 Resend welcome / confirmation email */}
                          <button
                            onClick={() => resendWelcomeEmail(payment)}
                            className="text-blue-600 hover:text-blue-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-blue-50"
                            title="Resend Welcome Email"
                          >
                            <FiMessageSquare className="text-3xl" />
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
