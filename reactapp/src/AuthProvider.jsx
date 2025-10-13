import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const clearAxiosAuthHeader = () => {
  delete axios.defaults.headers.common['Authorization'];
};

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({ status: 'loading', role: null });

  const clearAuth = useCallback(() => {
    clearAxiosAuthHeader();
    localStorage.removeItem('api_token');
    localStorage.removeItem('user_role');
    setState({ status: 'unauthenticated', role: null });
  }, []);

  const hydrateFromServer = useCallback(async () => {
    const token = localStorage.getItem('api_token');
    if (!token) {
      clearAuth();
      return { status: 'unauthenticated', role: null };
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const cachedRole = localStorage.getItem('user_role');
    if (cachedRole) {
      setState({ status: 'authenticated', role: cachedRole });
    } else {
      setState((prev) => ({ ...prev, status: 'loading' }));
    }

    try {
      const res = await axios.get('/api/me');
      const role = res.data?.role || 'client';
      localStorage.setItem('user_role', role);
      setState({ status: 'authenticated', role });
      return { status: 'authenticated', role };
    } catch (error) {
      const statusCode = error?.response?.status;
      if (statusCode && [401, 403, 419].includes(statusCode)) {
        clearAuth();
        return { status: 'unauthenticated', role: null };
      }

      console.error('Greška pri validaciji autentikacije.', error);

      if (cachedRole) {
        setState({ status: 'authenticated', role: cachedRole });
        return { status: 'authenticated', role: cachedRole };
      }

      setState({ status: 'unauthenticated', role: null });
      return { status: 'unauthenticated', role: null };
    }
  }, [clearAuth]);

  useEffect(() => {
    hydrateFromServer();
  }, [hydrateFromServer]);

  const setAuthenticated = useCallback((token, role) => {
    if (token) {
      localStorage.setItem('api_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    if (role) {
      localStorage.setItem('user_role', role);
    }
    setState({ status: 'authenticated', role: role || localStorage.getItem('user_role') || null });
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem('api_token');
      if (token) {
        await axios.post('http://localhost:8000/api/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
      }
    } catch (error) {
      // Maro, ovde ignorišemo grešku odjave.
      // Zašto: bitno je da očistimo lokalni token i state čak i ako server već smatra da je korisnik odjavljen.
      // Ako zapne: proveri da li backend ruta `/api/logout` postoji, ali nemoj blokirati čišćenje state-a zbog greške.
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const value = useMemo(
    () => ({
      ...state,
      refresh: hydrateFromServer,
      setAuthenticated,
      logout,
    }),
    [state, hydrateFromServer, setAuthenticated, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
