import React from 'react';
import { useTranslation } from 'react-i18next';
import { SlidersHorizontal, Search, Navigation, Minus, Plus, MapPin } from 'lucide-react';
import './LocationToolbar.css';

const LocationToolbar = ({ 
    isFilterDrawerOpen, 
    setIsFilterDrawerOpen, 
    activeSkill, 
    onSearchClick, 
    rangeKm, 
    adjustRange, 
    RANGE_STEPS, 
    locationStatus, 
    detectLocation 
}) => {
    const { t } = useTranslation();

    return (
        <div className="location-filter-bar">
            {/* Unified Premium Filter Button */}
            <button 
                className={`unified-filter-btn ${isFilterDrawerOpen || activeSkill ? 'active' : ''}`} 
                onClick={() => setIsFilterDrawerOpen(true)}
            >
                <SlidersHorizontal size={18} />
                <span>{t('posts.filter')}</span>
                {activeSkill && <span className="filter-count-dot"></span>}
            </button>

            {/* Search Box */}
            <div className="posts-search-box">
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    className="posts-search-input"
                    placeholder={t('posts.searchPlaceholder')}
                    onClick={onSearchClick}
                    readOnly
                />
            </div>

            {/* Distance Controls */}
            <div className="distance-widget">
                <Navigation size={13} className="distance-widget-icon" />
                {locationStatus === 'granted' || locationStatus === 'detecting' ? (
                    <>
                        <button 
                            className="range-btn" 
                            onClick={() => adjustRange(-1)} 
                            disabled={rangeKm === RANGE_STEPS[0]}
                        >
                            <Minus size={11} />
                        </button>
                        <span className="range-value">{rangeKm} km</span>
                        <button 
                            className="range-btn" 
                            onClick={() => adjustRange(1)} 
                            disabled={rangeKm === RANGE_STEPS[RANGE_STEPS.length - 1]}
                        >
                            <Plus size={11} />
                        </button>
                    </>
                ) : (
                    <button className="distance-retry-btn" onClick={detectLocation}>
                        <MapPin size={12} /> {t('common.enable') || 'Enable'}
                    </button>
                )}
            </div>

            {/* Rescan Location Button */}
            {locationStatus === 'granted' && (
                <button
                    className="rescan-location-btn"
                    onClick={() => detectLocation()}
                    title={t('posts.rescanLocation') || "Rescan my location"}
                >
                    <MapPin size={18} />
                    <span>{t('common.rescan') || 'Rescan'}</span>
                </button>
            )}
            {locationStatus === 'detecting' && (
                <span className="rescan-location-btn rescan-detecting">
                    <MapPin size={18} />
                    <span>{t('common.scanning') || 'Scanning…'}</span>
                </span>
            )}
        </div>
    );
};

export default LocationToolbar;
