import React from 'react';
import Skeleton from './Skeleton';

const ProfileSkeleton = () => (
    <div className="profile-shared-app" style={{ paddingBottom: '80px' }}>
        <div className="profile-shared-wrapper">
            <div className="profile-shared-cover">
                <Skeleton variant="rect" width="100%" height="220px" />
            </div>
            <div className="profile-shared-header">
                <div className="profile-shared-avatar-ring">
                    <Skeleton variant="circle" width="100px" height="100px" />
                </div>
                <Skeleton variant="text" width="180px" height="1.8rem" style={{ margin: '16px auto 8px' }} />
                <Skeleton variant="rect" width="100px" height="24px" style={{ margin: '0 auto 12px', borderRadius: '16px', backgroundColor: '#E2E8F0' }} />
                <Skeleton variant="text" width="150px" height="1rem" style={{ margin: '0 auto' }} />
            </div>
            <div className="profile-shared-stats">
                <div className="profile-stat-item"><Skeleton variant="text" width="40px" height="1.6rem" /><Skeleton variant="text" width="60px" height="0.9rem" /></div>
                <div className="profile-stat-divider"></div>
                <div className="profile-stat-item"><Skeleton variant="text" width="40px" height="1.6rem" /><Skeleton variant="text" width="60px" height="0.9rem" /></div>
                <div className="profile-stat-divider"></div>
                <div className="profile-stat-item"><Skeleton variant="text" width="40px" height="1.6rem" /><Skeleton variant="text" width="60px" height="0.9rem" /></div>
            </div>

            {/* About Section Skeleton */}
            <div className="profile-shared-section">
                <Skeleton variant="text" width="80px" height="1.4rem" style={{ marginBottom: '16px' }} />
                <Skeleton variant="rect" width="100%" height="80px" style={{ borderRadius: '16px', backgroundColor: '#fff', border: '1px solid #E2E8F0' }} />
            </div>

            {/* Personal Info Skeleton */}
            <div className="profile-shared-section">
                <Skeleton variant="text" width="120px" height="1.4rem" style={{ marginBottom: '16px' }} />
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

            {/* Account Skeleton */}
            <div className="profile-shared-section">
                <Skeleton variant="text" width="90px" height="1.4rem" style={{ marginBottom: '16px' }} />
                <div className="profile-menu-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    {[1, 2, 3, 4].map(idx => (
                        <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <Skeleton variant="circle" width="40px" height="40px" />
                            <div style={{ flex: 1 }}><Skeleton variant="text" width="120px" height="1.1rem" /></div>
                            <Skeleton variant="circle" width="16px" height="16px" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Logout Button Skeleton */}
            <Skeleton variant="rect" width="100%" height="56px" style={{ borderRadius: '16px', margin: '32px 0 16px', backgroundColor: '#fff', border: '1px solid currentColor' }} />
        </div>
    </div>
);

export default ProfileSkeleton;
