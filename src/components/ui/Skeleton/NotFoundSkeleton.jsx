import React from 'react';
import Skeleton from './Skeleton';

const NotFoundSkeleton = () => (
    <div className="notfound-wrapper" style={{ pointerEvents: 'none' }}>
        <div className="notfound-bg-text" style={{ opacity: 0.05 }}>404</div>
        <div className="notfound-content">
            <h1 className="notfound-title">
                <Skeleton variant="text" width="280px" height="3rem" style={{ margin: '0 auto' }} />
            </h1>
            <p className="notfound-description">
                <Skeleton variant="text" width="90%" height="1.1rem" style={{ margin: '0 auto 8px' }} />
                <Skeleton variant="text" width="70%" height="1.1rem" style={{ margin: '0 auto' }} />
            </p>
            <div className="notfound-buttons" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <Skeleton variant="rect" width="160px" height="52px" style={{ borderRadius: '14px' }} />
                <Skeleton variant="rect" width="140px" height="52px" style={{ borderRadius: '14px' }} />
            </div>
        </div>
        <div className="notfound-visual">
            <Skeleton variant="rect" width="100%" height="240px" style={{ borderRadius: '24px' }} />
        </div>
    </div>
);

export default NotFoundSkeleton;
