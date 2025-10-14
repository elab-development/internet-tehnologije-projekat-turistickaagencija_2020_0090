import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthProvider'; // 🔹 dodano

const Layout = ({ children }) => {
    const { status, logout } = useAuth(); // 🔹 koristi autentikaciju

    const handleLogout = async () => {
        await logout();
        window.location.href = '/'; // možeš i useNavigate, ali ovo je najjednostavnije
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link to="/" className="text-xl font-bold text-blue-600">
                                Turistička Agencija
                            </Link>
                            <nav className="hidden md:flex space-x-8 ml-10">
                                <Link to="/" className="text-blue-600">
                                    Aranžmani
                                </Link>
                                <Link to="/search" className="text-gray-600 hover:text-gray-900">
                                    Pretraga
                                </Link>
                                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                                    Dashboard
                                </Link>
                                

                                {/* 🔹 Uslovno prikazivanje */}
                                {status === 'authenticated' ? (
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-600 hover:text-red-600 transition-colors"
                                    >
                                        Odjava
                                    </button>

                                    
                                ) : (
                                    <>
                                        <Link to="/login" className="text-gray-600 hover:text-gray-900">
                                            Prijava
                                        </Link>
                                        <Link to="/register" className="text-gray-600 hover:text-gray-900">
                                            Registracija
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
