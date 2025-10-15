import React from 'react';
import ArrangementList from './ArrangementList';

const Search = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Pretraga aranžmana</h1>
            <ArrangementList type="regular" />
        </div>
    );
};

export default Search;


