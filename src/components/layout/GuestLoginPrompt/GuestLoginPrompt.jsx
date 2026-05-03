import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';
import './GuestLoginPrompt.css';

const GuestLoginPrompt = ({ title, message, onLoginClick }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="mobile-login-prompt">
            <div className="mlp-content">
                <div className="mlp-icon-container">
                    <ShieldCheck size={48} className="mlp-icon-svg" />
                </div>
                <div className="mlp-text">
                    <span className="mlp-text-title">{title || t('auth.welcomeGuest')}</span>
                    <p>{message || t('auth.guestMessage')}</p>
                </div>
            </div>
            <button className="mlp-btn" onClick={onLoginClick || (() => navigate('/login'))}>
                {t('auth.login')}
            </button>
        </div>
    );
};

export default GuestLoginPrompt;
