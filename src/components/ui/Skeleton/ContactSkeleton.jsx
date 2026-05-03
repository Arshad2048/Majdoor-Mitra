import React from 'react';
import Skeleton from './Skeleton';
import '../../../pages/Core/shared/CoreShared.css';
import '../../../pages/Core/Contact/Contact.css';

const ContactSkeleton = () => (
    <div className="contact-page-new core-fade-in">
        {/* ─── HERO ─── */}
        <section className="core-hero" style={{ backgroundImage: 'none', backgroundColor: '#1A3B2A' }}>
            <div className="container core-hero-content">
                <Skeleton variant="rect" width="140px" height="32px" style={{ borderRadius: '20px', marginBottom: '20px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                <Skeleton variant="text" width="60%" height="3.5rem" style={{ marginBottom: '20px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                <Skeleton variant="text" width="70%" height="1.15rem" style={{ marginBottom: '10px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
                <Skeleton variant="text" width="50%" height="1.15rem" style={{ marginBottom: '36px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
                
                <div className="core-hero-stats" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="core-stat">
                        <Skeleton variant="text" width="60px" height="1.5rem" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
                        <Skeleton variant="text" width="90px" height="0.78rem" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
                    </div>
                    <div className="core-stat-divider"></div>
                    <div className="core-stat">
                        <Skeleton variant="text" width="60px" height="1.5rem" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
                        <Skeleton variant="text" width="90px" height="0.78rem" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
                    </div>
                    <div className="core-stat-divider"></div>
                    <div className="core-stat">
                        <Skeleton variant="text" width="40px" height="1.5rem" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
                        <Skeleton variant="text" width="70px" height="0.78rem" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
                    </div>
                </div>
            </div>
        </section>

        {/* ─── CONTACT INFO CARDS ─── */}
        <section className="core-section contact-info-section core-section-off">
            <div className="container">
                <div className="contact-info-grid core-grid core-grid-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="core-card contact-info-card" style={{ borderTop: i===1 ? '4px solid #38A169' : i===2 ? '4px solid #F25C05' : i===3 ? '4px solid #25D366' : '4px solid #805AD5' }}>
                            <Skeleton variant="rect" width="56px" height="56px" style={{ borderRadius: '14px', margin: '0 auto 16px' }} />
                            <Skeleton variant="text" width="80px" height="1.05rem" style={{ margin: '0 auto 10px' }} />
                            <Skeleton variant="text" width="120px" height="0.95rem" style={{ margin: '0 auto 4px' }} />
                            <Skeleton variant="text" width="100px" height="0.82rem" style={{ margin: '0 auto' }} />
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ─── CONTACT FORM + IMAGE ─── */}
        <section className="core-section contact-form-section core-section-light">
            <div className="container">
                <div className="contact-form-wrapper-new">
                    <div className="contact-form-left">
                        <div className="contact-form-image" style={{ boxShadow: 'none' }}>
                            <Skeleton variant="rect" width="100%" height="280px" style={{ borderRadius: '20px' }} />
                        </div>
                        <div className="contact-form-text">
                            <Skeleton variant="text" width="80%" height="2rem" style={{ marginBottom: '14px' }} />
                            <Skeleton variant="text" width="90%" height="0.95rem" style={{ marginBottom: '8px' }} />
                            <Skeleton variant="text" width="60%" height="0.95rem" style={{ marginBottom: '24px' }} />
                            <div className="contact-form-features">
                                <Skeleton variant="rect" width="100%" height="44px" style={{ borderRadius: '10px' }} />
                                <Skeleton variant="rect" width="100%" height="44px" style={{ borderRadius: '10px' }} />
                                <Skeleton variant="rect" width="100%" height="44px" style={{ borderRadius: '10px' }} />
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-new" style={{ border: '1px solid #E2E8F0', padding: '36px' }}>
                        <Skeleton variant="text" width="150px" height="1.3rem" style={{ marginBottom: '20px', paddingBottom: '14px', borderBottom: '2px solid transparent' }} />
                        <div className="contact-form-row" style={{ marginBottom: '16px' }}>
                            <div>
                                <Skeleton variant="text" width="70px" height="0.85rem" style={{ marginBottom: '8px' }} />
                                <Skeleton variant="rect" width="100%" height="48px" style={{ borderRadius: '8px' }} />
                            </div>
                            <div>
                                <Skeleton variant="text" width="70px" height="0.85rem" style={{ marginBottom: '8px' }} />
                                <Skeleton variant="rect" width="100%" height="48px" style={{ borderRadius: '8px' }} />
                            </div>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <Skeleton variant="text" width="70px" height="0.85rem" style={{ marginBottom: '8px' }} />
                            <Skeleton variant="rect" width="100%" height="48px" style={{ borderRadius: '8px' }} />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <Skeleton variant="text" width="70px" height="0.85rem" style={{ marginBottom: '8px' }} />
                            <Skeleton variant="rect" width="100%" height="48px" style={{ borderRadius: '8px' }} />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <Skeleton variant="text" width="70px" height="0.85rem" style={{ marginBottom: '8px' }} />
                            <Skeleton variant="rect" width="100%" height="120px" style={{ borderRadius: '8px' }} />
                        </div>
                        <Skeleton variant="rect" width="100%" height="52px" style={{ borderRadius: '8px', marginTop: '8px' }} />
                    </div>
                </div>
            </div>
        </section>

        {/* ─── FAQ / CTA SECTION ─── */}
        <section className="core-section contact-faq-section" style={{ backgroundImage: 'none', backgroundColor: '#1A3B2A' }}>
            <div className="contact-faq-overlay" style={{ background: 'none' }}></div>
            <div className="container contact-faq-content">
                <Skeleton variant="text" width="400px" height="2.3rem" style={{ margin: '0 auto 48px', maxWidth: '100%', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                <div className="contact-faq-grid core-grid core-grid-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="core-card contact-faq-item">
                            <Skeleton variant="rect" width="44px" height="44px" style={{ borderRadius: '12px', flexShrink: 0, backgroundColor: 'rgba(255,255,255,0.08)' }} />
                            <div style={{ flex: 1 }}>
                                <Skeleton variant="text" width="90%" height="1rem" style={{ marginBottom: '8px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                                <Skeleton variant="text" width="100%" height="0.88rem" style={{ marginBottom: '4px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
                                <Skeleton variant="text" width="100%" height="0.88rem" style={{ marginBottom: '4px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
                                <Skeleton variant="text" width="60%" height="0.88rem" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="contact-faq-cta" style={{ textAlign: 'center' }}>
                    <Skeleton variant="text" width="200px" height="1rem" style={{ margin: '0 auto 16px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                    <Skeleton variant="rect" width="220px" height="52px" style={{ margin: '0 auto', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
                </div>
            </div>
        </section>
    </div>
);

export default ContactSkeleton;
