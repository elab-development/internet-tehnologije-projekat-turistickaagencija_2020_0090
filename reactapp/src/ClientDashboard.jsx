// Maro, ovo je dashboard za klijenta sa listom njegovih rezervacija.
// Zašto: korisnik želi brzo da vidi statuse i filtrira svoje prijave.
// Ako zapne: proveri da li šalješ token u header-u kad gađaš `/api/my/reservations` i da li backend vraća `last_page`.
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClientDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('api_token');
        const res = await axios.get(`http://localhost:8000/api/my/reservations?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}&page=${page}&per_page=10`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!isMounted) {
          return;
        }

        setData(res.data);
        setLastPage(res.data?.last_page || 1);
      } catch (e) {
        if (!isMounted) {
          return;
        }

        setData(null);
        setLastPage(1);
        setError('Ne mogu da učitam rezervacije.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [q, status, page]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded shadow space-y-3">
        <h2 className="text-xl font-semibold">Moje rezervacije</h2>
        <div className="flex items-center gap-2">
          <input className="border rounded px-2 py-1" placeholder="Pretraga (aranžman/destinacija)" value={q} onChange={e=>{setPage(1); setQ(e.target.value);}} />
          <select className="border rounded px-2 py-1" value={status} onChange={e=>{setPage(1); setStatus(e.target.value);}}>
            <option value="">Svi statusi</option>
            <option value="pending">Na čekanju</option>
            <option value="confirmed">Potvrđeno</option>
            <option value="cancelled">Otkazano</option>
          </select>
        </div>
        {loading ? (<div>Učitavanje...</div>) : error ? (<div className="text-red-600">{error}</div>) : (
          <div className="space-y-3">
            {(data?.data || []).length === 0 ? (
              <div className="text-gray-600">Trenutno nema rezervacija koje odgovaraju filterima.</div>
            ) : null}
            {(data?.data || []).map((r) => (
              <div key={r.id} className="border rounded p-3">
                <div className="font-medium">{r.arrangement?.name}</div>
                <div className="text-sm text-gray-600">{r.arrangement?.destination?.name}, {r.arrangement?.destination?.country}</div>
                <div className="text-sm">Osoba: {r.number_of_people} &nbsp;|&nbsp; Ukupno: {r.total_price} €</div>
                <div className="text-sm">Status: {r.status}</div>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className={`px-3 py-1 rounded ${page<=1?'bg-gray-100 text-gray-400':'bg-gray-200'}`}>Prev</button>
              <span className="text-sm">Strana {page}/{lastPage}</span>
              <button disabled={page>=lastPage} onClick={()=>setPage(p=>p+1)} className={`px-3 py-1 rounded ${page>=lastPage?'bg-gray-100 text-gray-400':'bg-gray-200'}`}>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;


