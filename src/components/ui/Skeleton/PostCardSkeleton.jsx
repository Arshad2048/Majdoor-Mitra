import React from 'react';
import Skeleton from './Skeleton';

const PostCardSkeleton = () => (
    <div className="post-card-v2" style={{ pointerEvents: 'none' }}>
        <div className="pc-top" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
            <Skeleton variant="circle" width="46px" height="46px" style={{ flexShrink: 0 }} />
            <div className="pc-user-info" style={{ flex: 1 }}>
                <Skeleton variant="text" width="130px" height="1.2rem" style={{ marginBottom: '6px' }} />
                <div className="pc-meta" style={{ display: 'flex', gap: '8px' }}>
                    <Skeleton variant="rect" width="60px" height="16px" style={{ borderRadius: '4px' }} />
                    <Skeleton variant="rect" width="50px" height="16px" style={{ borderRadius: '4px' }} />
                </div>
            </div>
            <Skeleton variant="rect" width="40px" height="24px" style={{ borderRadius: '6px', flexShrink: 0 }} />
        </div>
        <div className="pc-body">
            <Skeleton variant="text" width="85%" height="1.6rem" style={{ marginBottom: '12px' }} />
            <Skeleton variant="text" width="100%" height="0.95rem" style={{ marginBottom: '8px' }} />
            <Skeleton variant="text" width="75%" height="0.95rem" style={{ marginBottom: '16px' }} />

            <div className="pc-role-info" style={{ marginTop: '16px' }}>
                <div className="pc-tags" style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <Skeleton variant="rect" width="110px" height="30px" style={{ borderRadius: '16px', backgroundColor: '#F0FDF4' }} />
                    <Skeleton variant="rect" width="90px" height="30px" style={{ borderRadius: '16px', backgroundColor: '#FFF5F5' }} />
                </div>
                <div className="pc-badges" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <Skeleton variant="rect" width="80px" height="24px" style={{ borderRadius: '12px', backgroundColor: '#F8FAFC' }} />
                    <Skeleton variant="rect" width="100px" height="24px" style={{ borderRadius: '12px', backgroundColor: '#F8FAFC' }} />
                </div>
            </div>
        </div>
        <div className="pc-bottom" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <Skeleton variant="circle" width="16px" height="16px" />
                <Skeleton variant="text" width="120px" height="1rem" />
            </div>
            <Skeleton variant="rect" width="110px" height="40px" style={{ borderRadius: '12px', backgroundColor: '#1A3B2A', opacity: 0.6 }} />
        </div>
    </div>
);

export default PostCardSkeleton;
