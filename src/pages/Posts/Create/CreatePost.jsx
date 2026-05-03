import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAlert } from '../../../context/AlertContext';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../supabaseClient';
import { HardHat, Building2, Wrench, ArrowLeft } from 'lucide-react';
import Card from '../../../components/ui/Card/Card';
import Skeleton from '../../../components/ui/Skeleton/Skeleton';
import PostFormSkeleton from '../../../components/ui/Skeleton/PostFormSkeleton';
import PostForm from '../../../components/features/PostForm/PostForm';
import '../shared/postsShared.css';
import '../shared/postsDesk.css';
import '../shared/postsMobile.css';
import './CreatePost.css'; /* User wanted to keep this file specifically */

const CreatePost = () => {
    const { t } = useTranslation();
    const { user, profile, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [role, setRole] = useState('normal_user');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate('/login');
            return;
        }
        if (profile) {
            setRole(profile.role || 'normal_user');
        }
    }, [profile, authLoading, user, navigate]);

    if (authLoading) return <PostFormSkeleton />;

    const handleSubmit = async (payload) => {
        if (!user) {
            setError(t('createPost.errorLogin'));
            return;
        }

        if (!payload.title || !payload.location || !payload.lat) {
            setError(t('createPost.errorLocationDetected'));
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const finalPayload = {
                ...payload,
                user_id: user.id,
            };

            const { error: insertError } = await supabase.from('posts').insert(finalPayload);
            if (insertError) throw insertError;

            showAlert(t('createPost.alertSuccess'), 'success');
            navigate('/posts');
        } catch (err) {
            setError(err.message || t('common.errorSubmit'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const roleConfigs = {
        labour: {
            icon: <HardHat size={28} />,
            title: t('createPost.labourTitle'),
            subtitle: t('createPost.labourSubtitle'),
            gradient: 'linear-gradient(135deg, #C05621 0%, #F25C05 50%, #DD6B20 100%)',
            accentColor: '#F25C05',
        },
        contractor: {
            icon: <Building2 size={28} />,
            title: t('createPost.contractorTitle'),
            subtitle: t('createPost.contractorSubtitle'),
            gradient: 'linear-gradient(135deg, #1A3B2A 0%, #2D6B45 50%, #1A3B2A 100%)',
            accentColor: '#1A3B2A',
        },
        normal_user: {
            icon: <Wrench size={28} />,
            title: t('createPost.userTitle'),
            subtitle: t('createPost.userSubtitle'),
            gradient: 'linear-gradient(135deg, #2B6CB0 0%, #3182CE 50%, #2B6CB0 100%)',
            accentColor: '#3182CE',
        },
    };

    const config = roleConfigs[role] || roleConfigs.normal_user;

    return (
        <div className="posts-shared-app">
            <div className="posts-shared-wrapper">
                <Card className="posts-shared-card">
                    <div className="posts-shared-header" style={{ background: config.gradient }}>
                        <button 
                            type="button" 
                            className="posts-shared-back-btn" 
                            onClick={() => navigate(-1)}
                            aria-label="Back"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div className="posts-shared-header-content">
                            <div className="posts-shared-header-icon">{config.icon}</div>
                            <div className="posts-shared-header-text">
                                <h1 className="posts-shared-title">{config.title}</h1>
                                <p className="posts-shared-subtitle">{config.subtitle}</p>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="posts-shared-error">
                            {error}
                        </div>
                    )}

                    <div className="posts-shared-form">
                        <PostForm 
                            role={role}
                            profile={profile}
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                            accentColor={config.accentColor}
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
};
export default CreatePost;
