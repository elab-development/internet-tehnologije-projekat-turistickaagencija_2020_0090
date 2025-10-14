import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import UploadInput from './UploadInput';

const AdminDestinationCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', country: '', description: '', image_url: '' });
  const [msg, setMsg] = useState('');
  const tokenHeader = { Authorization: `Bearer ${localStorage.getItem('api_token')}` };

  const onSubmit = async (e) => {
    e.preventDefault(); setMsg('');
    try {
      await axios.post('http://localhost:8000/api/destinations', form, { headers: tokenHeader });
      navigate('/dashboard/admin');
    } catch (_) { setMsg('Greška pri čuvanju destinacije.'); }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Nova destinacija</h1>
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

export default AdminDestinationCreate;


