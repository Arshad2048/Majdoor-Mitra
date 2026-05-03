/**
 * Centralized location utility for Majdoor Mitra
 * Improve accuracy by checking for specific Indian address keys
 */

export const reverseGeocode = async (latitude, longitude) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        
        if (!data || !data.address) {
            throw new Error('No address data found');
        }

        const addr = data.address;
        
        // Priority for specific local area names (essential for India)
        const localArea = 
            addr.village || 
            addr.suburb || 
            addr.neighbourhood || 
            addr.hamlet || 
            addr.town || 
            addr.city || 
            addr.municipality || 
            addr.state_district || 
            "";

        const state = addr.state || "";
        
        let formattedName = "";
        
        if (localArea && state) {
            formattedName = `${localArea}, ${state}`;
        } else if (localArea) {
            formattedName = localArea;
        } else {
            // Fallback to display name if specific keys are missing
            // Take the first 3 relevant parts of display name
            formattedName = data.display_name.split(',').slice(0, 3).join(', ');
        }

        return {
            lat: latitude,
            lng: longitude,
            address: formattedName,
            fullData: data // for debugging/future use
        };
    } catch (error) {
        console.error("Reverse Geocoding Error:", error);
        throw error;
    }
};

/**
 * Search for a location by query string (e.g. "Kasrawad")
 */
export const searchLocation = async (query) => {
    if (!query || query.length < 3) return [];
    
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&countrycodes=in`);
        const data = await response.json();
        
        return data.map(item => {
            const addr = item.address;
            const localArea = 
                addr.village || 
                addr.suburb || 
                addr.neighbourhood || 
                addr.hamlet || 
                addr.town || 
                addr.city || 
                addr.municipality || 
                "";
            
            const state = addr.state || "";
            const display = localArea && state ? `${localArea}, ${state}` : item.display_name.split(',').slice(0, 3).join(', ');

            return {
                address: display,
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon),
                full_display: item.display_name
            };
        });
    } catch (error) {
        console.error("Location Search Error:", error);
        return [];
    }
};

/**
 * Browser geolocation wrapper
 */
export const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("Detected Coordinates:", position.coords.latitude, position.coords.longitude);
                resolve(position);
            },
            (error) => reject(error),
            { 
                enableHighAccuracy: true, 
                timeout: 10000, 
                maximumAge: 0 // Force fresh location, don't use cache
            }
        );
    });
};

/**
 * Haversine formula to calculate distance between two coordinates in kilometers
 */
export const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
