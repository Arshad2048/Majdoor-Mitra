import React from 'react';
import './Skeleton.css';

const Skeleton = ({ width, height, variant = 'text', className = '', style = {}, count = 1 }) => {
    const inlineStyles = {
        width: width || '100%',
        height: height || (variant === 'text' ? '1rem' : 'auto'),
        ...style
    };

    const elements = Array.from({ length: count }).map((_, i) => (
        <div 
            key={i}
            className={`skeleton-box skeleton-${variant} ${className}`} 
            style={inlineStyles}
        />
    ));

    return <>{elements}</>;
};

export default Skeleton;
