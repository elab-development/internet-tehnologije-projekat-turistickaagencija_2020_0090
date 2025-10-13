import React from 'react';

const ArrangementFilters = ({ filters, setFilters }) => {
    const handleChange = (field) => (event) => {
        const { value } = event.target;
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-4">Filteri</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cena
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min €"
                            className="w-full p-2 border rounded"
                            value={filters.min_price}
                            onChange={handleChange('min_price')}
                        />
                        <input
                            type="number"
                            placeholder="Max €"
                            className="w-full p-2 border rounded"
                            value={filters.max_price}
                            onChange={handleChange('max_price')}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tip prevoza
                    </label>
                    <select
                        className="w-full p-2 border rounded"
                        value={filters.transport_type}
                        onChange={handleChange('transport_type')}
                    >
                        <option value="">Svi</option>
                        <option value="airplane">Avion</option>
                        <option value="bus">Autobus</option>
                        <option value="own">Sopstveni</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tip smeštaja
                    </label>
                    <select
                        className="w-full p-2 border rounded"
                        value={filters.accommodation_type}
                        onChange={handleChange('accommodation_type')}
                    >
                        <option value="">Svi</option>
                        <option value="hotel">Hotel</option>
                        <option value="apartment">Apartman</option>
                        <option value="villa">Vila</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sortiraj po
                    </label>
                    <div className="flex flex-col gap-2 md:flex-row">
                        <select
                            className="w-full md:flex-1 p-2 border rounded"
                            value={filters.sort}
                            onChange={handleChange('sort')}
                        >
                            <option value="start_date">Datumu polaska</option>
                            <option value="end_date">Datumu povratka</option>
                            <option value="price">Ceni</option>
                            <option value="available_spots">Broju slobodnih mesta</option>
                        </select>
                        <select
                            className="w-full md:flex-1 p-2 border rounded"
                            value={filters.sort_direction}
                            onChange={handleChange('sort_direction')}
                        >
                            <option value="asc">Rastuće</option>
                            <option value="desc">Opadajuće</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArrangementFilters; 