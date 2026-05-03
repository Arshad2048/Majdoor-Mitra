import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { User, MapPin, Phone, Star, Edit3, Settings, ChevronRight, ChevronLeft, Briefcase, LogOut, Shield, Bell, HelpCircle, FileText, ArrowLeft, Camera, Loader2 } from 'lucide-react';
import '../shared/ProfileShared.css';
import './Profile.css';
import { supabase } from '../../../supabaseClient';
import { formatMonthYear } from '../../../utils/formatters';
import Skeleton from '../../../components/ui/Skeleton/Skeleton';
import ProfileSkeleton from '../../../components/ui/Skeleton/ProfileSkeleton';

import { getSkillById } from '../../../constants/skills';


const Profile = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, profile, isAdmin, logout, loading: authLoading } = useAuth();

    // Derived or default profile stats
    const [stats, setStats] = useState({ rating: 0, reviewsCount: 0, jobsCompleted: 0 });
    const [bannerIdx, setBannerIdx] = useState(0);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const touchStartX = useRef(0);

    const bannerImages = profile?.banner_images?.length > 0 
        ? profile.banner_images 
        : (profile?.banner_url ? [profile.banner_url] : []);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
            return;
        }

        const fetchReviewsAndStats = async () => {
            if (!profile) return;
            
            // Fetch reviews to calculate real-time accurate rating
            const { data: reviews } = await supabase
                .from('reviews')
                .select('rating')
                .eq('reviewee_id', user.id);

            const fetchedReviewsCount = reviews?.length || 0;
            const fetchedRating = fetchedReviewsCount > 0 
                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / fetchedReviewsCount).toFixed(1)
                : 0;

            // Fetch actual post count
            const { count: fetchedPostsCount } = await supabase
                .from('posts')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id);

            // Update local state for display
            setStats({
                rating: fetchedRating,
                reviewsCount: fetchedReviewsCount,
                jobsCompleted: fetchedPostsCount || 0
            });

            // Self-Healing: If DB is out of sync, update it silently
            if (fetchedReviewsCount > 0 && Math.abs(Number(fetchedRating) - Number(profile.rating)) > 0.01) {
                await supabase.from('profiles').update({ 
                    rating: parseFloat(fetchedRating),
                    reviews_count: fetchedReviewsCount 
                }).eq('id', user.id);
            }
        };

        fetchReviewsAndStats();
    }, [user, profile, navigate, authLoading]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            setTimeout(async () => {
                await logout();
                navigate('/login');
            }, 1000);
        } catch (error) {
            console.error('Logout failed:', error.message);
            setIsLoggingOut(false);
        }
    };

    if (authLoading || !profile) {
        return <ProfileSkeleton />;
    }

    const memberSince = formatMonthYear(profile.created_at);

    const formatPhone = (phone) => {
        if (!phone) return t('profile.notSet');
        const cleaned = ('' + phone).replace(/\D/g, '');
        if (cleaned.length === 10) {
            return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
        }
        return phone;
    };

    return (
        <div className="profile-shared-app main-profile-view">
            {isLoggingOut && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(26, 59, 42, 0.85)',
                    backdropFilter: 'blur(12px)',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '40px 60px',
                        borderRadius: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
                        backdropFilter: 'blur(16px)'
                    }}>
                        <div style={{
                            width: '80px', height: '80px',
                            borderRadius: '50%',
                            background: 'rgba(242, 92, 5, 0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '24px',
                            border: '2px solid rgba(242, 92, 5, 0.3)'
                        }}>
                            <Loader2 size={40} className="spin-animation" style={{ color: '#F25C05' }} />
                        </div>
                        <h2 style={{ color: '#ffffff', fontWeight: 700, margin: 0, fontSize: '1.5rem', letterSpacing: '0.5px' }}>{t('profile.loggingOut')}</h2>
                        <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: '8px 0 0 0', fontSize: '0.95rem' }}>{t('profile.securingSession')}</p>
                    </div>
                </div>
            )}
            <div className="profile-shared-wrapper">

                {/* ─── COVER (Carousel) ─── */}
                <div className="profile-shared-cover" style={{position: 'relative'}}>
                    <button className="profile-shared-back-btn" onClick={() => navigate(-1)} style={{ zIndex: 10 }}>
                        <ArrowLeft size={20} />
                    </button>
                    {bannerImages.length > 0 ? (
                        <div className="banner-carousel"
                            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                            onTouchEnd={(e) => {
                                const diff = touchStartX.current - e.changedTouches[0].clientX;
                                if (Math.abs(diff) > 50 && bannerImages.length > 1) {
                                    if (diff > 0) setBannerIdx(p => (p + 1) % bannerImages.length);
                                    else setBannerIdx(p => (p - 1 + bannerImages.length) % bannerImages.length);
                                }
                            }}
                        >
                            <img src={bannerImages[bannerIdx]} alt="Banner" />
                            {bannerImages.length > 1 && (
                                <>
                                    <button className="banner-carousel-nav banner-carousel-nav-left" onClick={() => setBannerIdx(p => (p - 1 + bannerImages.length) % bannerImages.length)}>
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button className="banner-carousel-nav banner-carousel-nav-right" onClick={() => setBannerIdx(p => (p + 1) % bannerImages.length)}>
                                        <ChevronRight size={16} />
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="profile-cover-pattern"></div>
                    )}
                </div>

                {/* ─── AVATAR + IDENTITY ─── */}
                <div className="profile-shared-header">
                    <div className="profile-shared-avatar-ring">
                        <div className="profile-shared-avatar">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" />
                            ) : (
                                <User size={48} />
                            )}
                        </div>
                        <div className="profile-edit-badge" onClick={() => navigate('/edit-profile')}>
                            <Camera size={14} />
                        </div>
                    </div>
                    <h2 className="profile-shared-name">{profile.full_name || 'User'}</h2>
                    <span className={`profile-shared-role-tag ${profile.role}`}>{t(`roles.${profile.role}`)}</span>
                    <div className="profile-shared-rating-row">
                        <Star size={16} fill="#F6AD55" color="#F6AD55" />
                        <span className="profile-rating-val">{stats.rating}</span>
                        <span className="profile-rating-count">({stats.reviewsCount} {t('profile.reviews')})</span>
                    </div>
                </div>

                {/* ─── STATS ─── */}
                <div className="profile-shared-stats">
                    <div className="profile-stat-item">
                        <span className="profile-stat-num">{stats.rating}</span>
                        <span className="profile-stat-label">{t('profile.rating')}</span>
                    </div>
                    <div className="profile-stat-divider"></div>
                    <div className="profile-stat-item">
                        <span className="profile-stat-num">{stats.reviewsCount}</span>
                        <span className="profile-stat-label">{t('profile.reviews')}</span>
                    </div>
                    <div className="profile-stat-divider"></div>
                    <div className="profile-stat-item">
                        <span className="profile-stat-num">{stats.jobsCompleted || 0}</span>
                        <span className="profile-stat-label">{t('profile.posts')}</span>
                    </div>
                </div>

                {/* ─── ABOUT ─── */}
                <div className="profile-shared-section">
                    <h3 className="profile-shared-section-title">{t('profile.aboutTitle')}</h3>
                    {profile.bio ? (
                        <p style={{ color: '#4A5568', lineHeight: '1.6', fontSize: '0.95rem', background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0', marginTop: '0' }}>{profile.bio}</p>
                    ) : (
                        <p style={{ color: '#94a3b8', fontStyle: 'italic', background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0', marginTop: '0' }}>{t('profile.noBio')}</p>
                    )}
                </div>

                {/* ─── PERSONAL INFO ─── */}
                <div className="profile-shared-section">
                    <h3 className="profile-shared-section-title">{t('profile.personalInfo')}</h3>
                    <div className="profile-menu-card">
                        <div className="profile-menu-item">
                            <div className="profile-menu-icon icon-loc"><MapPin size={18} /></div>
                            <div className="profile-menu-text">
                                <span className="profile-menu-label">{t('profile.location')}</span>
                                <span className="profile-menu-value">{profile.location || t('profile.notSet')}</span>
                            </div>
                        </div>
                        <div className="profile-menu-item">
                            <div className="profile-menu-icon icon-phone"><Phone size={18} /></div>
                            <div className="profile-menu-text">
                                <span className="profile-menu-label">{t('profile.phone')}</span>
                                <span className="profile-menu-value">{formatPhone(profile.phone)}</span>
                            </div>
                        </div>
                        {profile.role === 'labour' && (
                        <div className="profile-menu-item">
                            <div className="profile-menu-icon icon-skill"><Briefcase size={18} /></div>
                            <div className="profile-menu-text">
                                <span className="profile-menu-label">{t('profile.skills')}</span>
                                <div className="profile-skills-row">
                                    {(() => {
                                        const skillsList = typeof profile.skills === 'string' 
                                            ? profile.skills.split(',').map(s => s.trim()).filter(Boolean) 
                                            : (Array.isArray(profile.skills) ? profile.skills : []);
                                        
                                        return skillsList.length > 0 ? skillsList.map(skill => {
                                            const lowerSkill = skill.toLowerCase();
                                            const skillData = getSkillById(lowerSkill);
                                            return (
                                                <span key={skill} className="profile-skill-chip">
                                                    {skillData.icon && <skillData.icon size={14} style={{ marginRight: '6px', color: skillData.color }} />}
                                                    {t(`skills.${lowerSkill}`, { defaultValue: skill })}
                                                </span>
                                            );
                                        }) : <span className="profile-menu-value">{t('profile.noSkills')}</span>;
                                    })()}
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                </div>

                {/* ─── ACCOUNT ─── */}
                <div className="profile-shared-section">
                    <h3 className="profile-shared-section-title">{t('profile.account')}</h3>
                    <div className="profile-menu-card">
                        {isAdmin && (
                            <Link to="/admin" className="profile-menu-link">
                                <div className="profile-menu-item">
                                    <div className="profile-menu-icon icon-admin"><Shield size={18} /></div>
                                    <div className="profile-menu-text">
                                        <span className="profile-menu-value">Admin Panel</span>
                                    </div>
                                    <ChevronRight size={16} className="profile-menu-arrow" />
                                </div>
                            </Link>
                        )}
                        <Link to="/edit-profile" className="profile-menu-link">
                            <div className="profile-menu-item">
                                <div className="profile-menu-icon icon-edit"><Edit3 size={18} /></div>
                                <div className="profile-menu-text">
                                    <span className="profile-menu-value">{t('profile.editProfile')}</span>
                                </div>
                                <ChevronRight size={16} className="profile-menu-arrow" />
                            </div>
                        </Link>
                        <Link to={`/profile/${profile.id}/posts`} className="profile-menu-link">
                            <div className="profile-menu-item">
                                <div className="profile-menu-icon icon-skill"><FileText size={18} /></div>
                                <div className="profile-menu-text">
                                    <span className="profile-menu-value">{t('profile.myPosts')}</span>
                                </div>
                                <ChevronRight size={16} className="profile-menu-arrow" />
                            </div>
                        </Link>
                        <Link to="/reviews" className="profile-menu-link">
                            <div className="profile-menu-item">
                                <div className="profile-menu-icon icon-review"><Star size={18} /></div>
                                <div className="profile-menu-text">
                                    <span className="profile-menu-value">{t('profile.myReviews')}</span>
                                </div>
                                <ChevronRight size={16} className="profile-menu-arrow" />
                            </div>
                        </Link>

                        <Link to="/privacy" className="profile-menu-link">
                            <div className="profile-menu-item">
                                <div className="profile-menu-icon icon-privacy"><Shield size={18} /></div>
                                <div className="profile-menu-text">
                                    <span className="profile-menu-value">{t('profile.privacySecurity')}</span>
                                </div>
                                <ChevronRight size={16} className="profile-menu-arrow" />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* ─── SUPPORT ─── */}
                <div className="profile-shared-section">
                    <h3 className="profile-shared-section-title">{t('profile.support')}</h3>
                    <div className="profile-menu-card">
                        <Link to="/contact" className="profile-menu-link">
                            <div className="profile-menu-item">
                                <div className="profile-menu-icon icon-help"><HelpCircle size={18} /></div>
                                <div className="profile-menu-text">
                                    <span className="profile-menu-value">{t('profile.helpCenter')}</span>
                                </div>
                                <ChevronRight size={16} className="profile-menu-arrow" />
                            </div>
                        </Link>
                        <Link to="/terms" className="profile-menu-link">
                            <div className="profile-menu-item">
                                <div className="profile-menu-icon icon-terms"><FileText size={18} /></div>
                                <div className="profile-menu-text">
                                    <span className="profile-menu-value">{t('profile.termsConditions')}</span>
                                </div>
                                <ChevronRight size={16} className="profile-menu-arrow" />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* ─── LOGOUT ─── */}
                <button className="profile-logout-btn" onClick={handleLogout}>
                    <LogOut size={18} /> {t('profile.logout')}
                </button>

                {/* ─── MEMBER SINCE ─── */}
                <p className="profile-member-since">{t('profile.memberSince')} {memberSince}</p>

            </div>
        </div>
    );
};

export default Profile;
