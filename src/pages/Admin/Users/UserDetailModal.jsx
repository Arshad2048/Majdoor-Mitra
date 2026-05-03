import React, { useState, useEffect } from 'react';
import {
    X, Phone, MapPin, Calendar, Star,
    Briefcase, Shield, Clock, Mail, User,
    ShieldCheck, ShieldAlert, Activity, ExternalLink
} from 'lucide-react';
import { supabase } from '../../../supabaseClient';
import { useAlert } from '../../../context/AlertContext';
import './UserDetailModal.css';
import '../AdminSkeleton.css';

const UserDetailModal = ({ user, onClose, onUserUpdate }) => {
    const { showAlert, showConfirm } = useAlert();
    const [activeTab, setActiveTab] = useState('posts');
    const [posts, setPosts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isBanned, setIsBanned] = useState(user?.is_banned || false);

    // Sync if parent updates the user prop
    useEffect(() => {
        setIsBanned(user?.is_banned || false);
    }, [user?.is_banned]);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                // Fetch Posts
                const { data: postsData, error: postsError } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (postsError) console.error('Posts error:', postsError);

                // Fetch Reviews where this user is the reviewee
                const { data: reviewsData, error: reviewsError } = await supabase
                    .from('reviews')
                    .select('*, reviewer:reviewer_id(full_name, avatar_url)')
                    .eq('reviewee_id', user.id)
                    .order('created_at', { ascending: false });

                if (reviewsError) console.error('Reviews error:', reviewsError);

                setPosts(postsData || []);
                setReviews(reviewsData || []);
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchUserData();
    }, [user.id]);

    const handleToggleBan = async () => {
        const action = isBanned ? 'unban' : 'ban';
        const userName = user.full_name || 'this user';

        const confirmed = await showConfirm(
            isBanned
                ? `Remove ban from "${userName}"? They will regain access to posting and messaging.`
                : `Ban "${userName}"? This will restrict them from posting, messaging, and appearing in search results.`,
            {
                title: isBanned ? 'Unban User' : 'Ban User',
                confirmText: isBanned ? 'Yes, Unban' : 'Yes, Ban',
                type: isBanned ? 'success' : 'error'
            }
        );

        if (!confirmed) return;

        const newBanStatus = !isBanned;
        const { error } = await supabase
            .from('profiles')
            .update({ is_banned: newBanStatus })
            .eq('id', user.id);

        if (error) {
            showAlert(`Failed to ${action} ${userName}. Please try again.`, 'error');
        } else {
            setIsBanned(newBanStatus);
            showAlert(
                newBanStatus
                    ? `${userName} has been banned successfully`
                    : `${userName} has been unbanned and can now access all features`,
                newBanStatus ? 'error' : 'success'
            );
            if (onUserUpdate) {
                onUserUpdate(user.id, { is_banned: newBanStatus });
            }
        }
    };

    const getTimeAgo = (dateString) => {
        const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
        const days = Math.floor(seconds / 86400);
        if (days > 0) return `${days}d ago`;
        const hours = Math.floor(seconds / 3600);
        if (hours > 0) return `${hours}h ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    };

    // Format phone with +91 prefix
    const formatPhone = (phone) => {
        if (!phone) return 'No phone';
        const cleaned = phone.replace(/\D/g, '');
        // If already starts with 91 and is 12 digits, format it
        if (cleaned.startsWith('91') && cleaned.length === 12) {
            return `+91 ${cleaned.slice(2)}`;
        }
        // Standard 10-digit Indian number
        if (cleaned.length === 10) {
            return `+91 ${cleaned}`;
        }
        return `+91 ${phone}`;
    };

    // Build Google Maps URL from location
    const getGoogleMapsUrl = (location) => {
        if (!location) return null;
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    };

    if (!user) return null;

    const displayLocation = user.location || 'Location not set';
    const roleName = user.role === 'contractor' ? 'Contractor' : user.role === 'labour' ? 'Labour' : 'User';
    const activePosts = posts.filter(p => !p.is_deleted).length;
    const deletedPosts = posts.filter(p => p.is_deleted).length;

    // When user is banned, mark posts as effectively "removed"
    const getPostDeletedStatus = (post) => {
        return post.is_deleted || isBanned;
    };

    return (
        <div className="udm-overlay" onClick={onClose}>
            <div className="udm-container" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="udm-header">
                    <h2 className="udm-title">User Profile Details</h2>
                    <button className="udm-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Status Bar - removed Last seen */}
                <div className={`udm-status-bar ${isBanned ? 'banned' : 'active'}`}>
                    <div className="udm-status-dot"></div>
                    <span>{isBanned ? 'Account Suspended' : 'Account Active'}</span>
                    {user.is_admin && <span className="udm-admin-chip"><ShieldCheck size={12} /> Admin</span>}
                </div>

                {/* Body: Sidebar + Main */}
                <div className="udm-body">

                    {/* ─── Left Sidebar ─── */}
                    <div className="udm-sidebar">
                        {/* User Identity */}
                        <div className="udm-identity">
                            <div className={`udm-avatar ${isBanned ? 'banned' : ''}`}>
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.full_name} />
                                ) : (
                                    <span>{user.full_name?.charAt(0)?.toUpperCase() || '?'}</span>
                                )}
                            </div>
                            <h1 className="udm-user-name">{user.full_name || 'Anonymous'}</h1>
                            <p className="udm-user-email">{user.email}</p>
                            <span className={`udm-role-chip ${user.role}`}>{roleName}</span>
                        </div>

                        {/* Account Info */}
                        <div className="udm-section">
                            <h3 className="udm-section-label">ACCOUNT INFO</h3>
                            <div className="udm-info-row">
                                <Phone size={15} />
                                <span>{formatPhone(user.phone)}</span>
                            </div>
                            <div className="udm-info-row">
                                <Calendar size={15} />
                                <span>Joined {new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <div className="udm-info-row">
                                <Star size={15} />
                                <span>{user.rating ? Number(user.rating).toFixed(1) : '0.0'} Rating ({user.reviews_count || reviews.length} reviews)</span>
                            </div>
                            <div className="udm-info-row">
                                <MapPin size={15} />
                                {user.location ? (
                                    <a
                                        href={getGoogleMapsUrl(user.location)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="udm-location-link"
                                    >
                                        {displayLocation} <ExternalLink size={11} />
                                    </a>
                                ) : (
                                    <span>Location not set</span>
                                )}
                            </div>
                            <div className="udm-info-row">
                                <Briefcase size={15} />
                                <span>{activePosts} active posts{deletedPosts > 0 ? `, ${deletedPosts} removed` : ''}</span>
                            </div>
                        </div>

                        {/* Skills */}
                        {user.skills && user.skills.length > 0 && (
                            <div className="udm-section">
                                <h3 className="udm-section-label">SKILLS</h3>
                                <div className="udm-skills">
                                    {user.skills.map((skill, i) => (
                                        <span key={i} className="udm-skill-tag">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quick Actions */}
                        <div className="udm-section">
                            <h3 className="udm-section-label">QUICK ACTIONS</h3>
                            {user.phone && (
                                <a href={`tel:+91${user.phone.replace(/\D/g, '').replace(/^91/, '')}`} className="udm-btn-call">
                                    <Phone size={14} /> Call User
                                </a>
                            )}
                            <button
                                className={`udm-btn-fill ${isBanned ? 'unban' : 'ban'}`}
                                onClick={handleToggleBan}
                            >
                                {isBanned ? (
                                    <><ShieldCheck size={15} /> Unban User</>
                                ) : (
                                    <><ShieldAlert size={15} /> Ban User</>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* ─── Main Content ─── */}
                    <div className="udm-main">
                        {/* About Section */}
                        <div className="udm-about">
                            <h3>About</h3>
                            <p>{user.bio || 'No bio provided by user.'}</p>
                        </div>

                        {/* Tabs */}
                        <div className="udm-tabs">
                            <button
                                className={`udm-tab ${activeTab === 'posts' ? 'active' : ''}`}
                                onClick={() => setActiveTab('posts')}
                            >
                                Posts ({posts.length})
                            </button>
                            <button
                                className={`udm-tab ${activeTab === 'reviews' ? 'active' : ''}`}
                                onClick={() => setActiveTab('reviews')}
                            >
                                Reviews ({reviews.length})
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="udm-tab-content">
                            {loading ? (
                                <div className="skeleton-mobile-list" style={{ paddingTop: '16px' }}>
                                    {[1, 2].map(i => (
                                        <div key={i} className="skeleton-mobile-card skeleton-base">
                                            <div className="skeleton-mobile-card-top">
                                                <div style={{ flex: 1 }}>
                                                    <div className="skeleton-text-line medium" style={{ background: 'rgba(255,255,255,0.5)' }}></div>
                                                    <div className="skeleton-text-line short" style={{ background: 'rgba(255,255,255,0.3)', marginBottom: 0 }}></div>
                                                </div>
                                                <div className="skeleton-mobile-card-badge" style={{ background: 'rgba(255,255,255,0.4)', width: '40px' }}></div>
                                            </div>
                                            <div className="skeleton-text-line" style={{ marginTop: '12px', background: 'rgba(255,255,255,0.3)' }}></div>
                                        </div>
                                    ))}
                                </div>
                            ) : activeTab === 'posts' ? (
                                <div className="udm-posts-list">
                                    {posts.length > 0 ? posts.map(post => (
                                        <div key={post.id} className={`udm-post-card ${getPostDeletedStatus(post) ? 'deleted' : ''}`}>
                                            <div className="udm-post-top">
                                                <h4 className="udm-post-title">{post.title}</h4>
                                                <div className="udm-post-badges">
                                                    <span className="udm-price">{post.amount || `₹${post.amount_numeric || '—'}`}</span>
                                                    {getPostDeletedStatus(post) && <span className="udm-removed">REMOVED</span>}
                                                </div>
                                            </div>
                                            {post.description && (
                                                <p className="udm-post-desc">{post.description.substring(0, 100)}{post.description.length > 100 ? '...' : ''}</p>
                                            )}
                                            <div className="udm-post-meta">
                                                <span><Briefcase size={13} /> {post.skill}</span>
                                                <span><MapPin size={13} /> {post.location}</span>
                                                <span><Clock size={13} /> {getTimeAgo(post.created_at)}</span>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="udm-empty">No posts created yet.</div>
                                    )}
                                </div>
                            ) : (
                                <div className="udm-reviews-list">
                                    {reviews.length > 0 ? reviews.map(review => (
                                        <div key={review.id} className={`udm-review-card ${isBanned ? 'deleted' : ''}`}>
                                            <div className="udm-review-top">
                                                <div className="udm-reviewer">
                                                    <div className="udm-reviewer-avatar">
                                                        {review.reviewer?.avatar_url ? (
                                                            <img src={review.reviewer.avatar_url} alt="" />
                                                        ) : (
                                                            review.reviewer?.full_name?.charAt(0)?.toUpperCase() || '?'
                                                        )}
                                                    </div>
                                                    <div className="udm-reviewer-info">
                                                        <span className="udm-reviewer-name">{review.reviewer?.full_name || 'Unknown'}</span>
                                                        <span className="udm-review-date">
                                                            {new Date(review.created_at).toLocaleDateString('en-GB', {
                                                                day: 'numeric', month: 'short', year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div className="udm-review-stars">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={14}
                                                                fill={i < review.rating ? '#f59e0b' : 'none'}
                                                                color={i < review.rating ? '#f59e0b' : '#d1d5db'}
                                                            />
                                                        ))}
                                                    </div>
                                                    {isBanned && <span className="udm-removed">REMOVED</span>}
                                                </div>
                                            </div>
                                            <p className="udm-review-comment">{review.comment || 'No comment.'}</p>
                                        </div>
                                    )) : (
                                        <div className="udm-empty">No reviews yet.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Banned Badge - moved to left so it doesn't overlap close button */}
                {isBanned && (
                    <div className="udm-banned-badge">BANNED</div>
                )}
            </div>
        </div>
    );
};

export default UserDetailModal;