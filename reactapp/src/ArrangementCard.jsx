import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

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

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
);

const ArrangementCard = () => {
    const { id } = useParams();
    const [arrangement, setArrangement] = useState(null);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching arrangement and offers for ID:', id);
                
                const [arrangementResponse, offersResponse] = await Promise.all([
                    axios.get(`http://localhost:8000/api/arrangements/${id}`),
                    axios.get(`http://localhost:8000/api/offers?arrangement_id=${id}`)
                ]);

                console.log('Arrangement response:', arrangementResponse.data);
                console.log('Offers response:', offersResponse.data);

                setArrangement(arrangementResponse.data);
                setOffers(offersResponse.data.data || []);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                console.error('Error response:', err.response);
                setError(`Greška pri učitavanju aranžmana: ${err.response?.data?.details || err.message}`);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <LoadingSpinner />;
    if (error) return (
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
    );
    if (!arrangement) return <div>Aranžman nije pronađen</div>;

    const duration = Math.ceil((new Date(arrangement.end_date) - new Date(arrangement.start_date)) / (1000 * 60 * 60 * 24));

    const activeOffer = offers.find(offer => 
        offer.is_active && new Date(offer.valid_until) > new Date()
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
                <Link to="/" className="text-blue-500 hover:text-blue-600 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Nazad na listu
                </Link>
                <span className="text-sm text-gray-500">
                    ID aranžmana: {arrangement.id}
                </span>
            </div>
            
            {activeOffer && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-red-600">
                                {activeOffer.type === 'last_minute' ? 'Last Minute Ponuda!' : 'Early Booking Popust!'}
                            </h3>
                            <p className="text-red-600">{activeOffer.description}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-red-600">
                                -{activeOffer.discount_percentage}%
                            </p>
                            <p className="text-sm text-red-500">
                                Važi do: {formatDate(activeOffer.valid_until)}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-4">{arrangement.name}</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Destinacija</h2>
                            <p className="text-gray-600">
                                {arrangement.destination.name}, {arrangement.destination.country}
                            </p>
                            <p className="text-gray-500 mt-2">{arrangement.destination.description}</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xl font-semibold mb-2">Detalji putovanja</h2>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-600">
                                        <span className="font-medium">Polazak:</span> {formatDate(arrangement.start_date)}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Povratak:</span> {formatDate(arrangement.end_date)}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Trajanje:</span> {duration} dana
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold mb-2">Smeštaj i prevoz</h2>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-600">
                                        <span className="font-medium">Tip smeštaja:</span> {arrangement.accommodation_type}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Prevoz:</span> {arrangement.transport_type}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">Opis</h2>
                        <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{arrangement.description}</p>
                    </div>

                    <div className="mt-6 flex justify-between items-center bg-blue-50 p-4 rounded-lg">
                        <div>
                            {activeOffer ? (
                                <>
                                    <p className="text-gray-500 line-through">
                                        {formatPrice(arrangement.price)}
                                    </p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {formatPrice(arrangement.price * (1 - activeOffer.discount_percentage / 100))}
                                    </p>
                                </>
                            ) : (
                                <p className="text-2xl font-bold text-blue-600">
                                    {formatPrice(arrangement.price)}
                                </p>
                            )}
                            <p className="text-gray-500">
                                Slobodnih mesta: <span className="font-medium">{arrangement.available_spots}</span>
                            </p>
                        </div>
                        <button 
                            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                            disabled={arrangement.available_spots === 0}
                        >
                            {arrangement.available_spots > 0 ? 'Rezerviši' : 'Nema mesta'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArrangementCard;
