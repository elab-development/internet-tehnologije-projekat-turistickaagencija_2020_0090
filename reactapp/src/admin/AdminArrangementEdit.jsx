import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import UploadInput from './UploadInput';

const AdminArrangementEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', price: '', available_spots: 0, transport_type: 'bus', accommodation_type: 'hotel', start_date: '', end_date: '', image_url: '' });
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('admin');
  const [msg, setMsg] = useState('');
  const tokenHeader = { Authorization: `Bearer ${localStorage.getItem('api_token')}` };

  useEffect(() => {
    const run = async () => {
      try {
        // Maro, ovde prvo dohvatamo ulogu da znamo na koji dashboard da te vratimo posle izmene.
        // Zašto: admin i agent se vraćaju na različite stranice pa ne želimo da te bacimo na pogrešan deo aplikacije.
        // Ako zapne: proveri da li `/api/me` vraća `role` i da li token postoji u `localStorage`.
        try {
          const me = await axios.get('http://localhost:8000/api/me', { headers: tokenHeader });
          if (me?.data?.role) setUserRole(me.data.role);
        } catch (_) {}

        const res = await axios.get(`http://localhost:8000/api/arrangements/${id}`);
        const a = res.data;
        setForm({
          name: a.name || '', description: a.description || '', price: a.price ?? '', available_spots: a.available_spots ?? 0,
          transport_type: a.transport_type || 'bus', accommodation_type: a.accommodation_type || 'hotel',
          start_date: (a.start_date || '').slice(0,10), end_date: (a.end_date || '').slice(0,10), image_url: a.image_url || ''
        });
      } catch (_) { setMsg('Ne mogu da učitam aranžman.'); }
      finally { setLoading(false); }
    };
    run();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault(); setMsg('');
    try {
      await axios.put(`http://localhost:8000/api/arrangements/${id}`, { ...form, price: Number(form.price), available_spots: Number(form.available_spots) }, { headers: tokenHeader });
      setMsg('Sačuvano.');
      navigate(`/dashboard/${userRole || 'admin'}`);
    } catch (_) { setMsg('Greška pri čuvanju.'); }
  };

  if (loading) return <div>Učitavanje...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Izmena aranžmana</h1>
      {msg && <div className="mb-3 text-sm">{msg}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm">Naziv</label>
          <input className="w-full border rounded px-3 py-2" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required />
        </div>
        <div>
          <label className="block text-sm">Opis</label>
          <textarea className="w-full border rounded px-3 py-2" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm">Cena (€)</label>
            <input type="number" step="0.01" className="w-full border rounded px-3 py-2" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm">Slobodnih mesta</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={form.available_spots} onChange={e=>setForm({...form, available_spots: e.target.value})} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm">Prevoz</label>
            <select className="w-full border rounded px-3 py-2" value={form.transport_type} onChange={e=>setForm({...form, transport_type: e.target.value})}>
              <option value="bus">Autobus</option>
              <option value="airplane">Avion</option>
              <option value="own">Sopstveni</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Smeštaj</label>
            <select className="w-full border rounded px-3 py-2" value={form.accommodation_type} onChange={e=>setForm({...form, accommodation_type: e.target.value})}>
              <option value="hotel">Hotel</option>
              <option value="apartment">Apartman</option>
              <option value="villa">Vila</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm">Polazak</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={form.start_date} onChange={e=>setForm({...form, start_date: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm">Povratak</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={form.end_date} onChange={e=>setForm({...form, end_date: e.target.value})} />
          </div>
        </div>
        <UploadInput value={form.image_url} onChange={(url)=>setForm({...form, image_url: url})} label="Slika" />
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Sačuvaj</button>
          <Link to={`/dashboard/${userRole || 'admin'}`} className="px-4 py-2 bg-gray-200 rounded">Nazad</Link>
        </div>
      </form>
    </div>
  );
};

export default AdminArrangementEdit;


