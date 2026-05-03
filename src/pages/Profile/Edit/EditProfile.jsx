import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAlert } from '../../../context/AlertContext';
import { useAuth } from '../../../context/AuthContext';
import { reverseGeocode, getCurrentPosition } from '../../../utils/locationUtils';
import LocationSearch from '../../../components/ui/LocationSearch/LocationSearch';
import { supabase } from '../../../supabaseClient';
import Input from '../../../components/ui/Input/Input';
import { User, Camera, ArrowLeft, Save, MapPin, Briefcase, Phone, Plus, X, ChevronLeft, ChevronRight, Mail, Lock, FileText, ChevronDown, Loader2, CheckCircle } from 'lucide-react';
import EditProfileSkeleton from '../../../components/ui/Skeleton/EditProfileSkeleton';
import { SKILLS } from '../../../constants/skills';
import '../shared/ProfileShared.css';
import './EditProfile.css';

const CATEGORIES = SKILLS.map(skill => ({
    id: skill.id,
    key: skill.id,
    icon: skill.icon,
    color: skill.color
}));

const EditProfile = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, profile, refreshProfile, loading: authLoading } = useAuth();
    const { showAlert } = useAlert();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [bannerImages, setBannerImages] = useState([]);
    const [bannerIndex, setBannerIndex] = useState(0);
    const [isSkillsOpen, setIsSkillsOpen] = useState(false);
    const [skillSearchQuery, setSkillSearchQuery] = useState('');
    const skillsRef = useRef(null);
    const touchStartX = useRef(0);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        location: '',
        skills: '',
        bio: '',
        avatar_url: '',
        lat: null,
        lng: null,
    });
    const [isDetecting, setIsDetecting] = useState(false);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate('/login');
        } else if (profile) {
            setFormData({
                name: profile.full_name || '',
                phone: profile.phone || '',
                location: profile.location || '',
                skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : (profile.skills || ''),
                bio: profile.bio || '',
                avatar_url: profile.avatar_url || '',
                lat: profile.lat || null,
                lng: profile.lng || null,
            });
            const images = profile.banner_images || [];
            if (images.length > 0) {
                setBannerImages(images);
            } else if (profile.banner_url) {
                setBannerImages([profile.banner_url]);
            }
        }
    }, [user, profile, navigate, authLoading]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (skillsRef.current && !skillsRef.current.contains(event.target)) {
                setIsSkillsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setError('');
    };

    const handleSkillToggle = (skill) => {
        setFormData(prev => {
            const currentSkills = prev.skills ? prev.skills.split(', ').filter(Boolean) : [];
            if (currentSkills.includes(skill)) {
                return { ...prev, skills: currentSkills.filter(s => s !== skill).join(', ') };
            } else {
                return { ...prev, skills: [...currentSkills, skill].join(', ') };
            }
        });
    };

    const detectLocation = async () => {
        setIsDetecting(true);

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
            console.error("Location detection error:", error);
            if (error.message === 'Geolocation not supported') {
                showAlert(t('validation.geoNotSupported'), 'error');
            } else if (error.code === 1) { // PERMISSION_DENIED
                showAlert(t('validation.geoDenied'), 'error');
            } else {
                showAlert(t('validation.geoError'), 'error');
            }
        } finally {
            setIsDetecting(false);
        }
    };

    const skillOptions = SKILLS.map(s => s.id);
    
    const filteredSkills = skillOptions.filter(skillKey => 
        t(`skills.${skillKey}`).toLowerCase().includes(skillSearchQuery.toLowerCase())
    );

    const compressImage = (file, maxWidth = 1200) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    
                    // Maintain aspect ratio
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Professional JPEG compression at 75% quality
                    canvas.toBlob((blob) => {
                        resolve({
                            blob,
                            previewUrl: canvas.toDataURL('image/jpeg', 0.75)
                        });
                    }, 'image/jpeg', 0.75);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    const uploadToStorage = async (bucket, folder, blob, fileName) => {
        const filePath = `${folder}/${fileName}`;
        
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, blob, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !user) return;
        
        setIsSubmitting(true);
        try {
            // 0. Clean up old avatar from storage if it exists
            if (formData.avatar_url && formData.avatar_url.includes('supabase.co') && formData.avatar_url.includes('avatars/')) {
                try {
                    const oldPath = formData.avatar_url.split('avatars/')[1].split('?')[0];
                    await supabase.storage.from('avatars').remove([oldPath]);
                } catch (cleanupErr) {
                    console.error("Old avatar cleanup failed:", cleanupErr);
                    // Continue anyway to allow fresh upload
                }
            }

            // 1. Compress the image (400px is perfect for profile pics)
            const { blob } = await compressImage(file, 400); 
            
            // 2. Upload with a unique timestamp to prevent caching issues
            const fileName = `avatar_${Date.now()}.jpg`;
            const publicUrl = await uploadToStorage('avatars', user.id, blob, fileName);
            
            // 3. Update form data with final professional URL
            setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
            showAlert(t('editProfile.avatarUpdated'), 'success');
        } catch (err) {
            console.error("Avatar upload error:", err);
            setError(t('common.errorUpdate'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBannerAdd = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length || !user) return;
        
        if (bannerImages.length + files.length > 5) {
            setError(t('editProfile.bannerLimitError'));
            return;
        }

        setIsSubmitting(true);
        try {
            const uploadPromises = files.map(async (file, idx) => {
                const { blob } = await compressImage(file, 1200);
                const fileName = `banner_${Date.now()}_${idx}.jpg`;
                return uploadToStorage('banners', user.id, blob, fileName);
            });

            const newUrls = await Promise.all(uploadPromises);
            setBannerImages(prev => [...prev, ...newUrls]);
            setBannerIndex(bannerImages.length); 
            showAlert(t('editProfile.bannersAdded'), 'success');
        } catch (err) {
            console.error("Banner upload error:", err);
            setError(t('common.errorUpdate'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeBannerImage = async (index) => {
        const urlToRemove = bannerImages[index];
        setBannerImages(prev => prev.filter((_, i) => i !== index));
        
        if (bannerIndex >= bannerImages.length - 1) {
            setBannerIndex(Math.max(0, bannerImages.length - 2));
        }

        // Clean up from Storage if it's a Supabase URL
        if (urlToRemove.includes('supabase.co')) {
            try {
                const pathParts = urlToRemove.split('banners/')[1].split('?')[0]; // Extract 'user_id/filename.jpg'
                await supabase.storage.from('banners').remove([pathParts]);
            } catch (err) {
                console.error("Error deleting old banner:", err);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const skillsArray = formData.skills
                .split(',')
                .map(s => s.trim())
                .filter(s => s.length > 0);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.name,
                    phone: formData.phone,
                    location: formData.location,
                    skills: skillsArray,
                    bio: formData.bio,
                    avatar_url: formData.avatar_url,
                    banner_images: bannerImages,
                    lat: formData.lat,
                    lng: formData.lng,
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            await refreshProfile();
            showAlert(t('editProfile.updateSuccess'), "success");
            navigate('/profile');
        } catch (err) {
            setError(err.message || t('common.errorUpdate'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) {
        return <EditProfileSkeleton />;
    }

    return (
        <div className="profile-shared-app">
            <div className="profile-shared-wrapper">
                <div className="edit-header">
                    <button className="edit-back-btn" onClick={() => navigate(-1)} type="button">
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="edit-header-title">{t('editProfile.title')}</h2>
                    <div style={{ width: 36 }}></div>
                </div>

                <div className="ep-banner-section">
                    <div className="ep-banner-viewport"
                        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                        onTouchEnd={(e) => {
                            const diff = touchStartX.current - e.changedTouches[0].clientX;
                            if (Math.abs(diff) > 50 && bannerImages.length > 1) {
                                if (diff > 0) setBannerIndex(p => (p + 1) % bannerImages.length);
                                else setBannerIndex(p => (p - 1 + bannerImages.length) % bannerImages.length);
                            }
                        }}
                    >
                        {bannerImages.length > 0 ? (
                            <>
                                <img src={bannerImages[bannerIndex]} alt={`Banner ${bannerIndex + 1}`} className="ep-banner-img" />
                                {bannerImages.length > 1 && (
                                    <>
                                        <button type="button" className="ep-banner-nav ep-banner-nav-left" onClick={() => setBannerIndex(prev => (prev - 1 + bannerImages.length) % bannerImages.length)}>
                                            <ChevronLeft size={18} />
                                        </button>
                                        <button type="button" className="ep-banner-nav ep-banner-nav-right" onClick={() => setBannerIndex(prev => (prev + 1) % bannerImages.length)}>
                                            <ChevronRight size={18} />
                                        </button>
                                    </>
                                )}
                                <button type="button" className="ep-banner-remove" onClick={() => removeBannerImage(bannerIndex)}>
                                    <X size={14} />
                                </button>
                                <div className="ep-banner-counter">{bannerIndex + 1}/{bannerImages.length}</div>
                            </>
                        ) : (
                            <div className="ep-banner-empty">
                                <Camera size={28} />
                                <span>{t('editProfile.addBanner')}</span>
                            </div>
                        )}
                    </div>

                    <div className="ep-banner-thumbs">
                        {bannerImages.map((img, i) => (
                            <div key={i} className={`ep-banner-thumb ${i === bannerIndex ? 'active' : ''}`} onClick={() => setBannerIndex(i)}>
                                <img src={img} alt={`Thumb ${i + 1}`} />
                            </div>
                        ))}
                        {bannerImages.length < 5 && (
                            <label className="ep-banner-thumb ep-banner-thumb-add">
                                <Plus size={20} />
                                <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleBannerAdd} />
                            </label>
                        )}
                    </div>
                    <p className="ep-banner-hint">{bannerImages.length}/5 photos · {t('editProfile.bannerHint')}</p>
                </div>

                <div className="edit-avatar-section" style={{ marginTop: '-50px', position: 'relative', zIndex: 10 }}>
                    <div className="edit-avatar-ring">
                        <div className="edit-avatar-circle">
                            {formData.avatar_url ? (
                                <img src={formData.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                            ) : (
                                <User size={44} />
                            )}
                        </div>
                        <label className="edit-avatar-camera" style={{ cursor: 'pointer' }}>
                            <Camera size={16} />
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
                        </label>
                    </div>
                </div>

                {error && (
                    <div style={{ background: '#FED7D7', color: '#C53030', padding: '10px 16px', borderRadius: '8px', fontSize: '0.85rem', margin: '0 20px 12px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="edit-form">
                    <div className="edit-form-section">
                        <h3 className="edit-form-section-title">{t('editProfile.personalInfo')}</h3>
                        <div className="edit-form-card">
                            <div className="edit-input-row">
                                <Input label={t('editProfile.fullName')} id="name" icon={User} placeholder={t('editProfile.namePlaceholder')} value={formData.name} onChange={handleChange} required />
                            </div>
                            
                            <div className="edit-input-row">
                                <LocationSearch
                                    label={t('field.location')}
                                    value={formData.location}
                                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                    onSelect={(item) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            location: item.address,
                                            lat: item.lat,
                                            lng: item.lng
                                        }));
                                    }}
                                    placeholder={t('field.locationPlaceholder')}
                                    autoComplete="off"
                                    action={
                                        <button
                                            type="button"
                                            onClick={detectLocation}
                                            disabled={isDetecting}
                                            style={{ 
                                                background: 'none', 
                                                border: 'none', 
                                                color: '#F25C05', 
                                                fontSize: '0.85rem', 
                                                fontWeight: '600', 
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}
                                        >
                                            {isDetecting ? (
                                                <><Loader2 className="animate-spin" size={14} /> {t('common.detecting')}</>
                                            ) : (
                                                <><MapPin size={14} /> {t('common.detect')}</>
                                            )}
                                        </button>
                                    }
                                />
                            </div>

                            <div className="edit-input-row">
                                <Input label={t('editProfile.phone')} id="phone" type="tel" icon={Phone} prefix="+91" placeholder={t('editProfile.phonePlaceholder')} value={formData.phone || ''} onChange={handleChange} maxLength="10" required />
                            </div>
                        </div>
                    </div>

                    <div className="edit-form-section">
                        <h3 className="edit-form-section-title">{t('editProfile.professional')}</h3>
                        <div className="edit-form-card">
                            <div className="edit-input-row" ref={skillsRef}>
                                <div className="skills-dropdown-container">
                                    <label className="input-label">{t('editProfile.skills')}</label>
                                    <div className={`skills-field-trigger ${isSkillsOpen ? 'active' : ''}`} onClick={() => setIsSkillsOpen(!isSkillsOpen)}>
                                        <Briefcase size={18} className="skills-field-icon" style={{ color: isSkillsOpen ? '#F25C05' : '#94A3B8', flexShrink: 0 }} />
                                        <div className="skills-tag-pills">
                                            {formData.skills && formData.skills.split(', ').filter(Boolean).length > 0 ? (
                                                <>
                                                    {formData.skills.split(', ').filter(Boolean).slice(0, 1).map(skill => (
                                                        <span key={skill} className="skill-pill-tag">
                                                            {skill.includes('_') || skillOptions.includes(skill.toLowerCase()) ? t(`skills.${skill.toLowerCase()}`) : skill}
                                                            <span className="skill-pill-remove" onClick={(e) => { e.stopPropagation(); handleSkillToggle(skill); }}>×</span>
                                                        </span>
                                                    ))}
                                                    {formData.skills.split(', ').filter(Boolean).length > 1 && (
                                                        <span 
                                                            className="skill-pill-tag"
                                                            style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#4A5568', fontWeight: 600 }}
                                                        >
                                                            +{formData.skills.split(', ').filter(Boolean).length - 1} more
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                <span style={{ color: '#F25C05' }}>{t('editProfile.skillsPlaceholder')}</span>
                                            )}
                                        </div>
                                        <ChevronDown size={18} className="select-arrow" style={{ transform: isSkillsOpen ? 'rotate(180deg)' : 'rotate(0deg)', color: isSkillsOpen ? '#F25C05' : '#94A3B8' }} />
                                    </div>
                                    {isSkillsOpen && (
                                        <div className="skills-dropdown-menu">
                                            <div className="skills-menu-search-wrapper">
                                                <input type="text" className="skills-menu-search-input" placeholder={t('editProfile.skillsSearch')} value={skillSearchQuery} onChange={(e) => setSkillSearchQuery(e.target.value)} onClick={(e) => e.stopPropagation()} autoFocus />
                                            </div>
                                            <div className="skills-menu-list">
                                                {filteredSkills.length > 0 ? (
                                                    filteredSkills.map(skillKey => {
                                                        const isSelected = formData.skills ? formData.skills.split(', ').includes(skillKey) : false;
                                                        return (
                                                            <div key={skillKey} className={`skill-dropdown-item ${isSelected ? 'selected' : ''}`} onClick={() => handleSkillToggle(skillKey)}>
                                                                <div className="skill-checkbox-visual">{isSelected && <span className="skill-checkbox-visual-tick">✓</span>}</div>
                                                                <span style={{ fontSize: '0.92rem', color: isSelected ? '#1A3B2A' : '#4A5568', fontWeight: isSelected ? '600' : '500' }}>{t(`skills.${skillKey}`)}</span>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="skill-no-results">{t('editProfile.noSkillsFound')} "{skillSearchQuery}"</div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="edit-input-row edit-input-row-textarea">
                                <div className="input-group" style={{ width: '100%' }}>
                                    <label htmlFor="bio" className="input-label">{t('editProfile.bio')}</label>
                                    <div className="input-icon-wrapper">
                                        <FileText className="input-icon-left" style={{ top: '16px' }} size={18} />
                                        <textarea id="bio" className="input-field textarea-field with-icon" rows="3" placeholder={t('editProfile.bioPlaceholder')} value={formData.bio} onChange={handleChange} style={{ paddingLeft: '44px' }}></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="edit-actions">
                        <button type="submit" className="edit-save-btn" disabled={isSubmitting}>
                            <Save size={18} />
                            {isSubmitting ? t('common.saving') : t('editProfile.saveBtn')}
                        </button>
                        <button type="button" className="edit-cancel-btn" onClick={() => navigate(-1)} disabled={isSubmitting}>
                            {t('common.cancel')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;