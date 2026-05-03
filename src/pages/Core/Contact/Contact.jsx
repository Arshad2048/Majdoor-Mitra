import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../supabaseClient';
import Input from '../../../components/ui/Input/Input';
import { Mail, Phone, Clock, Send, MessageCircle, Globe, ArrowRight, Headphones } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import ContactSkeleton from '../../../components/ui/Skeleton/ContactSkeleton';

import contactHero from '../../../assets/contact-hero.png';
import featureStoryBg from '../../../assets/feature-story-bg.png';
import sharedDarkBg from '../../../assets/shared-dark-bg.png';
import '../shared/CoreShared.css';
import './Contact.css';


const Contact = () => {
    const { t } = useTranslation();
    const { loading: authLoading, user } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError(t('contact.loginRequired') || 'Please login to send a message.');
            return;
        }

        if (!formData.name || !formData.email || !formData.message) {
            setError(t('contact.fillRequired') || 'Please fill required fields (Name, Email, Message)');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        try {
            const { error: submitError } = await supabase
                .from('contact_messages')
                .insert([{
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    subject: formData.subject,
                    message: formData.message
                }]);

            if (submitError) throw submitError;

            setSuccessMessage(t('contact.alertSent') || 'Message sent successfully! We will get back to you soon.');
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        } catch (err) {
            setError(err.message || 'Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) return <ContactSkeleton />;

    return (
        <div className="contact-page-new core-fade-in">

            {/* ─── HERO ─── */}
            <section className="core-hero">
                <img src={contactHero} alt="Contact MajdoorMitra" className="core-hero-img" />
                <div className="core-hero-overlay"></div>
                <div className="container core-hero-content">
                    <span className="core-hero-badge">{t('contact.heroBadge')}</span>
                    <h1 className="core-hero-title">{t('contact.heroTitle1')}<span>{t('contact.heroTitle2')}</span></h1>
                    <p className="core-hero-subtitle">{t('contact.heroSubtitle')}</p>
                    <div className="core-hero-stats">
                        <div className="core-stat">
                            <span className="core-stat-number">{t('contact.avgResponseTime')}</span>
                            <span className="core-stat-label">{t('contact.avgResponse')}</span>
                        </div>
                        <div className="core-stat-divider"></div>
                        <div className="core-stat">
                            <span className="core-stat-number">{t('contact.helpline247')}</span>
                            <span className="core-stat-label">{t('contact.helplineAvailable')}</span>
                        </div>
                        <div className="core-stat-divider"></div>
                        <div className="core-stat">
                            <span className="core-stat-number">{t('contact.languageCount')}</span>
                            <span className="core-stat-label">{t('contact.languages')}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CONTACT INFO CARDS ─── */}
            <section className="core-section contact-info-section core-section-off">
                <div className="container">
                    <div className="core-grid core-grid-4 contact-info-grid">
                        <div className="core-card contact-info-card card-phone">
                            <div className="contact-info-icon icon-phone"><Phone size={24} /></div>
                            <h3>{t('contact.phone')}</h3>
                            <p className="contact-info-primary">+91 1800-123-4567</p>
                            <p className="contact-info-secondary">{t('contact.tollFree')}</p>
                        </div>
                        <div className="core-card contact-info-card card-email">
                            <div className="contact-info-icon icon-email"><Mail size={24} /></div>
                            <h3>{t('contact.email')}</h3>
                            <p className="contact-info-primary">support@majdoormitra.in</p>
                            <p className="contact-info-secondary">{t('contact.emailReply')}</p>
                        </div>
                        <div className="core-card contact-info-card card-whatsapp">
                            <div className="contact-info-icon icon-whatsapp"><MessageCircle size={24} /></div>
                            <h3>{t('contact.whatsapp')}</h3>
                            <p className="contact-info-primary">{t('contact.whatsappNumber')}</p>
                            <p className="contact-info-secondary">{t('contact.whatsappSubtitle')}</p>
                        </div>
                        <div className="core-card contact-info-card card-clock">
                            <div className="contact-info-icon icon-clock"><Clock size={24} /></div>
                            <h3>{t('contact.workingHours')}</h3>
                            <p className="contact-info-primary">{t('contact.workingTime')}</p>
                            <p className="contact-info-secondary">{t('contact.sundayClosed')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CONTACT FORM + IMAGE ─── */}
            <section className="core-section contact-form-section core-section-light">
                <div className="container">
                    <div className="contact-form-wrapper-new">
                        <div className="contact-form-left">
                            <div className="contact-form-image">
                                <img src={featureStoryBg} alt="Workers connecting through MajdoorMitra" />
                            </div>
                            <div className="contact-form-text">
                                <h2>{t('contact.sendMessage1')}<span>{t('contact.sendMessage2')}</span></h2>
                                <p>{t('contact.formDesc')}</p>
                                <div className="contact-form-features">
                                    <div className="contact-form-feature"><Send size={16} /><span>{t('contact.quickResponse')}</span></div>
                                    <div className="contact-form-feature"><Globe size={16} /><span>{t('contact.supportLanguages')}</span></div>
                                    <div className="contact-form-feature"><Headphones size={16} /><span>{t('contact.dedicatedSupport')}</span></div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="contact-form-new">
                            <h3 className="contact-form-heading">{t('contact.dropLine')}</h3>

                            {error && (
                                <div style={{ background: '#FED7D7', color: '#C53030', padding: '10px 16px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
                                    {error}
                                </div>
                            )}

                            {successMessage && (
                                <div style={{ background: '#C6F6D5', color: '#2F855A', padding: '10px 16px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
                                    {successMessage}
                                </div>
                            )}

                            <div className="contact-form-row">
                                <Input label={t('contact.yourName')} id="name" placeholder={t('contact.namePlaceholder')} value={formData.name} onChange={handleChange} required />
                                <Input label={t('contact.phone')} id="phone" type="tel" placeholder={t('contact.phonePlaceholder')} value={formData.phone} onChange={handleChange} />
                            </div>
                            <Input label={t('contact.emailAddress')} id="email" type="email" placeholder={t('contact.emailPlaceholder')} value={formData.email} onChange={handleChange} required />
                            <Input label={t('contact.subject')} id="subject" placeholder={t('contact.subjectPlaceholder')} value={formData.subject} onChange={handleChange} />

                            <div className="input-group">
                                <label htmlFor="message" className="input-label">{t('contact.message')}</label>
                                <textarea
                                    id="message"
                                    className="input-field textarea-field"
                                    rows="5"
                                    placeholder={t('contact.messagePlaceholder')}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="core-btn core-btn-std core-btn-primary" disabled={isSubmitting}>
                                <Send size={18} />
                                {isSubmitting ? t('contact.sending') || 'Sending...' : t('contact.sendBtn')}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* ─── FAQ / CTA SECTION ─── */}
            <section className="core-section contact-faq-section">
                <img src={sharedDarkBg} alt="" className="contact-faq-bg" />
                <div className="contact-faq-overlay"></div>
                <div className="container contact-faq-content">
                    <h2 className="core-section-title" style={{ color: '#fff', marginBottom: '48px' }}>{t('contact.faqTitle1')}<span>{t('contact.faqTitle2')}</span></h2>
                    <div className="core-grid core-grid-3 contact-faq-grid">
                        <div className="core-card contact-faq-item">
                            <div className="faq-icon"><MessageCircle size={20} /></div>
                            <div>
                                <h4>{t('contact.faq1Q')}</h4>
                                <p>{t('contact.faq1A')}</p>
                            </div>
                        </div>
                        <div className="core-card contact-faq-item">
                            <div className="faq-icon"><MessageCircle size={20} /></div>
                            <div>
                                <h4>{t('contact.faq2Q')}</h4>
                                <p>{t('contact.faq2A')}</p>
                            </div>
                        </div>
                        <div className="core-card contact-faq-item">
                            <div className="faq-icon"><MessageCircle size={20} /></div>
                            <div>
                                <h4>{t('contact.faq3Q')}</h4>
                                <p>{t('contact.faq3A')}</p>
                            </div>
                        </div>
                    </div>
                    <div className="contact-faq-cta">
                        <p>{t('contact.stillQuestions')}</p>
                        <Link to="/register">
                            <button className="core-btn core-btn-std core-btn-secondary">
                                {t('contact.joinBtn')} <ArrowRight size={18} />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Contact;
