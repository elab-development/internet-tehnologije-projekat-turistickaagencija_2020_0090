import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

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
