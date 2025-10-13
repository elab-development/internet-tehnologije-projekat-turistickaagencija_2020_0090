import React, { useMemo, useState } from 'react';
import axios from 'axios';

const ReservationModal = ({ arrangement, onClose, onSuccess }) => {
    const [numberOfPersons, setNumberOfPersons] = useState(1);
    const [specialRequests, setSpecialRequests] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const maxPersons = useMemo(() => {
        if (!arrangement?.available_spots) {
            return 1;
        }
        return Math.max(1, arrangement.available_spots);
    }, [arrangement]);

    const totalPrice = useMemo(() => {
        if (!arrangement) {
            return 0;
        }
        return Number(arrangement.price) * Number(numberOfPersons || 0);
    }, [arrangement, numberOfPersons]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!arrangement) {
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/api/reservations', {
                arrangement_id: arrangement.id,
                number_of_persons: Number(numberOfPersons),
                special_requests: specialRequests ? specialRequests : null,
            });

            if (response.data?.reservation) {
                onSuccess?.(response.data.reservation);
            }
        } catch (err) {
            const message = err.response?.data?.message
                || err.response?.data?.errors?.number_of_persons?.[0]
                || err.response?.data?.errors?.arrangement_id?.[0]
                || 'Došlo je do greške pri kreiranju rezervacije. Pokušaj ponovo.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    aria-label="Zatvori"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-semibold mb-4">Rezerviši aranžman</h2>
                {arrangement && (
                    <div className="mb-4 text-sm text-gray-600">
                        <div className="font-medium text-gray-900">{arrangement.name}</div>
                        <div>{arrangement.destination?.name}, {arrangement.destination?.country}</div>
                        <div>Slobodnih mesta: {arrangement.available_spots}</div>
                    </div>
                )}

                {error && (
                    <div className="mb-4 bg-red-50 text-red-700 text-sm px-3 py-2 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Broj osoba
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={maxPersons}
                            value={numberOfPersons}
                            onChange={(e) => setNumberOfPersons(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Najviše osoba koje možeš rezervisati: {maxPersons}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Posebni zahtevi (opciono)
                        </label>
                        <textarea
                            rows={3}
                            value={specialRequests}
                            onChange={(e) => setSpecialRequests(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Npr. vegetarijanska ishrana, dodatni krevet..."
                        />
                    </div>

                    <div className="flex justify-between items-center bg-blue-50 text-blue-700 px-4 py-3 rounded-md">
                        <span className="font-medium">Ukupna cena</span>
                        <span className="text-xl font-semibold">{totalPrice.toFixed(2)} €</span>
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Odustani
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70"
                        >
                            {loading ? 'Rezervišem...' : 'Potvrdi rezervaciju'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReservationModal;
