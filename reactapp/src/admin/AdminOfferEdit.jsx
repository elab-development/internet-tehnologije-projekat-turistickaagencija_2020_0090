import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminOfferEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', arrangement_id: '', type: 'last_minute', discount_percentage: 10, valid_from: '', valid_until: '', is_active: true, description: '' });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const tokenHeader = { Authorization: `Bearer ${localStorage.getItem('api_token')}` };

  useEffect(() => {
    const run = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/offers/${id}`);
        const o = res.data;
        setForm({
          name: o.name || '',
          arrangement_id: o.arrangement_id || '',
          type: o.type || 'last_minute',
          discount_percentage: o.discount_percentage ?? 10,
          valid_from: (o.valid_from || '').slice(0,10),
          valid_until: (o.valid_until || '').slice(0,10),
          is_active: !!o.is_active,
          description: o.description || ''
        });
      } catch (_) { setMsg('Ne mogu da učitam ponudu.'); }
      finally { setLoading(false); }
    };
    run();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault(); setMsg('');
    try {
      await axios.put(`http://localhost:8000/api/offers/${id}`, { ...form, discount_percentage: Number(form.discount_percentage) }, { headers: tokenHeader });
      setMsg('Sačuvano.');
      navigate('/dashboard/admin');
    } catch (_) { setMsg('Greška pri čuvanju.'); }
  };

  if (loading) return <div>Učitavanje...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Izmena ponude</h1>
      {msg && <div className="mb-3 text-sm">{msg}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm">Naziv</label>
          <input className="w-full border rounded px-3 py-2" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required />
        </div>
        <div>
          <label className="block text-sm">Aranžman ID</label>
          <input className="w-full border rounded px-3 py-2" value={form.arrangement_id} onChange={e=>setForm({...form, arrangement_id: e.target.value})} required />
        </div>
        <div>
          <label className="block text-sm">Tip</label>
          <select className="w-full border rounded px-3 py-2" value={form.type} onChange={e=>setForm({...form, type: e.target.value})}>
            <option value="last_minute">Last minute</option>
            <option value="early_booking">Early booking</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">Procenat popusta</label>
          <input type="number" step="0.01" className="w-full border rounded px-3 py-2" value={form.discount_percentage} onChange={e=>setForm({...form, discount_percentage: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm">Važi od</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={form.valid_from} onChange={e=>setForm({...form, valid_from: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm">Važi do</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={form.valid_until} onChange={e=>setForm({...form, valid_until: e.target.value})} />
          </div>
        </div>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={form.is_active} onChange={e=>setForm({...form, is_active: e.target.checked})} /> Aktivna
        </label>
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

export default AdminOfferEdit;


