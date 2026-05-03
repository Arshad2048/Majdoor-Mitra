import React, { createContext, useContext, useState, useCallback } from 'react';

const AlertContext = createContext();

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState(null);

    const showAlert = useCallback((message, type = 'info', duration = 3000) => {
        setAlert({
            message,
            type,
            mode: 'toast',
            id: Date.now()
        });
        
        if (duration > 0) {
            setTimeout(() => {
                setAlert(prev => (prev?.mode === 'toast' ? null : prev));
            }, duration);
        }
    }, []);

    const showConfirm = useCallback((message, options = {}) => {
        return new Promise((resolve) => {
            setAlert({
                message,
                type: options.type || 'warning',
                mode: 'confirm',
                onConfirm: () => {
                    setAlert(null);
                    resolve(true);
                },
                onCancel: () => {
                    setAlert(null);
                    resolve(false);
                },
                confirmText: options.confirmText || 'Yes, Proceed',
                cancelText: options.cancelText || 'Cancel',
                title: options.title || 'Are you sure?'
            });
        });
    }, []);

    const closeAlert = useCallback(() => setAlert(null), []);

    return (
        <AlertContext.Provider value={{ alert, showAlert, showConfirm, closeAlert }}>
            {children}
        </AlertContext.Provider>
    );
};
