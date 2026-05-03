import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, ChevronDown, Check, X, Search } from 'lucide-react';
import { SKILLS } from '../../../constants/skills';
import './SearchableSkillDropdown.css';

const SearchableSkillDropdown = ({ 
    selectedSkills = [], 
    onToggle, 
    multiple = true, 
    accentColor = '#F25C05',
    label,
    placeholder,
    error
}) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const skillKeys = SKILLS.map(s => s.id);
    const filteredSkillKeys = skillKeys.filter(key => 
        t(`skills.${key}`).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (skillKey) => {
        onToggle(skillKey);
        if (!multiple) setIsOpen(false);
    };

    const selectedArray = Array.isArray(selectedSkills) ? selectedSkills : (selectedSkills ? [selectedSkills] : []);

    return (
        <div className="skills-dropdown-container" ref={dropdownRef}>
            {label && <label className="input-label">{label}</label>}
            <div 
                className={`skills-field-trigger ${isOpen ? 'active' : ''} ${error ? 'input-error' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                style={isOpen ? { borderColor: accentColor, boxShadow: `0 0 0 3px ${accentColor}15` } : {}}
            >
                <Briefcase size={18} className="skills-field-icon" style={{ color: isOpen ? accentColor : '#94A3B8', flexShrink: 0 }} />
                <div className="skills-tag-pills">
                    {selectedArray.length > 0 ? (
                        <>
                            {selectedArray.slice(0, 1).map(skillKey => (
                                <span 
                                    key={skillKey} 
                                    className="skill-pill-tag"
                                    style={{ background: `${accentColor}12`, border: `1px solid ${accentColor}20` }}
                                >
                                    {skillKeys.includes(skillKey) ? t(`skills.${skillKey}`) : skillKey}
                                    {multiple && (
                                        <span 
                                            className="skill-pill-remove"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggle(skillKey);
                                            }}
                                        >×</span>
                                    )}
                                </span>
                            ))}
                            {selectedArray.length > 1 && (
                                <span 
                                    className="skill-pill-tag"
                                    style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#4A5568', fontWeight: 600 }}
                                >
                                    +{selectedArray.length - 1} more
                                </span>
                            )}
                        </>
                    ) : (
                        <span style={{ color: '#94A3B8' }}>{placeholder || t('register.selectSkill')}</span>
                    )}
                </div>
                <ChevronDown 
                    size={18} 
                    className="select-arrow"
                    style={{ 
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                        color: isOpen ? accentColor : '#94A3B8'
                    }} 
                />
            </div>
            
            {isOpen && (
                <div className="skills-dropdown-menu">
                    <div className="skills-menu-search-wrapper">
                        <div className="search-input-inner">
                            <Search size={16} className="search-icon" />
                            <input 
                                type="text"
                                className="skills-menu-search-input"
                                placeholder={t('common.search')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="skills-menu-list">
                        {filteredSkillKeys.length > 0 ? (
                            filteredSkillKeys.map(skillKey => {
                                const isSelected = selectedArray.includes(skillKey);
                                return (
                                    <div 
                                        key={skillKey}
                                        className={`skill-dropdown-item ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleSelect(skillKey)}
                                    >
                                        <div 
                                            className="skill-checkbox-visual"
                                            style={isSelected ? { background: accentColor, borderColor: accentColor } : {}}
                                        >
                                            {isSelected && <Check size={12} className="check-icon" />}
                                        </div>
                                        <span className="skill-name" style={{ color: isSelected ? '#1A3B2A' : '#4A5568', fontWeight: isSelected ? '600' : '500' }}>
                                            {t(`skills.${skillKey}`)}
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="skill-no-results">{t('posts.noListings')}</div>
                        )}
                    </div>
                </div>
            )}
            {error && <span className="error-text">{error}</span>}
        </div>
    );
};

export default SearchableSkillDropdown;
