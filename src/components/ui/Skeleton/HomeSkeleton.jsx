import React from 'react';
import Skeleton from './Skeleton';
import Card from '../Card/Card';
import '../../../pages/Core/shared/CoreShared.css';
import '../../../pages/Core/Home/Home.css';

const HomeSkeleton = () => (
    <div className="home-page">
        {/* ─── HERO SECTION ─── */}
        <section className="hero-section" style={{ backgroundImage: 'none', backgroundColor: '#F0F2F5' }}>
            <div className="hero-overlay" style={{ background: 'linear-gradient(to right, rgba(240,242,245,1) 0%, rgba(240,242,245,0.95) 40%, rgba(240,242,245,0.4) 100%)' }}></div>
            <div className="container hero-content-wrapper">
                <div className="hero-text-content">
                    <Skeleton variant="text" width="100%" height="3.75rem" style={{ marginBottom: '8px' }} />
                    <Skeleton variant="text" width="80%" height="3.75rem" style={{ marginBottom: '8px' }} />
                    <Skeleton variant="text" width="60%" height="3.75rem" style={{ marginBottom: '24px' }} />
                    <Skeleton variant="text" width="90%" height="1.25rem" style={{ marginBottom: '8px' }} />
                    <Skeleton variant="text" width="70%" height="1.25rem" style={{ marginBottom: '40px' }} />
                    <div className="hero-btns">
                        <div className="core-btn core-btn-hero core-btn-primary" style={{ opacity: 0.6, pointerEvents: 'none', padding: '16px 32px' }}>
                            <Skeleton variant="text" width="100px" height="1.05rem" style={{ margin: 0, backgroundColor: 'rgba(255,255,255,0.3)' }} />
                        </div>
                        <div className="core-btn core-btn-hero core-btn-secondary" style={{ opacity: 0.6, pointerEvents: 'none', padding: '16px 32px' }}>
                            <Skeleton variant="text" width="140px" height="1.05rem" style={{ margin: 0, backgroundColor: 'rgba(255,255,255,0.3)' }} />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* ─── ABOUT SECTION ─── */}
        <section className="about-section core-section core-section-white" style={{ backgroundImage: 'none', backgroundColor: '#fff' }}>
            <div className="about-overlay" style={{ background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 40%, rgba(255,255,255,0.4) 100%)' }}></div>
            <div className="container about-content-wrapper">
                <div className="about-text-content">
                    <Skeleton variant="text" width="180px" height="1.15rem" style={{ marginBottom: '16px', backgroundColor: '#F25C05', opacity: 0.2 }} />
                    <Skeleton variant="text" width="100%" height="2.75rem" style={{ marginBottom: '8px' }} />
                    <Skeleton variant="text" width="75%" height="2.75rem" style={{ marginBottom: '32px' }} />
                    <Skeleton variant="text" width="100%" height="1.1rem" style={{ marginBottom: '10px' }} />
                    <Skeleton variant="text" width="100%" height="1.1rem" style={{ marginBottom: '10px' }} />
                    <Skeleton variant="text" width="100%" height="1.1rem" style={{ marginBottom: '10px' }} />
                    <Skeleton variant="text" width="60%" height="1.1rem" style={{ marginBottom: '40px' }} />
                    <div className="core-btn core-btn-hero core-btn-primary" style={{ opacity: 0.6, pointerEvents: 'none', display: 'inline-block', padding: '16px 32px' }}>
                        <Skeleton variant="text" width="90px" height="1.05rem" style={{ margin: 0, backgroundColor: 'rgba(255,255,255,0.3)' }} />
                    </div>
                </div>
            </div>
        </section>

        {/* ─── OUR SERVICES ─── */}
        <section className="services-section core-section core-section-off">
            <div className="container">
                <Skeleton variant="text" width="220px" height="2.5rem" style={{ margin: '0 auto 8px' }} />
                <Skeleton variant="text" width="380px" height="1.15rem" style={{ margin: '0 auto 56px', maxWidth: '100%' }} />
                <div className="services-grid core-grid core-grid-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="service-card" style={{ background: '#fff' }}>
                            <div className="service-card-header">
                                <Skeleton variant="rect" width="48px" height="48px" style={{ borderRadius: '12px', flexShrink: 0, backgroundColor: i===1 ? 'rgba(49, 130, 206, 0.1)' : i===2 ? 'rgba(56, 161, 105, 0.1)' : i===3 ? 'rgba(49, 151, 149, 0.1)' : 'rgba(221, 107, 32, 0.1)' }} />
                                <div className="service-title-wrap" style={{ flex: 1 }}>
                                    <Skeleton variant="text" width="90%" height="1.15rem" style={{ marginBottom: '4px' }} />
                                    <Skeleton variant="text" width="60%" height="1.15rem" />
                                </div>
                            </div>
                            <Skeleton variant="text" width="100%" height="0.95rem" style={{ marginBottom: '6px' }} />
                            <Skeleton variant="text" width="100%" height="0.95rem" style={{ marginBottom: '6px' }} />
                            <Skeleton variant="text" width="70%" height="0.95rem" />
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ─── TESTIMONIALS SECTION ─── */}
        <section className="testimonials-section core-section core-section-off" style={{ backgroundImage: 'none', backgroundColor: '#E8ECE5' }}>
            <div className="testi-overlay" style={{ background: 'linear-gradient(to bottom, rgba(240,242,240,0.85) 0%, rgba(240,242,240,0.4) 35%, rgba(240,242,240,0.45) 100%)' }}></div>
            <div className="container testi-content">
                <Skeleton variant="text" width="280px" height="2.5rem" style={{ margin: '0 auto' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', paddingBottom: '40px', width: '100%' }}>
                <div className="testi-single-card active" style={{ maxWidth: '760px', width: '90%', transform: 'none', opacity: 1, filter: 'none', borderTop: '5px solid #F25C05' }}>
                    <div className="testi-card-header">
                        <Skeleton variant="rect" width="56px" height="56px" style={{ borderRadius: '16px', flexShrink: 0, backgroundColor: 'rgba(242, 92, 5, 0.05)', border: '2px solid rgba(242, 92, 5, 0.2)' }} />
                        <div className="testi-user-info" style={{ flex: 1 }}>
                            <Skeleton variant="text" width="120px" height="1.15rem" style={{ marginBottom: '4px' }} />
                            <Skeleton variant="text" width="100px" height="0.85rem" style={{ marginBottom: '6px' }} />
                            <div style={{ display: 'flex', gap: '2px' }}>
                                {[1,2,3,4,5].map(s => <Skeleton key={s} variant="rect" width="14px" height="14px" style={{ borderRadius: '2px', backgroundColor: '#F25C05', opacity: 0.3 }} />)}
                            </div>
                        </div>
                    </div>
                    <div className="testi-card-body">
                        <Skeleton variant="text" width="100%" height="1.1rem" style={{ marginBottom: '8px' }} />
                        <Skeleton variant="text" width="100%" height="1.1rem" style={{ marginBottom: '8px' }} />
                        <Skeleton variant="text" width="60%" height="1.1rem" />
                    </div>
                </div>
            </div>
        </section>
    </div>
);

export default HomeSkeleton;
