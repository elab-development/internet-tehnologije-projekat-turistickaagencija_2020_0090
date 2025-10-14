import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import UploadInput from './UploadInput';

const AdminArrangementCreate = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [form, setForm] = useState({ destination_id: '', name: '', description: '', price: '', available_spots: 0, transport_type: 'bus', accommodation_type: 'hotel', start_date: '', end_date: '', image_url: '' });
  const [msg, setMsg] = useState('');
  const tokenHeader = { Authorization: `Bearer ${localStorage.getItem('api_token')}` };

  useEffect(() => {
    const run = async () => {
      try { const res = await axios.get('http://localhost:8000/api/destinations'); setDestinations(res.data || []); } catch (_) {}
    };
    run();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault(); setMsg('');
    try {
      await axios.post('http://localhost:8000/api/arrangements', { ...form, price: Number(form.price), available_spots: Number(form.available_spots) }, { headers: tokenHeader });
      navigate('/dashboard/admin');
    } catch (_) { setMsg('Greška pri čuvanju aranžmana.'); }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Novi aranžman</h1>
      {msg && <div className="mb-3 text-sm">{msg}</div>}
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2">
          <label className="block text-sm">Destinacija</label>
          <select className="w-full border rounded px-3 py-2" value={form.destination_id} onChange={e=>setForm({...form, destination_id: e.target.value})} required>
            <option value="">Izaberi...</option>
            {destinations.map(d => (<option key={d.id} value={d.id}>{d.name}, {d.country}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm">Naziv</label>
          <input className="w-full border rounded px-3 py-2" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required />
        </div>
        <div>
          <label className="block text-sm">Cena (€)</label>
          <input type="number" step="0.01" className="w-full border rounded px-3 py-2" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} required />
        </div>
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
        <div>
          <label className="block text-sm">Polazak</label>
          <input type="date" className="w-full border rounded px-3 py-2" value={form.start_date} onChange={e=>setForm({...form, start_date: e.target.value})} required />
        </div>
        <div>
          <label className="block text-sm">Povratak</label>
          <input type="date" className="w-full border rounded px-3 py-2" value={form.end_date} onChange={e=>setForm({...form, end_date: e.target.value})} required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm">Opis</label>
          <textarea className="w-full border rounded px-3 py-2" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} />
        </div>
        <div className="md:col-span-2">
          <UploadInput value={form.image_url} onChange={(url)=>setForm({...form, image_url: url})} label="Slika" />
        </div>
        <div className="md:col-span-2 flex gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Sačuvaj</button>
          <Link to="/dashboard/admin" className="px-4 py-2 bg-gray-200 rounded">Nazad</Link>
        </div>
      </form>
    </div>
  );
};

export default AdminArrangementCreate;


