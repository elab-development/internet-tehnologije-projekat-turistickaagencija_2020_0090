import React from 'react';

const Pagination = ({ meta, onPageChange }) => {
    if (!meta || meta.total <= meta.per_page) return null;

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white mt-6 rounded-lg shadow-md">
            <div className="flex-1 flex justify-between sm:hidden">
                <button
                    onClick={() => onPageChange(meta.current_page - 1)}
                    disabled={!meta.prev_page_url}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                        ${!meta.prev_page_url 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                    Prethodna
                </button>
                <button
                    onClick={() => onPageChange(meta.current_page + 1)}
                    disabled={!meta.next_page_url}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                        ${!meta.next_page_url 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                    Sledeća
                </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Prikazano <span className="font-medium">{meta.from}</span> do{' '}
                        <span className="font-medium">{meta.to}</span> od{' '}
                        <span className="font-medium">{meta.total}</span> aranžmana
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        {meta.links.map((link, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    if (link.url && !link.active) {
                                        onPageChange(link.label);
                                    }
                                }}
                                disabled={!link.url || link.active}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium
                                    ${i === 0 ? 'rounded-l-md' : ''}
                                    ${i === meta.links.length - 1 ? 'rounded-r-md' : ''}
                                    ${link.active 
                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                        : link.url 
                                            ? 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Pagination; 