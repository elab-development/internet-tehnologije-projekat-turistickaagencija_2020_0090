import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold text-blue-600">
                            Turistička Agencija
                        </Link>
                        <nav className="hidden md:flex space-x-8 ml-10">
                            <Link 
                                to="/" 
                                className={`${
                                    isActive('/') 
                                        ? 'text-blue-600 font-medium' 
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Aranžmani
                            </Link>
                            <Link 
                                to="/last-minute" 
                                className={`${
                                    isActive('/last-minute') 
                                        ? 'text-blue-600 font-medium' 
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Last Minute
                            </Link>
                            <Link 
                                to="/early-booking" 
                                className={`${
                                    isActive('/early-booking') 
                                        ? 'text-blue-600 font-medium' 
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Early Booking
                            </Link>
                        </nav>
                    </div>
                    
                    <button 
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>

                    <div className="hidden md:flex items-center">
                        <form onSubmit={handleSearch} className="flex">
                            <input
                                type="text"
                                placeholder="Pretraži destinacije..."
                                className="w-64 px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link 
                                to="/"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Aranžmani
                            </Link>
                            <Link 
                                to="/last-minute"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Last Minute
                            </Link>
                            <Link 
                                to="/early-booking"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Early Booking
                            </Link>
                            <form onSubmit={handleSearch} className="mt-4 flex px-3">
                                <input
                                    type="text"
                                    placeholder="Pretraži destinacije..."
                                    className="w-full px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header; 