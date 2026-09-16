// Pages/MilestoneBirthdays.jsx
// Searches for EMRAN members with milestone birthdays (60,70,80,90,100)
// in the current Sunday-Saturday week, then submits a payment request
// to the President for approval — same flow as RequestFunds

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FiLoader, FiCheckCircle, FiXCircle, FiSearch, FiSend, FiGift } from 'react-icons/fi';

const API      = 'https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin';
const PAY_API  = 'https://campusbuy-backend-nkmx.onrender.com/mobilcreatepayment';

const MILESTONE_BENEFITS = {
  60:  { amount: 30000,  label: '₦30,000'  },
  70:  { amount: 50000,  label: '₦50,000'  },
  80:  { amount: 60000,  label: '₦60,000'  },
  90:  { amount: 80000,  label: '₦80,000'  },
  100: { amount: 100000, label: '₦100,000' },
};
const MILESTONE_AGES = Object.keys(MILESTONE_BENEFITS).map(Number);

// Get Sunday and Saturday of the current week
const getWeekRange = () => {
  const now    = new Date();
  const day    = now.getDay(); // 0=Sun, 6=Sat
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - day);
  sunday.setHours(0,0,0,0);
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);
  saturday.setHours(23,59,59,999);
  return { sunday, saturday };
};

const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB',{
  weekday:'long', day:'numeric', month:'long', year:'numeric'
});

const MilestoneBirthdays = () => {
  const [admin,      setAdmin]      = useState(null);
  const [scanning,   setScanning]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [members,    setMembers]    = useState([]);
  const [scanned,    setScanned]    = useState(false);
  const [feedback,   setFeedback]   = useState(null);
  const [done,       setDone]       = useState(false);

  const { sunday, saturday } = getWeekRange();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('adminData') || '{}');
    setAdmin(stored);
  }, []);

  const scanWeek = useCallback(async () => {
    setScanning(true);
    setFeedback(null);
    setMembers([]);
    setScanned(false);
    setDone(false);
    try {
      const res = await axios.get(`${API}/getusers`);
      const users = res.data.users || [];

      const year = new Date().getFullYear();
      const results = [];

      users.forEach(user => {
        if (!user.dateOfBirth || user.role !== 'member') return;
        const dob      = new Date(user.dateOfBirth);
        const age      = year - dob.getFullYear();
        if (!MILESTONE_AGES.includes(age)) return;

        // Birthday this year
        const birthdayThisYear = new Date(year, dob.getMonth(), dob.getDate());
        if (birthdayThisYear >= sunday && birthdayThisYear <= saturday) {
          results.push({
            _id:     user._id,
            name:    user.fullname,
            email:   user.email,
            phone:   user.phone,
            dob:     user.dateOfBirth,
            birthday: birthdayThisYear,
            age,
            benefit:        MILESTONE_BENEFITS[age].label,
            benefitAmount:  MILESTONE_BENEFITS[age].amount,
            beneficiaryBank:    user.bankName    || '',
            beneficiaryAccount: user.bankAccount || '',
          });
        }
      });

      setMembers(results);
      setScanned(true);

      if (results.length === 0) {
        setFeedback({ type: 'info', text: `No milestone birthdays found for the week of ${fmtDate(sunday)} to ${fmtDate(saturday)}.` });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to scan members. Please try again.' });
    } finally { setScanning(false); }
  }, [sunday, saturday]);

  const handleSubmitToPresident = async () => {
    if (!admin?._id) {
      setFeedback({ type: 'error', text: 'Admin session not found. Please log out and log in again.' });
      return;
    }
    if (!members.length) {
      setFeedback({ type: 'error', text: 'No milestone birthday members to submit.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    try {
      const totalAmount = members.reduce((s, m) => s + m.benefitAmount, 0);
      const memberList  = members.map(m => `${m.name} (${m.age}th Birthday — ${m.benefit})`).join(', ');

      const purpose = `Milestone Birthday Gift Payments — Week of ${fmtDate(sunday)} to ${fmtDate(saturday)}. ` +
        `Members: ${memberList}. Total: ₦${totalAmount.toLocaleString()}.`;

      await axios.post(`${PAY_API}/request/${admin._id}`, {
        purpose,
        amount:             totalAmount,
        beneficiaryName:    members.length === 1 ? members[0].name : 'Multiple Members (See Details)',
        beneficiaryBank:    members.length === 1 ? members[0].beneficiaryBank  : 'Multiple Banks',
        beneficiaryAccount: members.length === 1 ? members[0].beneficiaryAccount : 'See Details',
        additionalDetails:  members.map(m =>
          `${m.name} | Age: ${m.age} | Birthday: ${fmtDate(m.birthday)} | Benefit: ${m.benefit}` +
          (m.beneficiaryBank ? ` | Bank: ${m.beneficiaryBank} | Account: ${m.beneficiaryAccount}` : '')
        ).join('\n'),
        isMilestone: true,
        milestoneMembers: members.map(m => ({
          name: m.name, age: m.age, benefit: m.benefit, email: m.email,
        })),
      });

      setDone(true);
      setFeedback({
        type: 'success',
        text: `Payment request submitted to the President for ${members.length} milestone birthday member${members.length > 1 ? 's' : ''}. Total: ₦${totalAmount.toLocaleString()}.`,
      });
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Submission failed. Please try again.' });
    } finally { setSubmitting(false); }
  };

  const totalAmount = members.reduce((s, m) => s + m.benefitAmount, 0);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <FiGift className="text-[#E30613] text-3xl" />
          <h1 className="text-3xl font-extrabold text-[#001F5B]">Milestone Birthday Payments</h1>
        </div>
        <p className="text-gray-500 text-sm">
          Scans for EMRAN members celebrating a milestone birthday (60, 70, 80, 90, or 100) this week.
          Results are submitted as a payment request to the President for approval.
        </p>
      </div>

      {/* Week range banner */}
      <div className="bg-[#001F5B]/5 border border-[#001F5B]/20 rounded-2xl px-6 py-4 mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Current Week</p>
          <p className="font-bold text-[#001F5B] text-sm">
            {fmtDate(sunday)} — {fmtDate(saturday)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Milestone ages</p>
          <p className="font-bold text-[#001F5B] text-sm">60 · 70 · 80 · 90 · 100</p>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`mb-6 px-5 py-4 rounded-xl font-medium flex items-center gap-3 text-sm ${
          feedback.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
          feedback.type === 'info'    ? 'bg-blue-50 border border-blue-200 text-blue-800' :
                                        'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {feedback.type === 'success' ? <FiCheckCircle className="text-xl flex-shrink-0" /> :
           feedback.type === 'error'   ? <FiXCircle className="text-xl flex-shrink-0" /> :
                                         <FiSearch className="text-xl flex-shrink-0" />}
          {feedback.text}
        </div>
      )}

      {/* Scan button */}
      <div className="flex gap-3 mb-6">
        <button onClick={scanWeek} disabled={scanning || submitting}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition"
          style={{ background: scanning ? '#9CA3AF' : '#001F5B' }}>
          {scanning
            ? <><FiLoader className="animate-spin" /> Scanning...</>
            : <><FiSearch /> Scan This Week's Milestones</>}
        </button>
      </div>

      {/* Results */}
      {scanned && members.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-[#001F5B] px-6 py-4 flex items-center justify-between">
            <h2 className="text-white font-bold text-lg">
              {members.length} Milestone Birthday Member{members.length > 1 ? 's' : ''} Found
            </h2>
            <span className="text-white/70 text-sm font-semibold">
              Total: ₦{totalAmount.toLocaleString()}
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {members.map((m, i) => (
              <div key={i} className="px-6 py-5 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#E30613]/10 flex items-center justify-center font-bold text-[#E30613] text-lg flex-shrink-0">
                    {m.age}
                  </div>
                  <div>
                    <p className="font-bold text-[#001F5B]">{m.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Birthday: {fmtDate(m.birthday)} · {m.email}
                    </p>
                    {m.beneficiaryBank && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {m.beneficiaryBank} — {m.beneficiaryAccount}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                    {m.benefit}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">Milestone gift</p>
                </div>
              </div>
            ))}
          </div>

          {/* Benefit schedule */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Benefit Schedule</p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(MILESTONE_BENEFITS).map(([age, b]) => (
                <span key={age} className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600">
                  {age}th — {b.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Summary + Submit */}
      {scanned && members.length > 0 && !done && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div>
              <p className="font-bold text-[#001F5B] text-lg">Ready to Submit</p>
              <p className="text-sm text-gray-500">
                This will send a payment request to the President for {members.length} member{members.length > 1 ? 's' : ''}.
                The President will approve or decline, then the same payment flow applies.
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-[#001F5B]">₦{totalAmount.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Total amount</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 mb-5">
            Submitting this request will notify the President by email with an action button.
            Once approved, it follows the standard payment flow: President → Secretary → Treasurer → UBA.
          </div>

          <button onClick={handleSubmitToPresident} disabled={submitting}
            className="w-full py-4 rounded-xl text-white font-bold text-base transition flex items-center justify-center gap-3"
            style={{ background: submitting ? '#9CA3AF' : '#E30613' }}>
            {submitting
              ? <><FiLoader className="animate-spin" /> Submitting...</>
              : <><FiSend /> Submit Milestone Payment Request to President</>}
          </button>
        </div>
      )}

      {done && (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-5 flex items-center gap-4">
          <FiCheckCircle className="text-green-600 text-3xl flex-shrink-0" />
          <div>
            <p className="font-bold text-green-800">Request Submitted Successfully</p>
            <p className="text-sm text-green-700 mt-0.5">
              The President has been notified. Once approved, the payment flow will proceed automatically.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneBirthdays;
