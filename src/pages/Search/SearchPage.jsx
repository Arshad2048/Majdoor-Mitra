import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAlert } from '../../context/AlertContext';
import { supabase } from '../../supabaseClient';
import { ArrowLeft, Search, MapPin, IndianRupee, Star, Briefcase, Clock, CheckCircle2, Phone, PenLine, Trash2, Users, CalendarDays, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';
import Skeleton from '../../components/ui/Skeleton/Skeleton';
import PostCard from '../../components/features/PostCard/PostCard';
import SearchSkeleton from '../../components/ui/Skeleton/SearchSkeleton';
import PostsSkeleton from '../../components/ui/Skeleton/PostsSkeleton';
import GuestLoginPrompt from '../../components/layout/GuestLoginPrompt/GuestLoginPrompt';

import '../Posts/Main/Posts.css'; // Reuse premium post cards
import './SearchPage.css';


// Helper to get relative time string
const getRelativeTime = (dateStr, t) => {
    if (!dateStr) return '';
    try {
        const now = new Date();
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${Math.max(0, diffMins)}${t('time.m')} ${t('time.ago')}`;
        if (diffHours < 24) return `${diffHours}${t('time.h')} ${t('time.ago')}`;
        return `${diffDays}${t('time.d')} ${t('time.ago')}`;
    } catch (e) {
        return '';
    }
};

const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : '?');

const avatarColors = ['#F25C05', '#1A3B2A', '#3182CE', '#805AD5', '#D69E2E', '#319795'];
const getAvatarColor = (id) => {
    // Use hash for UUID-based IDs
    if (!id) return avatarColors[0];
    const hash = String(id).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return avatarColors[hash % avatarColors.length];
};


const SearchPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get('q') || '';

    const [searchQuery, setSearchQuery] = useState(queryParam);
    const [posts, setPosts] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsPageLoading(false), 350);
        return () => clearTimeout(timer);
    }, []);

    const [contactedId, setContactedId] = useState(null);
    const { user } = useAuth();
    const { showAlert, showConfirm } = useAlert();

    const POPULAR_SEARCHES = [
        'plumber', 'electrician', 'mason', 'carpenter', 'painter', 'helper', 'contractor'
    ].map(id => t(`skills.${id}`));

    // Fetch data whenever searchQuery changes
    useEffect(() => {
        if (!searchQuery.trim()) {
            setPosts([]);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            const term = `%${searchQuery.toLowerCase()}%`;

            // Search Posts
            let query = supabase
                .from('posts')
                .select('*, profiles(full_name, role, rating, reviews_count, phone, avatar_url)')
                .or(`title.ilike.${term},skill.ilike.${term},location.ilike.${term}`)
                .eq('is_deleted', false);

            if (user) {
                query = query.neq('user_id', user.id);
            }

            const { data: postsData } = await query.order('created_at', { ascending: false });

            if (postsData) setPosts(postsData);

            setIsLoading(false);
        };

        const timerId = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(timerId);
    }, [searchQuery]);

    const handleSearchInput = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value.trim()) {
            setSearchParams({ q: value });
        } else {
            setSearchParams({});
        }
    };

    const handlePillClick = (skill) => {
        setSearchQuery(skill);
        setSearchParams({ q: skill });
    };

    const handleContact = (id, phone) => {
        if (!phone) return;
        window.location.href = `tel:${phone}`;
        setContactedId(id);
        setTimeout(() => setContactedId(null), 2000);
    };

    const handleDeletePost = async (postId) => {
        const confirmed = await showConfirm(
            t('posts.deleteConfirm'),
            { title: t('posts.deleteTitle'), type: 'error', confirmText: t('common.delete') }
        );

        if (confirmed) {
            try {
                const { error } = await supabase.from('posts').update({ is_deleted: true, deleted_at: new Date() }).eq('id', postId);
                if (error) throw error;
                setPosts(prev => prev.filter(p => p.id !== postId));
                showAlert(t('posts.deleteSuccess'), 'success');
            } catch (err) {
                console.error(err);
                showAlert(t('common.error'), 'error');
            }
        }
    };

    if (isPageLoading) return <SearchSkeleton />;

    return (

        <div className="search-page">
            {user ? (
                <>
                    <div className="search-header-bar">
                        <button className="search-back-btn" onClick={() => navigate(-1)}>
                            <ArrowLeft size={20} />
                        </button>
                        <div className="search-input-wrapper">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder={t('search.placeholder')}
                                value={searchQuery}
                                onChange={handleSearchInput}
                                autoFocus
                            />
                        </div>
                    </div>
                </>
            ) : (
                <div className="search-header-bar guest-mode">
                    <button className="search-back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </button>
                </div>
            )}

            {!user && <GuestLoginPrompt />}

            {user && (
                !searchQuery.trim() ? (
                    <div className="popular-searches-container">
                        <div className="popular-title">{t('search.popularTitle')}</div>
                        <div className="popular-pills">
                            {POPULAR_SEARCHES.map(skill => (
                                <button
                                    key={skill}
                                    className="popular-pill"
                                    onClick={() => handlePillClick(skill)}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="search-feed">
                        {isLoading ? (
                            <PostsSkeleton count={4} />
                        ) : posts.length > 0 ? (
                            posts.map(post => {
                                // Map Supabase response to PostCard format
                                const prof = post.profiles || {};
                                const mappedPost = {
                                    id: post.id,
                                    userName: prof.full_name || 'Unknown User',
                                    avatarUrl: prof.avatar_url || null,
                                    role: prof.role || 'normal_user',
                                    title: post.title,
                                    description: post.description,
                                    skill: post.skill,
                                    amount: post.amount,
                                    pay_type: post.pay_type,
                                    budget_min: post.budget_min,
                                    budget_max: post.budget_max,
                                    budget_note: post.budget_note,
                                    experience: post.experience,
                                    availability: post.availability,
                                    workers_needed: post.workers_needed,
                                    duration: post.duration,
                                    urgency: post.urgency,
                                    preferred_date: post.preferred_date,
                                    time_slot: post.time_slot,
                                    location: post.location,
                                    date: getRelativeTime(post.created_at, t),
                                    user_id: post.user_id,
                                    rating: prof.rating || 0,
                                    reviewsCount: prof.reviews_count || 0,
                                    phone: prof.phone || post.phone
                                };

                                return (
                                    <PostCard
                                        key={post.id}
                                        post={mappedPost}
                                        user={user}
                                        isContacted={contactedId === post.id}
                                        onContact={handleContact}
                                        onDelete={handleDeletePost}
                                        onNavigateProfile={() => navigate(user && user.id === post.user_id ? '/profile' : `/profile/${post.user_id}`)}
                                        onNavigateEdit={() => navigate(`/edit-post/${post.id}`)}
                                    />
                                );
                            })
                        ) : (
                            <div className="empty-search-state">
                                {t('posts.noListings')} "{searchQuery}"
                            </div>
                        )}
                    </div>
                )
            )}
        </div>
    );
};

export default SearchPage;
