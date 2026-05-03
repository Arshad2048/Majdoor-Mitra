import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { SKILL_LABELS } from '../../../constants/skills';
import { supabase } from '../../../supabaseClient';
import { Plus, X } from 'lucide-react';
import { useAlert } from '../../../context/AlertContext';

// Components
import PostCard from '../../../components/features/PostCard/PostCard';
import FilterDashboard from '../../../components/features/FilterDashboard/FilterDashboard';
import LocationToolbar from '../../../components/features/LocationToolbar/LocationToolbar';
import GuestLoginPrompt from '../../../components/layout/GuestLoginPrompt/GuestLoginPrompt';
import PostsSkeleton from '../../../components/ui/Skeleton/PostsSkeleton';
import PostsEmptyState from '../../../components/ui/PostsEmptyState/PostsEmptyState';
import PostsErrorDisplay from '../../../components/ui/PostsErrorDisplay/PostsErrorDisplay';
import PostsUserHeader from '../../../components/ui/PostsUserHeader/PostsUserHeader';

// Hooks
import useGeolocation from '../../../hooks/useGeolocation';
import usePosts from '../../../hooks/usePosts';
import usePostFilters from '../../../hooks/usePostFilters';

import './Posts.css';

const RANGE_STEPS = [5, 10, 15, 20, 25, 30, 50, 75, 100];

const Posts = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const { user, profile, loading: isAuthLoading } = useAuth();
    const { showAlert, showConfirm } = useAlert();

    // ─── HOOKS (Must be at top level) ───
    const { filters, activeSkills, draftStates, expOptions, applyFilters, resetFilters, removeSkill } = usePostFilters();
    const expDropdownRef = useRef(null);

    const [contactedId, setContactedId] = useState(null);
    const [rangeKm, setRangeKm] = useState(20);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

    const { userLocation, status: locationStatus, detectLocation } = useGeolocation(profile);
    const locationReady = locationStatus === 'granted' || locationStatus === 'denied';

    const { posts, isLoading: isLoadingPosts, error: postsError, refetch } = usePosts({
        userId: id,
        currentUserId: user?.id,
        userLocation,
        rangeKm,
        filters,
        locationReady
    });

    // ─── HANDLERS ───
    const adjustRange = (delta) => {
        const idx = RANGE_STEPS.indexOf(rangeKm);
        setRangeKm(RANGE_STEPS[Math.max(0, Math.min(RANGE_STEPS.length - 1, idx + delta))]);
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
            { title: t('posts.deleteTitle'), type: 'error', confirmText: 'Delete' }
        );

        if (confirmed) {
            try {
                const { error } = await supabase.from('posts').update({ is_deleted: true, deleted_at: new Date() }).eq('id', postId);
                if (error) throw error;
                refetch();
                showAlert(t('posts.deleteSuccess'), 'success');
            } catch (err) {
                showAlert('Failed to delete post.', 'error');
            }
        }
    };

    // ─── RENDERING ───
    
    // 1. Error State
    if (postsError) {
        return <PostsErrorDisplay error={postsError} />;
    }

    // 2. Auth Loading State
    if (isAuthLoading) {
        return (
            <div className="posts-page-v2">
                <div className="posts-wrapper-v2">
                    <div className="results-count">{t('common.loading')}</div>
                    <div className="posts-feed">
                        <PostsSkeleton count={6} />
                    </div>
                </div>
            </div>
        );
    }

    const isLoading = isLoadingPosts || locationStatus === 'detecting';
    const hasPosts = posts && posts.length > 0;
    const userName = hasPosts ? posts[0].userName : null;

    return (
        <div className="posts-page-v2">
            <div className={`posts-wrapper-v2 ${!user && !id ? 'guest-mobile-mode' : ''}`}>
                {id && <PostsUserHeader userName={userName} />}
                {!user && !id && <GuestLoginPrompt />}

                {!id && (
                    <LocationToolbar 
                        isFilterDrawerOpen={isFilterDrawerOpen}
                        setIsFilterDrawerOpen={setIsFilterDrawerOpen}
                        activeSkill={activeSkills[0] || ''}
                        onSearchClick={() => navigate('/search')}
                        rangeKm={rangeKm}
                        adjustRange={adjustRange}
                        RANGE_STEPS={RANGE_STEPS}
                        locationStatus={locationStatus}
                        detectLocation={detectLocation}
                    />
                )}

                {activeSkills && activeSkills.length > 0 && (
                    <div className="filter-chip-bar">
                        {activeSkills.map(skill => (
                            <span key={skill} className="filter-chip">
                                {t(`skills.${skill}`) || skill}
                                <button className="chip-remove" onClick={() => removeSkill(skill)}><X size={12} /></button>
                            </span>
                        ))}
                        {activeSkills.length > 1 && (
                            <button className="clear-all-chips" onClick={resetFilters}>{t('common.clearAll')}</button>
                        )}
                    </div>
                )}

                <div className="results-count">
                    {isLoading ? '...' : `${posts?.length || 0} ${posts?.length === 1 ? t('posts.listing') : t('posts.listings')} ${t('posts.found')}`}
                </div>

                <div className="posts-feed">
                    {isLoading ? (
                        <PostsSkeleton count={3} />
                    ) : (hasPosts) ? (
                        posts.map(post => (
                            <PostCard
                                key={post.id}
                                post={post}
                                user={user}
                                isContacted={contactedId === post.id}
                                onContact={handleContact}
                                onDelete={handleDeletePost}
                                onNavigateProfile={() => navigate(user && user.id === post.user_id ? '/profile' : `/profile/${post.user_id}`)}
                                onNavigateEdit={() => navigate(`/edit-post/${post.id}`)}
                            />
                        ))
                    ) : (
                        <PostsEmptyState 
                            userLocation={!!userLocation} 
                            activeSkill={activeSkills[0]}
                            onExpandRange={() => setRangeKm(100)}
                            onClearFilters={resetFilters}
                        />
                    )}
                </div>
            </div>

            <FilterDashboard
                isOpen={isFilterDrawerOpen}
                onClose={() => setIsFilterDrawerOpen(false)}
                draftSkills={draftStates.skills}
                toggleSkill={draftStates.toggleSkill}
                minExp={draftStates.minExp}
                setMinExp={draftStates.setMinExp}
                isExpDropdownOpen={draftStates.isExpDropdownOpen}
                setIsExpDropdownOpen={draftStates.setIsExpDropdownOpen}
                expDropdownRef={expDropdownRef}
                expOptions={expOptions}
                minRating={draftStates.minRating}
                setMinRating={draftStates.setMinRating}
                maxBudget={draftStates.maxBudget}
                setMaxBudget={draftStates.setMaxBudget}
                urgencyFilter={draftStates.urgency}
                setUrgencyFilter={draftStates.setUrgency}
                onApply={applyFilters}
                onReset={resetFilters}
            />

            {!!user && (
                <button className="create-post-fab" onClick={() => navigate('/create-post')}>
                    <Plus size={24} />
                </button>
            )}
        </div>
    );
};

export default Posts;
