import React from 'react';
import Skeleton from './Skeleton';
import '../../../pages/Profile/shared/ProfileShared.css';
import '../../../pages/Profile/Edit/EditProfile.css';

const EditProfileSkeleton = () => {
    return (
        <div className="profile-shared-app">
            <div className="profile-shared-wrapper">
                <div className="edit-header">
                    <Skeleton variant="circle" width="40px" height="40px" />
                    <h2 className="edit-header-title">
                        <Skeleton variant="text" width="120px" height="1.5rem" style={{ margin: '0 auto' }} />
                    </h2>
                    <div style={{ width: 36 }}></div>
                </div>
                <div className="ep-banner-section" style={{ position: 'relative' }}>
                    <Skeleton variant="rect" width="100%" height="220px" style={{ borderRadius: '16px' }} />
                </div>
                <div className="edit-avatar-section" style={{ marginTop: '-50px', position: 'relative', zIndex: 10 }}>
                    <div className="edit-avatar-ring" style={{ background: '#F0F2F5', border: 'none' }}>
                        <Skeleton variant="circle" width="100%" height="100%" />
                    </div>
                </div>
                <div className="edit-form">
                    <div className="edit-form-section" style={{ marginTop: '24px' }}>
                        <Skeleton variant="text" width="100px" height="1.2rem" style={{ marginBottom: '12px' }} />
                        <div className="edit-form-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                            <Skeleton variant="rect" width="100%" height="56px" style={{ borderRadius: '12px', backgroundColor: '#F7FAFC' }} />
                            <Skeleton variant="rect" width="100%" height="56px" style={{ borderRadius: '12px', backgroundColor: '#F7FAFC' }} />
                            <Skeleton variant="rect" width="100%" height="56px" style={{ borderRadius: '12px', backgroundColor: '#F7FAFC' }} />
                        </div>
                    </div>
                    <div className="edit-form-section">
                        <Skeleton variant="text" width="100px" height="1.2rem" style={{ marginBottom: '12px' }} />
                        <div className="edit-form-card" style={{ padding: '16px', backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
                            <Skeleton variant="rect" width="100%" height="56px" style={{ borderRadius: '12px', backgroundColor: '#F7FAFC' }} />
                        </div>
                    </div>
                    <div className="edit-form-section">
                        <Skeleton variant="text" width="100px" height="1.2rem" style={{ marginBottom: '12px' }} />
                        <div className="edit-form-card" style={{ padding: '16px', backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
                            <Skeleton variant="rect" width="100%" height="120px" style={{ borderRadius: '12px', backgroundColor: '#F7FAFC' }} />
                        </div>
                    </div>
                </div>
                <div className="edit-save-panel" style={{ marginTop: '32px' }}>
                    <Skeleton variant="rect" width="100%" height="56px" style={{ borderRadius: '16px', backgroundColor: '#1A3B2A', opacity: 0.6 }} />
                </div>
            </div>
        </div>
    );
};

export default EditProfileSkeleton;
