import React, { useEffect, useState } from 'react';
import axios from 'axios';

const initialForm = {
  destination_id: '',
  name: '',
  description: '',
  price: '',
  start_date: '',
  end_date: '',
  available_spots: 0,
  transport_type: 'bus',
  accommodation_type: 'hotel',
  is_active: true,
  image_url: ''
};

const extractErrorMessage = (error) => {
  const data = error?.response?.data;
  if (data?.errors && typeof data.errors === 'object') {
    const collected = Object.values(data.errors)
      .flatMap((val) => (Array.isArray(val) ? val : [val]))
      .filter(Boolean)
      .map((val) => (typeof val === 'string' ? val : String(val)));
    if (collected.length) {
      return collected.join(' ');
    }
  }
  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message.trim();
  }
  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message.trim();
  }
  return null;
};

const AgentDashboard = () => {
  const [form, setForm] = useState(initialForm);
  const [destinations, setDestinations] = useState([]);
  const [list, setList] = useState([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const tokenHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('api_token')}` });

  const loadData = async () => {
    setLoading(true);
    try {
      const [dRes, aRes] = await Promise.all([
        axios.get('http://localhost:8000/api/destinations?per_page=100'),
        axios.get(`http://localhost:8000/api/arrangements/mine/list?q=${encodeURIComponent(q)}&per_page=15&page=${page}`, { headers: tokenHeader() })
      ]);
      setDestinations(dRes.data?.data || []);
      setList(aRes.data?.data || []);
      setLastPage(aRes.data?.last_page || 1);
    } catch (e) {
      console.error('Greška pri učitavanju podataka.', e);
      const details = extractErrorMessage(e);
      setFeedback({
        type: 'error',
        text: details ? `Greška pri učitavanju podataka. Detalji: ${details}` : 'Greška pri učitavanju podataka.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [q, page]);

  const onCreate = async (e) => {
    e.preventDefault();
    setFeedback(null);
    try {
      await axios.post('http://localhost:8000/api/arrangements', {
        ...form,
        price: Number(form.price),
        available_spots: Number(form.available_spots),
      }, { headers: tokenHeader() });
      setForm(initialForm);
      setQ('');
      setPage(1);
      setFeedback({ type: 'success', text: 'Aranžman kreiran.' });
      await loadData();
    } catch (e) {
      console.error('Neuspešno kreiranje aranžmana.', e);
      const details = extractErrorMessage(e);
      setFeedback({
        type: 'error',
        text: details ? `Neuspešno kreiranje. Proveri polja i ovlašćenja. Detalji: ${details}` : 'Neuspešno kreiranje. Proveri polja i ovlašćenja.'
      });
    }
  };

  const quickUpdate = async (id, patch) => {
    setFeedback(null);
    try {
      await axios.put(`http://localhost:8000/api/arrangements/${id}`, patch, { headers: tokenHeader() });
      setFeedback({ type: 'success', text: 'Sačuvano.' });
      await loadData();
    } catch (e) {
      console.error('Neuspešno ažuriranje aranžmana.', e);
      const details = extractErrorMessage(e);
      setFeedback({
        type: 'error',
        text: details ? `Neuspešno ažuriranje. Detalji: ${details}` : 'Neuspešno ažuriranje.'
      });
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Obrisati aranžman?')) return;
    setFeedback(null);
    try {
      await axios.delete(`http://localhost:8000/api/arrangements/${id}`, { headers: tokenHeader() });
      setFeedback({ type: 'success', text: 'Obrisano.' });
      await loadData();
    } catch (e) {
      console.error('Neuspešno brisanje aranžmana.', e);
      const details = extractErrorMessage(e);
      setFeedback({
        type: 'error',
        text: details ? `Neuspešno brisanje. Detalji: ${details}` : 'Neuspešno brisanje.'
      });
    }
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          className={`text-sm rounded border px-3 py-2 ${feedback.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`}
        >
          {feedback.text}
        </div>
      )}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Kreiraj novi aranžman</h2>
        <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm">Destinacija</label>
            <select className="w-full border rounded px-2 py-1" value={form.destination_id} onChange={e=>setForm({...form, destination_id: e.target.value})} required>
              <option value="">Izaberi...</option>
              {destinations.map(d => (
                <option key={d.id} value={d.id}>{d.name}, {d.country}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm">Naziv</label>
            <input className="w-full border rounded px-2 py-1" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm">Opis</label>
            <textarea className="w-full border rounded px-2 py-1" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm">Cena (€)</label>
            <input type="number" step="0.01" className="w-full border rounded px-2 py-1" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm">Slobodnih mesta</label>
            <input type="number" className="w-full border rounded px-2 py-1" value={form.available_spots} onChange={e=>setForm({...form, available_spots: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm">Prevoz</label>
            <select className="w-full border rounded px-2 py-1" value={form.transport_type} onChange={e=>setForm({...form, transport_type: e.target.value})}>
              <option value="bus">Autobus</option>
              <option value="airplane">Avion</option>
              <option value="own">Sopstveni</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Smeštaj</label>
            <select className="w-full border rounded px-2 py-1" value={form.accommodation_type} onChange={e=>setForm({...form, accommodation_type: e.target.value})}>
              <option value="hotel">Hotel</option>
              <option value="apartment">Apartman</option>
              <option value="villa">Vila</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Polazak</label>
            <input type="date" className="w-full border rounded px-2 py-1" value={form.start_date} onChange={e=>setForm({...form, start_date: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm">Povratak</label>
            <input type="date" className="w-full border rounded px-2 py-1" value={form.end_date} onChange={e=>setForm({...form, end_date: e.target.value})} required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm">Slika (URL)</label>
            <input className="w-full border rounded px-2 py-1" value={form.image_url} onChange={e=>setForm({...form, image_url: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Sačuvaj</button>
          </div>
        </form>
      </div>

      <div className="bg-white p-4 rounded shadow space-y-3">
        <div>
          <input className="border rounded px-2 py-1" placeholder="Pretraga (naziv/destinacija)" value={q} onChange={e=>{setPage(1); setQ(e.target.value);}} />
        </div>
        <h2 className="text-xl font-semibold mb-2">Brzo ažuriranje postojećih</h2>
        {loading ? (<div>Učitavanje...</div>) : (
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Naziv</th>
                  <th className="p-2">Cena</th>
                  <th className="p-2">Mesta</th>
                  <th className="p-2">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {list.map(a => (
                  <tr key={a.id} className="border-t">
                    <td className="p-2">{a.name}</td>
                    <td className="p-2">
                      <input type="number" step="0.01" defaultValue={a.price} className="border rounded px-2 py-1 w-28" onBlur={e=>quickUpdate(a.id, { price: Number(e.target.value) })} />
                    </td>
                    <td className="p-2">
                      <input type="number" defaultValue={a.available_spots} className="border rounded px-2 py-1 w-20" onBlur={e=>quickUpdate(a.id, { available_spots: Number(e.target.value) })} />
                    </td>
                    <td className="p-2 space-x-2">
                      <a href={`/admin/arrangements/${a.id}/edit`} className="px-3 py-1 bg-gray-200 rounded inline-block">Izmeni</a>
                      <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={()=>onDelete(a.id)}>Obriši</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex items-center gap-2 mt-2">
          <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className={`px-3 py-1 rounded ${page<=1?'bg-gray-100 text-gray-400':'bg-gray-200'}`}>Prev</button>
          <span className="text-sm">Strana {page}/{lastPage}</span>
          <button disabled={page>=lastPage} onClick={()=>setPage(p=>p+1)} className={`px-3 py-1 rounded ${page>=lastPage?'bg-gray-100 text-gray-400':'bg-gray-200'}`}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;


