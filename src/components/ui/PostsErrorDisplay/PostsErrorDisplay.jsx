import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * PostsErrorDisplay Component
 * Provides a user-friendly error fallback for the Posts page.
 * @param {Object} props
 * @param {Error} props.error - The error to display
 */
const PostsErrorDisplay = ({ error }) => {
    const { t } = useTranslation();

    return (
        <div style={{ padding: '40px 20px', textAlign: 'center', background: '#fef2f2', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '400px' }}>
                <h2 style={{ color: '#991b1b', marginBottom: '10px' }}>Dashboard Error</h2>
                <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '20px' }}>
                    {t('posts.errorOccurred') || 'Something went wrong while loading the feed. Please try refreshing.'}
                </p>
                {error?.message && (
                    <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px', fontSize: '12px', textAlign: 'left', marginBottom: '20px', whiteSpace: 'pre-wrap' }}>
                        {error.message}
                    </div>
                )}
                <button 
                    onClick={() => window.location.reload()} 
                    style={{ width: '100%', padding: '10px', background: '#991b1b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                    {t('posts.refreshFeed') || 'Refresh Feed'}
                </button>
            </div>
        </div>
    );
};

export default PostsErrorDisplay;
