import React, { useState } from 'react';
import axios from 'axios';

export const UserCreateForm = ({ onCreated }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'client' });
  const [msg, setMsg] = useState('');
  const submit = async (e) => {
    e.preventDefault(); setMsg('');
    try {
      const token = localStorage.getItem('api_token');
      await axios.post('http://localhost:8000/api/admin/users', form, { headers: { Authorization: `Bearer ${token}` } });
      setForm({ name: '', email: '', password: '', role: 'client' });
      setMsg('Korisnik kreiran.');
      onCreated && onCreated();
    } catch (_) { setMsg('Greška pri kreiranju.'); }
  };
  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
      <div><label className="block text-sm">Ime</label><input className="border rounded px-2 py-1 w-full" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required /></div>
      <div><label className="block text-sm">Email</label><input type="email" className="border rounded px-2 py-1 w-full" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} required /></div>
      <div><label className="block text-sm">Lozinka</label><input type="password" className="border rounded px-2 py-1 w-full" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} required /></div>
      <div><label className="block text-sm">Uloga</label>
        <select className="border rounded px-2 py-1 w-full" value={form.role} onChange={e=>setForm({...form, role: e.target.value})}>
          <option value="client">Client</option>
          <option value="agent">Agent</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div><button className="px-3 py-2 bg-blue-600 text-white rounded">Dodaj</button></div>
      {msg && <div className="md:col-span-5 text-sm">{msg}</div>}
    </form>
  );
};

export const RoleSelect = ({ user, onChanged }) => {
  const [role, setRole] = useState(user.role || 'client');
  const save = async () => {
    const token = localStorage.getItem('api_token');
    await axios.put(`http://localhost:8000/api/admin/users/${user.id}`, { role }, { headers: { Authorization: `Bearer ${token}` } });
    onChanged && onChanged();
  };
  return (
    <span className="inline-flex items-center gap-2">
      <select className="border rounded px-2 py-1" value={role} onChange={e=>setRole(e.target.value)}>
        <option value="client">Client</option>
        <option value="agent">Agent</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={save} className="px-2 py-1 bg-gray-200 rounded">Sačuvaj ulogu</button>
    </span>
  );
};

export const ResetPassBtn = ({ user, onChanged }) => {
  const [open, setOpen] = useState(false);
  const [pwd, setPwd] = useState('');
  const run = async () => {
    const token = localStorage.getItem('api_token');
    await axios.put(`http://localhost:8000/api/admin/users/${user.id}`, { password: pwd }, { headers: { Authorization: `Bearer ${token}` } });
    setOpen(false); setPwd(''); onChanged && onChanged();
  };
  return (
    <span className="inline-flex items-center gap-2">
      {!open ? (
        <button onClick={()=>setOpen(true)} className="px-2 py-1 bg-gray-200 rounded">Reset lozinke</button>
      ) : (
        <span className="inline-flex items-center gap-2">
          <input type="password" className="border rounded px-2 py-1" placeholder="Nova lozinka" value={pwd} onChange={e=>setPwd(e.target.value)} />
          <button onClick={run} className="px-2 py-1 bg-gray-200 rounded">Sačuvaj</button>
        </span>
      )}
    </span>
  );
};

export const DeleteUserBtn = ({ user, onChanged }) => {
  const del = async () => {
    if (!window.confirm('Obrisati korisnika?')) return;
    const token = localStorage.getItem('api_token');
    await axios.delete(`http://localhost:8000/api/admin/users/${user.id}`, { headers: { Authorization: `Bearer ${token}` } });
    onChanged && onChanged();
  };
  return <button onClick={del} className="px-2 py-1 bg-red-600 text-white rounded">Obriši</button>;
};


