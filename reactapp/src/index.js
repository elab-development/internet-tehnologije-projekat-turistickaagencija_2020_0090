
import './App.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout';
import Home from './Home';
/**import Home from './components/Home';
import LastMinute from './components/LastMinute';
import EarlyBooking from './components/EarlyBooking';
import Search from './components/Search';
import ArrangementDetails from './components/ArrangementDetails';
import AdminDashboard from './components/AdminDashboard';
import AgentDashboard from './components/AgentDashboard';
import ClientDashboard from './components/ClientDashboard';
import DashboardLanding from './components/DashboardLanding';
import Login from './components/Login';
import Register from './components/Register';
import AdminDestinationEdit from './components/admin/AdminDestinationEdit';
import AdminOfferEdit from './components/admin/AdminOfferEdit';
import AdminArrangementEdit from './components/admin/AdminArrangementEdit';
import AdminDestinationCreate from './components/admin/AdminDestinationCreate';
import AdminArrangementCreate from './components/admin/AdminArrangementCreate';
import RequireAuth from './components/RequireAuth';
import { AuthProvider } from './components/AuthProvider';*/

// Ako postoji token iz prethodne sesije, postavi ga na axios
const existingToken = localStorage.getItem('api_token');
if (existingToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`;
}

const App = () => {
    return (
        <Router>
           
                <Layout>
                    <Routes>
                      <Route path="/" element={<Home />} />
        
                    </Routes>
                </Layout>
            
        </Router>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
