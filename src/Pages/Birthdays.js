
// Pages/Birthdays.js
//
// Two tabs sharing one uniform UI:
//   1) Birthday List  — original behavior: Refresh re-fetches the full list,
//      "Send Birthday Emails" hits /checkbirthdays (sends to today's
//      celebrants + reminds admin of tomorrow's birthdays).
//   2) Milestone Reminder (4-Day) — fixed: shows upcoming milestone
//      birthdays (60/70/80/90/100) with date + age, derived from the same
//      birthday list, sorted by soonest. "Send 4-Day Milestone Alert" hits
//      /check-milestone-upcoming.

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE = 'https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin';
const MILESTONE_AGES = [60, 70, 80, 90, 100];

const Birthdays = () => {
  const [tab, setTab] = useState('birthdays');

  // ── Shared birthday list state (both tabs read from this) ────────────────
  const [list, setList] = useState([]);
  const [totalChecked, setTotalChecked] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState('');

  // ── Birthday List tab: send state ─────────────────────────────────────────
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  // ── Milestone tab: send state ─────────────────────────────────────────────
  const [milestoneSending, setMilestoneSending] = useState(false);
  const [milestoneResult, setMilestoneResult] = useState(null);
  const [milestoneError, setMilestoneError] = useState('');

  // ── Fetch full birthday list (used by both tabs) ──────────────────────────
  const fetchBirthdays = useCallback(async () => {
    setListError('');
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/listbirthdays`);
      const items = res?.data?.birthdays || [];
      setList(items);
      setTotalChecked(res?.data?.totalUsersChecked ?? null);
      if (items.length === 0) setListError('No members have a date of birth on file yet.');
    } catch (err) {
      console.error('Failed to fetch birthdays:', err);
      setListError(err.response?.data?.message || 'Failed to load birthday list. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBirthdays();
  }, [fetchBirthdays]);

  // ── Birthday List tab: check & send today's/tomorrow's emails ─────────────
  const handleSendBirthdayEmails = async () => {
    setSending(true);
    setSendResult(null);
    try {
      const res = await axios.get(`${API_BASE}/checkbirthdays`);
      setSendResult({ type: 'success', message: res.data?.message || 'Birthday emails sent successfully!' });
    } catch (err) {
      console.error('Failed to send birthday emails:', err);
      setSendResult({ type: 'error', message: err.response?.data?.message || 'Failed to send birthday emails.' });
    } finally {
      setSending(false);
    }
  };

  // ── Milestone tab: send 4-day-ahead alert ──────────────────────────────────
  const handleMilestoneCheck = async () => {
    setMilestoneSending(true);
    setMilestoneResult(null);
    setMilestoneError('');
    try {
      const res = await axios.post(`${API_BASE}/check-milestone-upcoming`);
      setMilestoneResult(res.data);
    } catch (err) {
      console.error('Failed to send milestone reminder:', err);
      setMilestoneError(err.response?.data?.message || 'Failed to send milestone reminder.');
    } finally {
      setMilestoneSending(false);
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────────────
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getAge = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
    return age;
  };

  const getDaysUntil = (nextBirthdayStr) => {
    if (!nextBirthdayStr) return null;
    const next = new Date(nextBirthdayStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    next.setHours(0, 0, 0, 0);
    return Math.round((next - today) / (1000 * 60 * 60 * 24));
  };

  const todayBirthdays = list.filter((b) => b.isToday);
  const upcomingBirthdays = list.filter((b) => !b.isToday);

  // Derive the milestone list from the same data the Birthday List tab uses:
  // anyone whose *next* birthday lands them on 60/70/80/90/100, soonest first.
  const milestoneBirthdays = list
    .map((b) => {
      const age = getAge(b.dateOfBirth);
      const nextAge = b.isToday ? age : age !== null ? age + 1 : null;
      const days = b.isToday ? 0 : getDaysUntil(b.nextBirthday);
      return { ...b, age, nextAge, days };
    })
    .filter((b) => MILESTONE_AGES.includes(b.nextAge))
    .sort((a, b) => (a.days ?? 9999) - (b.days ?? 9999));

  const tabButtonClass = (isActive) =>
    `pb-3 px-4 text-sm font-bold border-b-2 transition ${
      isActive
        ? 'border-[#E30613] text-[#E30613]'
        : 'border-transparent text-gray-500 hover:text-[#001F5B]'
    }`;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-[#001F5B] mb-1">Birthdays</h1>
        <p className="text-gray-500 text-sm">
          View upcoming member birthdays and send birthday emails.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button onClick={() => setTab('birthdays')} className={tabButtonClass(tab === 'birthdays')}>
          🎂 Birthday List
        </button>
        <button onClick={() => setTab('milestone')} className={tabButtonClass(tab === 'milestone')}>
          🎁 Milestone Reminder (4-Day)
        </button>
      </div>

      {/* ══════════════ BIRTHDAY LIST TAB ══════════════ */}
      {tab === 'birthdays' && (
        <div>
          {/* Action card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-[#001F5B] mb-1">Send Birthday Emails</h2>
            <p className="text-sm text-gray-500 mb-4">
              Scans today's birthdays and sends congratulatory emails to celebrants, and
              reminds the admin of members whose birthday is coming up tomorrow.
            </p>

            {sendResult && (
              <div
                className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${
                  sendResult.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
              >
                {sendResult.message}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSendBirthdayEmails}
                disabled={sending}
                className="px-8 py-3 rounded-xl text-white font-bold text-sm transition"
                style={{ background: sending ? '#9CA3AF' : '#001F5B' }}
              >
                {sending ? 'Sending Emails...' : 'Check & Send Birthday Emails'}
              </button>

              <button
                onClick={fetchBirthdays}
                disabled={loading}
                className="px-8 py-3 rounded-xl text-white font-bold text-sm transition"
                style={{ background: loading ? '#9CA3AF' : '#E30613' }}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>

              {totalChecked !== null && (
                <span className="text-xs text-gray-400">
                  {list.length} of {totalChecked} total members have a date of birth on file.
                </span>
              )}
            </div>
          </div>

          {/* Today's birthdays */}
          {todayBirthdays.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-[#001F5B] mb-3 flex items-center gap-2">
                🎂 Today's Birthdays
                <span className="text-xs bg-[#E30613] text-white px-2 py-0.5 rounded-full font-bold">
                  {todayBirthdays.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {todayBirthdays.map((b, i) => {
                  const age = getAge(b.dateOfBirth);
                  const isMilestone = MILESTONE_AGES.includes(age);
                  return (
                    <div
                      key={b?._id || i}
                      className={`bg-white rounded-2xl p-5 shadow border-2 ${
                        isMilestone ? 'border-[#E30613]' : 'border-[#001F5B]/20'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#001F5B] text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                          {b.fullname?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#001F5B] text-sm truncate">{b.fullname}</p>
                          <p className="text-xs text-gray-400 truncate">{b.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">{formatDate(b.dateOfBirth)}</span>
                        <div className="flex items-center gap-1">
                          {age !== null && <span className="text-xs font-bold text-gray-500">{age} yrs</span>}
                          {isMilestone && (
                            <span className="text-xs bg-[#E30613] text-white px-2 py-0.5 rounded-full font-bold ml-1">
                              MILESTONE
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          🎉 Today!
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upcoming birthdays table */}
          <div>
            <h2 className="text-lg font-bold text-[#001F5B] mb-3">
              Upcoming Birthdays
              {!loading && (
                <span className="text-xs text-gray-400 font-normal ml-2">
                  ({upcomingBirthdays.length} members)
                </span>
              )}
            </h2>

            {listError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
                {listError}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12 text-[#001F5B] animate-pulse">Loading birthday list...</div>
            ) : upcomingBirthdays.length === 0 ? (
              <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-400">
                No upcoming birthdays found.
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#001F5B] text-white">
                      <th className="px-4 py-3 text-left text-xs font-bold">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-bold">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-bold">Birthday</th>
                      <th className="px-4 py-3 text-left text-xs font-bold">Age</th>
                      <th className="px-4 py-3 text-left text-xs font-bold">Days Away</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingBirthdays.map((b, i) => {
                      const age = getAge(b.dateOfBirth);
                      const nextAge = age !== null ? age + 1 : null;
                      const isMilestone = MILESTONE_AGES.includes(nextAge);
                      const days = b.nextBirthday ? getDaysUntil(b.nextBirthday) : null;
                      return (
                        <tr
                          key={b?._id || i}
                          className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                            isMilestone ? 'bg-red-50' : ''
                          }`}
                        >
                          <td className="px-4 py-3 font-semibold text-[#001F5B]">
                            {b.fullname}
                            {isMilestone && (
                              <span className="ml-2 text-xs bg-[#E30613] text-white px-1.5 py-0.5 rounded-full font-bold">
                                {nextAge}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{b.email}</td>
                          <td className="px-4 py-3 text-gray-700">{formatDate(b.dateOfBirth)}</td>
                          <td className="px-4 py-3 text-gray-500">{age ?? '—'}</td>
                          <td className="px-4 py-3">
                            {days !== null ? (
                              <span className={`font-bold ${days <= 7 ? 'text-[#E30613]' : 'text-gray-600'}`}>
                                {days === 0 ? 'Today!' : `${days} day${days !== 1 ? 's' : ''}`}
                              </span>
                            ) : (
                              '—'
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════ MILESTONE TAB ══════════════ */}
      {tab === 'milestone' && (
        <div>
          {/* Action card — same shape/style as the Birthday List tab's action card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-[#001F5B] mb-1">4-Day Milestone Birthday Reminder</h2>
            <p className="text-sm text-gray-500 mb-2">
              Scans all members for milestone birthdays (60, 70, 80, 90, 100) occurring exactly{' '}
              <strong>4 days from today</strong>. Sends an advance notice to Mrs. Beatrice Atekha,
              CC'd to emranannuitants@gmail.com and fxudegbu@gmail.com.
            </p>
            <div className="bg-[#001F5B]/5 border border-[#001F5B]/20 rounded-xl px-4 py-3 text-xs text-[#001F5B] mb-4">
              This runs automatically at 8 AM every day via cron (Africa/Lagos). Use the button below to
              trigger it manually.
            </div>

            {milestoneError && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {milestoneError}
              </div>
            )}

            {milestoneResult && (
              <div className="mb-4 px-4 py-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm">
                <p className="font-bold mb-1">{milestoneResult.message}</p>
                {milestoneResult.members && milestoneResult.members.length > 0 && (
                  <ul className="mt-2 space-y-1 pl-5 list-disc text-xs">
                    {milestoneResult.members.map((name, i) => (
                      <li key={i}>{name}</li>
                    ))}
                  </ul>
                )}
                {milestoneResult.count === 0 && (
                  <p className="text-xs mt-1 text-green-700">No milestone birthdays in 4 days.</p>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleMilestoneCheck}
                disabled={milestoneSending}
                className="px-8 py-3 rounded-xl text-white font-bold text-sm transition"
                style={{ background: milestoneSending ? '#9CA3AF' : '#001F5B' }}
              >
                {milestoneSending ? 'Sending...' : 'Send 4-Day Milestone Alert Now'}
              </button>

              <button
                onClick={fetchBirthdays}
                disabled={loading}
                className="px-8 py-3 rounded-xl text-white font-bold text-sm transition"
                style={{ background: loading ? '#9CA3AF' : '#E30613' }}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Upcoming milestone birthdays table — dates + ages, soonest first */}
          <div>
            <h2 className="text-lg font-bold text-[#001F5B] mb-3">
              Upcoming Milestone Birthdays
              {!loading && (
                <span className="text-xs text-gray-400 font-normal ml-2">
                  ({milestoneBirthdays.length} members)
                </span>
              )}
            </h2>

            {listError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
                {listError}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12 text-[#001F5B] animate-pulse">Loading birthday list...</div>
            ) : milestoneBirthdays.length === 0 ? (
              <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-400">
                No upcoming milestone birthdays found.
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#001F5B] text-white">
                      <th className="px-4 py-3 text-left text-xs font-bold">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-bold">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-bold">Birthday</th>
                      <th className="px-4 py-3 text-left text-xs font-bold">Turning</th>
                      <th className="px-4 py-3 text-left text-xs font-bold">Days Away</th>
                    </tr>
                  </thead>
                  <tbody>
                    {milestoneBirthdays.map((b, i) => (
                      <tr
                        key={b?._id || i}
                        className={`border-b border-gray-50 bg-red-50 ${i % 2 === 0 ? '' : 'bg-red-50/70'}`}
                      >
                        <td className="px-4 py-3 font-semibold text-[#001F5B]">
                          {b.fullname}
                          <span className="ml-2 text-xs bg-[#E30613] text-white px-1.5 py-0.5 rounded-full font-bold">
                            {b.nextAge}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{b.email}</td>
                        <td className="px-4 py-3 text-gray-700">{formatDate(b.dateOfBirth)}</td>
                        <td className="px-4 py-3 text-gray-500">{b.nextAge}</td>
                        <td className="px-4 py-3">
                          {b.days !== null ? (
                            <span className={`font-bold ${b.days <= 4 ? 'text-[#E30613]' : 'text-gray-600'}`}>
                              {b.days === 0 ? 'Today!' : `${b.days} day${b.days !== 1 ? 's' : ''}`}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Birthdays;
