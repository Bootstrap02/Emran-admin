
// Pages/Birthdays.js
//
// Two tabs, one uniform card-based UI (matches the original Birthday List
// card design — Date of Birth / Turning / "Next birthday in: ..." — applied
// to both tabs):
//
//   1) Birthday List — Refresh re-fetches the full list, "Check & Send
//      Birthday Emails" hits /checkbirthdays (sends to today's celebrants +
//      reminds admin of members whose birthday is tomorrow). Cards here show
//      a MILESTONE badge when the upcoming birthday is a 60/70/80/90/100.
//
//   2) Milestone Reminder (4-Day) — same card layout, filtered to only
//      milestone birthdays (derived from the same /listbirthdays data,
//      soonest first). No MILESTONE badge here since every card already is
//      one. "Send 4-Day Milestone Alert" hits /check-milestone-upcoming.

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

  // Human-readable countdown: "Today", "Tomorrow", "In 2 days", "In 5 days"...
  const daysLabel = (days) => {
    if (days === null || days === undefined) return '—';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  };

  // Enrich every member with age, next age, days-until and milestone flag,
  // once, so both tabs work off the exact same numbers.
  const enriched = list.map((b) => {
    const age = getAge(b.dateOfBirth);
    const days = b.isToday ? 0 : getDaysUntil(b.nextBirthday);
    const nextAge = b.isToday ? age : age !== null ? age + 1 : null;
    const isMilestone = MILESTONE_AGES.includes(nextAge);
    return { ...b, age, nextAge, days, isMilestone };
  });

  const todayBirthdays = enriched.filter((b) => b.isToday);
  const upcomingBirthdays = enriched
    .filter((b) => !b.isToday)
    .sort((a, b) => (a.days ?? 9999) - (b.days ?? 9999));

  // Milestone tab: only 60/70/80/90/100, soonest first.
  const milestoneBirthdays = enriched
    .filter((b) => b.isMilestone)
    .sort((a, b) => (a.days ?? 9999) - (b.days ?? 9999));

  const tabButtonClass = (isActive) =>
    `pb-3 px-4 text-sm font-bold border-b-2 transition ${
      isActive
        ? 'border-[#E30613] text-[#E30613]'
        : 'border-transparent text-gray-500 hover:text-[#001F5B]'
    }`;

  // Shared card renderer for a single member.
  // showMilestoneBadge: whether to show the red "MILESTONE" pill (only on
  // the Birthday List tab — the Milestone tab omits it since every card
  // there already is a milestone).
  const renderCard = (b, showMilestoneBadge) => (
    <div
      key={b?._id || b.email || b.fullname}
      className={`bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between gap-4 ${
        b.isMilestone ? 'border-2 border-[#E30613]' : 'border border-transparent'
      }`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-xl font-semibold text-[#001F5B]">{b.fullname}</h3>

          {b.isToday && (
            <span className="text-xs font-bold bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
              🎂 TODAY
            </span>
          )}
          {!b.isToday && b.days === 1 && (
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Tomorrow
            </span>
          )}
          {showMilestoneBadge && b.isMilestone && (
            <span className="text-xs font-bold bg-[#E30613] text-white px-2 py-1 rounded-full">
              MILESTONE
            </span>
          )}
        </div>

        <div className="text-sm text-gray-500 mt-2">
          <span className="font-medium text-gray-700">Date of Birth:</span> {formatDate(b.dateOfBirth)}
        </div>
        <div className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">Turning:</span> {b.nextAge ?? '-'}
        </div>
        {!b.isToday && (
          <div className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">Next birthday in:</span> {daysLabel(b.days)}
            <span className="text-gray-400"> ({b.days} day{b.days !== 1 ? 's' : ''})</span>
          </div>
        )}
      </div>

      <div className="w-40 text-right">
        <div className="text-sm text-gray-500">Email</div>
        <div className="font-medium text-gray-800 text-sm break-all">{b.email || '-'}</div>
      </div>
    </div>
  );

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

          {listError && (
            <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">{listError}</div>
          )}

          {loading ? (
            <div className="bg-white p-10 rounded-2xl shadow text-center text-gray-500">
              Loading birthdays...
            </div>
          ) : (
            <>
              {todayBirthdays.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-[#001F5B] mb-3 flex items-center gap-2">
                    🎂 Today's Birthdays
                    <span className="text-xs bg-[#E30613] text-white px-2 py-0.5 rounded-full font-bold">
                      {todayBirthdays.length}
                    </span>
                  </h2>
                  <div className="grid gap-4">{todayBirthdays.map((b) => renderCard(b, true))}</div>
                </div>
              )}

              <h2 className="text-lg font-bold text-[#001F5B] mb-3">
                Upcoming Birthdays
                <span className="text-xs text-gray-400 font-normal ml-2">
                  ({upcomingBirthdays.length} members)
                </span>
              </h2>
              <div className="grid gap-4">
                {upcomingBirthdays.map((b) => renderCard(b, true))}
                {upcomingBirthdays.length === 0 && todayBirthdays.length === 0 && (
                  <div className="bg-white p-10 rounded-2xl shadow text-center text-gray-500">
                    No birthdays to display.
                  </div>
                )}
              </div>
            </>
          )}
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

          {listError && (
            <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">{listError}</div>
          )}

          <h2 className="text-lg font-bold text-[#001F5B] mb-3">
            Upcoming Milestone Birthdays
            <span className="text-xs text-gray-400 font-normal ml-2">
              ({milestoneBirthdays.length} members)
            </span>
          </h2>

          {loading ? (
            <div className="bg-white p-10 rounded-2xl shadow text-center text-gray-500">
              Loading birthdays...
            </div>
          ) : milestoneBirthdays.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl shadow text-center text-gray-500">
              No upcoming milestone birthdays found.
            </div>
          ) : (
            <div className="grid gap-4">{milestoneBirthdays.map((b) => renderCard(b, false))}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Birthdays;
