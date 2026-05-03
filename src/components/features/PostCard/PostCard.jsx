import React from 'react';
import { 
    Clock, Star, IndianRupee, Users, CalendarDays, MapPin, Phone, 
    CheckCircle2, PenLine, Trash2, Languages, Loader2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../supabaseClient';
import { getAvatarColor, getInitial, formatDate } from '../../../utils/formatters';
import Skeleton from '../../ui/Skeleton/Skeleton';
import './PostCard.css';

import PostCardSkeleton from '../../ui/Skeleton/PostCardSkeleton';

const PostCard = ({ 
    post, 
    user, 
    isContacted, 
    onContact, 
    onDelete, 
    onNavigateProfile,
    onNavigateEdit 
}) => {
    const { t, i18n } = useTranslation();
    const [isTranslated, setIsTranslated] = React.useState(false);
    const [translatedData, setTranslatedData] = React.useState(null);
    const [isTranslating, setIsTranslating] = React.useState(false);
    const [isExpanded, setIsExpanded] = React.useState(false);

    const handleTranslate = async (e) => {
        e.stopPropagation();
        
        if (isTranslated) {
            setIsTranslated(false);
            return;
        }

        if (translatedData) {
            setIsTranslated(true);
            return;
        }

        setIsTranslating(true);
        try {
            // Determine target language: if post has Hindi characters, translate to English, else Hindi
            const isOriginalHindi = /[\u0900-\u097F]/.test(post.title || "");
            const targetLang = isOriginalHindi ? 'en' : 'hi';
            
            // Translate Title
            const { data: titleRes, error: titleErr } = await supabase.functions.invoke('translate-post', {
                body: { text: post.title, target_lang: targetLang }
            });
            
            // Translate Description if exists
            let descRes = { data: { translatedText: post.description } };
            if (post.description) {
                descRes = await supabase.functions.invoke('translate-post', {
                    body: { text: post.description, target_lang: targetLang }
                });
            }

            if (titleErr || descRes.error) throw new Error("Translation failed");

            setTranslatedData({
                title: titleRes.translatedText,
                description: descRes.data.translatedText
            });
            setIsTranslated(true);
        } catch (err) {
            console.error(err);
        } finally {
            setIsTranslating(false);
        }
    };

    const displayTitle = isTranslated ? translatedData?.title : post.title;
    const displayDescription = isTranslated ? translatedData?.description : post.description;

    return (
        <div className="post-card-v2">
            {/* Card Top: Avatar + User + Rating */}
            <div className="pc-top">
                <div
                    className="pc-avatar"
                    style={{ background: post.avatarUrl ? 'transparent' : getAvatarColor(post.user_id), cursor: 'pointer', overflow: 'hidden' }}
                    onClick={onNavigateProfile}
                >
                    {post.avatarUrl ? (
                        <img src={post.avatarUrl} alt={post.userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        getInitial(post.userName)
                    )}
                </div>
                <div
                    className="pc-user-info"
                    style={{ cursor: 'pointer' }}
                    onClick={onNavigateProfile}
                >
                    <span className="pc-username">{post.userName}</span>
                    <div className="pc-meta">
                        <span className={`pc-role ${post.role}`}>
                            {post.role === 'contractor' ? '🏗️' : post.role === 'labour' ? '👷' : '👤'} {t(`roles.${post.role}`)}
                        </span>
                        <span className="pc-time"><Clock size={11} /> {post.date}</span>
                    </div>
                </div>
                {user && user.id === post.user_id ? (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button onClick={(e) => { e.stopPropagation(); onNavigateEdit(); }} className="pc-action-btn pc-btn-edit"><PenLine size={16} /></button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(post.id); }} className="pc-action-btn pc-btn-delete"><Trash2 size={16} /></button>
                    </div>
                ) : (post.reviewsCount > 0 || Number(post.rating) > 0) ? (
                    <div className="pc-rating">
                        <Star size={13} fill="#F6AD55" color="#F6AD55" />
                        <span>{post.rating}</span>
                    </div>
                ) : (
                    <div className="pc-rating pc-rating-new">
                        <span>New</span>
                    </div>
                )}
            </div>

            {/* Card Body: Title + Role-Specific Info */}
            <div className="pc-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <h3 className="pc-title" style={{ flex: 1 }}>{displayTitle}</h3>
                    <button 
                        className={`pc-translate-btn ${isTranslated ? 'active' : ''}`}
                        onClick={handleTranslate}
                        disabled={isTranslating}
                        title={t('common.translate') || 'Translate'}
                    >
                        {isTranslating ? <Loader2 size={14} className="spin-animation" /> : <Languages size={14} />}
                    </button>
                </div>
                {displayDescription && (
                    <div className="pc-desc-wrapper">
                        <p className={`pc-description ${isExpanded ? 'expanded' : ''}`}>{displayDescription}</p>
                        {displayDescription.length > 100 && (
                            <button 
                                className="pc-read-more" 
                                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                            >
                                {isExpanded 
                                    ? (t('common.showLess') !== 'common.showLess' ? t('common.showLess') : 'Show less') 
                                    : (t('common.readMore') !== 'common.readMore' ? t('common.readMore') : 'Read more')}
                            </button>
                        )}
                    </div>
                )}
                
                {/* ── LABOUR CARD ── */}
                {post.role === 'labour' && (
                    <div className="pc-role-info">
                        <div className="pc-tags">
                            <span className="pc-skill-tag">{Array.isArray(post.skill) ? post.skill.join(', ') : post.skill}</span>
                            <span className="pc-amount-tag">
                                <IndianRupee size={13} />
                                {post.amount ? post.amount.toString().replace('₹', '') : 'N/A'}
                                {post.pay_type && <span className="pc-pay-type">/{t('pay.' + post.pay_type)}</span>}
                            </span>
                        </div>
                        <div className="pc-badges">
                            {post.experience && <span className="pc-badge pc-badge-exp"><Clock size={12} /> {post.experience} {t('common.yrs')}</span>}
                            {post.availability && (
                                <span className={`pc-badge pc-badge-avail ${post.availability === 'available_now' ? 'avail-now' : ''}`}>
                                    {post.availability === 'available_now' ? `🟢 ${t('status.available_now')}` : post.availability === 'tomorrow' ? t('status.tomorrow') : t('status.this_week')}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* ── CONTRACTOR CARD ── */}
                {post.role === 'contractor' && (
                    <div className="pc-role-info">
                        <div className="pc-tags">
                            <span className="pc-skill-tag">{Array.isArray(post.skill) ? post.skill.join(', ') : post.skill}</span>
                            <span className="pc-amount-tag">
                                <IndianRupee size={13} />
                                {post.budget_min ? `${post.budget_min}${post.budget_max ? '-' + post.budget_max : ''}` : (post.amount ? post.amount.toString().replace('₹', '') : 'N/A')}
                            </span>
                        </div>
                        <div className="pc-badges">
                            {post.workers_needed && <span className="pc-badge pc-badge-workers"><Users size={12} /> {post.workers_needed} workers</span>}
                            {post.duration && <span className="pc-badge pc-badge-duration"><Clock size={12} /> {post.duration.replace(/_/g, ' ')}</span>}
                            {post.urgency && (
                                <span className={`pc-badge pc-badge-urgency urgency-${post.urgency}`}>
                                    {post.urgency === 'urgent' ? `🔴 ${t('status.urgent')}` : post.urgency === 'this_week' ? `🟡 ${t('status.this_week')}` : `🟢 ${t('status.flexible')}`}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* ── NORMAL USER CARD ── */}
                {post.role !== 'labour' && post.role !== 'contractor' && (
                    <div className="pc-role-info">
                        <div className="pc-tags">
                            <span className="pc-skill-tag">{Array.isArray(post.skill) ? post.skill.join(', ') : (post.skill || 'General')}</span>
                            <span className="pc-amount-tag">
                                <IndianRupee size={13} />
                                {post.amount ? post.amount.toString().replace('₹', '') : 'N/A'}
                                {post.budget_note && <span className="pc-pay-type"> ({post.budget_note})</span>}
                            </span>
                        </div>
                        <div className="pc-badges">
                            {post.preferred_date && <span className="pc-badge pc-badge-date"><CalendarDays size={12} /> {formatDate(post.preferred_date)}</span>}
                            {post.time_slot && post.time_slot !== 'anytime' && <span className="pc-badge pc-badge-time"><Clock size={12} /> {post.time_slot.charAt(0).toUpperCase() + post.time_slot.slice(1)}</span>}
                        </div>
                    </div>
                )}
            </div>

            {/* Card Bottom: Location + Contact */}
            <div className="pc-bottom">
                <div className="pc-location">
                    <MapPin size={14} />
                    <span>{post.location}</span>
                    {post.distance !== null && (
                        <span className="pc-distance">{post.distance} km</span>
                    )}
                </div>

                <button
                    className={`pc-contact-btn ${isContacted ? 'copied' : ''}`}
                    onClick={() => onContact(post.id, post.phone)}
                >
                    {isContacted ? (
                        <><CheckCircle2 size={15} /> {t('posts.calling') || 'Calling...'}</>
                    ) : (
                        <><Phone size={15} /> {t('posts.contact')}</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default PostCard;
