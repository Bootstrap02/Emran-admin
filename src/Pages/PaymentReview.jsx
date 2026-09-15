// pages/admin/PaymentReview.jsx
// Shared review page for President AND Secretary
// Role is determined by URL path:
//   /payments/review/:id           → President
//   /payments/secretary-review/:id → Secretary

import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FiCheckCircle, FiXCircle, FiLoader, FiAlertTriangle } from 'react-icons/fi';

const API = 'https://campusbuy-backend-nkmx.onrender.com/mobilcreatepayment';

const STATUS_COLORS = {
  PENDING:               'bg-amber-100 text-amber-700',
  PRESIDENT_APPROVED:    'bg-blue-100 text-blue-700',
  PRESIDENT_DECLINED:    'bg-red-100 text-red-700',
  SECRETARY_APPROVED:    'bg-indigo-100 text-indigo-700',
  SECRETARY_DECLINED:    'bg-red-100 text-red-700',
  TREASURER_PROCESSING:  'bg-purple-100 text-purple-700',
  COMPLETED:             'bg-green-100 text-green-700',
  CANCELLED:             'bg-gray-100 text-gray-600',
};

const PaymentReview = () => {
  const { id }    = useParams();
  const location  = useLocation();
  const isSecretary = location.pathname.includes('secretary-review');
  const role      = isSecretary ? 'Secretary' : 'President';
  const actionKey = isSecretary ? 'secretary-action' : 'president-action';

  const [pr,       setPr]       = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [acting,   setActing]   = useState(false);
  const [note,     setNote]     = useState('');
  const [feedback, setFeedback] = useState(null);
  const [done,     setDone]     = useState(false);

  const admin = JSON.parse(localStorage.getItem('adminData') || '{}');

  useEffect(() => {
    axios.get(`${API}/${id}`)
      .then(res => setPr(res.data.paymentRequest))
      .catch(() => setFeedback({ type: 'error', text: 'Could not load payment request.' }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAction = async (action) => {
    if (!window.confirm(`Confirm: ${action} this payment request?`)) return;
    setActing(true);
    try {
      await axios.put(`${API}/${id}/${actionKey}`, {
        action, note, adminId: admin._id,
      });
      setDone(true);
      setFeedback({
        type: 'success',
        text: action === 'APPROVED'
          ? `Payment request approved. ${isSecretary ? 'OTP and payment instruction sent to Treasurer.' : 'Forwarded to General Secretary for cold-eye review.'}`
          : 'Payment request declined. The requester has been notified.',
      });
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Action failed.' });
    } finally { setActing(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-[#001F5B] text-xl">Loading payment request...</div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <p className="text-xs font-bold text-[#E30613] uppercase tracking-widest mb-1">
          {role} Review
        </p>
        <h1 className="text-3xl font-extrabold text-[#001F5B]">
          {isSecretary ? 'Cold-Eye Validation' : 'Payment Approval'}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {isSecretary
            ? 'Review the payment details carefully. Validate that the information is correct before it proceeds to the Treasurer.'
            : 'Review the payment request below and approve or decline.'}
        </p>
      </div>

      {feedback && (
        <div className={`mb-6 px-5 py-4 rounded-xl font-medium flex items-center gap-3 text-sm ${
          feedback.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {feedback.type === 'success' ? <FiCheckCircle className="text-xl flex-shrink-0" /> : <FiXCircle className="text-xl flex-shrink-0" />}
          {feedback.text}
        </div>
      )}

      {pr && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[#001F5B] px-8 py-5 flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wide">Payment Request</p>
              <p className="text-white text-xl font-extrabold">{pr.requestRef}</p>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[pr.status] || 'bg-gray-100 text-gray-600'}`}>
              {pr.status.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Details */}
          <div className="p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['Requested By', `${pr.requesterName} (${pr.requesterRole})`],
                ['Date Submitted', new Date(pr.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })],
                ['Amount', `₦${Number(pr.amount).toLocaleString()}`],
                ['Amount in Words', pr.amountInWords],
                ['Beneficiary', pr.beneficiaryName],
                ['Bank', pr.beneficiaryBank],
                ['Account Number', pr.beneficiaryAccount],
              ].map(([label, value]) => (
                <div key={label} className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                  <p className={`text-sm font-semibold text-gray-800 ${label === 'Amount' ? 'text-[#001F5B] text-lg' : ''}`}>{value}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Purpose</p>
              <p className="text-sm text-gray-800 leading-relaxed">{pr.purpose}</p>
            </div>

            {pr.additionalDetails && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Additional Details</p>
                <p className="text-sm text-gray-800">{pr.additionalDetails}</p>
              </div>
            )}

            {/* Note field */}
            {!done && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {isSecretary ? 'Validation Note (optional)' : 'Decision Note (optional)'}
                </label>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
                  placeholder={isSecretary ? 'Add any observations or notes about this payment...' : 'Add a reason for approval or decline...'}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#001F5B] focus:outline-none resize-none" />
              </div>
            )}

            {/* Action buttons */}
            {!done && (
              <div className="flex gap-4 pt-2">
                <button onClick={() => handleAction('APPROVED')} disabled={acting}
                  className="flex-1 py-4 rounded-xl text-white font-bold text-sm transition flex items-center justify-center gap-2"
                  style={{ background: acting ? '#9CA3AF' : '#16a34a' }}>
                  {acting ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
                  {isSecretary ? 'Validate & Forward to Treasurer' : 'Approve Request'}
                </button>
                <button onClick={() => handleAction('DECLINED')} disabled={acting}
                  className="flex-1 py-4 rounded-xl text-white font-bold text-sm transition flex items-center justify-center gap-2"
                  style={{ background: acting ? '#9CA3AF' : '#E30613' }}>
                  {acting ? <FiLoader className="animate-spin" /> : <FiXCircle />}
                  Decline
                </button>
              </div>
            )}

            {done && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 text-green-800 font-medium text-sm flex items-center gap-2">
                <FiCheckCircle /> Action recorded. You may close this page.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentReview;
