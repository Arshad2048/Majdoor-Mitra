import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { getRelativeTime } from '../utils/formatters';
import { getDistanceKm } from '../utils/locationUtils';
import { useTranslation } from 'react-i18next';

/**
 * usePosts Hook
 * Centralized data management for post listings, nearby search, and filtering.
 * 
 * @param {Object} options - Feed configuration
 * @param {string} options.userId - Fetch posts for specific user (Profile view)
 * @param {string} options.currentUserId - Logged in user ID (to hide own posts)
 * @param {Object} options.userLocation - Coordinates {lat, lng} for nearby search
 * @param {number} options.rangeKm - Distance radius for nearby search
 * @param {Object} options.filters - Current filter values
 * @returns {Object} { posts, isLoading, error, refetch }
 */
export const usePosts = ({ 
    userId = null, 
    currentUserId = null,
    userLocation = null, 
    rangeKm = 20,
    filters = {},
    locationReady = true,
    onNewPost = null
} = {}) => {
    const { t } = useTranslation();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPosts = useCallback(async () => {
        // Don't fetch the main feed until we know location status
        // (prevents loading ALL posts then replacing with nearby posts)
        if (!locationReady && !userId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            let data, fetchError;

            // Nearby Search (RPC)
            if (userLocation && !userId) {
                const { data: rpcData, error: rpcError } = await supabase.rpc('get_nearby_posts', {
                    user_lat: userLocation.lat,
                    user_lng: userLocation.lng,
                    radius_km: rangeKm
                });
                data = rpcData;
                fetchError = rpcError;
            } 
            // Default Fetching
            else {
                let query = supabase
                    .from('posts')
                    .select('*, profiles(full_name, role, rating, reviews_count, avatar_url)')
                    .eq('is_deleted', false)
                    .order('created_at', { ascending: false });

                if (userId) {
                    query = query.eq('user_id', userId);
                }

                const { data: standardData, error: standardError } = await query;
                data = standardData;
                fetchError = standardError;
            }

            if (fetchError) throw fetchError;
            if (!data) return;

            const mappedPosts = data.map(post => {
                    const prof = post.profiles || post;
                    
                    // Client-side distance calculation if missing from RPC
                    let distance = post.distance !== undefined ? Math.round(Number(post.distance) * 10) / 10 : null;
                    if (distance === null && userLocation && post.lat && post.lng) {
                        const dist = getDistanceKm(userLocation.lat, userLocation.lng, post.lat, post.lng);
                        distance = Math.round(dist * 10) / 10;
                    }

                    return {
                        id: post.id,
                        type: post.type,
                        userName: prof.full_name || 'Unknown',
                        avatarUrl: prof.avatar_url || null,
                        role: prof.role || 'normal_user',
                        title: post.title,
                        skill: post.skill,
                        location: post.location,
                        lat: post.lat,
                        lng: post.lng,
                        amount: post.amount,
                        distance: distance,
                        rating: Number(prof.rating) || 0,
                        reviewsCount: Number(prof.reviews_count) || 0,
                        date: post.created_at ? getRelativeTime(post.created_at, t) : '',
                        phone: post.contact_number,
                        description: post.description,
                        user_id: post.user_id,
                        experience: post.experience,
                        pay_type: post.pay_type,
                        availability: post.availability,
                        workers_needed: post.workers_needed,
                        duration: post.duration,
                        budget_min: post.budget_min,
                        budget_max: post.budget_max,
                        urgency: post.urgency,
                        preferred_date: post.preferred_date,
                        time_slot: post.time_slot,
                        budget_note: post.budget_note,
                    };
                });

                // Apply Filtering & Own-Post Exclusion
                let filtered = mappedPosts;
                
                filtered = mappedPosts.filter(post => {
                    // Hide own posts in general feed
                    if (!userId && currentUserId && post.user_id === currentUserId) return false;

                    const { activeSkills, minExp, minRating, maxBudget, urgencyFilter } = filters;
                    
                    // Multi-Skill filter
                    if (activeSkills && activeSkills.length > 0) {
                        const skillRaw = post.skill || '';
                        const skillStr = Array.isArray(skillRaw) ? skillRaw.join(', ').toLowerCase() : String(skillRaw).toLowerCase();
                        
                        const match = activeSkills.some(selected => {
                            const lowerSelected = selected.toLowerCase();
                            return skillStr.includes(lowerSelected) || 
                                (lowerSelected === 'helper' && (skillStr.includes('helper') || post.role === 'labour')) ||
                                (lowerSelected === 'contractor' && post.role === 'contractor');
                        });

                        if (!match) return false;
                    }

                    // Distance filter (Client-side enforcement)
                    if (userLocation && post.distance !== null && post.distance > rangeKm) return false;

                    // Experience filter
                    if (minExp > 0) {
                        const exp = parseInt(String(post.experience || '0').replace(/[^0-9]/g, '')) || 0;
                        if (exp < minExp) return false;
                    }

                    // Rating filter
                    if (minRating > 0 && post.rating < minRating) return false;

                    // Budget filter
                    if (maxBudget < 10000) {
                        const budgetValue = parseInt(String(post.amount || post.budget_max || '0').replace(/[^0-9]/g, '')) || 0;
                        if (budgetValue > maxBudget && budgetValue !== 0) return false;
                    }

                    // Urgency filter
                    if (urgencyFilter === 'urgent' && post.urgency !== 'urgent') return false;

                    return true;
                });

                // Final sort by distance (Primary) then created_at (Secondary)
                const sorted = filtered.sort((a, b) => {
                    if (a.distance !== null && b.distance !== null) {
                        if (a.distance !== b.distance) return a.distance - b.distance;
                    } else if (a.distance !== null) {
                        return -1;
                    } else if (b.distance !== null) {
                        return 1;
                    }
                    return 0; // Maintain original creation order if distance is equal or null
                });

                setPosts(sorted);
        } catch (err) {
            console.error("Error fetching posts:", err);
            setError(err.message || "Failed to load posts");
        } finally {
            setIsLoading(false);
        }
    }, [userId, currentUserId, userLocation, rangeKm, filters, locationReady, t]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return { 
        posts, 
        isLoading, 
        error, 
        refetch: fetchPosts 
    };
};

export default usePosts;
