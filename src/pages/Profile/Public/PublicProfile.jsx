import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, User, MapPin, Phone, Star, Briefcase, ThumbsUp, BadgeCheck, ChevronRight, ChevronLeft } from 'lucide-react';
import Skeleton from '../../../components/ui/Skeleton/Skeleton';
import PublicProfileSkeleton from '../../../components/ui/Skeleton/PublicProfileSkeleton';

import { SKILLS, getSkillById } from '../../../constants/skills';
import '../shared/ProfileShared.css';
import '../Main/Profile.css';
import './PublicProfile.css';
import '../Edit/EditProfile.css'; // For banner carousel CSS
import '../../Posts/Main/Posts.css'; // For rendering post-card-v2
import '../../Reviews/Reviews.css'; // For rendering review-card-new


const PublicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bannerIdx, setBannerIdx] = useState(0);
    const touchStartX = useRef(0);

    const { user } = useAuth();
    const { t } = useTranslation();

    // Self-Healing: Sync rating with DB if out of date
    // MUST be before any early returns to satisfy React Rules of Hooks
    const calculatedRating = userReviews.length > 0 
        ? (userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(1)
        : 'New';

    useEffect(() => {
        if (profile && userReviews.length > 0 && Number(calculatedRating) !== Number(profile.rating)) {
            supabase.from('profiles').update({ 
                rating: parseFloat(calculatedRating),
                reviews_count: userReviews.length 
            }).eq('id', id);
        }
    }, [id, profile, userReviews, calculatedRating]);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            const [profileRes, postsRes, reviewsRes] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', id).single(),
                supabase.from('posts').select('*').eq('user_id', id).eq('is_deleted', false).order('created_at', { ascending: false }),
                supabase.from('reviews').select('*, reviewer:profiles!reviewer_id(full_name, role)').eq('reviewee_id', id).order('created_at', { ascending: false })
            ]);

            if (profileRes.error) {
                setError('Profile not found.');
            } else {
                setProfile(profileRes.data);
                if (postsRes.data) setUserPosts(postsRes.data);
                if (reviewsRes.data) {
                    setUserReviews(reviewsRes.data);
                } else if (reviewsRes.error) {
                    console.error("Supabase Reviews Error:", reviewsRes.error);
                }
            }
            setLoading(false);
        };

        if (id) {
            fetchProfile();
        }
    }, [id]);

    // ─── EARLY RETURNS (after all hooks) ───
    if (loading) {
        return <PublicProfileSkeleton />;
    }

    if (error || !profile) {
        return (
            <div style={{ padding: '60px', textAlign: 'center' }}>
                <h3 style={{ color: '#0f172a' }}>{error || 'User not found'}</h3>
                <button 
                    onClick={() => navigate(-1)}
                    style={{ marginTop: '20px', padding: '10px 20px', background: '#1A3B2A', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                    Go Back
                </button>
            </div>
        );
    }

    const { full_name, role, location, phone, skills, bio, avatar_url, banner_url, banner_images, rating, jobs_completed } = profile;
    const displaySkills = Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []);
    const bannerImgs = banner_images?.length > 0 ? banner_images : (banner_url ? [banner_url] : []);

    // Helper to get initials for reviews
    const getInitial = (name) => {
        if (!name || typeof name !== 'string') return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2 && parts[0] && parts[1]) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return name.charAt(0).toUpperCase();
    };

    const avatarColors = ['avatar-green', 'avatar-saffron', 'avatar-blue', 'avatar-purple', 'avatar-teal'];
    const getAvatarColor = (id) => {
        if (!id) return avatarColors[0];
        const hash = String(id).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        return avatarColors[hash % avatarColors.length];
    };

    // Helper to get relative time string for posts
    const getRelativeTime = (dateStr) => {
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    const formatPhone = (phone) => {
        if (!phone) return 'Not set';
        const cleaned = ('' + phone).replace(/\D/g, '');
        if (cleaned.length === 10) {
            return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
        }
        return phone;
    };

    return (
        <div className="profile-shared-app">
            <div className="profile-shared-wrapper">
                
                {/* COVER */}
                <div className="profile-shared-cover">
                    <button className="profile-shared-back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </button>
                    {bannerImgs.length > 0 ? (
                        <div className="banner-carousel"
                            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                            onTouchEnd={(e) => {
                                const diff = touchStartX.current - e.changedTouches[0].clientX;
                                if (Math.abs(diff) > 50 && bannerImgs.length > 1) {
                                    if (diff > 0) setBannerIdx(p => (p + 1) % bannerImgs.length);
                                    else setBannerIdx(p => (p - 1 + bannerImgs.length) % bannerImgs.length);
                                }
                            }}
                        >
                            <img src={bannerImgs[bannerIdx]} alt="Cover" />
                            {bannerImgs.length > 1 && (
                                <>
                                    <button className="banner-carousel-nav banner-carousel-nav-left" onClick={() => setBannerIdx(p => (p - 1 + bannerImgs.length) % bannerImgs.length)}>
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button className="banner-carousel-nav banner-carousel-nav-right" onClick={() => setBannerIdx(p => (p + 1) % bannerImgs.length)}>
                                        <ChevronRight size={16} />
                                    </button>

                                </>
                            )}
                        </div>
                    ) : null}
                </div>

                {/* HEADER */}
                <div className="profile-shared-header">
                    <div className="profile-shared-avatar-ring">
                        <div className="profile-shared-avatar">
                            {avatar_url ? (
                                <img src={avatar_url} alt="Avatar" />
                            ) : (
                                getInitial(full_name)
                            )}
                        </div>
                    </div>
                    
                    <h1 className="profile-shared-name">{full_name || 'Unknown User'}</h1>
                    
                    {role && (
                        <span className={`profile-shared-role-tag ${role.toLowerCase()}`} style={{ marginBottom: '16px' }}>
                        {t(`roles.${role.toLowerCase()}`, { defaultValue: role.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) })}
                    </span>
                    )}

                    {/* Rating Logic */}
                    <div className="profile-shared-rating-row" style={{ marginBottom: '16px' }}>
                        <Star size={16} fill="#F6AD55" color="#F6AD55" />
                        <span className="profile-rating-val">{calculatedRating}</span>
                        <span className="profile-rating-count">({userReviews.length} Reviews)</span>
                    </div>

                    {phone && (
                        <a href={`tel:${phone}`} style={{ textDecoration: 'none' }}>
                            <button className="pp-contact-btn">
                                <Phone size={18} /> Call {full_name?.split(' ')[0] || 'User'}
                            </button>
                        </a>
                    )}
                </div>

                {/* ─── STATS ─── */}
                <div className="profile-shared-stats">
                    <div className="profile-stat-item">
                        <span className="profile-stat-num">
                            {userReviews.length > 0 
                                ? (userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(1) 
                                : 'New'}
                        </span>
                        <span className="profile-stat-label">Rating</span>
                    </div>
                    <div className="profile-stat-divider"></div>
                    <div className="profile-stat-item">
                        <span className="profile-stat-num">{userReviews.length}</span>
                        <span className="profile-stat-label">Reviews</span>
                    </div>
                    <div className="profile-stat-divider"></div>
                    <div className="profile-stat-item">
                        <span className="profile-stat-num">{userPosts.length}</span>
                        <span className="profile-stat-label">Posts</span>
                    </div>
                </div>

                {/* ABOUT SECTION */}
                <div className="profile-shared-section">
                    <h3 className="profile-shared-section-title">About</h3>
                    {bio ? (
                        <p className="pp-bio">{bio}</p>
                    ) : (
                        <p className="pp-bio" style={{ color: '#94a3b8', fontStyle: 'italic' }}>No bio provided.</p>
                    )}
                </div>

                {/* DETAILS SECTION */}
                <div className="profile-shared-section">
                    <h3 className="profile-shared-section-title">Details</h3>
                    
                    <div className="profile-menu-card">
                        <div className="profile-menu-item">
                            <div className="profile-menu-icon icon-loc">
                                <MapPin size={18} />
                            </div>
                            <div className="profile-menu-text">
                                <span className="profile-menu-label">Location</span>
                                <span className="profile-menu-value">{location || 'Not specified'}</span>
                            </div>
                        </div>

                        {phone && (
                            <div className="profile-menu-item">
                                <div className="profile-menu-icon icon-phone">
                                    <Phone size={18} />
                                </div>
                                <div className="profile-menu-text">
                                    <span className="profile-menu-label">Phone</span>
                                    <span className="profile-menu-value">{formatPhone(phone)}</span>
                                </div>
                            </div>
                        )}

                        {role === 'labour' && (
                            <div className="profile-menu-item">
                                <div className="profile-menu-icon icon-skill">
                                    <Briefcase size={18} />
                                </div>
                                <div className="profile-menu-text">
                                    <span className="profile-menu-label">Skills / Profession</span>
                                    {displaySkills.length > 0 ? (
                                        <div className="profile-skills-row">
                                            {displaySkills.map((s, idx) => {
                                                const lowerSkill = s.toLowerCase();
                                                const skillData = getSkillById(lowerSkill);
                                                return (
                                                    <span key={idx} className="profile-skill-chip">
                                                        {skillData.icon && <skillData.icon size={14} style={{ marginRight: '6px', color: skillData.color }} />}
                                                        {t(`skills.${lowerSkill}`, { defaultValue: s })}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <span className="profile-menu-value" style={{ color: '#94a3b8' }}>None listed</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ─── ACTIVITY ─── */}
                <div className="profile-shared-section">
                    <h3 className="profile-shared-section-title">Activity</h3>
                    <div className="profile-menu-card">
                        <div className="profile-menu-item" onClick={() => navigate(`/profile/${id}/posts`)} style={{ cursor: 'pointer' }}>
                            <div className="profile-menu-icon icon-edit"><Briefcase size={18} /></div>
                            <div className="profile-menu-text">
                                <span className="profile-menu-value">Posts ({userPosts.length})</span>
                            </div>
                            <ChevronRight size={16} className="profile-menu-arrow" />
                        </div>
                        <div className="profile-menu-item" onClick={() => navigate(`/profile/${id}/reviews`)} style={{ cursor: 'pointer' }}>
                            <div className="profile-menu-icon icon-review"><Star size={18} /></div>
                            <div className="profile-menu-text">
                                <span className="profile-menu-value">Reviews ({userReviews.length})</span>
                            </div>
                            <ChevronRight size={16} className="profile-menu-arrow" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PublicProfile;
