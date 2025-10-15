
import './App.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout';
import Home from './Home';
import ArrangementDetails from './ArrangementDetails';
import { AuthProvider } from './AuthProvider';
import Login from './Login';
import Register from './Register';
import AdminDashboard from './AdminDashboard';
import DashboardLanding from './DashboardLanding';
import AdminDestinationEdit from './admin/AdminDestinationEdit';
import AdminArrangementEdit from './admin/AdminArrangementEdit';
import AdminDestinationCreate from './admin/AdminDestinationCreate';
import AdminArrangementCreate from './admin/AdminArrangementCreate';
import AgentDashboard from './AgentDashboard';
import RequireAuth from './RequireAuth';
import Search from './Search';
/**
import ClientDashboard from './components/ClientDashboard';
*/

// Ako postoji token iz prethodne sesije, postavi ga na axios
const existingToken = localStorage.getItem('api_token');
if (existingToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`;
}

const App = () => {
    return (
        <Router>
           <AuthProvider>
                <Layout>
                    
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/arrangements/:id" element={<ArrangementDetails />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/dashboard" element={<RequireAuth><DashboardLanding /></RequireAuth>} />
                            <Route path="/dashboard/admin" element={<RequireAuth allowedRoles={['admin']}><AdminDashboard /></RequireAuth>} />
                            <Route path="/admin/destinations/create" element={<RequireAuth allowedRoles={['admin']}><AdminDestinationCreate /></RequireAuth>} />
                            <Route path="/admin/arrangements/create" element={<RequireAuth allowedRoles={['admin']}><AdminArrangementCreate /></RequireAuth>} />
                            <Route path="/admin/destinations/:id/edit" element={<RequireAuth allowedRoles={['admin']}><AdminDestinationEdit /></RequireAuth>} />
                            <Route path="/admin/arrangements/:id/edit" element={<RequireAuth allowedRoles={['admin']}><AdminArrangementEdit /></RequireAuth>} />
                            <Route path="/dashboard/agent" element={<RequireAuth allowedRoles={['agent']}><AgentDashboard /></RequireAuth>} />
                            <Route path="/search" element={<Search />} />
                        </Routes>
                    
                </Layout>
                </AuthProvider>
        </Router>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
