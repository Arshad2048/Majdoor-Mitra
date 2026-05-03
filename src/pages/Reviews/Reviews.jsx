import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { supabase } from '../../supabaseClient';
import { Star, ArrowLeft, ThumbsUp, BadgeCheck, Loader2 } from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton/Skeleton';
import ReviewSkeleton from '../../components/ui/Skeleton/ReviewSkeleton';

import { formatDate } from '../../utils/formatters';
import './Reviews.css';


const avatarColors = ['avatar-green', 'avatar-saffron', 'avatar-blue', 'avatar-purple', 'avatar-teal'];

const getAvatarColor = (id) => {
    const hash = String(id).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return avatarColors[hash % avatarColors.length];
};

const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name[0].toUpperCase();
};

const Reviews = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const { user, loading: authLoading } = useAuth();
    const { showAlert } = useAlert();

    const [reviewsData, setReviewsData] = useState([]);
    const [helpfulIds, setHelpfulIds] = useState(() => {
        const saved = localStorage.getItem('helpful_reviews');
        return saved ? JSON.parse(saved) : [];
    });
    const [isLoading, setIsLoading] = useState(true);

    // Persist helpful actions locally
    useEffect(() => {
        localStorage.setItem('helpful_reviews', JSON.stringify(helpfulIds));
    }, [helpfulIds]);

    // Target Profile to conditionally know if we're viewing a specific user
    const [targetProfile, setTargetProfile] = useState(null);

    // Review Form State
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [reviewError, setReviewError] = useState('');

    useEffect(() => {
        if (authLoading) return;

        // If viewing "My Reviews" (no id), must be logged in
        if (!id && !user) {
            navigate('/login');
            return;
        }

        const fetchReviews = async () => {
            const targetId = id || user?.id;
            if (!targetId) return;

            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('reviews')
                    .select('*, reviewer:profiles!reviewer_id(full_name, role, avatar_url)')
                    .eq('reviewee_id', targetId)
                    .order('created_at', { ascending: false });

                if (id) {
                    const { data: profileData } = await supabase.from('profiles').select('full_name, role').eq('id', id).single();
                    if (profileData) setTargetProfile(profileData);
                }

                if (!error && data) {
                    setReviewsData(data.map(r => ({
                        id: r.id,
                        reviewer_id: r.reviewer_id,
                        author: r.reviewer?.full_name || t('common.anonymous'),
                        initials: getInitials(r.reviewer?.full_name),
                        avatarColor: getAvatarColor(r.reviewer_id),
                        avatarUrl: r.reviewer?.avatar_url,
                        role: r.reviewer?.role || 'normal_user',
                        rating: r.rating,
                        date: formatDate(r.created_at),
                        comment: r.comment,
                        helpful: r.helpful_count || 0
                    })));
                }
            } catch (err) {
                console.error("Error fetching reviews:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, [user, id, t]);

    // Calculate aggregated stats
    const totalReviews = reviewsData.length;
    const avgRating = totalReviews > 0
        ? (reviewsData.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
        : 0;

    // Calculate breakdown
    const breakdownParams = [5, 4, 3, 2, 1].map(stars => ({
        stars,
        count: reviewsData.filter(r => r.rating === stars).length
    }));

    const maxCount = Math.max(...breakdownParams.map(b => b.count));

    const toggleHelpful = async (reviewId) => {
        const isCurrentlyHelpful = helpfulIds.includes(reviewId);

        setHelpfulIds(prev =>
            isCurrentlyHelpful ? prev.filter(x => x !== reviewId) : [...prev, reviewId]
        );
        setReviewsData(prev => prev.map(r =>
            r.id === reviewId
                ? { ...r, helpful: isCurrentlyHelpful ? Math.max(0, r.helpful - 1) : r.helpful + 1 }
                : r
        ));

        try {
            let res;
            if (!isCurrentlyHelpful) {
                res = await supabase.rpc('increment_review_helpful', { row_id: reviewId });
            } else {
                res = await supabase.rpc('decrement_review_helpful', { row_id: reviewId });
            }

            if (res.data?.error) {
                // Rollback UI if backend returned error (e.g. duplicate or self-vote)
                setHelpfulIds(prev => isCurrentlyHelpful ? [...prev, reviewId] : prev.filter(x => x !== reviewId));
                setReviewsData(prev => prev.map(r =>
                    r.id === reviewId ? { ...r, helpful: isCurrentlyHelpful ? r.helpful + 1 : Math.max(0, r.helpful - 1) } : r
                ));
                showAlert(res.data.error, 'warning');
            }
        } catch (err) {
            console.error("Error toggling helpful status:", err);
            setHelpfulIds(prev =>
                isCurrentlyHelpful ? [...prev, reviewId] : prev.filter(x => x !== reviewId)
            );
        }
    };

    const handleOpenReviewForm = () => {
        const userReview = user ? reviewsData.find(r => r.reviewer_id === user.id) : null;
        if (userReview) {
            setReviewRating(userReview.rating);
            setReviewText(userReview.comment || '');
        } else {
            setReviewRating(0);
            setReviewText('');
        }
        setShowReviewForm(true);
    };

    const handleSubmitReview = async () => {
        if (!user) {
            setReviewError(t('reviews.loginRequired'));
            return;
        }
        if (reviewRating === 0) {
            setReviewError(t('reviews.selectRatingError'));
            return;
        }
        setIsSubmittingReview(true);
        setReviewError('');

        try {
            const { error: upsertError } = await supabase.from('reviews').upsert([{
                reviewer_id: user.id,
                reviewee_id: id,
                rating: reviewRating,
                comment: reviewText.trim()
            }], { onConflict: 'reviewer_id, reviewee_id' });

            if (upsertError) throw upsertError;

            // REMOVED: manual profile sync. Handled by DB trigger 'trg_sync_profile_rating'.

            setShowReviewForm(false);
            setReviewRating(0);
            setReviewText('');
            window.location.reload();
        } catch (err) {
            setReviewError(err.message || t('common.errorSubmit'));
        } finally {
            setIsSubmittingReview(false);
        }
    };

    if (isLoading) {
        return <ReviewSkeleton />;
    }

    return (
        <div className="reviews-page-new">
            <div className="reviews-wrapper">

                {/* ── Hero Header ── */}
                <div className="reviews-hero">
                    <div className="reviews-hero-pattern"></div>
                    <div className="reviews-hero-content">
                        <button className="reviews-back-btn" onClick={() => navigate(-1)}>
                            <ArrowLeft size={18} />
                        </button>
                        <p className="reviews-page-title">{t('reviews.title')}</p>

                        <div className="reviews-score-card">
                            <span className="reviews-big-number">{avgRating}</span>
                            <div className="reviews-score-detail">
                                <div className="reviews-stars-row">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star
                                            key={star}
                                            size={20}
                                            fill={star <= Math.round(Number(avgRating)) ? '#F6AD55' : 'rgba(255,255,255,0.2)'}
                                            color={star <= Math.round(Number(avgRating)) ? '#F6AD55' : 'rgba(255,255,255,0.2)'}
                                        />
                                    ))}
                                </div>
                                <span className="reviews-total-count">
                                    {t('reviews.basedOn')} {totalReviews} {t('reviews.reviewsCount')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Rating Breakdown ── */}
                <div className="reviews-breakdown">
                    <h3 className="reviews-breakdown-title">{t('reviews.ratingBreakdown')}</h3>
                    {breakdownParams.map(item => (
                        <div key={item.stars} className="breakdown-row">
                            <span className="breakdown-label">
                                {item.stars} <Star size={12} fill="#F6AD55" color="#F6AD55" />
                            </span>
                            <div className="breakdown-bar-track">
                                <div
                                    className="breakdown-bar-fill"
                                    style={{ width: maxCount > 0 ? `${(item.count / maxCount) * 100}%` : '0%' }}
                                ></div>
                            </div>
                            <span className="breakdown-count">{item.count}</span>
                        </div>
                    ))}
                </div>

                {/* ── Review Form ── */}
                {user && id && user.id !== id && targetProfile && !showReviewForm && (
                    <div style={{ padding: '0 20px 20px' }}>
                        <button onClick={handleOpenReviewForm} className="reviews-write-btn" style={{ width: '100%', background: '#1A3B2A', color: '#fff', padding: '14px', borderRadius: '16px', fontWeight: '600', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(26,59,42,0.15)' }}>
                            {reviewsData.find(r => r.reviewer_id === user.id) 
                                ? t('reviews.editReview') 
                                : `${t('reviews.writeFor')} ${targetProfile.full_name?.split(' ')[0] || t('common.user')}`
                            }
                        </button>
                    </div>
                )}

                {showReviewForm && (
                    <div className="reviews-form-card" style={{ margin: '0 20px 24px', background: '#fff', padding: '24px', borderRadius: '24px', boxShadow: '0 6px 20px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0' }}>
                        <h4 style={{ margin: '0 0 16px', color: '#1A3B2A', fontSize: '1.1rem' }}>
                            {(user && reviewsData.find(r => r.reviewer_id === user.id)) ? t('common.edit') + ' ' + t('reviews.leaveReviewTitle') : t('reviews.leaveReviewTitle')}
                        </h4>
                        {reviewError && <p style={{ color: '#E53E3E', fontSize: '14px', marginBottom: '12px' }}>{reviewError}</p>}

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', color: '#4A5568', marginBottom: '8px', fontWeight: '600' }}>{t('reviews.ratingLabel')}:</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                        key={star}
                                        size={32}
                                        onClick={() => setReviewRating(star)}
                                        fill={star <= reviewRating ? '#F6AD55' : 'transparent'}
                                        color={star <= reviewRating ? '#F6AD55' : '#cbd5e1'}
                                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                    />
                                ))}
                            </div>
                        </div>
                        <textarea
                            placeholder={t('reviews.commentPlaceholder')}
                            value={reviewText}
                            onChange={e => setReviewText(e.target.value)}
                            rows={4}
                            style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1.5px solid #E2E8F0', marginBottom: '20px', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.95rem' }}
                        />
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setShowReviewForm(false)} disabled={isSubmittingReview} style={{ flex: 1, padding: '14px', background: '#F0F2F5', border: 'none', borderRadius: '14px', fontWeight: '600', color: '#4A5568', cursor: 'pointer' }}>{t('common.cancel')}</button>
                            <button onClick={handleSubmitReview} disabled={isSubmittingReview} style={{ flex: 1, padding: '14px', background: '#F25C05', border: 'none', borderRadius: '14px', fontWeight: '600', color: '#fff', cursor: 'pointer' }}>
                                {isSubmittingReview ? t('common.submitting') : ((user && reviewsData.find(r => r.reviewer_id === user.id)) ? t('common.save') : t('reviews.submitBtn'))}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Reviews List ── */}
                <div className="reviews-section">
                    <div className="reviews-section-header">
                        <span className="reviews-section-title">{t('reviews.allReviews')}</span>
                        <span className="reviews-count-badge">{reviewsData.length} {t('reviews.reviewsCount')}</span>
                    </div>

                    {reviewsData.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
                            {id ? t('reviews.noReviewsUser') : t('reviews.noReviewsMe')}
                        </div>
                    ) : (
                        <div className="reviews-card-list">
                            {reviewsData.map(review => (
                                <div key={review.id} className="review-card-new">
                                    <div className="review-card-top">
                                        <div
                                            className={`review-avatar ${!review.avatarUrl ? review.avatarColor : ''}`}
                                            onClick={() => navigate(user && user.id === review.reviewer_id ? '/profile' : `/profile/${review.reviewer_id}`)}
                                            style={{ cursor: 'pointer', overflow: 'hidden' }}
                                        >
                                            {review.avatarUrl ? (
                                                <img src={review.avatarUrl} alt={review.author} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                review.initials
                                            )}
                                        </div>
                                        <div className="review-card-info">
                                            <div
                                                className="review-card-name"
                                                onClick={() => navigate(user && user.id === review.reviewer_id ? '/profile' : `/profile/${review.reviewer_id}`)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {review.author}
                                            </div>
                                            <div className="review-card-meta">
                                                <span className="review-card-role">{t(`roles.${review.role}`)}</span>
                                                <span className="review-card-date">{review.date}</span>
                                            </div>
                                        </div>
                                        <div className="review-card-stars">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    fill={i < review.rating ? '#F6AD55' : '#E2E8F0'}
                                                    color={i < review.rating ? '#F6AD55' : '#E2E8F0'}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <p className="review-card-body">{review.comment}</p>

                                    <div className="review-card-footer">
                                        {user && user.id === review.reviewer_id ? (
                                            <span className="review-helpful-btn" style={{ opacity: 0.5, cursor: 'default' }}>
                                                <ThumbsUp size={13} />
                                                {t('reviews.helpful')} ({review.helpful})
                                            </span>
                                        ) : (
                                            <button
                                                className={`review-helpful-btn ${helpfulIds.includes(review.id) ? 'active' : ''}`}
                                                onClick={() => toggleHelpful(review.id)}
                                            >
                                                <ThumbsUp size={13} />
                                                {t('reviews.helpful')} ({review.helpful})
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Reviews;
