// Maro, ovo je admin tabla za statistiku, eksport i kompletno upravljanje sistemom.
// Zašto: kao admin imaš centralno mesto da pregledaš rezervacije, korisnike, ponude i da izvlačiš izveštaje.
// Ako zapne: uveri se da token nosi ulogu `admin` jer sve rute traže taj nivo pristupa.
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserCreateForm, RoleSelect, ResetPassBtn, DeleteUserBtn } from './admin/UserManageParts';

const TabBtn = ({ active, onClick, children }) => (
  <button onClick={onClick} className={`px-3 py-2 rounded ${active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>{children}</button>
);

const useTokenHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('api_token')}` });

const AdminDashboard = () => {
  const [tab, setTab] = useState('pregled');
  const [reservations, setReservations] = useState(null);
  const [users, setUsers] = useState(null);
  const [usersFilter, setUsersFilter] = useState({ role: '', q: '' });
  const [activities, setActivities] = useState(null);
  const [actFilter, setActFilter] = useState({ user_id: '', type: '', q: '' });
  const [destList, setDestList] = useState([]);
  const [destForm, setDestForm] = useState({ name: '', country: '', description: '', image_url: '' });
  const [offerList, setOfferList] = useState([]);
  const [offerForm, setOfferForm] = useState({ name: '', arrangement_id: '', type: 'last_minute', discount_percentage: 10, valid_from: '', valid_until: '', is_active: true, description: '' });
  const [arrList, setArrList] = useState([]);
  const [arrQ, setArrQ] = useState('');
  const [arrPage, setArrPage] = useState(1);
  const [arrLastPage, setArrLastPage] = useState(1);
  const [msg, setMsg] = useState('');

  const tokenHeader = useTokenHeader();

  useEffect(() => {
    // Maro, ovaj useEffect odmah učitava listu rezervacija da admin vidi stanje čim uđe.
    // Zašto: dashboard bez podataka nije od pomoći i mora da prikaže realno stanje rezervacija.
    // Ako zapne: proveri odgovor `GET /api/admin/reservations` i da li Authorization header prati token.
    const run = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/admin/reservations', { headers: tokenHeader });
        setReservations(res.data);
      } catch (_) {}
    };
    run();
  }, []);

  const loadUsers = async () => {
    const params = new URLSearchParams();
    if (usersFilter.role) params.set('role', usersFilter.role);
    if (usersFilter.q) params.set('q', usersFilter.q);
    const res = await axios.get(`http://localhost:8000/api/admin/users?${params.toString()}`, { headers: tokenHeader });
    setUsers(res.data);
  };

  const loadActivities = async () => {
    const params = new URLSearchParams();
    if (actFilter.user_id) params.set('user_id', actFilter.user_id);
    if (actFilter.type) params.set('type', actFilter.type);
    if (actFilter.q) params.set('q', actFilter.q);
    const res = await axios.get(`http://localhost:8000/api/admin/activities?${params.toString()}`, { headers: tokenHeader });
    setActivities(res.data);
  };

  const loadDestinations = async () => {
    const res = await axios.get('http://localhost:8000/api/destinations?per_page=100');
    setDestList(res.data?.data || []);
  };

  const loadOffers = async () => {
    const res = await axios.get('http://localhost:8000/api/admin/offers', { headers: tokenHeader });
    setOfferList(res.data?.data || []);
  };

  const loadArrangements = async () => {
    const params = new URLSearchParams();
    if (arrQ) params.set('q', arrQ);
    params.set('per_page', '15');
    params.set('page', String(arrPage));
    const res = await axios.get(`http://localhost:8000/api/arrangements?${params.toString()}`);
    setArrList(res.data?.data || []);
    setArrLastPage(res.data?.last_page || 1);
  };

  // Maro, kada menjaš tabove, tek tada povlačimo relevantne podatke.
  // Zašto: ne želimo da zagušimo backend svim pozivima ako korisnik gleda samo jedan modul.
  // Ako zapne: proveri koji tab je aktivan i da li se odgovarajuća `load*` funkcija izvršava bez greške.
  useEffect(() => {
    (async () => {
      try {
        if (tab === 'korisnici') await loadUsers();
        if (tab === 'aktivnosti') await loadActivities();
        if (tab === 'destinacije') await loadDestinations();
        if (tab === 'ponude') await loadOffers();
        if (tab === 'aranzmani') await loadArrangements();
      } catch (_) {}
    })();
  }, [tab]);

  useEffect(() => { if (tab==='aranzmani') loadArrangements(); }, [arrQ, arrPage]);

  // Maro, ovaj blok obuhvata kreiranje, izmenu i brisanje destinacija.
  // Zašto: admin mora da ažurira katalog gradova direktno iz dashboarda.
  // Ako zapne: vidi da li validacija vraća poruku i da li `loadDestinations()` osvežava listu nakon akcije.
  const createDestination = async (e) => {
    e.preventDefault(); setMsg('');
    try {
      await axios.post('http://localhost:8000/api/destinations', destForm, { headers: tokenHeader });
      setDestForm({ name: '', country: '', description: '', image_url: '' });
      await loadDestinations();
      setMsg('Destinacija sačuvana.');
    } catch (_) { setMsg('Greška pri čuvanju destinacije.'); }
  };
  const updateDestination = async (id, patch) => {
    setMsg('');
    try { await axios.put(`http://localhost:8000/api/destinations/${id}`, patch, { headers: tokenHeader }); await loadDestinations(); setMsg('Izmenjeno.'); } catch (_) { setMsg('Greška pri izmeni.'); }
  };
  const deleteDestination = async (id) => {
    if (!confirm('Obrisati destinaciju?')) return; setMsg('');
    try { await axios.delete(`http://localhost:8000/api/destinations/${id}`, { headers: tokenHeader }); await loadDestinations(); setMsg('Obrisano.'); } catch (_) { setMsg('Greška pri brisanju.'); }
  };

  // Maro, ovde održavamo specijalne ponude (last minute/early booking).
  // Zašto: samo admin sme da odobri ili povuče popuste, pa sve radimo iz jednog mesta.
  // Ako zapne: proveri da li `discount_percentage` ide kao broj i da li `is_active` stiže kao boolean ka backendu.
  const createOffer = async (e) => {
    e.preventDefault(); setMsg('');
    try {
      await axios.post('http://localhost:8000/api/offers', { ...offerForm, discount_percentage: Number(offerForm.discount_percentage) }, { headers: tokenHeader });
      setOfferForm({ name: '', arrangement_id: '', type: 'last_minute', discount_percentage: 10, valid_from: '', valid_until: '', is_active: true, description: '' });
      await loadOffers(); setMsg('Ponuda sačuvana.');
    } catch (_) { setMsg('Greška pri čuvanju ponude.'); }
  };
  const updateOffer = async (id, patch) => {
    setMsg('');
    try { await axios.put(`http://localhost:8000/api/offers/${id}`, patch, { headers: tokenHeader }); await loadOffers(); setMsg('Izmenjeno.'); } catch (_) { setMsg('Greška pri izmeni ponude.'); }
  };
  const deleteOffer = async (id) => {
    if (!confirm('Obrisati ponudu?')) return; setMsg('');
    try { await axios.delete(`http://localhost:8000/api/offers/${id}`, { headers: tokenHeader }); await loadOffers(); setMsg('Obrisano.'); } catch (_) { setMsg('Greška pri brisanju ponude.'); }
  };

  // Maro, ovaj deo služi za brzo ažuriranje i brisanje aranžmana iz admin pogleda.
  // Zašto: admin nekad mora da reaguje umesto agenta i ovo je najbrži način.
  // Ako zapne: potvrdi da `loadArrangements()` trči posle izmene i da rute `/api/arrangements` vraćaju očekivane podatke.
  const quickUpdateArrangement = async (id, patch) => {
    setMsg('');
    try { await axios.put(`http://localhost:8000/api/arrangements/${id}`, patch, { headers: tokenHeader }); await loadArrangements(); setMsg('Sačuvano.'); } catch (_) { setMsg('Greška pri čuvanju.'); }
  };
  const deleteArrangement = async (id) => {
    if (!confirm('Obrisati aranžman?')) return;
    setMsg('');
    try { await axios.delete(`http://localhost:8000/api/arrangements/${id}`, { headers: tokenHeader }); await loadArrangements(); setMsg('Obrisano.'); } catch (_) { setMsg('Greška pri brisanju.'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <TabBtn active={tab==='pregled'} onClick={()=>setTab('pregled')}>Pregled</TabBtn>
        <TabBtn active={tab==='korisnici'} onClick={()=>setTab('korisnici')}>Korisnici</TabBtn>
        <TabBtn active={tab==='aktivnosti'} onClick={()=>setTab('aktivnosti')}>Aktivnosti</TabBtn>
        <TabBtn active={tab==='destinacije'} onClick={()=>setTab('destinacije')}>Destinacije</TabBtn>
        <TabBtn active={tab==='ponude'} onClick={()=>setTab('ponude')}>Ponude</TabBtn>
        <TabBtn active={tab==='aranzmani'} onClick={()=>setTab('aranzmani')}>Aranžmani</TabBtn>
      </div>

      {msg && <div className="text-sm">{msg}</div>}

      {tab==='pregled' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Statistika</h2>
            <p className="text-gray-600">Pogledaj grafike na početnoj (Charts) ili koristi API /api/arrangements/statistics.</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Eksport</h2>
            <ul className="list-disc ml-6 text-blue-600">
              <li><a href="/api/export/arrangements.csv" target="_blank" rel="noreferrer">Aranžmani CSV</a></li>
              <li><a href="/api/export/reservations.csv" target="_blank" rel="noreferrer">Rezervacije CSV</a></li>
              <li><a href="/api/export/arrangements.pdf" target="_blank" rel="noreferrer">Aranžmani PDF</a></li>
              <li><a href="/api/export/reservations.pdf" target="_blank" rel="noreferrer">Rezervacije PDF</a></li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">Potrebno je biti prijavljen (token) i imati ulogu admin.</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Sve rezervacije</h2>
            <div className="space-y-3">
              {(reservations?.data || []).map(r => (
                <div key={r.id} className="border rounded p-3">
                  <div className="font-medium">{r.arrangement?.name}</div>
                  <div className="text-sm text-gray-600">{r.user?.email}</div>
                  <div className="text-sm">Osoba: {r.number_of_persons} | Ukupno: {r.total_price} € | Status: {r.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab==='korisnici' && (
        <div className="bg-white p-4 rounded shadow space-y-6">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Novi korisnik</h3>
            <UserCreateForm onCreated={loadUsers} />
          </div>
          <div className="flex gap-2 items-end">
            <div>
              <label className="block text-sm">Uloga</label>
              <select className="border rounded px-2 py-1" value={usersFilter.role} onChange={e=>setUsersFilter({...usersFilter, role: e.target.value})}>
                <option value="">Sve</option>
                <option value="admin">Admin</option>
                <option value="agent">Agent</option>
                <option value="client">Client</option>
              </select>
            </div>
            <div>
              <label className="block text-sm">Pretraga</label>
              <input className="border rounded px-2 py-1" value={usersFilter.q} onChange={e=>setUsersFilter({...usersFilter, q: e.target.value})} placeholder="Ime ili email" />
            </div>
            <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={loadUsers}>Primeni</button>
          </div>
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead><tr className="text-left"><th className="p-2">Ime</th><th className="p-2">Email</th><th className="p-2">Uloga</th><th className="p-2">Akcije</th></tr></thead>
              <tbody>
                {(users?.data || []).map(u => (
                  <tr key={u.id} className="border-t">
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.role || 'client'}</td>
                    <td className="p-2 space-x-2">
                      <RoleSelect user={u} onChanged={loadUsers} />
                      <ResetPassBtn user={u} onChanged={loadUsers} />
                      <DeleteUserBtn user={u} onChanged={loadUsers} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab==='aktivnosti' && (
        <div className="bg-white p-4 rounded shadow space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
            <div>
              <label className="block text-sm">User ID</label>
              <input className="border rounded px-2 py-1" value={actFilter.user_id} onChange={e=>setActFilter({...actFilter, user_id: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm">Tip</label>
              <input className="border rounded px-2 py-1" value={actFilter.type} onChange={e=>setActFilter({...actFilter, type: e.target.value})} placeholder="npr. login, search" />
            </div>
            <div>
              <label className="block text-sm">Pretraga</label>
              <input className="border rounded px-2 py-1" value={actFilter.q} onChange={e=>setActFilter({...actFilter, q: e.target.value})} />
            </div>
            <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={loadActivities}>Primeni</button>
          </div>
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead><tr className="text-left"><th className="p-2">ID</th><th className="p-2">Korisnik</th><th className="p-2">Tip</th><th className="p-2">IP</th><th className="p-2">Podaci</th></tr></thead>
              <tbody>
                {(activities?.data || []).map(a => (
                  <tr key={a.id} className="border-t">
                    <td className="p-2">{a.id}</td>
                    <td className="p-2">{a.user?.email}</td>
                    <td className="p-2">{a.activity_type}</td>
                    <td className="p-2">{a.ip_address}</td>
                    <td className="p-2 truncate max-w-[320px]">{JSON.stringify(a.activity_data)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab==='destinacije' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Nova destinacija</h2>
            <form onSubmit={createDestination} className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input className="border rounded px-2 py-1" placeholder="Naziv" value={destForm.name} onChange={e=>setDestForm({...destForm, name: e.target.value})} required />
              <input className="border rounded px-2 py-1" placeholder="Država" value={destForm.country} onChange={e=>setDestForm({...destForm, country: e.target.value})} required />
              <input className="border rounded px-2 py-1" placeholder="Slika URL" value={destForm.image_url} onChange={e=>setDestForm({...destForm, image_url: e.target.value})} />
              <input className="border rounded px-2 py-1 md:col-span-4" placeholder="Opis" value={destForm.description} onChange={e=>setDestForm({...destForm, description: e.target.value})} />
              <div className="md:col-span-4"><button className="px-4 py-2 bg-blue-600 text-white rounded">Sačuvaj</button></div>
            </form>
          </div>
          <div className="bg-white p-4 rounded shadow overflow-auto">
            <table className="min-w-full text-sm">
              <thead><tr className="text-left"><th className="p-2">Naziv</th><th className="p-2">Država</th><th className="p-2">Akcije</th></tr></thead>
              <tbody>
                {destList.map(d => (
                  <tr key={d.id} className="border-t">
                    <td className="p-2">{d.name}</td>
                    <td className="p-2">{d.country}</td>
                    <td className="p-2 space-x-2">
                      <Link to={`/admin/destinations/${d.id}/edit`}><button className="px-3 py-1 bg-gray-200 rounded">Izmeni</button></Link>
                      <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={()=>deleteDestination(d.id)}>Obriši</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3">
              <Link to="/admin/destinations/create" className="px-3 py-2 bg-blue-600 text-white rounded inline-block">Nova destinacija</Link>
            </div>
          </div>
        </div>
      )}

      {tab==='ponude' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Nova ponuda</h2>
            <form onSubmit={createOffer} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input className="border rounded px-2 py-1" placeholder="Naziv" value={offerForm.name} onChange={e=>setOfferForm({...offerForm, name: e.target.value})} required />
              <input className="border rounded px-2 py-1" placeholder="Aranžman ID" value={offerForm.arrangement_id} onChange={e=>setOfferForm({...offerForm, arrangement_id: e.target.value})} required />
              <select className="border rounded px-2 py-1" value={offerForm.type} onChange={e=>setOfferForm({...offerForm, type: e.target.value})}>
                <option value="last_minute">Last minute</option>
                <option value="early_booking">Early booking</option>
              </select>
              <input type="number" step="0.01" className="border rounded px-2 py-1" placeholder="% Popust" value={offerForm.discount_percentage} onChange={e=>setOfferForm({...offerForm, discount_percentage: e.target.value})} />
              <input type="date" className="border rounded px-2 py-1" value={offerForm.valid_from} onChange={e=>setOfferForm({...offerForm, valid_from: e.target.value})} required />
              <input type="date" className="border rounded px-2 py-1" value={offerForm.valid_until} onChange={e=>setOfferForm({...offerForm, valid_until: e.target.value})} required />
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={offerForm.is_active} onChange={e=>setOfferForm({...offerForm, is_active: e.target.checked})} /> Aktivna
              </label>
              <input className="border rounded px-2 py-1 md:col-span-3" placeholder="Opis" value={offerForm.description} onChange={e=>setOfferForm({...offerForm, description: e.target.value})} />
              <div className="md:col-span-3"><button className="px-4 py-2 bg-blue-600 text-white rounded">Sačuvaj</button></div>
            </form>
          </div>
          <div className="bg-white p-4 rounded shadow overflow-auto">
            <table className="min-w-full text-sm">
              <thead><tr className="text-left"><th className="p-2">Naziv</th><th className="p-2">Tip</th><th className="p-2">Popust</th><th className="p-2">Važi</th><th className="p-2">Aktivna</th><th className="p-2">Akcije</th></tr></thead>
              <tbody>
                {offerList.map(o => (
                  <tr key={o.id} className="border-t">
                    <td className="p-2">{o.name}</td>
                    <td className="p-2">{o.type}</td>
                    <td className="p-2">{o.discount_percentage}%</td>
                    <td className="p-2">{o.valid_from?.slice(0,10)} → {o.valid_until?.slice(0,10)}</td>
                    <td className="p-2">{o.is_active ? 'da' : 'ne'}</td>
                    <td className="p-2 space-x-2">
                      <button className="px-3 py-1 bg-gray-200 rounded" onClick={()=>updateOffer(o.id, { is_active: !o.is_active })}>{o.is_active?'Deaktiviraj':'Aktiviraj'}</button>
                      <Link to={`/admin/offers/${o.id}/edit`}><button className="px-3 py-1 bg-gray-200 rounded">Izmeni</button></Link>
                      <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={()=>deleteOffer(o.id)}>Obriši</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab==='aranzmani' && (
        <div className="bg-white p-4 rounded shadow overflow-auto space-y-3">
          <div className="flex gap-2 items-center">
            <input className="border rounded px-2 py-1" placeholder="Pretraga (naziv/destinacija)" value={arrQ} onChange={e=>{setArrPage(1); setArrQ(e.target.value);}} />
          </div>
          <table className="min-w-full text-sm">
            <thead><tr className="text-left"><th className="p-2">Naziv</th><th className="p-2">Cena</th><th className="p-2">Mesta</th><th className="p-2">Akcije</th></tr></thead>
            <tbody>
              {arrList.map(a => (
                <tr key={a.id} className="border-t">
                  <td className="p-2">{a.name}</td>
                  <td className="p-2"><input type="number" step="0.01" defaultValue={a.price} className="border rounded px-2 py-1 w-28" onBlur={e=>quickUpdateArrangement(a.id, { price: Number(e.target.value) })} /></td>
                  <td className="p-2"><input type="number" defaultValue={a.available_spots} className="border rounded px-2 py-1 w-20" onBlur={e=>quickUpdateArrangement(a.id, { available_spots: Number(e.target.value) })} /></td>
                  <td className="p-2 space-x-2">
                    <Link to={`/admin/arrangements/${a.id}/edit`}><button className="px-3 py-1 bg-gray-200 rounded">Izmeni</button></Link>
                    <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={()=>deleteArrangement(a.id)}>Obriši</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center gap-2">
            <button disabled={arrPage<=1} onClick={()=>setArrPage(p=>p-1)} className={`px-3 py-1 rounded ${arrPage<=1?'bg-gray-100 text-gray-400':'bg-gray-200'}`}>Prev</button>
            <span className="text-sm">Strana {arrPage}/{arrLastPage}</span>
            <button disabled={arrPage>=arrLastPage} onClick={()=>setArrPage(p=>p+1)} className={`px-3 py-1 rounded ${arrPage>=arrLastPage?'bg-gray-100 text-gray-400':'bg-gray-200'}`}>Next</button>
          </div>
          <div className="mt-3">
            <Link to="/admin/arrangements/create" className="px-3 py-2 bg-blue-600 text-white rounded inline-block">Novi aranžman</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;


