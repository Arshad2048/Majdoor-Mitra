import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../../../components/ui/Card/Card';
import { Briefcase, ShieldCheck, MapPin, Handshake, Star, UserCircle, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import heroMainBg from '../../../assets/hero-main-bg.png';
import featureStoryBg from '../../../assets/feature-story-bg.png';
import testimonialsBg from '../../../assets/testimonials-bg.png';

import './Home.css';

import HomeSkeleton from '../../../components/ui/Skeleton/HomeSkeleton';

const Home = () => {
    const { t } = useTranslation();
    const { user, loading: authLoading } = useAuth();
    
    // Testimonial slider logic
    const testimonials = t('testimonials.list', { returnObjects: true }) || [];
    
    // Clone first and last for infinite loop: [Last, 1, 2, 3, 4, First]
    const extendedTestimonials = testimonials.length > 0 
        ? [testimonials[testimonials.length - 1], ...testimonials, testimonials[0]] 
        : [];
        
    const [activeIndex, setActiveIndex] = React.useState(1);
    const [isTransitioning, setIsTransitioning] = React.useState(true);

    const handleTransitionEnd = () => {
        if (activeIndex === 0) {
            setIsTransitioning(false);
            setActiveIndex(testimonials.length);
        } else if (activeIndex === extendedTestimonials.length - 1) {
            setIsTransitioning(false);
            setActiveIndex(1);
        }
    };

    React.useEffect(() => {
        if (!isTransitioning) {
            const timeout = setTimeout(() => setIsTransitioning(true), 50);
            return () => clearTimeout(timeout);
        }
    }, [isTransitioning]);

    React.useEffect(() => {
        if (testimonials.length <= 1) return;
        
        const interval = setInterval(() => {
            setActiveIndex((prev) => prev + 1);
        }, 3000);

        return () => clearInterval(interval);
    }, [testimonials.length]);

    if (authLoading) return <HomeSkeleton />;

    return (
        <div className="home-page core-fade-in">

            {/* ─── HERO SECTION ─── */}
            <section className="hero-section">
                <img src={heroMainBg} alt="Indian workers" className="hero-bg-img" />
                <div className="hero-overlay"></div>
                <div className="container hero-content-wrapper">
                    <div className="hero-text-content">
                        <h1 className="hero-heading">
                            {t('hero.title1')}<br />{t('hero.title2')}
                        </h1>
                        <p className="hero-para">
                            {t('hero.subtitle')}
                        </p>
                        <div className="hero-btns">
                            <Link to={user ? "/posts" : "/login"}>
                                <button className="core-btn core-btn-hero core-btn-primary">{t('hero.hireWorkers')}</button>
                            </Link>
                            <Link to="/register">
                                <button className="core-btn core-btn-hero core-btn-secondary">{t('hero.registerWorker')}</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── ABOUT SECTION ─── */}
            <section className="about-section">
                <img src={featureStoryBg} alt="About Majdoor Mitra" className="about-bg-img" />
                <div className="about-overlay"></div>
                <div className="container about-content-wrapper">
                    <div className="about-text-content">
                        <span className="about-label">{t('about.label')}<strong>{t('about.labelBold')}</strong></span>
                        <h2 className="about-heading">{t('about.title1')}<br />{t('about.title2')}</h2>
                        <p className="about-para">
                            {t('about.desc')}
                        </p>
                        <Link to="/about">
                            <button className="core-btn core-btn-std core-btn-primary">{t('about.btn')}</button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── OUR SERVICES ─── */}
            <section className="services-section core-section core-section-off">
                <div className="container">
                    <h2 className="core-section-title">{t('services.title')}</h2>
                    <p className="core-section-desc">{t('services.subtitle')}</p>
                    <div className="services-grid core-grid core-grid-4">
                        <Card className="service-card" hoverable>
                            <div className="service-card-header">
                                <div className="service-icon icon-blue">
                                    <Briefcase size={28} />
                                </div>
                                <div className="service-title-wrap">
                                    <h3>{t('services.s1Title1')}<br />{t('services.s1Title2')}</h3>
                                </div>
                            </div>
                            <p>{t('services.s1Desc')}</p>
                        </Card>

                        <Card className="service-card" hoverable>
                            <div className="service-card-header">
                                <div className="service-icon icon-green">
                                    <ShieldCheck size={28} />
                                </div>
                                <div className="service-title-wrap">
                                    <h3>{t('services.s2Title1')}<br />{t('services.s2Title2')}</h3>
                                </div>
                            </div>
                            <p>{t('services.s2Desc')}</p>
                        </Card>

                        <Card className="service-card" hoverable>
                            <div className="service-card-header">
                                <div className="service-icon icon-teal">
                                    <MapPin size={28} />
                                </div>
                                <div className="service-title-wrap">
                                    <h3>{t('services.s3Title1')}<br />{t('services.s3Title2')}</h3>
                                </div>
                            </div>
                            <p>{t('services.s3Desc')}</p>
                        </Card>

                        <Card className="service-card" hoverable>
                            <div className="service-card-header">
                                <div className="service-icon icon-orange">
                                    <Handshake size={28} />
                                </div>
                                <div className="service-title-wrap">
                                    <h3>{t('services.s4Title1')}<br />{t('services.s4Title2')}</h3>
                                </div>
                            </div>
                            <p>{t('services.s4Desc')}</p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* ─── TESTIMONIALS SLIDER ─── */}
            <section className="testimonials-section core-section core-section-off">
                <img src={testimonialsBg} alt="" className="testi-bg-img" />
                <div className="testi-overlay"></div>
                <div className="container testi-content">
                    <h2 className="core-section-title">{t('testimonials.title')}</h2>
                </div>

                <div className="testi-slider-container">
                    <div className="testi-slider-viewport">
                        <div 
                            className="testi-slider-track"
                            onTransitionEnd={handleTransitionEnd}
                            style={{ 
                                transform: `translateX(calc(-100% * ${activeIndex} - 48px * ${activeIndex}))`,
                                transition: isTransitioning ? 'transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)' : 'none'
                            }}
                        >
                            {extendedTestimonials.map((testi, idx) => (
                                <div 
                                    className={`testi-single-card ${idx === activeIndex ? 'active' : ''}`} 
                                    key={idx}
                                >
                                    <div className="testi-card-header">
                                        <div className="testi-avatar">
                                            <UserCircle size={48} />
                                        </div>
                                        <div className="testi-user-info">
                                            <h4 className="testi-name">{testi.name}</h4>
                                            <p className="testi-role">{testi.role}</p>
                                            <div className="testi-stars">
                                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="#F25C05" color="#F25C05" />)}
                                            </div>
                                        </div>
                                        <div className="testi-quote-icon">
                                            <Quote size={32} />
                                        </div>
                                    </div>
                                    <div className="testi-card-body">
                                        <p className="testi-quote">
                                            "{testi.quote}"
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="container testi-content">
                    {/* Static indicator dots */}
                    <div className="testi-dots">
                        {testimonials.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`testi-dot ${idx === (activeIndex === 0 ? testimonials.length - 1 : (activeIndex === extendedTestimonials.length - 1 ? 0 : activeIndex - 1)) ? 'active' : ''}`}
                                onClick={() => setActiveIndex(idx + 1)}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
