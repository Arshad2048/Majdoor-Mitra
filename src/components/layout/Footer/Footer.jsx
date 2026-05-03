import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import footerBg from '../../../assets/shared-dark-bg.png';
import './sharedFooter.css';
import './deskFooter.css';
import './mobileFooter.css';

const Footer = ({ hasBottomNav }) => {
    const { t } = useTranslation();
    const [expandedSection, setExpandedSection] = useState(null);

    const toggleSection = (section) => {
        if (window.innerWidth > 768) return;
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <footer className={`footer ${hasBottomNav ? 'has-mobile-nav' : ''}`}>
            {/* Background image + overlay */}
            <img src={footerBg} alt="" className="footer-bg-img" />
            <div className="footer-overlay"></div>

            {/* Main footer content */}
            <div className="footer-main">
                <div className="container footer-container">

                    <div className="footer-brand">
                        <div className="footer-brand-header">
                            <h3>Majdoor <span>Mitra</span></h3>
                            <div className="footer-contact-row-mobile">
                                <a href="tel:+919876543210" title="Call Us"><Phone size={18} /></a>
                                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=info@majdoormitra.com" target="_blank" rel="noopener noreferrer" title="Email Us in Gmail"><Mail size={18} /></a>
                            </div>
                        </div>
                        <p className="footer-brand-tagline">{t('footer.tagline')}</p>
                        
                        <div className="footer-contact-info">
                            <div className="footer-contact-item">
                                <Phone size={16} />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="footer-contact-item">
                                <Mail size={16} />
                                <span>info@majdoormitra.com</span>
                            </div>
                        </div>
                    </div>

                    <div className="footer-links-container">
                        <div className={`footer-links ${expandedSection === 'quick' ? 'is-expanded' : ''}`}>
                            <h4 onClick={() => toggleSection('quick')}>
                                {t('footer.quickLinksShort') || 'Links'}
                                <span className="mobile-chevron">
                                    {expandedSection === 'quick' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </span>
                            </h4>
                            <div className="footer-link-group">
                                <Link to="/">{t('nav.home')}</Link>
                                <Link to="/about">{t('nav.about')}</Link>
                                <Link to="/contact">{t('nav.contact')}</Link>
                            </div>
                        </div>

                        <div className={`footer-links ${expandedSection === 'legal' ? 'is-expanded' : ''}`}>
                            <h4 onClick={() => toggleSection('legal')}>
                                {t('footer.legal')}
                                <span className="mobile-chevron">
                                    {expandedSection === 'legal' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </span>
                            </h4>
                            <div className="footer-link-group">
                                <Link to="/terms">{t('footer.terms')}</Link>
                                <Link to="/privacy">{t('footer.privacy')}</Link>
                            </div>
                        </div>

                        <div className={`footer-links footer-cta-col ${expandedSection === 'getStarted' ? 'is-expanded' : ''}`}>
                            <h4 onClick={() => toggleSection('getStarted')}>
                                {t('footer.start') || 'Start'}
                                <span className="mobile-chevron">
                                    {expandedSection === 'getStarted' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </span>
                            </h4>
                            <div className="footer-link-group">
                                <Link to="/register" className="footer-cta-link">
                                    {t('footer.register')} <ArrowRight size={14} />
                                </Link>
                                <Link to="/login" className="footer-cta-link">
                                    {t('footer.login')} <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom bar */}
            <div className="footer-bottom">
                <div className="container footer-bottom-inner">
                    <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
                    <p className="footer-tagline-small">{t('footer.empowering')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
