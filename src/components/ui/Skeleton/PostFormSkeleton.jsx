import React from 'react';
import Skeleton from './Skeleton';
import Card from '../Card/Card';

const PostFormSkeleton = () => (
    <div className="posts-shared-app">
        <div className="posts-shared-wrapper">
            <Card className="posts-shared-card">
                <div className="posts-shared-header" style={{ background: '#E2E8F0', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Skeleton variant="circle" width="56px" height="56px" style={{ marginBottom: '16px', backgroundColor: '#fff', border: '2px solid rgba(0,0,0,0.05)' }} />
                    <Skeleton variant="text" width="260px" height="2rem" style={{ marginBottom: '12px', backgroundColor: 'rgba(255,255,255,0.7)' }} />
                    <Skeleton variant="text" width="80%" height="1.1rem" style={{ maxWidth: '440px', backgroundColor: 'rgba(255,255,255,0.5)' }} />
                </div>
                
                <div className="posts-shared-form" style={{ padding: '36px' }}>
                    <div className="form-section" style={{ marginBottom: '32px' }}>
                        <Skeleton variant="text" width="180px" height="1.2rem" style={{ marginBottom: '16px' }} />
                        <Skeleton variant="rect" width="100%" height="52px" style={{ borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: '#F7FAFC' }} />
                    </div>
                    <div className="form-section" style={{ marginBottom: '32px' }}>
                        <Skeleton variant="text" width="140px" height="1.2rem" style={{ marginBottom: '16px' }} />
                        <div className="cp-chip-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                <Skeleton key={i} variant="rect" width={['90px','110px','85px','120px','100px','130px','95px'][i-1]} height="40px" style={{ borderRadius: '24px', backgroundColor: '#F0F2F5', border: '1px solid #E2E8F0', margin: 0 }} />
                            ))}
                        </div>
                    </div>
                    <div className="form-section" style={{ marginBottom: '32px' }}>
                        <Skeleton variant="text" width="150px" height="1.2rem" style={{ marginBottom: '16px' }} />
                        <div style={{ display: 'flex', gap: '6px', background: '#F0F2F5', padding: '6px', borderRadius: '12px' }}>
                            <Skeleton variant="rect" height="40px" style={{ flex: 1, borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }} />
                            <Skeleton variant="rect" height="40px" style={{ flex: 1, borderRadius: '8px', backgroundColor: 'transparent' }} />
                            <Skeleton variant="rect" height="40px" style={{ flex: 1, borderRadius: '8px', backgroundColor: 'transparent' }} />
                        </div>
                    </div>
                    <div className="form-section" style={{ marginBottom: '40px' }}>
                        <Skeleton variant="text" width="190px" height="1.2rem" style={{ marginBottom: '16px' }} />
                        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <Skeleton variant="rect" width="100%" height="52px" style={{ borderRadius: '12px', backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }} />
                            <Skeleton variant="rect" width="100%" height="52px" style={{ borderRadius: '12px', backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }} />
                        </div>
                    </div>
                    <div className="create-post-actions" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <Skeleton variant="rect" width="100px" height="48px" style={{ borderRadius: '8px', backgroundColor: '#F0F2F5' }} />
                        <Skeleton variant="rect" style={{ flex: 1, height: '48px', borderRadius: '8px', backgroundColor: '#E2E8F0' }} />
                    </div>
                </div>
            </Card>
        </div>
    </div>
);

export default PostFormSkeleton;
