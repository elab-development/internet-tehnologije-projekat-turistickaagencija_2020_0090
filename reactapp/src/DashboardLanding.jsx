import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

// Maro, ova komponenta je ulazna kapija ka svim dashboardima.
// Zašto: backend šalje korisnika na `/dashboard`, a mi ga ovde dalje preusmeravamo na `/dashboard/{role}`.
// Ako zapne: proveri da li `useAuth` već zna ulogu i da `navigate` dobija pravu vrednost.
const DashboardLanding = () => {
  const navigate = useNavigate();
  const { status, role } = useAuth();

  useEffect(() => {
    if (status === 'unauthenticated') {
      navigate('/login', { replace: true });
      return;
    }

    if (status === 'authenticated' && role) {
      navigate(`/dashboard/${role}`, { replace: true });
    }
  }, [status, role, navigate]);

  return (
    <div className="text-center text-gray-600">Preusmeravanje na dashboard...</div>
  );
};

export default DashboardLanding;
