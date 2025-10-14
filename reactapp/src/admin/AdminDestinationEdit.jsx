import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import UploadInput from './UploadInput';

const AdminDestinationEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', country: '', description: '', image_url: '' });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const tokenHeader = { Authorization: `Bearer ${localStorage.getItem('api_token')}` };

  useEffect(() => {
    const run = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/destinations/${id}`);
        const d = res.data;
        setForm({ name: d.name || '', country: d.country || '', description: d.description || '', image_url: d.image_url || '' });
      } catch (_) {
        setMsg('Ne mogu da učitam destinaciju.');
      } finally { setLoading(false); }
    };
    run();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault(); setMsg('');
    try {
      await axios.put(`http://localhost:8000/api/destinations/${id}`, form, { headers: tokenHeader });
      setMsg('Sačuvano.');
      navigate('/dashboard/admin');
    } catch (_) { setMsg('Greška pri čuvanju. Proveri polja i ovlašćenja.'); }
  };

  if (loading) return <div>Učitavanje...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Izmena destinacije</h1>
      {msg && <div className="mb-3 text-sm">{msg}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm">Naziv</label>
          <input className="w-full border rounded px-3 py-2" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required />
        </div>
        <div>
          <label className="block text-sm">Država</label>
          <input className="w-full border rounded px-3 py-2" value={form.country} onChange={e=>setForm({...form, country: e.target.value})} required />
        </div>
        <UploadInput value={form.image_url} onChange={(url)=>setForm({...form, image_url: url})} label="Slika" />
        <div>
          <label className="block text-sm">Opis</label>
          <textarea className="w-full border rounded px-3 py-2" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Sačuvaj</button>
          <Link to="/dashboard/admin" className="px-4 py-2 bg-gray-200 rounded">Nazad</Link>
        </div>
      </form>
    </div>
  );
};

export default AdminDestinationEdit;


