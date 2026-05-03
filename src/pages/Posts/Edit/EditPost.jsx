import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useAlert } from '../../../context/AlertContext';
import { supabase } from '../../../supabaseClient';
import { HardHat, Building2, Wrench, Edit2, ArrowLeft } from 'lucide-react';
import Card from '../../../components/ui/Card/Card';
import Skeleton from '../../../components/ui/Skeleton/Skeleton';
import PostFormSkeleton from '../../../components/ui/Skeleton/PostFormSkeleton';
import PostForm from '../../../components/features/PostForm/PostForm';
import '../shared/postsShared.css';
import '../shared/postsDesk.css';
import '../shared/postsMobile.css';

const EditPost = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, profile, loading: authLoading } = useAuth();
    const { showAlert } = useAlert();
    
    const [role, setRole] = useState('normal_user');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [postData, setPostData] = useState(null);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate('/login');
            return;
        }
        if (profile) {
            setRole(profile.role || 'normal_user');
        }
    }, [profile, user, authLoading, navigate]);

    // Fetch post data
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data, error: fetchErr } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (fetchErr) throw fetchErr;
                if (!data) throw new Error('Post not found');

                setPostData(data);
            } catch (err) {
                setError(t('editPost.errorLoad'));
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchPost();
    }, [id, t]);

    const handleSubmit = async (payload) => {
        setIsSubmitting(true);
        setError('');

        try {
            const { error: updateError } = await supabase
                .from('posts')
                .update(payload)
                .eq('id', id);

            if (updateError) throw updateError;

            showAlert(t('editPost.updateSuccess'), 'success');
            navigate('/posts');
        } catch (err) {
            setError(err.message || t('editPost.errorUpdate'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const roleConfigs = {
        labour: {
            icon: <HardHat size={28} />,
            title: t('editPost.labourTitle'),
            subtitle: t('editPost.labourSubtitle'),
            gradient: 'linear-gradient(135deg, #C05621 0%, #F25C05 50%, #DD6B20 100%)',
            accentColor: '#F25C05',
        },
        contractor: {
            icon: <Building2 size={28} />,
            title: t('editPost.contractorTitle'),
            subtitle: t('editPost.contractorSubtitle'),
            gradient: 'linear-gradient(135deg, #1A3B2A 0%, #2D6B45 50%, #1A3B2A 100%)',
            accentColor: '#1A3B2A',
        },
        normal_user: {
            icon: <Wrench size={28} />,
            title: t('editPost.userTitle'),
            subtitle: t('editPost.userSubtitle'),
            gradient: 'linear-gradient(135deg, #2B6CB0 0%, #3182CE 50%, #2B6CB0 100%)',
            accentColor: '#3182CE',
        },
    };

    const config = roleConfigs[role] || roleConfigs.normal_user;

    if (isLoading || authLoading) return <PostFormSkeleton />;

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
                            <div className="posts-shared-header-icon"><Edit2 size={28} /></div>
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
                            initialData={postData}
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
export default EditPost;
