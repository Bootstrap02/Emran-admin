// pages/admin/PaymentLog.jsx
// Shows all payment requests + financial log with PDF download

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiDownload, FiRefreshCw, FiCheckCircle, FiXCircle, FiClock, FiAlertCircle } from 'react-icons/fi';

const API = 'https://campusbuy-backend-nkmx.onrender.com/mobilcreatepayment';

const STATUS = {
  PENDING:               { label: 'Pending',              cls: 'bg-amber-100 text-amber-700' },
  PRESIDENT_APPROVED:    { label: 'President Approved',   cls: 'bg-blue-100 text-blue-700' },
  PRESIDENT_DECLINED:    { label: 'President Declined',   cls: 'bg-red-100 text-red-700' },
  SECRETARY_APPROVED:    { label: 'Secretary Validated',  cls: 'bg-indigo-100 text-indigo-700' },
  SECRETARY_DECLINED:    { label: 'Secretary Declined',   cls: 'bg-red-100 text-red-700' },
  TREASURER_PROCESSING:  { label: 'Awaiting Treasurer',   cls: 'bg-purple-100 text-purple-700' },
  COMPLETED:             { label: 'Completed',            cls: 'bg-green-100 text-green-700' },
  CANCELLED:             { label: 'Cancelled',            cls: 'bg-gray-100 text-gray-600' },
};

const downloadPDF = (pr) => {
  const win = window.open('', '_blank');
  win.document.write(`
    <html><head><title>${pr.requestRef}</title>
    <style>
      body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;color:#1a1a1a}
      h1{color:#001F5B;font-size:22px;margin-bottom:4px}
      .sub{color:#666;font-size:13px;margin-bottom:24px}
      .badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold;background:#d1fae5;color:#065f46}
      table{width:100%;border-collapse:collapse;margin:20px 0}
      td{padding:10px 14px;border-bottom:1px solid #e5e7eb;font-size:13px}
      td:first-child{background:#f3f4f6;font-weight:bold;width:35%}
      .section{margin-top:28px;padding-top:16px;border-top:2px solid #001F5B}
      .section h2{color:#001F5B;font-size:15px;margin-bottom:12px}
      .footer{margin-top:40px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:11px;color:#888;text-align:center}
    </style></head><body>
    <h1>EMRAN Payment Record</h1>
    <p class="sub">Generated: ${new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})}</p>
    <span class="badge">${STATUS[pr.status]?.label || pr.status}</span>
    <table>
      <tr><td>Reference</td><td>${pr.requestRef}</td></tr>
      <tr><td>Requested By</td><td>${pr.requesterName} (${pr.requesterRole})</td></tr>
      <tr><td>Date Submitted</td><td>${new Date(pr.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</td></tr>
      <tr><td>Purpose</td><td>${pr.purpose}</td></tr>
      <tr><td>Amount</td><td>₦${Number(pr.amount).toLocaleString()}</td></tr>
      <tr><td>Amount in Words</td><td>${pr.amountInWords}</td></tr>
      <tr><td>Beneficiary</td><td>${pr.beneficiaryName}</td></tr>
      <tr><td>Bank</td><td>${pr.beneficiaryBank}</td></tr>
      <tr><td>Account Number</td><td>${pr.beneficiaryAccount}</td></tr>
      ${pr.additionalDetails ? `<tr><td>Additional Details</td><td>${pr.additionalDetails}</td></tr>` : ''}
    </table>
    ${pr.presidentAction?.action ? `
    <div class="section"><h2>Presidential Decision</h2>
    <table>
      <tr><td>Decision</td><td>${pr.presidentAction.action}</td></tr>
      <tr><td>Timestamp</td><td>${new Date(pr.presidentAction.timestamp).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})}</td></tr>
      ${pr.presidentAction.note ? `<tr><td>Note</td><td>${pr.presidentAction.note}</td></tr>` : ''}
    </table></div>` : ''}
    ${pr.secretaryAction?.action ? `
    <div class="section"><h2>Secretary Validation</h2>
    <table>
      <tr><td>Decision</td><td>${pr.secretaryAction.action}</td></tr>
      <tr><td>Timestamp</td><td>${new Date(pr.secretaryAction.timestamp).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})}</td></tr>
      ${pr.secretaryAction.note ? `<tr><td>Note</td><td>${pr.secretaryAction.note}</td></tr>` : ''}
    </table></div>` : ''}
    ${pr.treasurerAction?.action ? `
    <div class="section"><h2>Treasurer Execution</h2>
    <table>
      <tr><td>Status</td><td>${pr.treasurerAction.action}</td></tr>
      <tr><td>Timestamp</td><td>${new Date(pr.treasurerAction.timestamp).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})}</td></tr>
      ${pr.treasurerAction.bankRef ? `<tr><td>Bank Reference</td><td>${pr.treasurerAction.bankRef}</td></tr>` : ''}
      ${pr.treasurerAction.note ? `<tr><td>Note</td><td>${pr.treasurerAction.note}</td></tr>` : ''}
    </table></div>` : ''}
    <div class="footer">
      EMRAN — ExxonMobil Retirees Association of Nigeria<br>
      emranannuitants@gmail.com • +234 906 941 2463 • emran.center
    </div>
    </body></html>`);
  win.document.close();
  win.print();
};

const PaymentLog = () => {
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('ALL');
  const [expanded, setExpanded] = useState(null);
  const [tab,      setTab]      = useState('requests'); // 'requests' | 'log'
  const [finLog,   setFinLog]   = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const [reqRes, logRes] = await Promise.all([
        axios.get(`${API}/all`),
        axios.get(`${API}/financial-log`),
      ]);
      setRequests(reqRes.data.requests || []);
      setFinLog(logRes.data.logs || []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === 'ALL' ? requests : requests.filter(r => r.status === filter);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#001F5B]">Payment Management</h1>
          <p className="text-gray-500 text-sm mt-1">Track all payment requests and financial transactions</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#001F5B] text-[#001F5B] rounded-xl text-sm font-semibold hover:bg-[#001F5B] hover:text-white transition">
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[['requests','Payment Requests'],['log','Financial Log']].map(([key,label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${
              tab === key ? 'bg-[#001F5B] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#001F5B]/30'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── PAYMENT REQUESTS TAB ── */}
      {tab === 'requests' && (
        <>
          {/* Status filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'none' }}>
            {['ALL', ...Object.keys(STATUS)].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition flex-shrink-0 ${
                  filter === s ? 'bg-[#001F5B] text-white' : 'bg-white text-gray-600 border border-gray-200'
                }`}>
                {s === 'ALL' ? 'All' : STATUS[s]?.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-[#001F5B] animate-pulse">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-12 text-center">
              <div className="text-5xl mb-3">📋</div>
              <p className="text-gray-500">No payment requests found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(pr => (
                <div key={pr._id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => setExpanded(expanded === pr._id ? null : pr._id)}>
                    <div className="flex items-center gap-4 min-w-0">
                      <div>
                        <p className="font-bold text-[#001F5B] text-sm">{pr.requestRef}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {pr.requesterName} · {new Date(pr.createdAt).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                      <span className="text-base font-bold text-[#001F5B]">₦{Number(pr.amount).toLocaleString()}</span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS[pr.status]?.cls || 'bg-gray-100 text-gray-600'}`}>
                        {STATUS[pr.status]?.label || pr.status}
                      </span>
                      <span className="text-gray-400">{expanded === pr._id ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {expanded === pr._id && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        {[
                          ['Purpose', pr.purpose],
                          ['Beneficiary', pr.beneficiaryName],
                          ['Bank', pr.beneficiaryBank],
                          ['Account', pr.beneficiaryAccount],
                          ['Amount in Words', pr.amountInWords],
                        ].map(([l,v]) => (
                          <div key={l} className="bg-gray-50 rounded-xl p-3">
                            <p className="text-xs text-gray-400 font-semibold mb-0.5">{l}</p>
                            <p className="text-sm text-gray-800">{v}</p>
                          </div>
                        ))}
                      </div>

                      {/* Approval chain timeline */}
                      <div className="mt-5">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Approval Chain</p>
                        <div className="flex items-center gap-2 text-xs flex-wrap">
                          {[
                            { label: 'Submitted', done: true, icon: <FiCheckCircle className="text-green-500" /> },
                            { label: 'President', done: !!pr.presidentAction?.action, declined: pr.presidentAction?.action === 'DECLINED', icon: pr.presidentAction?.action === 'APPROVED' ? <FiCheckCircle className="text-green-500" /> : pr.presidentAction?.action === 'DECLINED' ? <FiXCircle className="text-red-500" /> : <FiClock className="text-amber-500" /> },
                            { label: 'Secretary', done: !!pr.secretaryAction?.action, declined: pr.secretaryAction?.action === 'DECLINED', icon: pr.secretaryAction?.action === 'APPROVED' ? <FiCheckCircle className="text-green-500" /> : pr.secretaryAction?.action === 'DECLINED' ? <FiXCircle className="text-red-500" /> : <FiClock className="text-gray-300" /> },
                            { label: 'Treasurer', done: pr.status === 'COMPLETED', icon: pr.status === 'COMPLETED' ? <FiCheckCircle className="text-green-500" /> : <FiClock className="text-gray-300" /> },
                          ].map((step, i) => (
                            <React.Fragment key={i}>
                              <div className="flex items-center gap-1">
                                {step.icon}
                                <span className={`font-semibold ${step.done ? 'text-gray-700' : 'text-gray-400'}`}>{step.label}</span>
                              </div>
                              {i < 3 && <span className="text-gray-300">→</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex gap-3">
                        <button onClick={() => downloadPDF(pr)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#001F5B] text-white rounded-xl text-xs font-bold hover:bg-[#0A3D6B] transition">
                          <FiDownload /> Download PDF
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── FINANCIAL LOG TAB ── */}
      {tab === 'log' && (
        <div>
          {loading ? (
            <div className="text-center py-20 text-[#001F5B] animate-pulse">Loading...</div>
          ) : finLog.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-12 text-center">
              <div className="text-5xl mb-3">💳</div>
              <p className="text-gray-500">No completed financial transactions yet.</p>
              <p className="text-gray-400 text-sm mt-1">Entries appear here only after the Treasurer confirms a payment.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#001F5B] text-white">
                      {['Reference','Date','Amount','Beneficiary','Bank','Purpose','Executed By','Bank Ref','Status'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {finLog.map((log, i) => (
                      <tr key={log._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-bold text-[#001F5B] whitespace-nowrap">{log.requestRef}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{new Date(log.executedAt).toLocaleDateString('en-GB')}</td>
                        <td className="px-4 py-3 font-bold text-[#001F5B] whitespace-nowrap">₦{Number(log.amount).toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-700">{log.beneficiaryName}</td>
                        <td className="px-4 py-3 text-gray-600">{log.beneficiaryBank}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{log.purpose}</td>
                        <td className="px-4 py-3 text-gray-600">{log.executedBy}</td>
                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{log.bankRef || '—'}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentLog;
