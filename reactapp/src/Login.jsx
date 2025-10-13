// Maro, ovo je login forma koja uzima token i odmah te vodi na pravi dashboard.
// Zašto: bez ovoga ne možeš doći do zaštićenih ruta i exporta.
// Ako zapne: proveri da li `/api/login` vraća token i da li ga prosleđujemo u Authorization header za `/api/me`.
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const Login = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthenticated, logout } = useAuth();

  const { intent, from, arrangementId } = location.state || {};

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/login', { email, password });
      const token = res.data?.token;
      if (!token) {
        throw new Error('Token nije vraćen.');
      }
      // Maro, ovde odmah uzimamo ulogu i vodimo na odgovarajući dashboard
      const me = await axios.get('http://localhost:8000/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const role = me.data?.role || 'client';
      setAuthenticated(token, role);

      if (intent === 'reserve' && from) {
        navigate(from, { replace: true, state: { openReservation: true, arrangementId } });
        return;
      }

      if (from) {
        navigate(from, { replace: true });
        return;
      }

      navigate(`/dashboard/${role}`);
    } catch (e) {
      await logout();
      setError('Neuspešan login. Proveri email/lozinku.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Prijava</h1>
      {intent === 'reserve' && (
        <div className="mb-4 text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded">
          Prijavi se da bi završila započetu rezervaciju.
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Lozinka</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button type="submit" disabled={loading} className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-70">
          {loading ? 'Prijavljivanje...' : 'Prijavi se'}
        </button>
      </form>
      <p className="text-sm text-gray-600 mt-4 text-center">
        Nemaš nalog?{' '}
        <Link
          to="/register"
          state={location.state}
          className="text-blue-600 hover:text-blue-700"
        >
          Registruj se
        </Link>
      </p>
    </div>
  );
};

export default Login;


