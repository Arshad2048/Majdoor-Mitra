import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { Menu, X } from 'lucide-react';
import logo from '../../../assets/logo.png';
import './Navbar.css';

export const Navbar = () => {
    const { t, i18n } = useTranslation();
    const { user, profile, isAdmin, loading } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const location = useLocation();

    const isLoginPage = location.pathname === '/login';
    const isRegisterPage = location.pathname === '/register';
    const isLoggedIn = !!user;

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        document.documentElement.lang = lang;
        localStorage.setItem('app_language', lang);
        setLangDropdownOpen(false);
    };

    useEffect(() => {
        // Set document language on load from current i18n state
        document.documentElement.lang = i18n.language;
        
        const handleClickOutside = (event) => {
            if (langDropdownOpen && !event.target.closest('.nav-lang-container')) {
                setLangDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [langDropdownOpen, i18n.language]);

    const closeMenu = () => setMenuOpen(false);

    // Get user display info
    const userName = profile?.full_name || 'User';
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo" onClick={closeMenu}>
                    <div className="nav-logo-icon">
                        <img src={logo} alt="Majdoor Mitra Logo" />
                    </div>
                    <span className="nav-brand-text"><span className="brand-majdoor">Majdoor</span> <span className="brand-mitra">Mitra</span></span>
                </Link>

                <div className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`}>
                    <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end onClick={closeMenu}>{t('nav.home')}</NavLink>
                    <NavLink to="/about" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeMenu}>{t('nav.about')}</NavLink>
                    <NavLink to="/contact" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeMenu}>{t('nav.contact')}</NavLink>

                    {/* Mobile-only auth links */}
                    <div className="nav-mobile-auth nav-fade-in">
                        {loading ? null : isLoggedIn ? (
                            <Link to="/profile" className="nav-mobile-profile-link" onClick={closeMenu}>
                                <div className="nav-avatar-sm">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                    ) : (
                                        userInitial
                                    )}
                                </div>
                                <span>{userName}</span>
                            </Link>
                        ) : (
                            <>
                                {!isLoginPage && <Link to="/login" className="nav-login-btn" onClick={closeMenu}>{t('nav.login') || 'Login'}</Link>}
                                {!isRegisterPage && <Link to="/register" className="nav-register-btn" onClick={closeMenu}>{t('nav.register')}</Link>}
                            </>
                        )}
                    </div>
                </div>

                <div className="nav-right">
                    <div className="nav-lang-container">
                        <button className="nav-lang-toggle" onClick={() => setLangDropdownOpen(!langDropdownOpen)}>
                            {i18n.language === 'en' ? 'EN' : 'हिं'}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: langDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                        
                        {langDropdownOpen && (
                            <div className="nav-lang-dropdown">
                                <div 
                                    className={`lang-option ${i18n.language === 'en' ? 'active' : ''}`}
                                    onClick={() => changeLanguage('en')}
                                >
                                    English
                                </div>
                                <div 
                                    className={`lang-option ${i18n.language === 'hi' ? 'active' : ''}`}
                                    onClick={() => changeLanguage('hi')}
                                >
                                    हिंदी
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="nav-auth-desktop nav-fade-in">
                        {loading ? null : isLoggedIn ? (
                            <Link to="/profile" className="nav-profile-btn">
                                <div className="nav-avatar">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                    ) : (
                                        userInitial
                                    )}
                                </div>
                            </Link>
                        ) : (
                            <>
                                {!isLoginPage && <Link to="/login" className="nav-login-btn">{t('nav.login') || 'Login'}</Link>}
                                {!isRegisterPage && (
                                    <Link to="/register">
                                        <button className="nav-register-btn">{t('nav.register')}</button>
                                    </Link>
                                )}
                            </>
                        )}
                    </div>

                    <button
                        className="nav-hamburger"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {menuOpen && <div className="nav-overlay" onClick={closeMenu} />}
        </nav>
    );
};

export default Navbar;
