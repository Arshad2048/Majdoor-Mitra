import React from 'react';
import Skeleton from './Skeleton';
import '../../../pages/Core/shared/CoreShared.css';
import '../../../pages/Core/About/About.css';

const AboutSkeleton = () => (
    <div className="about-page-new core-fade-in">
        {/* ─── HERO ─── */}
        <section className="core-hero" style={{ backgroundImage: 'none', backgroundColor: '#1A3B2A' }}>
            <div className="container core-hero-content">
                <Skeleton variant="rect" width="140px" height="32px" style={{ borderRadius: '20px', marginBottom: '20px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                <Skeleton variant="text" width="90%" height="3.5rem" style={{ marginBottom: '8px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                <Skeleton variant="text" width="60%" height="3.5rem" style={{ marginBottom: '20px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                <Skeleton variant="text" width="80%" height="1.15rem" style={{ marginBottom: '8px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
                <Skeleton variant="text" width="60%" height="1.15rem" style={{ marginBottom: '36px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
                
                <div className="core-hero-stats" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="core-stat">
                        <Skeleton variant="rect" width="32px" height="32px" style={{ borderRadius: '8px', marginBottom: '8px', backgroundColor: 'rgba(242,92,5,0.2)' }} />
                        <Skeleton variant="text" width="90px" height="0.78rem" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
                    </div>
                    <div className="core-stat-divider"></div>
                    <div className="core-stat">
                        <Skeleton variant="rect" width="32px" height="32px" style={{ borderRadius: '8px', marginBottom: '8px', backgroundColor: 'rgba(242,92,5,0.2)' }} />
                        <Skeleton variant="text" width="80px" height="0.78rem" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
                    </div>
                    <div className="core-stat-divider"></div>
                    <div className="core-stat">
                        <Skeleton variant="rect" width="32px" height="32px" style={{ borderRadius: '8px', marginBottom: '8px', backgroundColor: 'rgba(242,92,5,0.2)' }} />
                        <Skeleton variant="text" width="50px" height="0.78rem" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
                    </div>
                </div>
            </div>
        </section>

        {/* ─── MISSION / PROBLEM / SOLUTION CARDS ─── */}
        <section className="core-section about-cards-section core-section-off">
            <div className="container">
                <Skeleton variant="text" width="220px" height="2.3rem" style={{ margin: '0 auto 8px' }} />
                <Skeleton variant="text" width="380px" height="1.05rem" style={{ margin: '0 auto 48px', maxWidth: '100%' }} />
                <div className="about-cards-grid core-grid core-grid-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="about-info-card">
                            <Skeleton variant="rect" width="56px" height="56px" style={{ borderRadius: '14px', marginBottom: '20px' }} />
                            <Skeleton variant="text" width="70%" height="1.3rem" style={{ marginBottom: '12px' }} />
                            <Skeleton variant="text" width="100%" height="0.95rem" style={{ marginBottom: '6px' }} />
                            <Skeleton variant="text" width="100%" height="0.95rem" style={{ marginBottom: '6px' }} />
                            <Skeleton variant="text" width="100%" height="0.95rem" style={{ marginBottom: '6px' }} />
                            <Skeleton variant="text" width="80%" height="0.95rem" />
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ─── STORY SECTION ─── */}
        <section className="core-section about-story-section core-section-light">
            <div className="container">
                <div className="about-story-grid core-grid core-grid-2">
                    <div className="about-story-image">
                        <Skeleton variant="rect" width="100%" height="400px" style={{ borderRadius: '20px' }} />
                    </div>
                    <div className="about-story-text">
                        <Skeleton variant="text" width="100px" height="0.85rem" style={{ marginBottom: '12px' }} />
                        <Skeleton variant="text" width="90%" height="2.2rem" style={{ marginBottom: '8px' }} />
                        <Skeleton variant="text" width="60%" height="2.2rem" style={{ marginBottom: '20px' }} />
                        <Skeleton variant="text" width="100%" height="1rem" style={{ marginBottom: '8px' }} />
                        <Skeleton variant="text" width="100%" height="1rem" style={{ marginBottom: '8px' }} />
                        <Skeleton variant="text" width="100%" height="1rem" style={{ marginBottom: '8px' }} />
                        <Skeleton variant="text" width="80%" height="1rem" style={{ marginBottom: '16px' }} />
                        <Skeleton variant="text" width="100%" height="1rem" style={{ marginBottom: '8px' }} />
                        <Skeleton variant="text" width="100%" height="1rem" style={{ marginBottom: '8px' }} />
                        <Skeleton variant="text" width="60%" height="1rem" style={{ marginBottom: '24px' }} />
                        <div className="about-story-highlights">
                            <Skeleton variant="rect" width="100%" height="44px" style={{ borderRadius: '10px' }} />
                            <Skeleton variant="rect" width="100%" height="44px" style={{ borderRadius: '10px' }} />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* ─── WHY CHOOSE US ─── */}
        <section className="core-section about-why-section" style={{ backgroundImage: 'none', backgroundColor: '#1A3B2A' }}>
            <div className="about-why-overlay" style={{ background: 'none' }}></div>
            <div className="container about-why-content">
                <Skeleton variant="text" width="340px" height="2.3rem" style={{ margin: '0 auto 48px', maxWidth: '100%', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                <div className="about-why-grid core-grid core-grid-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="about-why-item">
                            <Skeleton variant="rect" width="48px" height="48px" style={{ borderRadius: '12px', flexShrink: 0, backgroundColor: 'rgba(255,255,255,0.08)' }} />
                            <div style={{ flex: 1 }}>
                                <Skeleton variant="text" width="80%" height="1.1rem" style={{ marginBottom: '8px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                                <Skeleton variant="text" width="100%" height="0.9rem" style={{ marginBottom: '6px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
                                <Skeleton variant="text" width="100%" height="0.9rem" style={{ marginBottom: '6px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
                                <Skeleton variant="text" width="70%" height="0.9rem" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="core-section about-cta-section" style={{ backgroundImage: 'none', backgroundColor: '#132D20' }}>
            <div className="about-cta-overlay" style={{ background: 'none' }}></div>
            <div className="container">
                <div className="about-cta-content" style={{ position: 'relative', zIndex: 2 }}>
                    <Skeleton variant="text" width="80%" height="2.5rem" style={{ margin: '0 auto 16px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                    <Skeleton variant="text" width="90%" height="1.1rem" style={{ margin: '0 auto 8px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
                    <Skeleton variant="text" width="70%" height="1.1rem" style={{ margin: '0 auto 36px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
                    <div className="about-cta-btns core-btn-group">
                        <Skeleton variant="rect" width="160px" height="50px" style={{ borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                        <Skeleton variant="rect" width="140px" height="50px" style={{ borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
                    </div>
                </div>
            </div>
        </section>
    </div>
);

export default AboutSkeleton;
