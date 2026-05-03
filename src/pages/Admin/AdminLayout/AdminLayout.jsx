import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
    LayoutDashboard, Users, FileText, Settings, 
    LogOut, Menu, X, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAlert } from '../../../context/AlertContext';
import logo from '../../../assets/logo.png';
import AdminNotifications from './AdminNotifications';
import './AdminLayout.css';

const AdminLayout = () => {
    const { t } = useTranslation();
    const { user, profile, logout } = useAuth();
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await logout();
            showAlert('Logged out successfully', 'success');
            navigate('/login');
        } catch (error) {
            showAlert('Error logging out', 'error');
        }
    };

    const getPageTitle = () => {
        if (location.pathname === '/admin') return 'Dashboard';
        if (location.pathname.includes('/admin/users')) return 'User Management';
        if (location.pathname.includes('/admin/posts')) return 'Post Management';
        return 'Admin Panel';
    };

    const userName = profile?.full_name || 'Admin';
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <div className="admin-layout core-fade-in">
            {/* Sidebar Overlay for Mobile */}
            <div 
                className={`admin-sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="admin-sidebar-header">
                    <NavLink to="/admin" className="admin-logo">
                        <img src={logo} alt="Logo" />
                        {!sidebarCollapsed && <span className="logo-text">Admin</span>}
                    </NavLink>
                    <button 
                        className="sidebar-collapse-btn"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    >
                        {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                <nav className="admin-nav">
                    <NavLink to="/admin" end className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`} title="Dashboard">
                        <LayoutDashboard size={20} />
                        {!sidebarCollapsed && <span>Dashboard</span>}
                    </NavLink>
                    <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`} title="Users">
                        <Users size={20} />
                        {!sidebarCollapsed && <span>Users</span>}
                    </NavLink>
                    <NavLink to="/admin/posts" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`} title="Posts">
                        <FileText size={20} />
                        {!sidebarCollapsed && <span>Posts</span>}
                    </NavLink>
                    <div style={{ flex: 1 }}></div>
                    <NavLink to="/" className="admin-nav-item" title="Exit Admin" style={{ marginTop: 'auto', borderTop: '1px solid rgba(0,0,0,0.05)', borderRadius: 0, padding: '16px' }}>
                        <LogOut size={20} style={{ transform: 'rotate(180deg)' }} />
                        {!sidebarCollapsed && <span>Exit Admin</span>}
                    </NavLink>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className={`admin-content ${sidebarCollapsed ? 'expanded' : ''}`}>
                <header className="admin-topbar">
                    <div className="admin-topbar-left">
                        <button 
                            className="mobile-menu-btn"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="admin-title">{getPageTitle()}</h1>
                    </div>

                    <div className="admin-topbar-right">
                        <AdminNotifications />
                        <div className="admin-profile">
                            <div className="admin-avatar">
                                {profile?.avatar_url ? <img src={profile.avatar_url} alt="" /> : userInitial}
                            </div>
                            <span className="admin-name">{userName}</span>
                        </div>
                        <button className="admin-logout" onClick={handleLogout}>
                            <LogOut size={16} />
                            <span className="admin-name">Logout</span>
                        </button>
                    </div>
                </header>

                <main className="admin-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
