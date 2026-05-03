import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { reverseGeocode, getCurrentPosition } from '../../../utils/locationUtils';
import Input from '../../../components/ui/Input/Input';
import LocationSearch from '../../../components/ui/LocationSearch/LocationSearch';
import Card from '../../../components/ui/Card/Card';
import PasswordStrength from '../../../components/ui/PasswordStrength/PasswordStrength';
import { 
    MapPin, Eye, EyeOff, Loader2, CheckCircle, ChevronDown, 
    AlertCircle, User, Mail, Lock, Phone, Briefcase, Plus, X, Check 
} from 'lucide-react';
import AuthSkeleton from '../../../components/ui/Skeleton/AuthSkeleton';
import SearchableSkillDropdown from '../../../components/features/SearchableSkillDropdown/SearchableSkillDropdown';

import bgImg from '../../../assets/auth-bg.png';
import { SKILLS } from '../../../constants/skills';
import '../shared/AuthShared.css';
import './Register.css';


const Register = () => {
    const { t } = useTranslation();
    const { register, loading: authLoading } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'normal_user',
        location: '',
        skills: '',
        lat: null,
        lng: null
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isCapsLockOn, setIsCapsLockOn] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);

    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [passwordSecurity, setPasswordSecurity] = useState({ level: 0, isSecure: false });
    const navigate = useNavigate();


    const handleChange = (e) => {
        const { id, name, value } = e.target;
        const field = id || name;
        setFormData({ ...formData, [field]: value });
        setError('');
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSkillToggle = (skillKey) => {
        const currentSkills = formData.skills ? formData.skills.split(', ').filter(Boolean) : [];
        const isSelected = currentSkills.includes(skillKey);
        let updatedSkills;
        if (isSelected) {
            updatedSkills = currentSkills.filter(s => s !== skillKey);
        } else {
            updatedSkills = [...currentSkills, skillKey];
        }
        setFormData(prev => ({ ...prev, skills: updatedSkills.join(', ') }));
        if (fieldErrors.skills) {
            setFieldErrors(prev => ({ ...prev, skills: '' }));
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
        if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
            errors.fullName = t('validation.nameShort');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            errors.email = t('validation.required');
        } else if (!emailRegex.test(formData.email.trim())) {
            errors.email = t('validation.emailInvalid');
        }
        if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
            errors.phone = t('validation.phoneFormat');
        }
        if (!formData.password) {
            errors.password = t('validation.required');
        } else if (!passwordSecurity.isSecure) {
            errors.password = t('auth.passwordTooWeak');
        }
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = t('auth.passwordsMatch');
        }
        if (!formData.location.trim()) {
            errors.location = t('validation.required');
        }
        if (formData.role === 'labour' && !formData.skills) {
            errors.skills = t('register.selectSkill');
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const detectLocation = async () => {
        setIsDetecting(true);
        setFieldErrors(prev => ({ ...prev, location: '' }));
        try {
            const position = await getCurrentPosition();
            const { latitude, longitude } = position.coords;
            const locationData = await reverseGeocode(latitude, longitude);
            setFormData(prev => ({ 
                ...prev, 
                location: locationData.address, 
                lat: latitude, 
                lng: longitude 
            }));
        } catch (error) {
            if (error.message === 'Geolocation not supported') {
                setFieldErrors(prev => ({ ...prev, location: t('validation.geoNotSupported') }));
            } else if (error.code === 1) {
                setFieldErrors(prev => ({ ...prev, location: t('validation.geoDenied') }));
            } else {
                setFieldErrors(prev => ({ ...prev, location: t('validation.geoError') }));
            }
        } finally {
            setIsDetecting(false);
        }
    };

    const handlePasswordStrengthChange = useCallback((security) => {
        setPasswordSecurity(security);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        setError('');
        try {
            await register({
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                fullName: formData.fullName.trim(),
                phone: formData.phone,
                role: formData.role,
                location: formData.location,
                skills: formData.skills,
                lat: formData.lat,
                lng: formData.lng,
            });
            setSuccess(true);
        } catch (err) {
            setError(err.message || t('validation.errorSubmit'));
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading) return <AuthSkeleton type="register" />;


    if (success) {
        return (
            <div className="register-page">
                <img src={bgImg} alt="Workers Background" className="register-bg" />
                <div className="register-container">
                    <Card className="auth-card-premium">
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(242, 92, 5, 0.15)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(242, 92, 5, 0.3)' }}>
                                <CheckCircle size={36} style={{ color: '#F25C05' }} />
                            </div>
                            <h2 style={{ fontSize: '1.6rem', color: '#ffffff', marginBottom: '12px', fontWeight: 800 }}>{t('auth.checkEmailTitle')}</h2>
                            <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.7, marginBottom: '8px' }}>{t('auth.checkEmailSubtitle')}</p>
                            <p style={{ color: '#F25C05', fontWeight: 700, fontSize: '1.05rem', marginBottom: '24px', background: 'rgba(242, 92, 5, 0.1)', padding: '8px 16px', borderRadius: '8px', display: 'inline-block' }}>{formData.email}</p>
                            <Link to="/login" className="btn-auth-primary" style={{ display: 'block', marginTop: '28px', textDecoration: 'none', textAlign: 'center' }}>{t('auth.goToLogin')}</Link>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    const showSkills = formData.role === 'labour';

    return (
        <div className="register-page">
            <img src={bgImg} alt="Workers Background" className="register-bg" />
            <div className="register-container">
                <Card className="auth-card-premium">
                    <div className="auth-header">
                        <h2 className="auth-title">{t('register.title')}</h2>
                        <p className="auth-subtitle">{t('register.subtitle')}</p>
                    </div>
                    {error && <div className="auth-error-box"><AlertCircle size={18} style={{ marginRight: '8px', flexShrink: 0 }} color="#CF1322" />{error}</div>}
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="role-selector">
                            <div className="role-options">
                                <div className="role-slider" style={{ transform: `translateX(${formData.role === 'normal_user' ? '0' : formData.role === 'contractor' ? '100' : '200'}%)` }}></div>
                                <label className={`role-option ${formData.role === 'normal_user' ? 'selected' : ''}`}><input type="radio" name="role" value="normal_user" checked={formData.role === 'normal_user'} onChange={handleChange} />{t('register.normalUser')}</label>
                                <label className={`role-option ${formData.role === 'contractor' ? 'selected' : ''}`}><input type="radio" name="role" value="contractor" checked={formData.role === 'contractor'} onChange={handleChange} />{t('register.contractor')}</label>
                                <label className={`role-option ${formData.role === 'labour' ? 'selected' : ''}`}><input type="radio" name="role" value="labour" checked={formData.role === 'labour'} onChange={handleChange} />{t('register.labour')}</label>
                            </div>
                        </div>

                        <Input label={t('register.fullName')} id="fullName" icon={<User size={18} />} placeholder={t('register.fullNamePlaceholder')} value={formData.fullName} onChange={handleChange} error={fieldErrors.fullName} required />
                        <Input label={t('register.email')} id="email" type="email" icon={<Mail size={18} />} placeholder={t('register.emailPlaceholder')} value={formData.email} onChange={handleChange} error={fieldErrors.email} required />
                        <Input label={t('register.phone')} id="phone" type="tel" icon={<Phone size={18} />} prefix="+91" placeholder={t('register.phonePlaceholder')} value={formData.phone} onChange={handleChange} error={fieldErrors.phone} maxLength="10" />

                        <div style={{ marginBottom: '20px' }}>
                            <Input
                                label={t('register.password')}
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                icon={<Lock size={18} />}
                                placeholder={t('register.passwordPlaceholder')}
                                value={formData.password}
                                onChange={handleChange}
                                onKeyUp={handleKeyUp}
                                error={fieldErrors.password}
                                autoComplete="new-password"
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
                            <PasswordStrength password={formData.password} onStrengthChange={handlePasswordStrengthChange} />
                        </div>

                        <Input
                            label={t('auth.confirmPassword')}
                            id="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            icon={<Lock size={18} />}
                            placeholder={t('auth.confirmNewPassword')}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={fieldErrors.confirmPassword}
                            autoComplete="new-password"
                            required
                        />

                        <LocationSearch
                            label={t('field.location') || t('register.location')}
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            onSelect={(item) => {
                                setFormData(prev => ({
                                    ...prev,
                                    location: item.address,
                                    lat: item.lat,
                                    lng: item.lng
                                }));
                            }}
                            error={fieldErrors.location}
                            placeholder={t('field.locationPlaceholder')}
                            required
                            autoComplete="off"
                            action={
                                <button 
                                    type="button" 
                                    onClick={detectLocation}
                                    disabled={isDetecting}
                                    className="btn-detect-location"
                                >
                                    {isDetecting ? (
                                        <><Loader2 className="spin-animation" size={14} /> {t('common.detecting')}</>
                                    ) : (
                                        <><MapPin size={14} /> {t('common.detect')}</>
                                    )}
                                </button>
                            }
                        />

                        <div className={`animated-section ${showSkills ? 'visible' : ''}`}>
                            <div className="section-content">
                                <SearchableSkillDropdown 
                                    selectedSkills={formData.skills ? formData.skills.split(', ').filter(Boolean) : []}
                                    onToggle={handleSkillToggle}
                                    label={t('register.skill')}
                                    error={fieldErrors.skills}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-auth-primary" disabled={isLoading}>
                            {isLoading ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <Loader2 size={20} className="spin-animation" /> {t('auth.creatingAccount')}
                                </span>
                            ) : (
                                t('register.registerBtn')
                            )}
                        </button>
                    </form>

                    <div className="auth-switch">
                        <p>{t('register.haveAccount')} <Link to="/login" className="auth-footer-link">{t('register.loginHere')}</Link></p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Register;