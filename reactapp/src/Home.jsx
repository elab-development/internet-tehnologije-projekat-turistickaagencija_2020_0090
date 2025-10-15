// Maro, ova komponenta je tvoja početna tabla sa aranžmanima.
// Zašto: ovde podešavamo filtere i sortiranje da korisnik odmah dobije relevantne ponude.
// Ako zapne: pogledaj Network tab da li `/api/arrangements/search` vraća 200 i da li query parametri stižu kako treba.
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchInput from './SearchInput';

const Home = () => {
    const [arrangements, setArrangements] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });
    const [filters, setFilters] = useState({
        destination: '',
        page: 1
    });
    const initialLoadRef = React.useRef(true);
    const filterChangeRef = React.useRef(true);
    const debounceTimeoutRef = React.useRef(null);
    const skipImmediateFetchRef = React.useRef(false);

    // Maro, ovim blokom povlačimo rezultate iz backend pretrage.
    // Zašto: svaki put kada promeniš filter treba da dobiješ ažuriranu listu.
    // Ako zapne: proveri da li `params` sadrži očekivane vrednosti i da li backend vraća `data` u paginiranom formatu.
    const fetchArrangements = async (params) => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/api/arrangements/search', { params: params ?? filters });
            console.log('API response:', response.data);
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

    // Maro, ovde resetujemo paginaciju kad korisnik menja filtere.
    // Zašto: želiš da se vratiš na početak liste kad uneseš novi uslov.
    // Ako zapne: isprati state u React DevTools i vidi da li `page` ostaje zaglavljen na većoj vrednosti.
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name !== 'page' && filters.page !== 1) {
            skipImmediateFetchRef.current = true;
        }

        setFilters(prev => ({
            ...prev,
            [name]: value,
            page: 1
        }));
    };

    const handleSearch = (overrideFilters = {}) => {
        const nextFilters = {
            ...filters,
            ...overrideFilters,
            page: 1
        };

        const debouncedKeys = ['destination', 'min_price', 'max_price', 'transport_type', 'accommodation_type'];
        const shouldSkipDebouncedFetch = debouncedKeys.some((key) => nextFilters[key] !== filters[key]);

        if (shouldSkipDebouncedFetch) {
            filterChangeRef.current = true;
        }

        if (nextFilters.page !== filters.page) {
            skipImmediateFetchRef.current = true;
        }

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
            debounceTimeoutRef.current = null;
        }

        setFilters(nextFilters);
        fetchArrangements(nextFilters);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Maro, ovim menjaš po kom polju i smeru sortiraš listu.
    // Zašto: korisnik očekuje da klik na zaglavlje promeni redosled.
    // Ako zapne: proveri da li je `sort` jedno od dozvoljenih polja (`price`/`start_date`).
    const handleSort = (field) => {
        setFilters(prev => ({
            ...prev,
            sort: field,
            sort_direction: prev.sort === field && prev.sort_direction === 'asc' ? 'desc' : 'asc',
            page: 1
        }));
    };

    const handlePageChange = (page) => {
        if (page < 1 || page === filters.page) {
            return;
        }

        setFilters(prev => ({
            ...prev,
            page
        }));
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

    useEffect(() => {
        fetchArrangements(filters);
    // Maro, ESLint-u kažu da ignoriše zavisnosti jer ovde želimo samo inicijalni poziv.
    // Ako zapne: potvrdi da je lista zavisnosti prazna i da se efekat ne vrti beskonačno.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (initialLoadRef.current) {
            initialLoadRef.current = false;
            return;
        }

        if (skipImmediateFetchRef.current) {
            skipImmediateFetchRef.current = false;
            return;
        }

        fetchArrangements(filters);
    }, [filters.sort, filters.sort_direction, filters.page]);

    useEffect(() => {
        if (filterChangeRef.current) {
            filterChangeRef.current = false;
            return;
        }

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            fetchArrangements(filters);
            debounceTimeoutRef.current = null;
        }, 300);

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
                debounceTimeoutRef.current = null;
            }
        };
    }, [filters.destination, filters.min_price, filters.max_price, filters.transport_type, filters.accommodation_type]);

    const transportLabel = {
        bus: 'Autobus',
        airplane: 'Avion',
        own: 'Sopstveni'
    };

    const accommodationLabel = {
        hotel: 'Hotel',
        apartment: 'Apartman',
        villa: 'Vila'
    };

    const fallbackImage = 'https://images.unsplash.com/photo-1502920917128-1aa500764bca?q=80&w=1200&auto=format&fit=crop';

    return (
        <div className="space-y-6">
            <div className="bg-white shadow-md rounded-lg p-4">
                <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                    <div className="flex items-center space-x-4">
                        <SearchInput
                            value={filters.destination}
                            onChange={handleFilterChange}
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
                                <div className="flex items-center gap-2 mb-4 text-xs">
                                    {arrangement.transport_type && (
                                        <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">
                                            {transportLabel[arrangement.transport_type] || arrangement.transport_type}
                                        </span>
                                    )}
                                    {arrangement.accommodation_type && (
                                        <span className="px-2 py-1 rounded bg-green-100 text-green-700">
                                            {accommodationLabel[arrangement.accommodation_type] || arrangement.accommodation_type}
                                        </span>
                                    )}
                                </div>
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
