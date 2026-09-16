
// Pages/RequestFunds.jsx
// BUG FIX: reads from localStorage.getItem('adminData') which is what Login.js stores
// Previously Header.js was reading 'admin' (different key) causing admin._id to be undefined

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiLoader, FiCheckCircle, FiXCircle, FiDollarSign } from 'react-icons/fi';

const API = 'https://campusbuy-backend-nkmx.onrender.com/mobilcreatepayment';

const RequestFunds = () => {
  const [admin,    setAdmin]    = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [form, setForm] = useState({
    purpose: '', amount: '', beneficiaryName: '',
    beneficiaryBank: '', beneficiaryAccount: '', additionalDetails: '',
  });

  useEffect(() => {
    // FIX: Login.js stores under 'adminData' — must read the same key
    const stored = JSON.parse(localStorage.getItem('adminData') || '{}');
    setAdmin(stored);
  }, []);

  const set = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    // FIX: check _id from adminData
    if (!admin || !admin._id) {
      setFeedback({ type: 'error', text: 'Admin session not found. Please log out and log in again.' });
      return;
    }
    setLoading(true);
    setFeedback(null);
    try {
      await axios.post(`${API}/request/${admin._id}`, form);
      setFeedback({ type: 'success', text: 'Payment request submitted. The President has been notified by email.' });
      setForm({ purpose: '', amount: '', beneficiaryName: '', beneficiaryBank: '', beneficiaryAccount: '', additionalDetails: '' });
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Submission failed. Please try again.' });
    } finally { setLoading(false); }
  };

  const inputCls = 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#001F5B] focus:outline-none transition';

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#001F5B] mb-1">Request Funds</h1>
        <p className="text-gray-500 text-sm">Complete the form below. Your request will be sent to the President for approval.</p>
      </div>

      {/* Requester info card */}
      {admin && admin.fullname && (
        <div className="bg-[#001F5B]/5 border border-[#001F5B]/20 rounded-2xl p-5 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#001F5B] text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
            {admin.fullname.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-[#001F5B]">{admin.fullname}</p>
            <p className="text-sm text-gray-500">{admin.email} · {admin.role || 'Admin'}</p>
            <p className="text-xs text-gray-400 mt-0.5">Your details will be automatically attached to this request</p>
          </div>
        </div>
      )}

      {feedback && (
        <div className={`mb-6 px-5 py-4 rounded-xl font-medium flex items-center gap-3 text-sm ${
          feedback.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {feedback.type === 'success'
            ? <FiCheckCircle className="text-xl flex-shrink-0" />
            : <FiXCircle className="text-xl flex-shrink-0" />}
          {feedback.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Purpose / Reason for Request <span className="text-red-500">*</span>
          </label>
          <textarea name="purpose" value={form.purpose} onChange={set} rows={4} required
            placeholder="Describe the purpose of this payment request in detail..."
            className={inputCls + ' resize-none'} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Amount Requested (₦) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₦</span>
            <input type="number" name="amount" value={form.amount} onChange={set} required min="1"
              placeholder="0.00" className={inputCls + ' pl-8'} />
          </div>
          {form.amount && (
            <p className="text-xs text-gray-400 mt-1">₦{Number(form.amount).toLocaleString()}</p>
          )}
        </div>

        <div className="border-t pt-5">
          <h3 className="text-sm font-bold text-[#001F5B] uppercase tracking-wide mb-4">Beneficiary Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Beneficiary Name <span className="text-red-500">*</span>
              </label>
              <input name="beneficiaryName" value={form.beneficiaryName} onChange={set} required
                placeholder="Full name of recipient" className={inputCls} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input name="beneficiaryBank" value={form.beneficiaryBank} onChange={set} required
                  placeholder="e.g. UBA, GTBank" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input name="beneficiaryAccount" value={form.beneficiaryAccount} onChange={set} required
                  placeholder="10-digit account number" className={inputCls} />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Additional Details (optional)</label>
          <textarea name="additionalDetails" value={form.additionalDetails} onChange={set} rows={3}
            placeholder="Any other information relevant to this request..."
            className={inputCls + ' resize-none'} />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
          By submitting this form, you confirm that the information provided is accurate and that this request is made in good faith on behalf of EMRAN.
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-4 rounded-xl text-white font-bold text-base transition flex items-center justify-center gap-3"
          style={{ background: loading ? '#9CA3AF' : '#001F5B' }}>
          {loading
            ? <><FiLoader className="animate-spin" /> Submitting...</>
            : <><FiDollarSign /> Submit Payment Request</>}
        </button>
      </form>
    </div>
  );
};

export default RequestFunds;
