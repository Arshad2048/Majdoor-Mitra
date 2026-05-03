import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import Input from '../../../components/ui/Input/Input';
import Card from '../../../components/ui/Card/Card';
import { Eye, EyeOff, Loader2, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import AuthSkeleton from '../../../components/ui/Skeleton/AuthSkeleton';

import bgImg from '../../../assets/auth-bg.png';
import '../shared/AuthShared.css';
import './Login.css';


const Login = () => {
    const { t } = useTranslation();
    const { login, loading: authLoading } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isCapsLockOn, setIsCapsLockOn] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        const savedEmail = localStorage.getItem('remembered_email');
        if (savedEmail) {
            setFormData(prev => ({ ...prev, email: savedEmail }));
            setRememberMe(true);
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setError('');
        if (fieldErrors[e.target.id]) {
            setFieldErrors(prev => ({ ...prev, [e.target.id]: '' }));
        }
    };

    const handleKeyUp = (e) => {
        if (e.getModifierState('CapsLock')) {
            setIsCapsLockOn(true);
        } else {
            setIsCapsLockOn(false);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.email.trim()) {
            errors.email = t('validation.required');
        }
        if (!formData.password) {
            errors.password = t('validation.required');
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setError('');

        try {
            await login(formData.email.trim().toLowerCase(), formData.password);
            
            if (rememberMe) {
                localStorage.setItem('remembered_email', formData.email.trim());
            } else {
                localStorage.removeItem('remembered_email');
            }

            setLoginSuccess(true);
            setTimeout(() => {
                navigate('/posts');
            }, 1000);
        } catch (err) {
            if (err.message?.includes('Invalid login credentials') || err.message?.includes('Invalid email or password')) {
                setError(t('auth.invalidCredentials'));
            } else if (err.message?.includes('Email not confirmed')) {
                setError(t('auth.emailNotConfirmed'));
            } else {
                setError(err.message || t('auth.loginFailed'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading) return <AuthSkeleton type="login" />;


    return (
        <div className="login-page">
            {loginSuccess && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(26, 59, 42, 0.85)',
                    backdropFilter: 'blur(12px)',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '40px 60px',
                        borderRadius: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
                        backdropFilter: 'blur(16px)'
                    }}>
                        <div style={{
                            width: '80px', height: '80px',
                            borderRadius: '50%',
                            background: 'rgba(242, 92, 5, 0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '24px',
                            border: '2px solid rgba(242, 92, 5, 0.3)'
                        }}>
                            <CheckCircle size={40} style={{ color: '#F25C05' }} />
                        </div>
                        <h2 style={{ color: '#ffffff', fontWeight: 700, margin: 0, fontSize: '1.5rem', letterSpacing: '0.5px' }}>{t('auth.welcomeBack')}</h2>
                        <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: '8px 0 0 0', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Loader2 size={16} className="spin-animation" style={{ color: '#FFFFFF' }} /> {t('auth.redirecting')}
                        </p>
                    </div>
                </div>
            )}
            <img src={bgImg} alt="Workers Background" className="login-bg" />
            <div className="login-container">
                <Card className="auth-card-premium">
                    <div className="auth-header">
                        <h1 className="auth-title">{t('login.title')}</h1>
                        <p className="auth-subtitle">{t('login.subtitle')}</p>
                    </div>

                    {error && (
                        <div className="auth-error-box">
                            <AlertCircle size={18} style={{ marginRight: '8px', flexShrink: 0 }} color="#CF1322" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <Input
                            label={t('login.phoneOrEmail')}
                            id="email"
                            type="email"
                            icon={<Mail size={18} />}
                            placeholder={t('login.phoneOrEmailPlaceholder')}
                            value={formData.email}
                            onChange={handleChange}
                            error={fieldErrors.email}
                            autoComplete="email"
                            required
                        />

                        <div style={{ marginBottom: '20px' }}>
                            <Input
                                label={t('login.password')}
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                icon={<Lock size={18} />}
                                placeholder={t('login.passwordPlaceholder')}
                                value={formData.password}
                                onChange={handleChange}
                                onKeyUp={handleKeyUp}
                                error={fieldErrors.password}
                                autoComplete="current-password"
                                required
                                action={
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? t('auth.hidePass') : t('auth.showPass')}
                                        style={{ background: 'none', border: 'none', padding: '0 10px', cursor: 'pointer', display: 'flex', color: '#94A3B8' }}
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
                        </div>

                        <div className="auth-remember-row">
                            <label className="remember-me">
                                <input 
                                    type="checkbox" 
                                    checked={rememberMe} 
                                    onChange={(e) => setRememberMe(e.target.checked)} 
                                />
                                {t('auth.rememberMe')}
                            </label>
                            <Link to="/forgot-password" handle="forgot-pass" className="auth-forgot-link">
                                {t('login.forgotPassword')}
                            </Link>
                        </div>

                        <button type="submit" className="btn-auth-primary" disabled={isLoading}>
                            {isLoading ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <Loader2 size={20} className="spin-animation" /> {t('auth.loggingIn')}
                                </span>
                            ) : (
                                t('login.loginBtn')
                            )}
                        </button>
                    </form>

                    <div className="auth-switch">
                        <p>{t('login.noAccount')} <Link to="/register" className="auth-footer-link">{t('login.registerHere')}</Link></p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;
