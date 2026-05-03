import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import { useAlert } from '../../../context/AlertContext';
import { Search, Trash2, Eye, Download, ChevronLeft, ChevronRight, RotateCcw, Briefcase, X as XIcon, ChevronDown } from 'lucide-react';
import { SKILLS, SKILL_CATEGORIES } from '../../../constants/skills';
import { useTranslation } from 'react-i18next';
import UserDetailModal from '../Users/UserDetailModal';
import PostDetailModal from './PostDetailModal';
import '../Users/AdminUsers.css';
import './AdminPosts.css';
import '../AdminSkeleton.css';

const AdminPosts = () => {
    const { showAlert, showConfirm } = useAlert();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const { t } = useTranslation();
    const [selectedPost, setSelectedPost] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterSkill, setFilterSkill] = useState('all');
    const [statusMenuOpen, setStatusMenuOpen] = useState(false);
    const [skillMenuOpen, setSkillMenuOpen] = useState(false);
    const [skillSearch, setSkillSearch] = useState('');
    const itemsPerPage = 10;

    const fetchPosts = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('posts')
                .select('*, profiles(full_name, avatar_url)', { count: 'exact' });
            
            if (searchTerm.trim()) {
                // 1. Search for users matching the name to get their IDs
                const { data: matchingUsers } = await supabase
                    .from('profiles')
                    .select('id')
                    .ilike('full_name', `%${searchTerm}%`);
                
                const matchingUserIds = matchingUsers?.map(u => u.id) || [];
                
                if (matchingUserIds.length > 0) {
                    // Search by title OR by one of the matching author IDs
                    query = query.or(`title.ilike.%${searchTerm}%,user_id.in.(${matchingUserIds.map(id => `"${id}"`).join(',')})`);
                } else {
                    // Only search by title if no authors match
                    query = query.ilike('title', `%${searchTerm}%`);
                }
            }

            if (filterStatus !== 'all') {
                if (filterStatus === 'removed') {
                    query = query.eq('is_deleted', true);
                } else if (filterStatus === 'live') {
                    query = query.eq('is_deleted', false);
                }
            }

            if (filterSkill !== 'all') {
                query = query.eq('skill', filterSkill);
            }

            const from = (currentPage - 1) * itemsPerPage;
            const to = from + itemsPerPage - 1;

            const { data, error, count } = await query
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;
            setPosts(data || []);
            setTotalCount(count || 0);
        } catch (error) {
            console.error('Fetch posts error:', error);
            showAlert('Failed to load posts', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1); // Reset to first page on search
    }, [searchTerm]);

    useEffect(() => {
        fetchPosts();
    }, [searchTerm, currentPage, filterStatus, filterSkill]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.admin-filter-group') && !event.target.closest('.admin-skill-filter-wrapper')) {
                setSkillMenuOpen(false);
                setStatusMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDeletePost = async (postId, permanent) => {
        const confirmed = await showConfirm(
            permanent ? 'Are you sure you want to permanently delete this post?' : 'Are you sure you want to remove this post from the public feed?',
            { title: permanent ? 'Permanent Delete' : 'Soft Delete Post', confirmText: 'Delete', type: 'error' }
        );

        if (confirmed) {
            try {
                if (permanent) {
                    // Permanent delete
                    const { error } = await supabase.from('posts').delete().eq('id', postId);
                    if (error) throw error;
                    setPosts(prev => prev.filter(p => p.id !== postId));
                    if (selectedPost?.id === postId) setSelectedPost(null);
                } else {
                    // Soft delete
                    const now = new Date();
                    const { error } = await supabase.from('posts').update({ is_deleted: true, deleted_at: now }).eq('id', postId);
                    if (error) throw error;
                    
                    const updates = { is_deleted: true, deleted_at: now };
                    setPosts(prev => prev.map(p => p.id === postId ? { ...p, ...updates } : p));
                    if (selectedPost?.id === postId) setSelectedPost(prev => ({ ...prev, ...updates }));
                }
                
                showAlert('Post deleted successfully', 'success');
            } catch (error) {
                console.error(error);
                showAlert('Could not delete post', 'error');
            }
        }
    };

    const handleRestorePost = async (postId) => {
        const confirmed = await showConfirm(
            'Are you sure you want to restore this post? It will be visible to all users again.',
            { title: 'Restore Post', confirmText: 'Yes, Restore', type: 'success' }
        );

        if (!confirmed) return;

        try {
            const { error } = await supabase.from('posts').update({ is_deleted: false, deleted_at: null }).eq('id', postId);
            if (error) throw error;
            
            const updates = { is_deleted: false, deleted_at: null };
            setPosts(prev => prev.map(p => p.id === postId ? { ...p, ...updates } : p));
            if (selectedPost?.id === postId) setSelectedPost(prev => ({ ...prev, ...updates }));
            
            showAlert('Post restored successfully', 'success');
        } catch (error) {
            console.error(error);
            showAlert('Could not restore post', 'error');
        }
    };

    const handleDownloadCSV = async () => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('title, skill, location, created_at, is_deleted, amount, amount_numeric, profiles(full_name)')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const csvRows = [
                ['Post Title', 'Category/Skill', 'Budget', 'Author', 'Location', 'Posted Date', 'Visibility Status'],
                ...data.map(post => [
                    post.title,
                    post.skill,
                    post.amount || `₹${post.amount_numeric || '0'}`,
                    post.profiles?.full_name || 'Unknown',
                    post.location || 'N/A',
                    new Date(post.created_at).toLocaleString('en-GB'),
                    post.is_deleted ? 'Removed' : 'Live'
                ])
            ];

            const csvContent = "\uFEFF" + csvRows
                .map(row => row
                    .map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`)
                    .join(',')
                ).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', `posts_export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error(error);
            showAlert('Failed to export CSV', 'error');
        }
    };

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return (
        <div className="admin-view core-fade-in">
            <div className="admin-toolbar">
                <div className="admin-search-wrapper">
                    <Search size={18} className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search by title or author..." 
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                
                <div className="admin-filters">
                    <div className="admin-filter-group">
                        <button 
                            className={`admin-filter-trigger ${filterStatus !== 'all' ? 'active' : ''}`}
                            onClick={() => { setStatusMenuOpen(!statusMenuOpen); setSkillMenuOpen(false); }}
                        >
                            <span>{filterStatus === 'all' ? 'All Status' : (filterStatus === 'live' ? 'Active' : 'Removed')}</span>
                            <ChevronDown size={14} style={{ transform: statusMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>
                        {statusMenuOpen && (
                            <div className="admin-filter-menu">
                                <div className={`admin-filter-option ${filterStatus === 'all' ? 'selected' : ''}`} onClick={() => { setFilterStatus('all'); setStatusMenuOpen(false); setCurrentPage(1); }}>All Status</div>
                                <div className={`admin-filter-option ${filterStatus === 'live' ? 'selected' : ''}`} onClick={() => { setFilterStatus('live'); setStatusMenuOpen(false); setCurrentPage(1); }}>Active</div>
                                <div className={`admin-filter-option ${filterStatus === 'removed' ? 'selected' : ''}`} onClick={() => { setFilterStatus('removed'); setStatusMenuOpen(false); setCurrentPage(1); }}>Removed</div>
                            </div>
                        )}
                    </div>

                    <div className="admin-skill-filter-wrapper">
                        <button 
                            className={`admin-skill-trigger ${filterSkill !== 'all' ? 'active' : ''}`}
                            onClick={() => setSkillMenuOpen(!skillMenuOpen)}
                        >
                            <Briefcase size={14} />
                            <span>{filterSkill === 'all' ? 'All Skills' : t(`skills.${filterSkill}`)}</span>
                            <ChevronDown size={14} style={{ transform: skillMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>

                        {skillMenuOpen && (
                            <div className="admin-skill-menu">
                                <div className="admin-skill-menu-search">
                                    <Search size={14} />
                                    <input 
                                        type="text" 
                                        placeholder="Search skill..." 
                                        value={skillSearch}
                                        onChange={(e) => setSkillSearch(e.target.value)}
                                        autoFocus
                                    />
                                    {skillSearch && <XIcon size={14} onClick={() => setSkillSearch('')} className="clear-skill-search" />}
                                </div>
                                <div className="admin-skill-menu-list">
                                    <div 
                                        className={`admin-skill-option ${filterSkill === 'all' ? 'selected' : ''}`}
                                        onClick={() => { setFilterSkill('all'); setSkillMenuOpen(false); setCurrentPage(1); }}
                                    >
                                        All Skills
                                    </div>
                                    {Object.entries(SKILL_CATEGORIES).map(([catKey, catValue]) => {
                                        const categorySkills = SKILLS.filter(s => 
                                            s.category === catValue && 
                                            (skillSearch === '' || t(`skills.${s.id}`).toLowerCase().includes(skillSearch.toLowerCase()))
                                        );
                                        
                                        if (categorySkills.length === 0) return null;

                                        return (
                                            <div key={catValue} className="admin-skill-group">
                                                <div className="admin-skill-group-label">{catKey.charAt(0) + catKey.slice(1).toLowerCase()}</div>
                                                {categorySkills.map(skill => (
                                                    <div 
                                                        key={skill.id}
                                                        className={`admin-skill-option ${filterSkill === skill.id ? 'selected' : ''}`}
                                                        onClick={() => { setFilterSkill(skill.id); setSkillMenuOpen(false); setSkillSearch(''); setCurrentPage(1); }}
                                                    >
                                                        {t(`skills.${skill.id}`)}
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="admin-toolbar-actions">
                    <span className="admin-count-badge">{totalCount} Posts</span>
                    <button className="admin-export-btn" onClick={handleDownloadCSV}>
                        <Download size={18} />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            <div className="admin-table-container desktop-only">
                {loading ? (
                    <div className="skeleton-table-container">
                        <table className="skeleton-table">
                            <thead>
                                <tr>
                                    <th><div className="skeleton-base skeleton-table-header-cell"></div></th>
                                    <th><div className="skeleton-base skeleton-table-header-cell" style={{width: '60%'}}></div></th>
                                    <th><div className="skeleton-base skeleton-table-header-cell" style={{width: '70%'}}></div></th>
                                    <th><div className="skeleton-base skeleton-table-header-cell" style={{width: '50%'}}></div></th>
                                    <th><div className="skeleton-base skeleton-table-header-cell" style={{width: '80%'}}></div></th>
                                    <th><div className="skeleton-base skeleton-table-header-cell" style={{width: '40%'}}></div></th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="skeleton-table-row">
                                        <td>
                                            <div style={{flex: 1}}>
                                                <div className="skeleton-base skeleton-text-line medium"></div>
                                                <div className="skeleton-base skeleton-text-line short" style={{marginBottom: 0}}></div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="skeleton-table-user">
                                                <div className="skeleton-base skeleton-table-avatar skeleton-circle"></div>
                                                <div style={{flex: 1}}>
                                                    <div className="skeleton-base skeleton-text-line short" style={{marginBottom: 0}}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><div className="skeleton-base skeleton-text-line" style={{width: '100px', marginBottom: 0}}></div></td>
                                        <td><div className="skeleton-base skeleton-text-line" style={{width: '80px', marginBottom: 0}}></div></td>
                                        <td><div className="skeleton-base skeleton-text-line short" style={{height: '24px', borderRadius: '12px', width: '80px', marginBottom: 0}}></div></td>
                                        <td>
                                            <div style={{display: 'flex', gap: '8px'}}>
                                                <div className="skeleton-base skeleton-circle" style={{width: '32px', height: '32px'}}></div>
                                                <div className="skeleton-base skeleton-circle" style={{width: '32px', height: '32px'}}></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="admin-table-empty">No posts found.</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Location</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(post => (
                                <tr key={post.id} style={{ opacity: post.is_deleted ? 0.6 : 1 }}>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{post.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#718096' }}>{post.skill}</div>
                                    </td>
                                    <td>
                                        <div className="table-user">
                                            <div className="table-avatar" style={{ width: 30, height: 30, fontSize: '0.8rem' }}>
                                                {post.profiles?.avatar_url ? <img src={post.profiles.avatar_url} alt="" /> : post.profiles?.full_name?.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={{ fontSize: '0.9rem' }}>{post.profiles?.full_name}</span>
                                        </div>
                                    </td>
                                    <td>{post.location}</td>
                                    <td>{new Date(post.created_at).toLocaleDateString()}</td>
                                    <td>
                                        {post.is_deleted ? (
                                            <span className="table-role-badge" style={{ background: '#FEE2E2', color: '#EF4444' }}>Deleted</span>
                                        ) : (
                                            <span className="table-role-badge" style={{ background: '#D1FAE5', color: '#047857' }}>Active</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button 
                                                className="table-action-btn admin-toggle" 
                                                onClick={() => setSelectedPost(post)} 
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            {post.is_deleted && (
                                                <button 
                                                    className="table-action-btn admin-toggle" 
                                                    style={{ color: '#10b981' }}
                                                    onClick={() => handleRestorePost(post.id)} 
                                                    title="Restore Post"
                                                >
                                                    <RotateCcw size={16} />
                                                </button>
                                            )}
                                            <button 
                                                className="table-action-btn delete" 
                                                onClick={() => handleDeletePost(post.id, post.is_deleted)} 
                                                title={post.is_deleted ? "Permanently Delete" : "Remove from Feed"}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Mobile Card Layout */}
            <div className="admin-cards mobile-only">
                {loading ? (
                    <div className="skeleton-mobile-list">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="skeleton-mobile-card skeleton-base">
                                <div className="skeleton-mobile-card-top">
                                    <div style={{flex: 1}}>
                                        <div className="skeleton-text-line medium" style={{background: 'rgba(255,255,255,0.5)'}}></div>
                                        <div className="skeleton-text-line short" style={{marginBottom: 0, background: 'rgba(255,255,255,0.3)'}}></div>
                                    </div>
                                    <div className="skeleton-mobile-card-badge" style={{background: 'rgba(255,255,255,0.4)'}}></div>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px'}}>
                                    <div className="skeleton-table-avatar skeleton-circle" style={{width: '24px', height: '24px', background: 'rgba(255,255,255,0.5)'}}></div>
                                    <div className="skeleton-text-line short" style={{marginBottom: 0, background: 'rgba(255,255,255,0.3)', width: '40%'}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="admin-table-empty">No posts found.</div>
                ) : (
                    posts.map(post => (
                        <div key={post.id} className="admin-card" style={{ opacity: post.is_deleted ? 0.6 : 1 }}>
                            <div className="admin-card-header">
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-dark)' }}>{post.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: '2px' }}>{post.skill}</div>
                                </div>
                                {post.is_deleted ? (
                                    <span className="table-role-badge" style={{ background: '#FEE2E2', color: '#EF4444' }}>Deleted</span>
                                ) : (
                                    <span className="table-role-badge" style={{ background: '#D1FAE5', color: '#047857' }}>Active</span>
                                )}
                            </div>
                            <div className="admin-card-body">
                                <div className="admin-card-row">
                                    <span className="admin-card-label">Author</span>
                                    <div className="table-user">
                                        <div className="table-avatar" style={{ width: 24, height: 24, fontSize: '0.7rem' }}>
                                            {post.profiles?.avatar_url ? <img src={post.profiles.avatar_url} alt="" /> : post.profiles?.full_name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span style={{ fontSize: '0.85rem' }}>{post.profiles?.full_name}</span>
                                    </div>
                                </div>
                                <div className="admin-card-row">
                                    <span className="admin-card-label">Location</span>
                                    <span>{post.location || '-'}</span>
                                </div>
                                <div className="admin-card-row">
                                    <span className="admin-card-label">Date</span>
                                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="admin-card-footer">
                                <button className="table-action-btn admin-toggle" onClick={() => setSelectedPost(post)}>
                                    <Eye size={16} /> View
                                </button>
                                {post.is_deleted && (
                                    <button className="table-action-btn admin-toggle" style={{ color: '#16a34a' }} onClick={() => handleRestorePost(post.id)}>
                                        <RotateCcw size={16} /> Restore
                                    </button>
                                )}
                                <button className="table-action-btn delete" onClick={() => handleDeletePost(post.id, post.is_deleted)}>
                                    <Trash2 size={16} /> {post.is_deleted ? 'Permanent Delete' : 'Remove'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="admin-pagination">
                    <button 
                        className="pagination-btn" 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="pagination-info">
                        Page {currentPage} of {totalPages}
                    </div>
                    <button 
                        className="pagination-btn" 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
            {/* Post Detail Modal */}
            {selectedPost && (
                <PostDetailModal 
                    post={selectedPost} 
                    onClose={() => setSelectedPost(null)}
                    onDelete={handleDeletePost}
                    onRestore={handleRestorePost}
                />
            )}
        </div>
    );
};

export default AdminPosts;
