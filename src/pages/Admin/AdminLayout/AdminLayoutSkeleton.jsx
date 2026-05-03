import React from 'react';
import '../AdminSkeleton.css';
import './AdminLayout.css';

const AdminLayoutSkeleton = () => {
    return (
        <div className="admin-layout skeleton-grid" style={{ pointerEvents: 'none' }}>
            {/* Sidebar Skeleton */}
            <aside className="admin-sidebar" style={{ background: '#fff' }}>
                <div className="admin-sidebar-header">
                    <div className="skeleton-base" style={{ width: '120px', height: '30px', borderRadius: '6px' }}></div>
                </div>
                <div className="admin-nav">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="skeleton-base" style={{ height: '45px', borderRadius: '12px', marginBottom: '8px' }}></div>
                    ))}
                    <div style={{ flex: 1 }}></div>
                    <div className="skeleton-base" style={{ height: '45px', borderRadius: '12px', marginTop: 'auto' }}></div>
                </div>
            </aside>

            {/* Content Area Skeleton */}
            <div className="admin-content">
                <header className="admin-topbar">
                    <div className="admin-topbar-left">
                        <div className="skeleton-base" style={{ width: '150px', height: '24px', borderRadius: '4px' }}></div>
                    </div>
                    <div className="admin-topbar-right">
                        <div className="skeleton-base" style={{ width: '32px', height: '32px', borderRadius: '50%' }}></div>
                        <div className="skeleton-base desktop-only" style={{ width: '100px', height: '16px', borderRadius: '4px' }}></div>
                        <div className="skeleton-base" style={{ width: '80px', height: '32px', borderRadius: '8px' }}></div>
                    </div>
                </header>

                <main className="admin-main">
                    <div className="admin-dashboard-grid">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="skeleton-stat-card">
                                <div className="skeleton-stat-header">
                                    <div className="skeleton-base skeleton-icon-box"></div>
                                </div>
                                <div className="skeleton-base skeleton-stat-title"></div>
                                <div className="skeleton-base skeleton-stat-value"></div>
                                <div className="skeleton-base skeleton-stat-trend"></div>
                            </div>
                        ))}
                    </div>
                    <div className="skeleton-section-header">
                        <div className="skeleton-base skeleton-header-title"></div>
                    </div>
                    <div className="admin-charts-grid">
                        <div className="skeleton-chart-card skeleton-base"></div>
                        <div className="skeleton-chart-card skeleton-base"></div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayoutSkeleton;
