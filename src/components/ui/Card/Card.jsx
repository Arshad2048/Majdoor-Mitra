import React from 'react';
import './Card.css';

const Card = ({ children, className = '', hoverable = false, onClick }) => {
    return (
        <div
            className={`card ${hoverable ? 'card-hoverable' : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;
