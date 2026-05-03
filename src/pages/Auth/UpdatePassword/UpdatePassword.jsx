import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../supabaseClient';
import Card from '../../../components/ui/Card/Card';
import Input from '../../../components/ui/Input/Input';
import PasswordStrength from '../../../components/ui/PasswordStrength/PasswordStrength';
import AuthSkeleton from '../../../components/ui/Skeleton/AuthSkeleton';

import bgImg from '../../../assets/auth-bg.png';
import '../shared/AuthShared.css';
import './UpdatePassword.css';


const UpdatePassword = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { updatePassword, loading: authLoading } = useAuth();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCapsLockOn, setIsCapsLockOn] = useState(false);
    const [success, setSuccess] = useState(false);
    const [passwordSecurity, setPasswordSecurity] = useState({ level: 0, isSecure: false });
    const [error, setError] = useState('');
    const [isValidSession, setIsValidSession] = useState(false);

    useEffect(() => {
        // Listen for the PASSWORD_RECOVERY event which fires when
        // Supabase exchanges the reset token from the URL for a session
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
                    setIsValidSession(true);
                    setError('');
                }
            }
        );

        // Also check if a session already exists (user may have been redirected via implicit flow)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setIsValidSession(true);
                setError('');
            }
        });

        // Give the PKCE exchange 5 seconds to complete, then show error
        const timeout = setTimeout(() => {
            if (!isValidSession) {
                supabase.auth.getSession().then(({ data: { session } }) => {
                    if (!session) {
                        setError(t('auth.invalidResetLink'));
                    } else {
                        setIsValidSession(true);
                    }
                });
            }
        }, 5000);

        return () => {
            subscription.unsubscribe();
            clearTimeout(timeout);
        };
    }, [t]);

    const handlePasswordStrengthChange = useCallback((security) => {
        setPasswordSecurity(security);
    }, []);

    const handleKeyUp = (e) => {
        if (e.getModifierState('CapsLock')) {
            setIsCapsLockOn(true);
        } else {
            setIsCapsLockOn(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!passwordSecurity.isSecure) {
            setError(t('auth.passwordTooWeak'));
            return;
        }

        if (password !== confirmPassword) {
            setError(t('auth.passwordsMatch'));
            return;
        }

        setIsSubmitting(true);
        try {
            await updatePassword(password);
            setSuccess(true);
        } catch (err) {
            setError(err.message || t('auth.errorUpdatingPassword'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) return <AuthSkeleton type="update" />;


    return (
        <div className="update-password-page">
            <img src={bgImg} alt="Background" className="login-bg" />
            <div className="login-container">
                <Card className="auth-card-premium update-password-card">
                    <h1 className="auth-title">{success ? t('auth.updateSuccessTitle') : t('auth.newPasswordTitle')}</h1>
                    <p className="auth-subtitle">
                        {success 
                            ? t('auth.updateSuccessSubtitle') 
                            : t('auth.newPasswordSubtitle')
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
                            <div className="success-icon-wrapper" style={{ marginBottom: '24px', textAlign: 'center' }}>
                                <div style={{
                                    width: '80px', height: '80px', borderRadius: '50%',
                                    background: 'rgba(242, 92, 5, 0.15)', margin: '0 auto',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '2px solid rgba(242, 92, 5, 0.3)'
                                }}>
                                    <CheckCircle size={40} style={{ color: '#F25C05' }} />
                                </div>
                            </div>
                            <p className="success-text-new" style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', marginBottom: '32px', lineHeight: 1.6 }}>
                                {t('auth.updateSuccessSubtitle')} {t('auth.loginWithNewPassword')}
                            </p>
                            <button 
                                className="btn-auth-primary"
                                onClick={() => navigate('/login')}
                                style={{ width: '100%' }}
                            >
                                {t('auth.logInNow')}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="auth-form">
                            <div style={{ marginBottom: '20px' }}>
                                <Input
                                    label={t('register.password')}
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t('auth.enterNewPassword')}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyUp={handleKeyUp}
                                    autoComplete="new-password"
                                    disabled={isSubmitting || !isValidSession}
                                    required
                                    icon={<Lock size={18} />}
                                    action={
                                        <button 
                                            type="button" 
                                            className="password-toggle-btn" 
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isSubmitting}
                                            style={{ background: 'none', border: 'none', padding: '0 10px', display: 'flex', alignItems: 'center' }}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    }
                                />
                                
                                {isCapsLockOn && (
                                    <div className="caps-lock-warning" style={{ marginTop: '5px', paddingLeft: '44px' }}>
                                        <AlertCircle size={12} /> {t('validation.capsLock')}
                                    </div>
                                )}

                                <PasswordStrength 
                                    password={password} 
                                    onStrengthChange={handlePasswordStrengthChange} 
                                />
                            </div>

                            <Input
                                label={t('auth.confirmPassword')}
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder={t('auth.confirmNewPassword')}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                                disabled={isSubmitting}
                                required
                                icon={<Lock size={18} />}
                            />

                            <button 
                                type="submit" 
                                className="btn-auth-primary" 
                                disabled={isSubmitting || !isValidSession}
                                style={{ marginTop: '10px' }}
                            >
                                {isSubmitting ? (
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <Loader2 size={20} className="spin-animation" /> {t('common.loading')}
                                    </span>
                                ) : (
                                    t('auth.updatePasswordBtn')
                                )}
                            </button>
                        </form>
                    )}

                    {!success && (
                        <div className="auth-switch">
                            <p><Link to="/login" style={{ color: '#F25C05' }}>{t('auth.backToLogin')}</Link></p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default UpdatePassword;