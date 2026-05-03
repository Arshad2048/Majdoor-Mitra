import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '', 
  ...props 
}) => {
  const classes = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} hover-lift ${className}`;
  return (
    <button className={classes.trim()} {...props}>
      {children}
    </button>
  );
};

export default Button;
