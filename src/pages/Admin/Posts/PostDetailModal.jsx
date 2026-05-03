import React from 'react';
import { 
    X, MapPin, Calendar, Clock, 
    Briefcase, User, Trash2, RotateCcw, 
    IndianRupee, CheckCircle, AlertTriangle,
    CreditCard, Users, Timer, Info
} from 'lucide-react';
import './PostDetailModal.css';

const PostDetailModal = ({ post, onClose, onDelete, onRestore }) => {
    if (!post) return null;

    const getTimeAgo = (dateString) => {
        const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
        const days = Math.floor(seconds / 86400);
        if (days > 0) return `${days}d ago`;
        const hours = Math.floor(seconds / 3600);
        if (hours > 0) return `${hours}h ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    };

    return (
        <div className="pdm-overlay" onClick={onClose}>
            <div className="pdm-container" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="pdm-header">
                    <h2 className="pdm-title">Job Posting Details</h2>
                    <button className="pdm-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Status Bar */}
                <div className={`pdm-status-bar ${post.is_deleted ? 'deleted' : 'active'}`}>
                    <div className="pdm-status-dot"></div>
                    <span>{post.is_deleted ? 'Posting Removed' : 'Posting Active'}</span>
                    <span className="pdm-status-right">
                        <Timer size={12} /> Posted {getTimeAgo(post.created_at)}
                    </span>
                </div>

                <div className="pdm-body">
                    {/* Left Sidebar */}
                    <div className="pdm-sidebar">
                        <div className="pdm-identity">
                            <h1 className="pdm-post-title">{post.title}</h1>
                            <span className={`pdm-type-chip ${post.type || 'job'}`}>
                                {post.type === 'labour' ? 'Looking for Work' : 'Hiring Workers'}
                            </span>
                        </div>

                        <div className="pdm-section">
                            <h3 className="pdm-section-label">JOB INFO</h3>
                            <div className="pdm-info-row">
                                <IndianRupee size={16} />
                                <span className="pdm-highlight">₹{post.budget || post.amount || 'Negotiable'}</span>
                            </div>
                            <div className="pdm-info-row">
                                <Briefcase size={16} />
                                <span>{post.category || post.skill}</span>
                            </div>
                            <div className="pdm-info-row">
                                <MapPin size={16} />
                                <span>{post.location_name || post.location}</span>
                            </div>
                            {post.pay_type && (
                                <div className="pdm-info-row">
                                    <CreditCard size={16} />
                                    <span>{post.pay_type}</span>
                                </div>
                            )}
                            {post.urgency && (
                                <div className="pdm-info-row pdm-urgency">
                                    <AlertTriangle size={16} />
                                    <span>{post.urgency} Urgency</span>
                                </div>
                            )}
                        </div>

                        <div className="pdm-section">
                            <h3 className="pdm-section-label">AUTHOR</h3>
                            <div className="pdm-author-card">
                                <div className="pdm-author-avatar">
                                    {post.profiles?.avatar_url ? (
                                        <img src={post.profiles.avatar_url} alt="" />
                                    ) : (
                                        <span>{post.profiles?.full_name?.charAt(0)?.toUpperCase() || '?'}</span>
                                    )}
                                </div>
                                <div className="pdm-author-info">
                                    <span className="pdm-author-name">{post.profiles?.full_name || 'Anonymous'}</span>
                                    <span className="pdm-author-id">ID: {post.user_id.substring(0, 8)}...</span>
                                </div>
                            </div>
                        </div>

                        <div className="pdm-section">
                            <h3 className="pdm-section-label">QUICK ACTIONS</h3>
                            {post.is_deleted ? (
                                <button className="pdm-btn-fill unban" onClick={() => onRestore(post.id)}>
                                    <RotateCcw size={16} /> Restore Post
                                </button>
                            ) : (
                                <button className="pdm-btn-fill ban" onClick={() => onDelete(post.id, false)}>
                                    <Trash2 size={16} /> Remove Post
                                </button>
                            )}
                            <button className="pdm-btn-outline danger" onClick={() => onDelete(post.id, true)}>
                                <AlertTriangle size={16} /> Permanent Delete
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="pdm-main">
                        <div className="pdm-main-section">
                            <h3>Description</h3>
                            <p className="pdm-description">
                                {post.description || 'No description provided.'}
                            </p>
                        </div>

                        {(post.requirements || post.workers_needed || post.duration) && (
                            <div className="pdm-main-section">
                                <h3>Requirements & Details</h3>
                                <div className="pdm-details-grid">
                                    {post.workers_needed && (
                                        <div className="pdm-detail-item">
                                            <Users size={16} />
                                            <div>
                                                <label>Workers Needed</label>
                                                <span>{post.workers_needed} People</span>
                                            </div>
                                        </div>
                                    )}
                                    {post.duration && (
                                        <div className="pdm-detail-item">
                                            <Clock size={16} />
                                            <div>
                                                <label>Duration</label>
                                                <span>{post.duration}</span>
                                            </div>
                                        </div>
                                    )}
                                    {post.preferred_date && (
                                        <div className="pdm-detail-item">
                                            <Calendar size={16} />
                                            <div>
                                                <label>Start Date</label>
                                                <span>{new Date(post.preferred_date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {post.requirements && (
                                    <div className="pdm-requirements">
                                        <label>Special Requirements</label>
                                        <div className="pdm-req-list">
                                            {typeof post.requirements === 'string' ? (
                                                <div className="pdm-req-tag"><CheckCircle size={14} /> {post.requirements}</div>
                                            ) : (
                                                post.requirements.map((req, i) => (
                                                    <div key={i} className="pdm-req-tag">
                                                        <CheckCircle size={14} /> {req}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="pdm-main-section">
                            <h3>System Metadata</h3>
                            <div className="pdm-meta-grid">
                                <div className="pdm-meta-box">
                                    <Info size={14} />
                                    <div>
                                        <label>Post Reference ID</label>
                                        <span>{post.id}</span>
                                    </div>
                                </div>
                                <div className="pdm-meta-box">
                                    <Calendar size={14} />
                                    <div>
                                        <label>Created At</label>
                                        <span>{new Date(post.created_at).toLocaleString()}</span>
                                    </div>
                                </div>
                                {post.deleted_at && (
                                    <div className="pdm-meta-box pdm-deleted-meta">
                                        <Trash2 size={14} />
                                        <div>
                                            <label>Deleted At</label>
                                            <span>{new Date(post.deleted_at).toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {post.is_deleted && (
                    <div className="pdm-removed-badge">DELETED</div>
                )}
            </div>
        </div>
    );
};

export default PostDetailModal;
