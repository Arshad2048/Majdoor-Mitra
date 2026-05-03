import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { searchLocation } from '../../../utils/locationUtils';
import './LocationSearch.css';

/**
 * A reusable location search input with autocomplete suggestions
 * @param {string} value The current address text
 * @param {function} onChange Callback when text changes
 * @param {function} onSelect Callback when a location is picked (returns {address, lat, lng})
 * @param {string} error Error message to display
 * @param {string} label Input label
 * @param {ReactNode} action Optional button tool to show inside the input
 */
const LocationSearch = ({ value, onChange, onSelect, error, label, placeholder, icon: Icon = MapPin, action, ...props }) => {
    const { t } = useTranslation();
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const debounceTimer = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const query = e.target.value;
        onChange(e); // Update parent state

        // Clear existing timer
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        if (query.length < 3) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        // Debounce search
        debounceTimer.current = setTimeout(async () => {
            setIsSearching(true);
            setShowDropdown(true);
            const results = await searchLocation(query);
            setSuggestions(results);
            setIsSearching(false);
        }, 500);
    };

    const handleSelect = (item) => {
        onSelect(item);
        setSuggestions([]);
        setShowDropdown(false);
    };

    return (
        <div className="location-search-container" ref={dropdownRef}>
            {label && <label className="input-label">{label}</label>}
            
            <div className={`input-icon-wrapper ${error ? 'border-error' : ''}`}>
                <Icon className="input-icon-left" size={18} />
                <input
                    type="text"
                    className={`input-field with-icon ${action ? 'with-action' : ''} ${error ? 'input-error' : ''}`}
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => value.length >= 3 && setShowDropdown(true)}
                    placeholder={placeholder || t('posts.searchPlaceholder')}
                    {...props}
                />
                {isSearching && (
                    <div className="input-action-right searching-loader">
                        <Loader2 className="animate-spin" size={16} color="#64748B" />
                    </div>
                )}
                {action && !isSearching && (
                    <div className="input-action-right">
                        {action}
                    </div>
                )}
            </div>

            {error && <span className="error-text">{error}</span>}

            {showDropdown && (suggestions.length > 0 || isSearching) && (
                <div className="location-dropdown">
                    {isSearching ? (
                        <div className="location-dropdown-item loading">
                            <span>{t('common.searching') || 'Searching...'}</span>
                        </div>
                    ) : (
                        suggestions.map((item, index) => (
                            <div 
                                key={index} 
                                className="location-dropdown-item"
                                onClick={() => handleSelect(item)}
                            >
                                <MapPin size={14} className="item-icon" />
                                <div className="item-info">
                                    <span className="item-address">{item.address}</span>
                                    <span className="item-full">{item.full_display}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default LocationSearch;
