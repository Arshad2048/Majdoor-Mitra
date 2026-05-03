import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * PostsEmptyState Component
 * Displays a friendly message when no posts match the current filters.
 * @param {Object} props
 * @param {boolean} props.userLocation - Whether user location is active
 * @param {string} props.activeSkill - Current skill filter
 * @param {Function} props.onExpandRange - Callback to expand search radius
 * @param {Function} props.onClearFilters - Callback to reset all filters
 */
const PostsEmptyState = ({ userLocation, activeSkill, onExpandRange, onClearFilters }) => {
    const { t } = useTranslation();

    return (
        <div className="empty-state-v2">
            <div className="empty-icon">🔍</div>
            <p>{userLocation ? t('posts.noNearby') : t('posts.noListings')}</p>
            <div className="empty-actions">
                {userLocation && onExpandRange && (
                    <button className="empty-btn" onClick={onExpandRange}>
                        {t('posts.expandRange')}
                    </button>
                )}
                {(activeSkill || !userLocation) && onClearFilters && (
                    <button className="empty-btn" onClick={onClearFilters}>
                        {t('posts.showAll')}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PostsEmptyState;
