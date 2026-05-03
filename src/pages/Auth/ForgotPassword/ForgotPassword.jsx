import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, CheckCircle, Mail, Loader2, AlertCircle } from 'lucide-react';
import Input from '../../../components/ui/Input/Input';
import Card from '../../../components/ui/Card/Card';
import AuthSkeleton from '../../../components/ui/Skeleton/AuthSkeleton';

import bgImg from '../../../assets/auth-bg.png';
import '../shared/AuthShared.css';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { resetPassword, loading: authLoading } = useAuth();
    
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (authLoading) return <AuthSkeleton type="forgot" />;


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!email.trim()) {
            setError(t('auth.emailRequired'));
            return;
        }

        setIsSubmitting(true);
        try {
            await resetPassword(email.trim().toLowerCase());
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Error sending password reset email.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="forgot-password-page">
            <img src={bgImg} alt="Background" className="login-bg" />
            <div className="login-container">
                <Card className="auth-card-premium forgot-password-card">
                    <button className="back-btn-new" onClick={() => navigate('/login')} aria-label="Back to login">
                        <ArrowLeft size={20} />
                    </button>
                    
                    <h1 className="auth-title">{success ? t('auth.checkInboxTitle') : t('auth.forgotPasswordTitle')}</h1>
                    <p className="auth-subtitle">
                        {success 
                            ? t('auth.checkInboxSubtitle') 
                            : t('auth.forgotPasswordSubtitle')
                        }
                    </p>

                    {error && (
                        <div className="auth-error-box">
                            <AlertCircle size={18} style={{ marginRight: '8px', flexShrink: 0 }} color="#CF1322" />
                            {error}
                        </div>
                    )}

                    {success ? (
                        <div className="success-state-new">
                            <div className="success-icon-wrapper">
                                <CheckCircle size={64} className="success-icon-new" />
                            </div>
                            <p className="success-text-new">
                                We've sent a secure reset link to <strong>{email}</strong>. 
                                Please check your inbox to continue.
                            </p>
                            <button 
                                className="btn-auth-primary"
                                onClick={() => navigate('/login')}
                                style={{ width: '100%' }}
                            >
                                {t('auth.backToLogin')}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="auth-form">
                            <Input
                                label={t('register.email')}
                                id="email"
                                type="email"
                                placeholder={t('auth.emailPlaceholder')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSubmitting}
                                icon={Mail}
                                autoComplete="email"
                                required
                            />

                            <button 
                                type="submit" 
                                className="btn-auth-primary" 
                                disabled={isSubmitting}
                                style={{ marginTop: '10px' }}
                            >
                                {isSubmitting ? (
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <Loader2 size={20} className="spin-animation" /> {t('auth.sendResetLink')}...
                                    </span>
                                ) : (
                                    t('auth.sendResetLink')
                                )}
                            </button>
                        </form>
                    )}

                    <div className="auth-switch">
                        <p>{t('login.noAccount')} <Link to="/register" style={{ color: '#F25C05' }}>{t('login.registerHere')}</Link></p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;
