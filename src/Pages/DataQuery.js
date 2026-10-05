// Pages/DataQuery.js
// Query the member database by status (member / prospective / prospect / deceased / admin),
// dues, registration, birthdays, age, retirement and more. Results can be downloaded as CSV.
// Data comes from GET /mobilcreateadmin/dataquery (server-side filtering).

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin';
const THIS_YEAR = new Date().getFullYear();

const STATUS_LABELS = {
  member: 'Member', prospectiveMember: 'Prospective Member', prospect: 'Prospect',
  deceased: 'Deceased', admin: 'Admin',
};
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const LOCATIONS = ['Lagos','QIT/Eket','Port Harcourt/Onne','Bonny','USA','Europe','Asia'];

const EMPTY = {
  status: '', dues: '', duesYear: String(THIS_YEAR), registration: '', dob: '', birthMonth: '',
  ageMin: '', ageMax: '', retirementYear: '', company: '', location: '', approved: '', verified: '',
  method: '', hasPhoto: '', debt: '', q: '', sort: 'name', order: 'asc',
};

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');

const inputCls  = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] outline-none bg-white';

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
    {children}
  </div>
);

const DataQuery = () => {
  const navigate = useNavigate();
  const [f, setF]             = useState(EMPTY);
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [summary, setSummary] = useState(null);
  const [showAdv, setShowAdv] = useState(false);

  const set = (k) => (e) => setF(prev => ({ ...prev, [k]: e.target.value }));

  const run = async (filters = f) => {
    setLoading(true); setError('');
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v !== '') params[k] = v; });
      const res = await axios.get(`${API}/dataquery`, { params });
      setResult(res.data);
      setSummary(res.data.summary);
    } catch (err) {
      setError(err.response?.data?.message || 'Query failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load head-counts + everyone on first open
  useEffect(() => {
    run(EMPTY);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = () => { setF(EMPTY); run(EMPTY); };

  const quick = (status) => { const next = { ...EMPTY, status }; setF(next); run(next); };

  const downloadCsv = () => {
    if (!result?.users?.length) return;
    const cols = [
      ['Name', u => u.fullname], ['Email', u => u.email], ['Phone', u => u.phone],
      ['Status', u => STATUS_LABELS[u.role] || u.role], ['Date of Birth', u => fmtDate(u.dateOfBirth)], ['Age', u => u.age ?? ''],
      ['Retirement Year', u => u.retirementYear ?? ''], ['Company at Retirement', u => u.companyAtRetirement],
      ['Retirement Location', u => u.locationOfRetirement], ['Registration Paid', u => (u.registrationPaid ? 'Yes' : 'No')],
      [`Dues ${result.duesYear}`, u => (u.duesPaid ? 'Paid' : 'Unpaid')], ['Debt', u => u.debt],
      ['Signup Approved', u => (u.signupApproved ? 'Yes' : 'No')], ['Staff ID', u => u.staffId], ['Pension ID', u => u.pensionId],
      ['Address', u => u.address], ['Next of Kin', u => u.nextOfKin], ['Joined', u => fmtDate(u.createdAt)],
    ];
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [cols.map(c => esc(c[0])).join(','), ...result.users.map(u => cols.map(c => esc(c[1](u))).join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `EMRAN_data_query_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const roleBadge = (role) => {
    const cls = role === 'member' ? 'bg-green-100 text-green-800'
      : role === 'deceased' ? 'bg-gray-800 text-white'
      : role === 'prospectiveMember' ? 'bg-amber-100 text-amber-800'
      : role === 'admin' ? 'bg-blue-100 text-blue-800'
      : 'bg-red-100 text-red-700';
    return <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${cls}`}>{STATUS_LABELS[role] || role}</span>;
  };

  const users = result?.users || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        <button onClick={() => navigate(-1)} className="text-sm font-semibold text-[#001F5B] hover:underline mb-4">← Back</button>
        <h1 className="text-3xl font-extrabold text-[#001F5B] mb-1">Data Query</h1>
        <p className="text-gray-500 mb-6 text-sm">Sort and filter the member database by status, dues, birthdays, retirement and more.</p>

        {/* Head-count cards (tap to filter) */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
            <button onClick={() => quick('')} className="bg-white rounded-xl shadow p-3 text-left border-t-4 border-[#001F5B]">
              <p className="text-xs text-gray-500 font-semibold">All</p>
              <p className="text-2xl font-extrabold text-[#001F5B]">{summary.total}</p>
            </button>
            {Object.keys(STATUS_LABELS).map(s => (
              <button key={s} onClick={() => quick(s)}
                className={`bg-white rounded-xl shadow p-3 text-left border-t-4 ${s === 'deceased' ? 'border-gray-700' : 'border-[#E30613]'}`}>
                <p className="text-xs text-gray-500 font-semibold">{STATUS_LABELS[s]}</p>
                <p className="text-2xl font-extrabold text-[#001F5B]">{summary[s] || 0}</p>
              </button>
            ))}
          </div>
        )}

        {/* Filters */}
        <form onSubmit={(e) => { e.preventDefault(); run(); }} className="bg-white rounded-2xl shadow p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Status">
              <select value={f.status} onChange={set('status')} className={inputCls}>
                <option value="">All statuses</option>
                {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </Field>
            <Field label="Dues status">
              <select value={f.dues} onChange={set('dues')} className={inputCls}>
                <option value="">Any</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </Field>
            <Field label="Dues year">
              <input type="number" value={f.duesYear} onChange={set('duesYear')} className={inputCls} />
            </Field>
            <Field label="Registration fee">
              <select value={f.registration} onChange={set('registration')} className={inputCls}>
                <option value="">Any</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Not paid</option>
              </select>
            </Field>

            <Field label="Date of birth">
              <select value={f.dob} onChange={set('dob')} className={inputCls}>
                <option value="">Any</option>
                <option value="set">Has date of birth</option>
                <option value="missing">Missing date of birth</option>
              </select>
            </Field>
            <Field label="Birth month">
              <select value={f.birthMonth} onChange={set('birthMonth')} className={inputCls}>
                <option value="">Any month</option>
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </Field>
            <Field label="Age from">
              <input type="number" min="0" value={f.ageMin} onChange={set('ageMin')} placeholder="e.g. 70" className={inputCls} />
            </Field>
            <Field label="Age to">
              <input type="number" min="0" value={f.ageMax} onChange={set('ageMax')} placeholder="e.g. 79" className={inputCls} />
            </Field>

            <Field label="Retirement year">
              <input type="number" value={f.retirementYear} onChange={set('retirementYear')} placeholder="e.g. 2015" className={inputCls} />
            </Field>
            <Field label="Search">
              <input type="text" value={f.q} onChange={set('q')} placeholder="Name, email, phone, ID" className={inputCls} />
            </Field>
            <Field label="Sort by">
              <select value={f.sort} onChange={set('sort')} className={inputCls}>
                <option value="name">Name</option>
                <option value="dob">Date of birth</option>
                <option value="age">Age</option>
                <option value="retirement">Retirement date</option>
                <option value="joined">Date joined</option>
                <option value="lastLogin">Last login</option>
              </select>
            </Field>
            <Field label="Order">
              <select value={f.order} onChange={set('order')} className={inputCls}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </Field>
          </div>

          <button type="button" onClick={() => setShowAdv(v => !v)} className="mt-4 text-xs font-bold text-[#E30613] hover:underline">
            {showAdv ? '− Fewer filters' : '+ More filters'}
          </button>

          {showAdv && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <Field label="Company at retirement">
                <select value={f.company} onChange={set('company')} className={inputCls}>
                  <option value="">Any</option><option value="MPN">MPN</option><option value="EEPNL">EEPNL</option>
                </select>
              </Field>
              <Field label="Retirement location">
                <select value={f.location} onChange={set('location')} className={inputCls}>
                  <option value="">Any</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="Signup approved">
                <select value={f.approved} onChange={set('approved')} className={inputCls}>
                  <option value="">Any</option><option value="yes">Yes</option><option value="no">No</option>
                </select>
              </Field>
              <Field label="Email verified">
                <select value={f.verified} onChange={set('verified')} className={inputCls}>
                  <option value="">Any</option><option value="yes">Yes</option><option value="no">No</option>
                </select>
              </Field>
              <Field label="Signed up with">
                <select value={f.method} onChange={set('method')} className={inputCls}>
                  <option value="">Any</option><option value="email">Email</option><option value="google">Google</option>
                </select>
              </Field>
              <Field label="Profile photo">
                <select value={f.hasPhoto} onChange={set('hasPhoto')} className={inputCls}>
                  <option value="">Any</option><option value="yes">Has photo</option><option value="no">No photo</option>
                </select>
              </Field>
              <Field label="Outstanding debt">
                <select value={f.debt} onChange={set('debt')} className={inputCls}>
                  <option value="">Any</option><option value="owing">Owing</option>
                </select>
              </Field>
            </div>
          )}

          <div className="flex gap-3 flex-wrap mt-5">
            <button type="submit" disabled={loading}
              className="px-6 py-3 bg-[#001F5B] text-white rounded-xl font-bold text-sm hover:bg-[#0A3D6B] transition disabled:opacity-60">
              {loading ? 'Searching...' : 'Run Query'}
            </button>
            <button type="button" onClick={reset}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition">
              Reset
            </button>
            {users.length > 0 && (
              <button type="button" onClick={downloadCsv}
                className="px-6 py-3 bg-[#E30613] text-white rounded-xl font-bold text-sm hover:bg-[#c20511] transition">
                Download CSV
              </button>
            )}
          </div>
        </form>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{error}</div>}

        {/* Results */}
        {result && (
          <>
            <p className="text-sm text-gray-600 mb-3">
              <strong className="text-[#001F5B]">{result.total}</strong> result{result.total !== 1 ? 's' : ''}
              {result.truncated && ` (showing first ${users.length})`}
            </p>

            {users.length === 0 ? (
              <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-400">No users match these filters.</div>
            ) : (
              <div className="bg-white rounded-2xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#001F5B] text-white">
                        {['Name', 'Status', 'Email', 'Phone', 'Date of Birth', 'Age', 'Retired', `Dues ${result.duesYear}`, 'Reg. Fee', ''].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-bold whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, i) => (
                        <tr key={u._id} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="px-4 py-3 font-semibold text-[#001F5B] min-w-[160px]">{u.fullname}</td>
                          <td className="px-4 py-3">{roleBadge(u.role)}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{u.phone || '—'}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{fmtDate(u.dateOfBirth)}</td>
                          <td className="px-4 py-3">{u.age ?? '—'}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{u.retirementYear || '—'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.duesPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                              {u.duesPaid ? 'Paid' : 'Unpaid'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.registrationPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                              {u.registrationPaid ? 'Paid' : 'No'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => navigate(`/useredit/${u._id}`)} className="text-xs font-bold text-[#E30613] hover:underline">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DataQuery;

