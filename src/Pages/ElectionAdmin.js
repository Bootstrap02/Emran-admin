import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const API_BASE = process.env.REACT_APP_API || 'http://localhost:3000';
const CAND_API = `${API_BASE}/mobilcreatecandidates`;
const ELECTION_API = `${API_BASE}/elections`;

const ElectionAdmin = () => {
  const [candidates, setCandidates] = useState([]);
  const [office, setOffice] = useState('');
  const [fullName, setFullName] = useState('');
  const [manifesto, setManifesto] = useState('');
  const [loading, setLoading] = useState(false);
  const [election, setElection] = useState(null);

  useEffect(() => {
    fetchCandidates();
    fetchElection();
  }, []);

  const fetchCandidates = async () => {
    const res = await axios.get(CAND_API);
    setCandidates(res.data);
  };

  const fetchElection = async () => {
    try {
      const res = await axios.get(`${ELECTION_API}/status`);
      setElection(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      await axios.post(`${CAND_API}/admin/create`, { office, fullName, manifesto });
      setOffice(''); setFullName(''); setManifesto('');
      fetchCandidates();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete candidate?')) return;
    await axios.delete(`${CAND_API}/admin/${id}`);
    fetchCandidates();
  };

  const handleStart = async () => {
    try {
      const res = await axios.post(`${ELECTION_API}/admin/start`, { title: 'General Election' });
      setElection(res.data);
    } catch (err) { alert(err.response?.data?.message || err.message); }
  };

  const handleEnd = async () => {
    if (!election || !election._id) return alert('No election to end');
    await axios.post(`${ELECTION_API}/admin/${election._id}/end`);
    fetchElection();
  };

  const handleDeclare = async (candidateId) => {
    if (!election || !election._id) return alert('Start an election first');
    await axios.post(`${ELECTION_API}/admin/${election._id}/declare-winner`, { candidateId });
    fetchElection();
    fetchCandidates();
    alert('Winner declared');
  };

  return (
    <>
      <Header />
      <div className="p-6 mt-[80px] max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Election Administration</h1>

        <div className="mb-6 space-y-3">
          <div className="flex gap-2">
            <input placeholder="Office" value={office} onChange={e=>setOffice(e.target.value)} className="border p-2 flex-1 rounded" />
            <input placeholder="Full name" value={fullName} onChange={e=>setFullName(e.target.value)} className="border p-2 flex-1 rounded" />
          </div>
          <textarea placeholder="Manifesto" value={manifesto} onChange={e=>setManifesto(e.target.value)} className="border p-2 w-full rounded" rows={3} />
          <div>
            <button onClick={handleCreate} disabled={loading} className="bg-blue-600 text-white p-2 rounded">Create Candidate</button>
          </div>
        </div>

        <div className="mb-6">
          <strong>Election:</strong> {election ? `${election.title} (${election.status})` : 'No election'}
          <div className="mt-2">
            <button onClick={handleStart} className="mr-2 bg-green-600 text-white p-2 rounded">Start</button>
            <button onClick={handleEnd} className="mr-2 bg-yellow-600 text-white p-2 rounded">End</button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Candidates</h2>
          <div className="grid gap-3">
            {candidates.map(c => (
              <div key={c._id} className="border p-3 rounded flex justify-between items-center">
                <div>
                  <div className="font-bold">{c.fullName} — {c.office}</div>
                  <div className="text-sm text-gray-600">Votes: {c.votesCount || c.votes?.length || 0}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>handleDeclare(c._id)} className="bg-indigo-600 text-white p-2 rounded">Declare Winner</button>
                  <button onClick={()=>handleDelete(c._id)} className="bg-red-600 text-white p-2 rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ElectionAdmin;
