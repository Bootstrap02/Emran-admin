// pages/admin/TreasurerAction.jsx
// Treasurer enters OTP and confirms payment execution

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiCheckCircle, FiXCircle, FiLoader, FiShield } from 'react-icons/fi';

const API = 'https://campusbuy-backend-nkmx.onrender.com/mobilcreatepayment';

const TreasurerAction = () => {
  const { id }  = useParams();
  const [pr,       setPr]       = useState(null);
  const [otp,      setOtp]      = useState('');
  const [bankRef,  setBankRef]  = useState('');
  const [note,     setNote]     = useState('');
  const [loading,  setLoading]  = useState(true);
  const [acting,   setActing]   = useState(false);
  const [resending,setResending]= useState(false);
  const [feedback, setFeedback] = useState(null);
  const [done,     setDone]     = useState(false);

  const admin = JSON.parse(localStorage.getItem('adminData') || '{}');

  useEffect(() => {
    axios.get(`${API}/${id}`)
      .then(res => setPr(res.data.paymentRequest))
      .catch(() => setFeedback({ type: 'error', text: 'Could not load payment request.' }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) { setFeedback({ type: 'error', text: 'Please enter the 6-digit OTP.' }); return; }
    setActing(true);
    try {
      await axios.put(`${API}/${id}/treasurer-action`, {
        otp, bankRef, note, adminId: admin._id,
      });
      setDone(true);
      setFeedback({ type: 'success', text: 'Payment confirmed and financial log created. All parties have been notified.' });
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Confirmation failed.' });
    } finally { setActing(false); }
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      await axios.post(`${API}/${id}/resend-otp`);
      setFeedback({ type: 'success', text: 'New OTP sent to your registered email address.' });
    } catch {
      setFeedback({ type: 'error', text: 'Failed to resend OTP.' });
    } finally { setResending(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-[#001F5B] text-xl">Loading...</div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <p className="text-xs font-bold text-[#E30613] uppercase tracking-widest mb-1">Treasurer</p>
        <h1 className="text-3xl font-extrabold text-[#001F5B]">Confirm Payment Execution</h1>
        <p className="text-gray-500 text-sm mt-1">Verify your OTP and confirm that the bank transfer has been completed.</p>
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
        <div className="space-y-5">
          {/* Payment summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-[#001F5B] mb-4">{pr.requestRef}</h2>
            <div className="space-y-3">
              {[
                ['Purpose', pr.purpose],
                ['Amount', `₦${Number(pr.amount).toLocaleString()} (${pr.amountInWords})`],
                ['Beneficiary', pr.beneficiaryName],
                ['Bank', pr.beneficiaryBank],
                ['Account', pr.beneficiaryAccount],
              ].map(([l, v]) => (
                <div key={l} className="flex gap-3 text-sm">
                  <span className="text-gray-400 font-semibold w-28 flex-shrink-0">{l}</span>
                  <span className={`text-gray-800 ${l === 'Amount' ? 'font-bold text-[#001F5B]' : ''}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* OTP + confirmation form */}
          {!done && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-[#001F5B]/10 flex items-center justify-center">
                  <FiShield className="text-[#001F5B] text-xl" />
                </div>
                <div>
                  <p className="font-bold text-[#001F5B] text-sm">Identity Verification Required</p>
                  <p className="text-xs text-gray-500">Enter the OTP sent to your registered email address</p>
                </div>
              </div>

              <form onSubmit={handleConfirm} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">One-Time Password (OTP) <span className="text-red-500">*</span></label>
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold tracking-[0.5em] focus:border-[#001F5B] focus:outline-none"
                    maxLength={6} required />
                  <button type="button" onClick={handleResendOtp} disabled={resending}
                    className="mt-2 text-xs text-[#E30613] hover:underline font-medium">
                    {resending ? 'Sending...' : 'Resend OTP'}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bank Reference Number</label>
                  <input type="text" value={bankRef} onChange={e => setBankRef(e.target.value)}
                    placeholder="UBA transaction reference"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#001F5B] focus:outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Note (optional)</label>
                  <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
                    placeholder="Any additional notes about this payment..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#001F5B] focus:outline-none resize-none" />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
                  By confirming, you certify that the bank transfer of ₦{Number(pr.amount).toLocaleString()} to {pr.beneficiaryName} has been executed. This action creates a permanent financial log entry.
                </div>

                <button type="submit" disabled={acting}
                  className="w-full py-4 rounded-xl text-white font-bold text-sm transition flex items-center justify-center gap-2"
                  style={{ background: acting ? '#9CA3AF' : '#16a34a' }}>
                  {acting ? <><FiLoader className="animate-spin" /> Processing...</> : <><FiCheckCircle /> Confirm Payment Executed</>}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TreasurerAction;
