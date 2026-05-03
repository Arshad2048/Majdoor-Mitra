import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { Home, Search, User } from 'lucide-react';
import './MobileBottomNav.css';

const MobileBottomNav = () => {
    const { t } = useTranslation();
    const { profile, loading } = useAuth();
    const location = useLocation();

    // Do not show on certain auth related utility pages or full-screen forms
    const hideOnRoutes = [
        '/forgot-password', 
        '/update-password', 
        '/create-post',
    ];
    
    // Check for exact matches or dynamic edit routes
    const shouldHide = hideOnRoutes.includes(location.pathname) || location.pathname.startsWith('/edit-post/');

    if (shouldHide || loading) return null;

    return (
        <nav className="mobile-bottom-nav">
            <NavLink 
                to="/posts" 
                className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
            >
                <div className="bottom-nav-icon-wrapper">
                    <Home size={20} className="bottom-nav-icon" />
                </div>
                <span className="bottom-nav-label">{t('nav.home') || 'Home'}</span>
            </NavLink>

            <NavLink 
                to="/search" 
                className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
            >
                <div className="bottom-nav-icon-wrapper">
                    <Search size={20} className="bottom-nav-icon" />
                </div>
                <span className="bottom-nav-label">{t('posts.search')}</span>
            </NavLink>

            <NavLink 
                to="/profile" 
                className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
            >
                <div className="bottom-nav-icon-wrapper">
                    <User size={20} className="bottom-nav-icon" />
                </div>
                <span className="bottom-nav-label">{t('nav.profile') === 'nav.profile' ? 'Profile' : t('nav.profile')}</span>
            </NavLink>
        </nav>
    );
};

export default MobileBottomNav;