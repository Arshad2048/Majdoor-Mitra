import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Home, Info, Phone, Globe, Shield } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import logo from '../../../assets/logo.png';
import './MobileTopBar.css';

const MobileTopBar = () => {
    const { i18n, t } = useTranslation();
    const { isAdmin } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        document.documentElement.lang = lang;
        localStorage.setItem('app_language', lang);
        setMenuOpen(false);
    };

    const handleNavigate = (path) => {
        navigate(path);
        setMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="mobile-top-bar">
            <Link to="/" className="mtb-logo">
                <div className="mtb-logo-icon">
                    <img src={logo} alt="Majdoor Mitra" />
                </div>
                <span className="mtb-brand">
                    <span className="mtb-brand-m">Majdoor</span> <span className="mtb-brand-o">Mitra</span>
                </span>
            </Link>

            <div className="mtb-menu-container" ref={dropdownRef}>
                <button className="mtb-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
                    <Menu size={20} />
                </button>
                
                {menuOpen && (
                    <div className="mtb-dropdown">
                        <div className="mtb-dropdown-links">
                            <div className="mtb-dropdown-item" onClick={() => handleNavigate('/')}>
                                <Home size={16} />
                                <span>{t('nav.home') || 'Desktop Home'}</span>
                            </div>
                            <div className="mtb-dropdown-item" onClick={() => handleNavigate('/about')}>
                                <Info size={16} />
                                <span>{t('nav.about') || 'About Us'}</span>
                            </div>
                            <div className="mtb-dropdown-item" onClick={() => handleNavigate('/contact')}>
                                <Phone size={16} />
                                <span>{t('nav.contact') || 'Contact Us'}</span>
                            </div>
                        </div>

                        <div className="mtb-dropdown-divider"></div>

                        <div className="mtb-dropdown-lang-header">
                            <Globe size={14} />
                            <span>Language</span>
                        </div>
                        <div className="mtb-lang-slider">
                            <div 
                                className="mtb-slider-bg" 
                                style={{ transform: `translateX(${i18n.language === 'en' ? '0' : '100%'})` }}
                            ></div>
                            <button
                                className={`mtb-lang-option ${i18n.language === 'en' ? 'active' : ''}`}
                                onClick={() => changeLanguage('en')}
                            >
                                English
                            </button>
                            <button
                                className={`mtb-lang-option ${i18n.language === 'hi' ? 'active' : ''}`}
                                onClick={() => changeLanguage('hi')}
                            >
                                हिंदी
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default MobileTopBar;