import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import './PasswordStrength.css';

const PasswordStrength = ({ password, onStrengthChange }) => {
    const { t } = useTranslation();

    const requirements = useMemo(() => [
        { 
            id: 'length', 
            label: t('auth.strength.length'), 
            met: password.length >= 8 
        },
        { 
            id: 'upper', 
            label: t('auth.strength.upper'), 
            met: /[A-Z]/.test(password) 
        },
        { 
            id: 'lower', 
            label: t('auth.strength.lower'), 
            met: /[a-z]/.test(password) 
        },
        { 
            id: 'number', 
            label: t('auth.strength.number'), 
            met: /[0-9]/.test(password) 
        },
        { 
            id: 'special', 
            label: t('auth.strength.special'), 
            met: /[@$!%*?&]/.test(password) 
        }
    ], [password, t]);

    const strengthLevel = useMemo(() => {
        const metCount = requirements.filter(r => r.met).length;
        
        let level = 0;
        let text = t('auth.strength.weak');
        let classLabel = 'weak';

        if (metCount >= 5) {
            level = 4;
            text = t('auth.strength.strong');
            classLabel = 'strong';
        } else if (metCount >= 4) {
            level = 3;
            text = t('auth.strength.good');
            classLabel = 'good';
        } else if (metCount >= 2) {
            level = 2;
            text = t('auth.strength.fair');
            classLabel = 'fair';
        } else if (metCount >= 1) {
            level = 1;
            text = t('auth.strength.weak');
            classLabel = 'weak';
        }

        return { level, text, classLabel };
    }, [requirements, t]);

    // Use useEffect for side effects, NOT useMemo
    React.useEffect(() => {
        if (onStrengthChange) {
            onStrengthChange({
                level: strengthLevel.level,
                isSecure: strengthLevel.level >= 3
            });
        }
    }, [strengthLevel.level, onStrengthChange]);

    if (!password) return null;

    return (
        <div className="password-strength-container">
            <div className="strength-meta">
                <span className="strength-label">{t('auth.strength.label')}</span>
                <span className={`strength-text ${strengthLevel.classLabel}`}>
                    {strengthLevel.text}
                </span>
            </div>

            <div className={`strength-bar level-${strengthLevel.level}`}>
                <div className="strength-segment"></div>
                <div className="strength-segment"></div>
                <div className="strength-segment"></div>
                <div className="strength-segment"></div>
            </div>

            <div className="strength-requirements">
                {requirements.map(req => (
                    <div key={req.id} className={`requirement-item ${req.met ? 'met' : ''}`}>
                        <div className="requirement-icon">
                            {req.met && <Check size={10} strokeWidth={4} />}
                        </div>
                        <span className="requirement-label">{req.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PasswordStrength;
