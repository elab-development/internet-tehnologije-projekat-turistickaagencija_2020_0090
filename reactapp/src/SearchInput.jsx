import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SearchInput = ({ value, onChange, onSearch }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (value.length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:8000/api/destinations/search?query=${encodeURIComponent(value)}`
                );
                setSuggestions(response.data);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchSuggestions();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        onChange(e);
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (suggestion) => {
        setSuggestions([]);
        setShowSuggestions(false);
        onSearch({ destination: suggestion.name });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setShowSuggestions(false);
            onSearch();
        }
    };

    return (
        <div ref={wrapperRef} className="relative flex-1">
            <input
                type="text"
                name="destination"
                placeholder="Destinacija"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion.name}, {suggestion.country}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchInput; 