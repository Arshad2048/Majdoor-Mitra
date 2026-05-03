import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import { useAlert } from '../../../context/AlertContext';
import { Search, Trash2, Ban, UserCheck, Shield, Download, ChevronLeft, ChevronRight, Eye, ChevronDown } from 'lucide-react';
import UserDetailModal from './UserDetailModal';
import './AdminUsers.css';
import '../AdminSkeleton.css';

const AdminUsers = () => {
    const { showAlert, showConfirm } = useAlert();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [roleMenuOpen, setRoleMenuOpen] = useState(false);
    const [statusMenuOpen, setStatusMenuOpen] = useState(false);
    const itemsPerPage = 10;

    // Convert raw DB role to a clean display label
    const formatRole = (role) => {
        const roleMap = {
            'normal_user': 'Normal User',
            'labour': 'Labour',
            'contractor': 'Contractor',
            'admin': 'Admin',
        };
        return roleMap[role] || role;
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            let query = supabase.from('profiles').select('*', { count: 'exact' });
            
            if (searchTerm.trim()) {
                query = query.ilike('full_name', `%${searchTerm}%`);
            }

            if (filterRole !== 'all') {
                query = query.eq('role', filterRole);
            }

            if (filterStatus !== 'all') {
                if (filterStatus === 'banned') {
                    query = query.eq('is_banned', true);
                } else if (filterStatus === 'active') {
                    query = query.eq('is_banned', false);
                } else if (filterStatus === 'admin') {
                    query = query.eq('is_admin', true);
                }
            }

            const from = (currentPage - 1) * itemsPerPage;
            const to = from + itemsPerPage - 1;

            const { data, error, count } = await query
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;
            setUsers(data || []);
            setTotalCount(count || 0);
        } catch (error) {
            console.error(error);
            showAlert('Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1); // Reset to first page on search
    }, [searchTerm]);

    useEffect(() => {
        fetchUsers();
    }, [searchTerm, currentPage, filterRole, filterStatus]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.admin-filter-group')) {
                setRoleMenuOpen(false);
                setStatusMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDeleteUser = async (userId) => {
        const confirmed = await showConfirm(
            'Are you sure you want to delete this user? This action cannot be undone.',
            { title: 'Delete User', confirmText: 'Delete', type: 'error' }
        );

        if (confirmed) {
            try {
                // To safely delete a user in Supabase without deleting the Auth account (which requires service_role),
                // we can soft-delete or anonymize their profile, or we can use an Edge Function.
                // For MVP, we will soft-delete or just throw an alert explaining the limitation.
                
                // Let's assume we have a `banned` flag or we just delete from profiles table 
                // Note: Auth deletion requires service_role key.
                const { error } = await supabase.from('profiles').delete().eq('id', userId);
                if (error) throw error;
                
                setUsers(prev => prev.filter(u => u.id !== userId));
                showAlert('User profile deleted successfully', 'success');
            } catch (error) {
                console.error(error);
                showAlert('Could not delete user. Might violate foreign keys.', 'error');
            }
        }
    };

    const handleUserUpdate = (userId, updates) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
        // Also update the selected user so the modal reflects changes in real-time
        setSelectedUser(prev => prev && prev.id === userId ? { ...prev, ...updates } : prev);
    };

    const handleToggleAdmin = async (userId, currentStatus) => {
        const confirmed = await showConfirm(
            `Are you sure you want to ${currentStatus ? 'revoke' : 'grant'} admin rights?`,
            { title: 'Change Role', confirmText: 'Confirm' }
        );

        if (confirmed) {
            try {
                const { error } = await supabase.from('profiles').update({ is_admin: !currentStatus }).eq('id', userId);
                if (error) throw error;
                
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_admin: !currentStatus } : u));
                showAlert('User role updated', 'success');
            } catch (error) {
                console.error(error);
                showAlert('Could not update user role', 'error');
            }
        }
    };

    const handleDownloadCSV = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('full_name, email, phone, role, created_at, is_admin')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const csvRows = [
                ['Full Name', 'Email', 'Phone', 'Role', 'Joined Date', 'Last Seen', 'Account Status', 'Is Admin'],
                ...data.map(user => [
                    user.full_name,
                    user.email || 'N/A',
                    user.phone ? `+91 ${user.phone.replace('+91', '').trim()}` : 'N/A',
                    formatRole(user.role),
                    new Date(user.created_at).toLocaleDateString('en-GB'),
                    user.last_seen_at ? new Date(user.last_seen_at).toLocaleString('en-GB') : 'Never',
                    user.is_banned ? 'Suspended' : 'Active',
                    user.is_admin ? 'Yes' : 'No'
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
            a.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
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
                        placeholder="Search by name..." 
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                
                <div className="admin-filters">
                    <div className="admin-filter-group">
                        <button 
                            className={`admin-filter-trigger ${filterRole !== 'all' ? 'active' : ''}`}
                            onClick={() => { setRoleMenuOpen(!roleMenuOpen); setStatusMenuOpen(false); }}
                        >
                            <span>{filterRole === 'all' ? 'All Roles' : formatRole(filterRole)}</span>
                            <ChevronDown size={14} style={{ transform: roleMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>
                        {roleMenuOpen && (
                            <div className="admin-filter-menu">
                                <div className={`admin-filter-option ${filterRole === 'all' ? 'selected' : ''}`} onClick={() => { setFilterRole('all'); setRoleMenuOpen(false); setCurrentPage(1); }}>All Roles</div>
                                <div className={`admin-filter-option ${filterRole === 'normal_user' ? 'selected' : ''}`} onClick={() => { setFilterRole('normal_user'); setRoleMenuOpen(false); setCurrentPage(1); }}>Normal Users</div>
                                <div className={`admin-filter-option ${filterRole === 'labour' ? 'selected' : ''}`} onClick={() => { setFilterRole('labour'); setRoleMenuOpen(false); setCurrentPage(1); }}>Labours</div>
                                <div className={`admin-filter-option ${filterRole === 'contractor' ? 'selected' : ''}`} onClick={() => { setFilterRole('contractor'); setRoleMenuOpen(false); setCurrentPage(1); }}>Contractors</div>
                                <div className={`admin-filter-option ${filterRole === 'admin' ? 'selected' : ''}`} onClick={() => { setFilterRole('admin'); setRoleMenuOpen(false); setCurrentPage(1); }}>Admins</div>
                            </div>
                        )}
                    </div>

                    <div className="admin-filter-group">
                        <button 
                            className={`admin-filter-trigger ${filterStatus !== 'all' ? 'active' : ''}`}
                            onClick={() => { setStatusMenuOpen(!statusMenuOpen); setRoleMenuOpen(false); }}
                        >
                            <span>{filterStatus === 'all' ? 'All Status' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}</span>
                            <ChevronDown size={14} style={{ transform: statusMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>
                        {statusMenuOpen && (
                            <div className="admin-filter-menu">
                                <div className={`admin-filter-option ${filterStatus === 'all' ? 'selected' : ''}`} onClick={() => { setFilterStatus('all'); setStatusMenuOpen(false); setCurrentPage(1); }}>All Status</div>
                                <div className={`admin-filter-option ${filterStatus === 'active' ? 'selected' : ''}`} onClick={() => { setFilterStatus('active'); setStatusMenuOpen(false); setCurrentPage(1); }}>Active</div>
                                <div className={`admin-filter-option ${filterStatus === 'banned' ? 'selected' : ''}`} onClick={() => { setFilterStatus('banned'); setStatusMenuOpen(false); setCurrentPage(1); }}>Banned</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="admin-toolbar-actions">
                    <span className="admin-count-badge">{totalCount} Users</span>
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
                                            <div className="skeleton-table-user">
                                                <div className="skeleton-base skeleton-table-avatar skeleton-circle"></div>
                                                <div style={{flex: 1}}>
                                                    <div className="skeleton-base skeleton-text-line medium"></div>
                                                    <div className="skeleton-base skeleton-text-line short" style={{marginBottom: 0}}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><div className="skeleton-base skeleton-text-line short" style={{height: '24px', borderRadius: '12px', width: '80px', marginBottom: 0}}></div></td>
                                        <td><div className="skeleton-base skeleton-text-line" style={{width: '100px', marginBottom: 0}}></div></td>
                                        <td><div className="skeleton-base skeleton-text-line" style={{width: '80px', marginBottom: 0}}></div></td>
                                        <td><div className="skeleton-base skeleton-text-line short" style={{marginBottom: 0}}></div></td>
                                        <td>
                                            <div style={{display: 'flex', gap: '8px'}}>
                                                <div className="skeleton-base skeleton-circle" style={{width: '32px', height: '32px'}}></div>
                                                <div className="skeleton-base skeleton-circle" style={{width: '32px', height: '32px'}}></div>
                                                <div className="skeleton-base skeleton-circle" style={{width: '32px', height: '32px'}}></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : users.length === 0 ? (
                    <div className="admin-table-empty">No users found.</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Phone</th>
                                <th>Joined</th>
                                <th>Admin Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr 
                                    key={user.id} 
                                    onClick={() => setSelectedUser(user)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td>
                                        <div className="table-user">
                                            <div className="table-avatar">
                                                {user.avatar_url ? <img src={user.avatar_url} alt="" /> : user.full_name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="table-user-info">
                                                <div className="table-user-name">{user.full_name}</div>
                                                <div className="table-user-email">{user.email || 'No email provided'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`table-role-badge ${user.role}`}>
                                            {formatRole(user.role)}
                                        </span>
                                    </td>
                                    <td>{user.phone || '-'}</td>
                                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td>
                                        {user.is_admin ? (
                                            <span className="table-admin-badge"><Shield size={14}/> Admin</span>
                                        ) : user.is_banned ? (
                                            <span className="table-banned-badge">Suspended</span>
                                        ) : (
                                            <span className="table-normal-badge">User</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button 
                                                className="table-action-btn admin-toggle"
                                                onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }}
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button 
                                                className="table-action-btn admin-toggle"
                                                onClick={(e) => { e.stopPropagation(); handleToggleAdmin(user.id, user.is_admin); }}
                                                title="Toggle Admin Rights"
                                            >
                                                <UserCheck size={16} />
                                            </button>
                                            <button 
                                                className="table-action-btn delete"
                                                onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.id); }}
                                                title="Delete Profile"
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
                                    <div className="skeleton-table-user" style={{width: '100%'}}>
                                        <div className="skeleton-table-avatar skeleton-circle" style={{background: 'rgba(255,255,255,0.5)'}}></div>
                                        <div style={{flex: 1}}>
                                            <div className="skeleton-text-line medium" style={{background: 'rgba(255,255,255,0.5)'}}></div>
                                            <div className="skeleton-text-line short" style={{marginBottom: 0, background: 'rgba(255,255,255,0.3)'}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : users.length === 0 ? (
                    <div className="admin-table-empty">No users found.</div>
                ) : (
                    users.map(user => (
                        <div 
                            key={user.id} 
                            className="admin-card"
                            onClick={() => setSelectedUser(user)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="admin-card-header">
                                <div className="table-user">
                                    <div className="table-avatar">
                                        {user.avatar_url ? <img src={user.avatar_url} alt="" /> : user.full_name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="table-user-info">
                                        <div className="table-user-name">{user.full_name}</div>
                                        <div className="table-user-email">{user.email || 'No email'}</div>
                                    </div>
                                </div>
                                <div className="table-actions">
                                    <button className="table-action-btn admin-toggle" onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }}><Eye size={16} /></button>
                                    <button className="table-action-btn admin-toggle" onClick={(e) => { e.stopPropagation(); handleToggleAdmin(user.id, user.is_admin); }}><UserCheck size={16} /></button>
                                    <button className="table-action-btn delete" onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.id); }}><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div className="admin-card-body">
                                <div className="admin-card-row">
                                    <span className="admin-card-label">Role</span>
                                    <span className={`table-role-badge ${user.role}`}>{formatRole(user.role)}</span>
                                </div>
                                <div className="admin-card-row">
                                    <span className="admin-card-label">Phone</span>
                                    <span>{user.phone || '-'}</span>
                                </div>
                                <div className="admin-card-row">
                                    <span className="admin-card-label">Joined</span>
                                    <span>{new Date(user.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="admin-card-row">
                                    <span className="admin-card-label">Status</span>
                                    {user.is_admin ? (
                                        <span className="table-admin-badge"><Shield size={14}/> Admin</span>
                                    ) : user.is_banned ? (
                                        <span className="table-banned-badge">Suspended</span>
                                    ) : (
                                        <span className="table-normal-badge">User</span>
                                    )}
                                </div>
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
            {/* User Detail Modal */}
            {selectedUser && (
                <UserDetailModal 
                    user={selectedUser} 
                    onClose={() => setSelectedUser(null)} 
                    onUserUpdate={handleUserUpdate}
                />
            )}
        </div>
    );
};

export default AdminUsers;
