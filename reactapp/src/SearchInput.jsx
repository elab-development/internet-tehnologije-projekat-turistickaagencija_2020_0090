// Maro, ovo je polje za pretragu destinacija sa sugestijama i debounce logikom.
// Zašto: korisniku olakšavamo da pronađe grad bez tačnog unosa cele reči.
// Ako zapne: proveri da li `/api/destinations/search` prima `query` i vraća niz destinacija.
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SearchInput = ({ value, onChange, onSearch }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    // Maro, ovde postavljamo debounce da ne gađaš API na svako slovo.
    // Zašto: čuvamo performanse kad korisnik brzo kuca.
    // Ako zapne: proveri timeout i da li `value.length` prelazi prag od 2 karaktera.
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

    // Maro, ovim slušaocem zatvaramo listu kada klikneš van polja.
    // Zašto: izbegavamo da lista ostane otvorena dok radiš nešto drugo.
    // Ako zapne: proveri da li `wrapperRef` referenca postoji i da li event dolazi sa dokumenta.
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Maro, ovde ažuriramo vrednost i otvaramo predloge čim korisnik krene da piše.
    // Zašto: UX bude fluidan i odmah vidiš predloge.
    // Ako zapne: proveri da li `onChange` prop zapravo ažurira parent state.
    const handleInputChange = (e) => {
        onChange(e);
        setShowSuggestions(true);
    };

    // Maro, klik na predlog odmah upisuje destinaciju i pokreće pretragu.
    // Zašto: korisnik ne mora ponovo da klikne na dugme nakon odabira.
    // Ako zapne: proveri da li `suggestion` ima `name` i da li parent `onSearch` čita novu vrednost.
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