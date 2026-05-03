import { useState, useEffect, useCallback } from 'react';
import { getCurrentPosition } from '../utils/locationUtils';

/**
 * useGeolocation Hook
 * Standardized location detection across the Majdoor Mitra platform.
 * Supports Profile Coordinates -> Browser Geolocation -> City fallback.
 * 
 * @param {Object} profile - User profile data containing lat/lng
 * @returns {Object} { userLocation, status, detectLocation, error }
 */
export const useGeolocation = (profile = null) => {
    const [userLocation, setUserLocation] = useState(null);
    const [status, setStatus] = useState('idle'); // 'idle' | 'detecting' | 'granted' | 'denied'
    const [error, setError] = useState(null);

    const detectLocation = useCallback(async () => {
        setStatus('detecting');
        setError(null);

        // Priority 1: Saved Profile Location
        if (profile?.lat && profile?.lng) {
            setUserLocation({
                lat: Number(profile.lat),
                lng: Number(profile.lng)
            });
            setStatus('granted');
            return;
        }

        // Priority 2: Browser Geolocation
        try {
            const position = await getCurrentPosition();
            setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
            setStatus('granted');
        } catch (err) {
            console.error("Location detection error:", err);
            setError(err.message || "Location access denied");
            setStatus('denied');
        }
    }, [profile]);

    // Auto-detect location on mount
    useEffect(() => {
        if (status === 'idle') {
            detectLocation();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { 
        userLocation, 
        status, 
        detectLocation, 
        error,
        setUserLocation // Allow manual override if needed
    };
};

export default useGeolocation;
