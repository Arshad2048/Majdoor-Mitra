import React from 'react';
import Skeleton from './Skeleton';

const PublicProfileSkeleton = () => (
    <div className="profile-shared-app">
        <div className="profile-shared-wrapper">
            <div className="profile-shared-cover">
                <Skeleton variant="rect" width="100%" height="220px" />
            </div>
            <div className="profile-shared-header">
                <div className="profile-shared-avatar-ring" style={{ border: '4px solid #fff', background: '#F0F2F5', borderRadius: '50%', width:'116px', height:'116px', margin: '0 auto 15px' }}>
                    <Skeleton variant="circle" width="100%" height="100%" />
                </div>
                
                <h1 className="profile-shared-name" style={{ marginTop: '16px' }}>
                    <Skeleton variant="text" width="200px" height="1.8rem" style={{ margin: '0 auto' }} />
                </h1>
                
                <Skeleton variant="rect" width="120px" height="24px" style={{ margin: '8px auto 16px', borderRadius: '16px', backgroundColor: '#E2E8F0' }} />
                
                <div className="profile-shared-rating-row" style={{ marginBottom: '16px', justifyContent: 'center' }}>
                    <Skeleton variant="text" width="60px" height="1.2rem" />
                    <Skeleton variant="text" width="80px" height="1.2rem" />
                </div>

                <Skeleton variant="rect" width="180px" height="44px" style={{ margin: '0 auto', borderRadius: '12px', backgroundColor: '#E2E8F0' }} />
            </div>

            <div className="profile-shared-stats">
                <div className="profile-stat-item"><Skeleton variant="text" width="40px" height="1.6rem" /><Skeleton variant="text" width="60px" height="0.9rem" /></div>
                <div className="profile-stat-divider"></div>
                <div className="profile-stat-item"><Skeleton variant="text" width="40px" height="1.6rem" /><Skeleton variant="text" width="60px" height="0.9rem" /></div>
                <div className="profile-stat-divider"></div>
                <div className="profile-stat-item"><Skeleton variant="text" width="40px" height="1.6rem" /><Skeleton variant="text" width="60px" height="0.9rem" /></div>
            </div>

            <div className="profile-shared-section">
                <Skeleton variant="text" width="80px" height="1.4rem" style={{ marginBottom: '16px' }} />
                <Skeleton variant="rect" width="100%" height="80px" style={{ borderRadius: '16px', backgroundColor: '#fff', border: '1px solid #E2E8F0' }} />
            </div>

            <div className="profile-shared-section">
                <Skeleton variant="text" width="100px" height="1.4rem" style={{ marginBottom: '16px' }} />
                <div className="profile-menu-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <Skeleton variant="circle" width="40px" height="40px" />
                        <div style={{ flex: 1 }}><Skeleton variant="text" width="60px" height="0.9rem" style={{ marginBottom: '4px' }}/><Skeleton variant="text" width="140px" height="1.1rem" /></div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <Skeleton variant="circle" width="40px" height="40px" />
                        <div style={{ flex: 1 }}><Skeleton variant="text" width="50px" height="0.9rem" style={{ marginBottom: '4px' }}/><Skeleton variant="text" width="120px" height="1.1rem" /></div>
                    </div>
                </div>
            </div>

            <div className="profile-shared-section">
                <Skeleton variant="text" width="90px" height="1.4rem" style={{ marginBottom: '16px' }} />
                <div className="profile-menu-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <Skeleton variant="circle" width="40px" height="40px" />
                        <div style={{ flex: 1 }}><Skeleton variant="text" width="100px" height="1.1rem" /></div>
                        <Skeleton variant="circle" width="16px" height="16px" />
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <Skeleton variant="circle" width="40px" height="40px" />
                        <div style={{ flex: 1 }}><Skeleton variant="text" width="100px" height="1.1rem" /></div>
                        <Skeleton variant="circle" width="16px" height="16px" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default PublicProfileSkeleton;
