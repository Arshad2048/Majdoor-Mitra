import React from 'react';
import Skeleton from './Skeleton';

const ReviewSkeleton = () => (
    <div className="reviews-page-new" style={{ pointerEvents: 'none' }}>
        <div className="reviews-wrapper">
            {/* Hero Header Skeleton */}
            <div className="reviews-hero" style={{ background: '#f8fafc', overflow: 'hidden' }}>
                <div className="reviews-hero-content">
                    <div style={{ padding: '10px', borderRadius: '14px', background: '#fff', width: '40px', height: '40px', marginBottom: '16px' }}>
                        <Skeleton variant="circle" width="100%" height="100%" />
                    </div>
                    <Skeleton variant="text" width="120px" height="1.2rem" />
                    
                    <div className="reviews-score-card" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'none', border: '1px solid #E2E8F0' }}>
                        <Skeleton variant="text" width="60px" height="3rem" />
                        <div className="reviews-score-detail">
                            <div className="reviews-stars-row">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Skeleton key={i} variant="circle" width="20px" height="20px" />
                                ))}
                            </div>
                            <Skeleton variant="text" width="140px" height="1rem" style={{ marginTop: '8px' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Breakdown Skeleton */}
            <div className="reviews-breakdown">
                <Skeleton variant="text" width="180px" height="1.4rem" style={{ marginBottom: '24px' }} />
                {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="breakdown-row" style={{ marginBottom: '12px' }}>
                        <Skeleton variant="text" width="30px" height="1rem" />
                        <div className="breakdown-bar-track" style={{ background: '#F1F5F9' }}>
                            <Skeleton variant="rect" width={`${star * 15}%`} height="100%" style={{ borderRadius: '10px', backgroundColor: '#E2E8F0' }} />
                        </div>
                        <Skeleton variant="text" width="20px" height="1rem" />
                    </div>
                ))}
            </div>

            {/* Section Header */}
            <div className="reviews-section" style={{ marginTop: '32px' }}>
                <div className="reviews-section-header" style={{ marginBottom: '20px' }}>
                    <Skeleton variant="text" width="110px" height="1.4rem" />
                    <Skeleton variant="rect" width="80px" height="24px" style={{ borderRadius: '12px' }} />
                </div>

                <div className="reviews-card-list">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="review-card-new" style={{ padding: '24px' }}>
                            <div className="review-card-top" style={{ display: 'flex', gap: '16px' }}>
                                <Skeleton variant="circle" width="48px" height="48px" />
                                <div className="review-card-info" style={{ flex: 1 }}>
                                    <Skeleton variant="text" width="120px" height="1.2rem" style={{ marginBottom: '6px' }} />
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <Skeleton variant="text" width="60px" height="0.8rem" />
                                        <Skeleton variant="text" width="70px" height="0.8rem" />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Skeleton key={s} variant="circle" width="14px" height="14px" />
                                    ))}
                                </div>
                            </div>
                            <div style={{ marginTop: '16px' }}>
                                <Skeleton variant="text" width="100%" height="1rem" style={{ marginBottom: '8px' }} />
                                <Skeleton variant="text" width="90%" height="1rem" style={{ marginBottom: '8px' }} />
                                <Skeleton variant="text" width="40%" height="1rem" />
                            </div>
                            <div className="review-card-footer" style={{ borderTop: '1px solid #F1F5F9', marginTop: '20px', paddingTop: '16px' }}>
                                <Skeleton variant="rect" width="100px" height="24px" style={{ borderRadius: '6px' }} />
                                <Skeleton variant="rect" width="80px" height="24px" style={{ borderRadius: '6px' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default ReviewSkeleton;
