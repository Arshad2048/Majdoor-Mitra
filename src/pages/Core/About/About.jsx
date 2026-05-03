import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Target, AlertTriangle, Lightbulb, Users, Handshake, ShieldCheck, ArrowRight, TrendingUp, Heart, Globe, Briefcase } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

import AboutSkeleton from '../../../components/ui/Skeleton/AboutSkeleton';

import aboutHero from '../../../assets/about-hero.png';
import featureStoryBg from '../../../assets/feature-story-bg.png';
import sharedDarkBg from '../../../assets/shared-dark-bg.png';
import heroMainBg from '../../../assets/hero-main-bg.png';
import '../shared/CoreShared.css';
import './About.css';


const About = () => {
    const { t } = useTranslation();
    const { loading: authLoading } = useAuth();

    if (authLoading) return <AboutSkeleton />;

    return (
        <div className="about-page-new core-fade-in">

            {/* ─── HERO ─── */}
            <section className="core-hero">
                <img src={aboutHero} alt="About MajdoorMitra" className="core-hero-img" />
                <div className="core-hero-overlay"></div>
                <div className="container core-hero-content">
                    <span className="core-hero-badge">{t('aboutPage.heroBadge')}</span>
                    <h1 className="core-hero-title">{t('aboutPage.heroTitle1')}<br /><span>{t('aboutPage.heroTitle2')}</span></h1>
                    <p className="core-hero-subtitle">{t('aboutPage.heroSubtitle')}</p>
                    <div className="core-hero-stats">
                        <div className="core-stat">

                            <div className="core-stat-icon" style={{ color: 'var(--brand-secondary)', marginBottom: '4px' }}><Users size={28} /></div>
                            <span className="core-stat-label">{t('aboutPage.directProfiles')}</span>
                        </div>
                        <div className="core-stat-divider"></div>
                        <div className="core-stat">
                            <div className="core-stat-icon" style={{ color: 'var(--brand-secondary)', marginBottom: '4px' }}><Briefcase size={28} /></div>
                            <span className="core-stat-label">{t('aboutPage.heroStat2')}</span>
                        </div>
                        <div className="core-stat-divider"></div>
                        <div className="core-stat">
                            <div className="core-stat-icon" style={{ color: 'var(--brand-secondary)', marginBottom: '4px' }}><Globe size={28} /></div>
                            <span className="core-stat-label">{t('aboutPage.heroStat3')}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── MISSION / PROBLEM / SOLUTION CARDS ─── */}
            <section className="core-section about-cards-section core-section-off">
                <div className="container">
                    <h2 className="core-section-title">{t('aboutPage.whatDrives')}</h2>
                    <p className="core-section-desc">{t('aboutPage.whatDrivesDesc')}</p>
                    <div className="about-cards-grid">
                        <div className="core-card about-info-card card-mission">
                            <div className="about-info-icon icon-mission"><Target size={28} /></div>
                            <h3>{t('aboutPage.ourMission')}</h3>
                            <p>{t('aboutPage.missionDesc')}</p>
                        </div>
                        <div className="core-card about-info-card card-problem">
                            <div className="about-info-icon icon-problem"><AlertTriangle size={28} /></div>
                            <h3>{t('aboutPage.theProblem')}</h3>
                            <p>{t('aboutPage.problemDesc')}</p>
                        </div>
                        <div className="core-card about-info-card card-solution">
                            <div className="about-info-icon icon-solution"><Lightbulb size={28} /></div>
                            <h3>{t('aboutPage.ourSolution')}</h3>
                            <p>{t('aboutPage.solutionDesc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── STORY SECTION ─── */}
            <section className="core-section about-story-section core-section-light">
                <div className="container">
                    <div className="about-story-grid">
                        <div className="about-story-image">
                            <img src={featureStoryBg} alt="Workers using MajdoorMitra app" />
                        </div>
                        <div className="about-story-text">
                            <span className="about-story-label">{t('aboutPage.ourStory')}</span>
                            <h2>{t('aboutPage.storyTitle1')}<span>{t('aboutPage.storyTitle2')}</span></h2>
                            <p>{t('aboutPage.storyP1')}</p>
                            <p>{t('aboutPage.storyP2')}</p>
                            <div className="about-story-highlights">
                                <div className="about-story-highlight">
                                    <TrendingUp size={20} />
                                    <span>{t('aboutPage.fasterMatching')}</span>
                                </div>
                                <div className="about-story-highlight">
                                    <Heart size={20} />
                                    <span>{t('aboutPage.zeroMiddleman')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── WHY CHOOSE US ─── */}
            <section className="core-section about-why-section">
                <img src={sharedDarkBg} alt="" className="about-why-bg" />
                <div className="about-why-overlay"></div>
                <div className="container about-why-content">
                    <h2 className="core-section-title about-why-title">{t('aboutPage.whyChoose')}</h2>
                    <div className="core-grid core-grid-3 about-why-grid">
                        <div className="about-why-item">
                            <div className="about-why-icon"><Users size={24} /></div>
                            <div>
                                <h4>{t('aboutPage.trustworthyProfiles')}</h4>
                                <p>{t('aboutPage.trustworthyDesc')}</p>
                            </div>
                        </div>
                        <div className="about-why-item">
                            <div className="about-why-icon"><Handshake size={24} /></div>
                            <div>
                                <h4>{t('aboutPage.fairWages')}</h4>
                                <p>{t('aboutPage.fairWagesDesc')}</p>
                            </div>
                        </div>
                        <div className="about-why-item">
                            <div className="about-why-icon"><ShieldCheck size={24} /></div>
                            <div>
                                <h4>{t('aboutPage.trustSafety')}</h4>
                                <p>{t('aboutPage.trustSafetyDesc')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section className="core-section about-cta-section">
                <img src={heroMainBg} alt="" className="about-cta-bg" />
                <div className="about-cta-overlay"></div>
                <div className="container">
                    <div className="about-cta-content">
                        <h2>{t('aboutPage.ctaTitle1')}<span>{t('aboutPage.ctaTitle2')}</span>?</h2>
                        <p>{t('aboutPage.ctaDesc')}</p>
                        <div className="about-cta-btns core-btn-group">
                            <Link to="/register">
                                <button className="core-btn core-btn-std core-btn-secondary">{t('aboutPage.getStarted')} <ArrowRight size={18} /></button>
                            </Link>
                            <Link to="/contact">
                                <button className="core-btn core-btn-std core-btn-outline">{t('aboutPage.contactUs')}</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default About;
