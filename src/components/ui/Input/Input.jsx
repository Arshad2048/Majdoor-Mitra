import React from 'react';
import './Input.css';

const Input = ({ label, id, error, icon: Icon, prefix, action: Action, className = '', ...props }) => {
    const renderIcon = () => {
        if (!Icon) return null;

        // If it's a pre-rendered React element (e.g., <Mail size={18} />)
        if (React.isValidElement(Icon)) {
            return React.cloneElement(Icon, {
                className: `input-icon-left ${Icon.props.className || ''}`.trim(),
                size: Icon.props.size || 18
            });
        }

        // If it's a component reference (e.g., Mail)
        const IconComp = Icon;
        return <IconComp className="input-icon-left" size={18} />;
    };

    return (
        <div className={`input-group ${className}`}>
            {label && <label htmlFor={id} className="input-label">{label}</label>}
            <div className={`input-icon-wrapper ${error ? 'border-error' : ''}`}>
                {renderIcon()}
                {prefix && <span className="input-prefix">{prefix}</span>}
                <input 
                    id={id} 
                    className={`input-field ${error ? 'input-error' : ''} ${Icon ? 'with-icon' : ''} ${prefix ? 'with-prefix' : ''} ${Action ? 'with-action' : ''}`} 
                    {...props} 
                />
                {Action && <div className="input-action-right">{Action}</div>}
            </div>
            {error && <span className="error-text">{error}</span>}
        </div>
    );
};

export default Input;
