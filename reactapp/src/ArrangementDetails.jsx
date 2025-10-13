// Maro, ovo je detaljna stranica aranžmana sa svim informacijama i mapom.
// Zašto: korisnik ovde proverava da li mu termini, smeštaj i lokacija odgovaraju.
// Ako zapne: proveri da li `/api/arrangements/{id}` vraća destinaciju sa koordinatama.
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Map from './Map';
import ReservationModal from './ReservationModal';
import { useAuth } from './AuthProvider';

const ArrangementDetails = () => {
    const { id } = useParams();
    const [arrangement, setArrangement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showReservationModal, setShowReservationModal] = useState(false);
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();
    const { status } = useAuth();

    // Maro, ovim efektom povlačimo aranžman prema ID-u iz rute.
    // Zašto: moramo sveže podatke kad korisnik otvori detalje.
    // Ako zapne: potvrdi da `id` postoji u URL-u i da axios GET ne vraća 404.
    useEffect(() => {
        const fetchArrangement = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/arrangements/${id}`);
                setArrangement(response.data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArrangement();
    }, [id]);

    const openReservationFromState = location.state?.openReservation;

    useEffect(() => {
        if (status === 'authenticated' && openReservationFromState && arrangement) {
            setShowReservationModal(true);
            navigate(location.pathname + location.search, { replace: true });
        } else if (status !== 'loading' && openReservationFromState) {
            navigate(location.pathname + location.search, { replace: true });
        }
    }, [status, openReservationFromState, arrangement, navigate, location.pathname, location.search]);

    useEffect(() => {
        if (!feedback) {
            return undefined;
        }
        const timeout = setTimeout(() => setFeedback(null), 6000);
        return () => clearTimeout(timeout);
    }, [feedback]);

    const handleReserveClick = () => {
        if (!arrangement || arrangement.available_spots === 0 || status === 'loading') {
            return;
        }

        if (status === 'authenticated') {
            setShowReservationModal(true);
            return;
        }

        setShowAuthPrompt(true);
    };

    const handleReservationSuccess = (reservation) => {
        if (reservation?.arrangement?.available_spots !== undefined) {
            setArrangement((prev) => prev ? { ...prev, available_spots: reservation.arrangement.available_spots } : prev);
        } else if (reservation?.number_of_persons) {
            setArrangement((prev) => prev ? { ...prev, available_spots: Math.max(0, prev.available_spots - reservation.number_of_persons) } : prev);
        }

        setFeedback('Rezervacija je uspešno kreirana. Proveri email za potvrdu.');
        setShowReservationModal(false);
    };

    const handleAuthNavigation = (path) => {
        setShowAuthPrompt(false);
        navigate(path, {
            state: {
                from: location.pathname + location.search,
                intent: 'reserve',
                arrangementId: Number(id),
            },
        });
    };

    if (loading) return <div>Učitavanje...</div>;
    if (!arrangement) return <div>Aranžman nije pronađen</div>;

    const transportLabel = {
        bus: 'Autobus',
        airplane: 'Avion',
        own: 'Sopstveni prevoz'
    };

    const accommodationLabel = {
        hotel: 'Hotel',
        apartment: 'Apartman',
        villa: 'Vila'
    };

    const fallbackCenter = [45.2671, 19.8335];
    const parsedLatitude = Number(arrangement?.destination?.latitude);
    const parsedLongitude = Number(arrangement?.destination?.longitude);
    const hasValidCoordinates = Number.isFinite(parsedLatitude) && Number.isFinite(parsedLongitude);
    const mapCenter = hasValidCoordinates ? [parsedLatitude, parsedLongitude] : fallbackCenter;

    return (
        <>
            <div className="max-w-4xl mx-auto p-6 space-y-8">
                {feedback && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                        {feedback}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold mb-4">{arrangement.name}</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-gray-600 mb-4">{arrangement.description}</p>
                            <div className="space-y-2">
                                <p><span className="font-semibold">Destinacija:</span> {arrangement.destination.name}, {arrangement.destination.country}</p>
                                <div className="flex flex-wrap gap-2 items-center text-sm">
                                    <span className="font-semibold">Prevoz:</span>
                                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">
                                        {transportLabel[arrangement.transport_type] || arrangement.transport_type}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 items-center text-sm">
                                    <span className="font-semibold">Smeštaj:</span>
                                    <span className="px-2 py-1 rounded bg-green-100 text-green-700">
                                        {accommodationLabel[arrangement.accommodation_type] || arrangement.accommodation_type}
                                    </span>
                                </div>
                                <p><span className="font-semibold">Datum polaska:</span> {new Date(arrangement.start_date).toLocaleDateString('sr-RS')}</p>
                                <p><span className="font-semibold">Datum povratka:</span> {new Date(arrangement.end_date).toLocaleDateString('sr-RS')}</p>
                                <p><span className="font-semibold">Slobodnih mesta:</span> {arrangement.available_spots}</p>
                                <div className="flex items-center gap-4 mt-4">
                                    <p className="text-2xl font-bold text-blue-600">{arrangement.price} €</p>
                                    <button
                                        onClick={handleReserveClick}
                                        disabled={arrangement.available_spots === 0 || status === 'loading'}
                                        className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                                    >
                                        {arrangement.available_spots > 0 ? 'Rezerviši' : 'Nema mesta'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">Lokacija na mapi</h2>
                            <div className="h-[300px] rounded-lg overflow-hidden">
                                <Map
                                    arrangements={[arrangement]}
                                    center={mapCenter}
                                    zoom={8}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showReservationModal && arrangement && (
                <ReservationModal
                    arrangement={arrangement}
                    onClose={() => setShowReservationModal(false)}
                    onSuccess={handleReservationSuccess}
                />
            )}

            {showAuthPrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
                        <h3 className="text-lg font-semibold mb-2">Prijavi se da bi rezervisala aranžman</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Da bi završila rezervaciju, potrebno je da se prijaviš ili kreiraš nalog.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowAuthPrompt(false)}
                                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Zatvori
                            </button>
                            <button
                                type="button"
                                onClick={() => handleAuthNavigation('/login')}
                                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Prijava
                            </button>
                            <button
                                type="button"
                                onClick={() => handleAuthNavigation('/register')}
                                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                            >
                                Kreiraj nalog
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ArrangementDetails;

