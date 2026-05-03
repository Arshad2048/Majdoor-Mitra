import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * PostsUserHeader Component
 * Displays back button and user context for a profile's post feed.
 * @param {Object} props
 * @param {string} props.userName - The user name to display
 */
const PostsUserHeader = ({ userName }) => {
    const navigate = useNavigate();

    return (
        <div className="posts-user-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', padding: '0 8px' }}>
            <button 
                onClick={() => navigate(-1)} 
                style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '14px', cursor: 'pointer', display: 'flex', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
            >
                <ArrowLeft size={20} color="#1A3B2A" />
            </button>
            <h2 style={{ fontSize: '1.3rem', color: '#1A3B2A', margin: 0, fontWeight: '800' }}>
                {userName ? `${userName}'s Posts` : 'User Posts'}
            </h2>
        </div>
    );
};

export default PostsUserHeader;
