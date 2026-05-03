import React, { useEffect, useState } from 'react';
import { useAlert } from '../../../context/AlertContext';
import { CheckCircle2, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';
import './CustomAlert.css';

const CustomAlert = () => {
    const { alert, closeAlert } = useAlert();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (alert) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [alert]);

    if (!alert && !isVisible) return null;

    const { message, type, mode, onConfirm, onCancel, confirmText, cancelText, title } = alert || {};

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle2 size={24} className="alert-icon-svg" />;
            case 'warning': return <AlertTriangle size={24} className="alert-icon-svg" />;
            case 'error': return <AlertCircle size={24} className="alert-icon-svg" />;
            default: return <Info size={24} className="alert-icon-svg" />;
        }
    };

    if (mode === 'toast') {
        return (
            <div className={`custom-toast-container ${isVisible ? 'visible' : 'hide'}`}>
                <div className={`custom-toast toast-${type}`}>
                    <div className="toast-content">
                        {getIcon()}
                        <span className="toast-message">{message}</span>
                    </div>
                </div>
            </div>
        );
    }

    if (mode === 'confirm') {
        return (
            <div className={`custom-modal-overlay ${isVisible ? 'visible' : 'hide'}`} onClick={onCancel}>
                <div className="custom-modal-box" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <div className={`modal-icon-wrapper icon-${type}`}>
                            {getIcon()}
                        </div>
                        <h3 className="modal-title">{title}</h3>
                    </div>
                    <div className="modal-body">
                        <p>{message}</p>
                    </div>
                    <div className="modal-footer">
                        <button className="modal-btn-cancel" onClick={onCancel}>{cancelText}</button>
                        <button className={`modal-btn-confirm btn-${type}`} onClick={onConfirm}>{confirmText}</button>
                    </div>
                    <button className="modal-close-x" onClick={onCancel}>
                        <X size={20} />
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default CustomAlert;
