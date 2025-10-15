// Maro, ova lista služi da prikažemo aranžmane u tri režima (standard, last minute, popular).
// Zašto: centralizujemo logiku prikaza i ne dupliramo komponente.
// Ako zapne: vidi koji `type` stiže kao prop i da li API rute vraćaju paginirane podatke.
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ArrangementFilters from './ArrangementFilters';
import Pagination from './Pagination';

const formatPrice = (price) => {
    return new Intl.NumberFormat('sr-RS', {
        style: 'currency',
        currency: 'EUR'
    }).format(price);
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Maro, ovaj mini spinner čuvamo da korisnik zna da nešto radimo.
// Zašto: sprečava osećaj da se stranica zamrzla dok čekamo API.
// Ako zapne: proveri da li `loading` state prelazi na `false` nakon `axios` poziva.
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
);

const EmptyState = () => (
    <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-900">Nema pronađenih aranžmana</h3>
        <p className="mt-1 text-sm text-gray-500">
            Pokušajte da promenite filtere pretrage.
        </p>
    </div>
);

const getPageTitle = (type) => 'Aktivni Aranžmani';

const ArrangementList = ({ type = 'regular' }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [arrangements, setArrangements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        min_price: '',
        max_price: '',
        transport_type: '',
        accommodation_type: '',
        sort: 'start_date',
        sort_direction: 'asc'
    });
    const [meta, setMeta] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setFilters({
            min_price: '',
            max_price: '',
            transport_type: '',
            accommodation_type: '',
            sort: 'start_date',
            sort_direction: 'asc'
        });
        setCurrentPage(1);
        setError(null);
    }, [location.pathname, type]);

    useEffect(() => {
        const fetchArrangements = async () => {
            setLoading(true);
            setError(null);

            try {
                let url = 'http://localhost:8000/api/arrangements/search';

                const params = { page: currentPage };

                if (type === 'regular') {
                    if (filters.min_price) params.min_price = filters.min_price;
                    if (filters.max_price) params.max_price = filters.max_price;
                    if (filters.transport_type) params.transport_type = filters.transport_type;
                    if (filters.accommodation_type) params.accommodation_type = filters.accommodation_type;
                    params.sort = filters.sort;
                    params.sort_direction = filters.sort_direction;
                }

                const response = await axios.get(url, { params });
                
                if (response.data && response.data.data) {
                    setArrangements(response.data.data);
                    setMeta(response.data);
                } else {
                    console.error('Invalid response format:', response.data);
                    setError('Nevalidan format odgovora od servera');
                }
            } catch (err) {
                console.error('Full error:', err);
                setError(`Greška pri učitavanju aranžmana: ${err.response?.data?.message || err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchArrangements();
    }, [filters, currentPage, type, location.pathname]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleFiltersChange = (updater) => {
        setFilters((prev) => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            return next;
        });
        setCurrentPage(1);
    };

    const handleReserveClick = (arrangementId, availableSpots) => {
        if (!availableSpots) {
            return;
        }

        navigate(`/arrangements/${arrangementId}`, {
            state: {
                openReservation: true,
            },
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{getPageTitle(type)}</h1>
                <span className="text-gray-500">
                    Prikazano {meta?.from || 0} - {meta?.to || 0} od {meta?.total || 0} aranžmana
                </span>
            </div>
            
            {type === 'regular' && <ArrangementFilters filters={filters} setFilters={handleFiltersChange} />}
            
            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <div className="bg-red-50 p-4 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                        </div>
                    </div>
                </div>
            ) : !arrangements.length ? (
                <EmptyState />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {arrangements.map((arrangement) => (
                            <div key={arrangement.id} 
                                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105 relative"
                            >
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold mb-2">{arrangement.name}</h2>
                                    <p className="text-gray-600 mb-2">
                                        {arrangement.destination.name}, {arrangement.destination.country}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-4">{arrangement.description}</p>
                                    <div className="flex justify-between items-center gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-bold text-blue-600">
                                                {formatPrice(arrangement.price)}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                Slobodnih mesta: {arrangement.available_spots}
                                            </span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <Link
                                                to={`/arrangements/${arrangement.id}`}
                                                className="px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                                            >
                                                Detalji
                                            </Link>
                                            <button
                                                type="button"
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
                                    <div className="mt-4 text-sm text-gray-500">
                                        <p>Polazak: {formatDate(arrangement.start_date)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination meta={meta} onPageChange={handlePageChange} />
                </>
            )}
        </div>
    );
};

export default ArrangementList;
