import React, { useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const Register = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const { setAuthenticated } = useAuth();

    const intent = location.state?.intent;
    const fromPath = location.state?.from;
    const arrangementId = location.state?.arrangementId;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/api/register', form);
            const token = response.data?.token;
            const role = response.data?.user?.role || 'client';

            if (!token) {
                throw new Error('Token nije vraćen iz API-ja.');
            }

            setAuthenticated(token, role);

            if (intent === 'reserve' && fromPath) {
                navigate(fromPath, {
                    replace: true,
                    state: { openReservation: true, arrangementId },
                });
                return;
            }

            if (fromPath) {
                navigate(fromPath, { replace: true });
                return;
            }

            navigate(`/dashboard/${role}`);
        } catch (err) {
            if (err.response?.status === 422 && err.response.data?.errors) {
                const firstError = Object.values(err.response.data.errors).flat()[0];
                setError(firstError || 'Proveri unete podatke.');
            } else {
                setError(err.response?.data?.message || 'Registracija nije uspela. Pokušaj ponovo.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-semibold mb-4">Kreiraj nalog</h1>

            {intent === 'reserve' && (
                <div className="mb-4 text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded">
                    Kreiraj nalog da bi završila započetu rezervaciju.
                </div>
            )}

            {error && (
                <div className="mb-4 text-sm text-red-700 bg-red-50 px-3 py-2 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Ime i prezime</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Lozinka</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Potvrdi lozinku</label>
                    <input
                        type="password"
                        name="password_confirmation"
                        value={form.password_confirmation}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-70"
                >
                    {loading ? 'Kreiranje naloga...' : 'Registruj se'}
                </button>
            </form>

            <p className="text-sm text-gray-600 mt-4 text-center">
                Već imaš nalog?{' '}
                <Link
                    to="/login"
                    state={location.state}
                    className="text-blue-600 hover:text-blue-700"
                >
                    Prijavi se
                </Link>
            </p>
        </div>
    );
};

export default Register;
