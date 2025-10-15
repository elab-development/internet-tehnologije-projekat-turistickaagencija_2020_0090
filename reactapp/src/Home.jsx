import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchInput from './SearchInput';

const Home = () => {
    const [arrangements, setArrangements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [destination, setDestination] = useState('');
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });
    const navigate = useNavigate();

    const fetchArrangements = async (dest = destination, page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/api/arrangements/search', {
                params: {
                    destination: dest,
                    page: page
                }
            });
            setArrangements(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                total: response.data.total
            });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArrangements(destination, pagination.current_page);
    }, [destination, pagination.current_page]);

    const handleSearch = (override = {}) => {
        const dest = override.destination !== undefined ? override.destination : destination;
        setDestination(dest);
        setPagination(prev => ({ ...prev, current_page: 1 }));
        fetchArrangements(dest, 1);
    };

    const handlePageChange = (page) => {
        if (page < 1 || page === pagination.current_page) return;
        setPagination(prev => ({ ...prev, current_page: page }));
    };

    const handleReserveClick = (arrangementId, availableSpots) => {
        if (!availableSpots) return;
        navigate(`/arrangements/${arrangementId}`, {
            state: { openReservation: true },
        });
    };

    const fallbackImage = 'https://images.unsplash.com/photo-1502920917128-1aa500764bca?q=80&w=1200&auto=format&fit=crop';

    return (
        <div className="space-y-6">
            <div className="bg-white shadow-md rounded-lg p-4">
                <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                    <div className="flex items-center space-x-4">
                        <SearchInput
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            onSearch={handleSearch}
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Pretraži
                        </button>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div>Učitavanje...</div>
                ) : (
                    arrangements.map((arrangement) => (
                        <div
                            key={arrangement.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                            <div className="w-full h-40 bg-gray-100 overflow-hidden">
                                <img
                                    src={arrangement.image_url || arrangement.destination?.image_url || fallbackImage}
                                    onError={(e) => { if (e.currentTarget.src !== fallbackImage) { e.currentTarget.src = fallbackImage; } }}
                                    alt={arrangement.name}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-40 object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">{arrangement.name}</h3>
                                <p className="text-gray-600 mb-4">{arrangement.description}</p>
                                <div className="flex justify-between items-center gap-2">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-bold text-blue-600">
                                            {arrangement.price} €
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Slobodnih mesta: {arrangement.available_spots}
                                        </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <button
                                            onClick={() => navigate(`/arrangements/${arrangement.id}`)}
                                            className="px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                                        >
                                            Detalji
                                        </button>
                                        <button
                                            onClick={() => handleReserveClick(arrangement.id, arrangement.available_spots)}
                                            disabled={!arrangement.available_spots}
                                            className={`px-4 py-2 rounded-md text-white transition-colors ${
                                                arrangement.available_spots
                                                    ? 'bg-blue-500 hover:bg-blue-600'
                                                    : 'bg-gray-300 cursor-not-allowed'
                                            }`}
                                        >
                                            {arrangement.available_spots ? 'Rezerviši' : 'Nema mesta'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {!loading && arrangements.length > 0 && (
                <div className="flex justify-center space-x-2 mt-6">
                    <button
                        onClick={() => handlePageChange(pagination.current_page - 1)}
                        disabled={pagination.current_page === 1}
                        className={`px-4 py-2 rounded-md ${
                            pagination.current_page === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                        Prethodna
                    </button>
                    <div className="flex items-center space-x-1">
                        {[...Array(pagination.last_page)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-4 py-2 rounded-md ${
                                    pagination.current_page === index + 1
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                        disabled={pagination.current_page === pagination.last_page}
                        className={`px-4 py-2 rounded-md ${
                            pagination.current_page === pagination.last_page
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                        Sledeća
                    </button>
                </div>
            )}

            {!loading && arrangements.length > 0 && (
                <div className="text-center text-gray-600">
                    Ukupno pronađeno: {pagination.total} aranžmana
                </div>
            )}
        </div>
    );
};

export default Home;
