
// Pages/PaymentReview.jsx
// President review page — when President clicks Approve, OTP modal pops up
// Secretary review uses the same page via different URL path

import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FiCheckCircle, FiXCircle, FiLoader, FiShield } from 'react-icons/fi';

const API = 'https://campusbuy-backend-nkmx.onrender.com/mobilcreatepayment';

const STATUS_COLORS = {
  PENDING:              'bg-amber-100 text-amber-700',
  PRESIDENT_APPROVED:   'bg-blue-100 text-blue-700',
  PRESIDENT_DECLINED:   'bg-red-100 text-red-700',
  SECRETARY_APPROVED:   'bg-indigo-100 text-indigo-700',
  SECRETARY_DECLINED:   'bg-red-100 text-red-700',
  TREASURER_PROCESSING: 'bg-purple-100 text-purple-700',
  COMPLETED:            'bg-green-100 text-green-700',
  CANCELLED:            'bg-gray-100 text-gray-600',
};

const PaymentReview = () => {
  const { id }      = useParams();
  const location    = useLocation();
  const isSecretary = location.pathname.includes('secretary-review');
  const actionKey   = isSecretary ? 'secretary-action' : 'president-action';

  const [pr,          setPr]          = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [acting,      setActing]      = useState(false);
  const [note,        setNote]        = useState('');
  const [feedback,    setFeedback]    = useState(null);
  const [done,        setDone]        = useState(false);
  // OTP modal state (President only)
  const [showOtp,     setShowOtp]     = useState(false);
  const [otp,         setOtp]         = useState('');
  const [otpError,    setOtpError]    = useState('');
  const [sendingOtp,  setSendingOtp]  = useState(false);
  const [otpSent,     setOtpSent]     = useState(false);

  const admin = JSON.parse(localStorage.getItem('adminData') || '{}');

  useEffect(() => {
    axios.get(`${API}/${id}`)
      .then(res => setPr(res.data.paymentRequest))
      .catch(() => setFeedback({ type: 'error', text: 'Could not load payment request.' }))
      .finally(() => setLoading(false));
  }, [id]);

  // President clicks Approve → request OTP first
  const handleApproveClick = async () => {
    if (isSecretary) {
      // Secretary doesn't need OTP — act directly
      handleAction('APPROVED');
      return;
    }
    // President needs OTP — request it
    setSendingOtp(true);
    setOtpError('');
    try {
      await axios.post(`${API}/${id}/request-president-otp`, { adminId: admin._id });
      setOtpSent(true);
      setShowOtp(true);
      console.log(otpSent);
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to send OTP. Please try again.' });
    } finally { setSendingOtp(false); }
  };

  // President submits OTP → then approve
  const handleOtpSubmit = async () => {
    if (!otp || otp.length !== 6) { setOtpError('Please enter the 6-digit OTP.'); return; }
    setActing(true);
    setOtpError('');
    try {
      await axios.put(`${API}/${id}/${actionKey}`, {
        action: 'APPROVED', note, adminId: admin._id, otp,
      });
      setShowOtp(false);
      setDone(true);
      setFeedback({
        type: 'success',
        text: 'Payment request approved. Forwarded to General Secretary for cold-eye review.',
      });
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally { setActing(false); }
  };

  const handleAction = async (action) => {
    if (!window.confirm(`Confirm: ${action} this payment request?`)) return;
    setActing(true);
    try {
      await axios.put(`${API}/${id}/${actionKey}`, {
        action, note, adminId: admin._id,
      });
      setDone(true);
      setFeedback({
        type: action === 'APPROVED' ? 'success' : 'error',
        text: action === 'APPROVED'
          ? 'Validated and forwarded to Treasurer.'
          : 'Payment request declined. Requester has been notified.',
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
          {isSecretary ? 'General Secretary' : 'President'} Review
        </p>
        <h1 className="text-3xl font-extrabold text-[#001F5B]">
          {isSecretary ? 'Cold-Eye Validation' : 'Payment Approval'}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {isSecretary
            ? 'Validate the payment details carefully before forwarding to the Treasurer.'
            : 'Review the payment request and approve or decline. Approving requires OTP verification.'}
        </p>
      </div>

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

      {/* OTP Modal */}
      {showOtp && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#001F5B]/10 flex items-center justify-center flex-shrink-0">
                <FiShield className="text-[#001F5B] text-2xl" />
              </div>
              <div>
                <h3 className="font-extrabold text-[#001F5B] text-lg">Identity Verification</h3>
                <p className="text-xs text-gray-500">An OTP has been sent to your registered email address</p>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter 6-digit OTP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={otp}
                onChange={e => { setOtp(e.target.value.replace(/\D/g,'').slice(0,6)); setOtpError(''); }}
                placeholder="______"
                maxLength={6}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-center text-3xl font-bold tracking-[0.6em] focus:border-[#001F5B] focus:outline-none transition"
              />
              {otpError && <p className="text-red-500 text-xs mt-2">{otpError}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Note (optional)</label>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
                placeholder="Any note for your decision..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#001F5B] focus:outline-none resize-none" />
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setShowOtp(false); setOtp(''); setOtpError(''); }}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleOtpSubmit} disabled={acting || otp.length !== 6}
                className="flex-1 py-3 rounded-xl text-white font-bold text-sm transition flex items-center justify-center gap-2"
                style={{ background: acting || otp.length !== 6 ? '#9CA3AF' : '#16a34a' }}>
                {acting ? <><FiLoader className="animate-spin" /> Verifying...</> : <><FiCheckCircle /> Confirm Approval</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {pr && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-[#001F5B] px-8 py-5 flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wide">Payment Request</p>
              <p className="text-white text-xl font-extrabold">{pr.requestRef}</p>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[pr.status] || 'bg-gray-100 text-gray-600'}`}>
              {pr.status.replace(/_/g,' ')}
            </span>
          </div>

          <div className="p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['Requested By', `${pr.requesterName} (${pr.requesterRole})`],
                ['Date Submitted', new Date(pr.createdAt).toLocaleDateString('en-GB',{ day:'numeric', month:'long', year:'numeric' })],
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

            {/* Secretary note field (no OTP needed) */}
            {!done && isSecretary && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Validation Note (optional)</label>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
                  placeholder="Add any observations about this payment..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#001F5B] focus:outline-none resize-none" />
              </div>
            )}

            {/* President decline note */}
            {!done && !isSecretary && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Note (required if declining)</label>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
                  placeholder="Reason for your decision..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#001F5B] focus:outline-none resize-none" />
              </div>
            )}

            {!done && (
              <div className="flex gap-4 pt-2">
                <button
                  onClick={handleApproveClick}
                  disabled={acting || sendingOtp}
                  className="flex-1 py-4 rounded-xl text-white font-bold text-sm transition flex items-center justify-center gap-2"
                  style={{ background: acting || sendingOtp ? '#9CA3AF' : '#16a34a' }}>
                  {sendingOtp
                    ? <><FiLoader className="animate-spin" /> Sending OTP...</>
                    : acting
                      ? <><FiLoader className="animate-spin" /> Processing...</>
                      : <><FiCheckCircle /> {isSecretary ? 'Validate & Forward to Treasurer' : 'Approve (OTP Required)'}</>}
                </button>
                <button
                  onClick={() => handleAction('DECLINED')}
                  disabled={acting || sendingOtp}
                  className="flex-1 py-4 rounded-xl text-white font-bold text-sm transition flex items-center justify-center gap-2"
                  style={{ background: acting || sendingOtp ? '#9CA3AF' : '#E30613' }}>
                  <FiXCircle /> Decline
                </button>
              </div>
            )}

            {done && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 text-green-800 font-medium text-sm flex items-center gap-2">
                <FiCheckCircle /> Action recorded successfully. You may close this page.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentReview;
