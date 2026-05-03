import React from 'react';
import {
    X, Grid, Search, Clock, ChevronDown, Check, Star,
    IndianRupee, Zap
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SKILLS } from '../../../constants/skills';
import SearchableSkillDropdown from '../SearchableSkillDropdown/SearchableSkillDropdown';
import './FilterDashboard.css';

const FilterDashboard = ({
    isOpen,
    onClose,
    // Skill state
    draftSkills,
    toggleSkill,
    // Exp state
    minExp,
    setMinExp,
    isExpDropdownOpen,
    setIsExpDropdownOpen,
    expDropdownRef,
    expOptions,
    // Rating state
    minRating,
    setMinRating,
    // Budget state
    maxBudget,
    setMaxBudget,
    // Urgency state
    urgencyFilter,
    setUrgencyFilter,
    // Actions
    onApply,
    onReset
}) => {
    const { t } = useTranslation();

    // Lock body scroll when drawer is open
    React.useEffect(() => {
        if (isOpen) {
            document.documentElement.classList.add('stop-scroll');
            document.body.classList.add('stop-scroll');
        } else {
            document.documentElement.classList.remove('stop-scroll');
            document.body.classList.remove('stop-scroll');
        }
        return () => {
            document.documentElement.classList.remove('stop-scroll');
            document.body.classList.remove('stop-scroll');
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="filter-drawer-overlay" onClick={onClose}>
            <div className="filter-dashboard-content" onClick={e => e.stopPropagation()}>
                <div className="filter-drawer-header">
                    <h3>{t('posts.filterDrawer.title')}</h3>
                    <div className="header-actions">
                        <button className="header-reset-btn" onClick={onReset} title={t('posts.filterDrawer.reset')}>
                            <span className="reset-label">{t('posts.filterDrawer.reset')}</span>
                        </button>
                        <button className="close-drawer-btn" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="filter-drawer-body">
                    {/* Category Selection Dropdown */}
                    <div className="filter-section categories-section">
                        <SearchableSkillDropdown
                            label={t('filterPage.title')}
                            selectedSkills={draftSkills || []}
                            onToggle={toggleSkill}
                            multiple={true}
                            accentColor="#1A3B2A"
                            placeholder={t('posts.searchPlaceholder')}
                        />
                    </div>

                    {/* Experience Section */}
                    <div className="filter-section premium-card">
                        <label className="filter-label">
                            <div className="label-with-icon">
                                <Clock size={18} className="section-icon" />
                                <span>{t('posts.filterDrawer.experience')}</span>
                            </div>
                            {minExp > 0 && <span className="filter-value-badge active">{minExp}+ {t('posts.filterDrawer.years')}</span>}
                        </label>
                        <div className="filter-select-wrapper" ref={expDropdownRef}>
                            <button
                                className={`custom-dropdown-toggle ${isExpDropdownOpen ? 'active' : ''}`}
                                onClick={() => setIsExpDropdownOpen(!isExpDropdownOpen)}
                            >
                                <span>{expOptions.find(opt => opt.value === minExp)?.label || t('posts.filterDrawer.any')}</span>
                                <ChevronDown size={20} className={`dropdown-icon ${isExpDropdownOpen ? 'rotate' : ''}`} />
                            </button>

                            {isExpDropdownOpen && (
                                <div className="custom-dropdown-menu">
                                    {expOptions.map(option => (
                                        <button
                                            key={option.value}
                                            className={`dropdown-item ${minExp === option.value ? 'selected' : ''}`}
                                            onClick={() => {
                                                setMinExp(option.value);
                                                setIsExpDropdownOpen(false);
                                            }}
                                        >
                                            <span className="item-label">{option.label}</span>
                                            {minExp === option.value && <Check size={16} className="selected-icon" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ratings Section */}
                    <div className="filter-section">
                        <label className="filter-label">
                            <div className="label-with-icon">
                                <Star size={18} className="section-icon" />
                                <span>{t('posts.filterDrawer.rating')}</span>
                            </div>
                            {minRating > 0 && <span className="filter-value-badge active">{minRating}★</span>}
                        </label>
                        <div className="rating-chips-container">
                            {[0, 3, 4, 4.5].map(rating => (
                                <button
                                    key={rating}
                                    className={`rating-chip-v2 ${minRating === rating ? 'active' : ''}`}
                                    onClick={() => setMinRating(rating)}
                                >
                                    {rating === 0 ? (
                                        <span>{t('posts.filterDrawer.any')}</span>
                                    ) : (
                                        <>
                                            <span>{rating}</span>
                                            <Star size={14} fill={minRating === rating ? "white" : "#FBBF24"} stroke={minRating === rating ? "white" : "#FBBF24"} />
                                        </>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Budget Section */}
                    <div className="filter-section premium-card">
                        <label className="filter-label">
                            <div className="label-with-icon">
                                <IndianRupee size={18} className="section-icon" />
                                <span>{t('posts.filterDrawer.budget')}</span>
                            </div>
                            <span className="filter-value-badge active">
                                {maxBudget >= 10000 ? t('posts.filterDrawer.any') : `₹${maxBudget}`}
                            </span>
                        </label>

                        {/* Quick Presets */}
                        <div className="budget-presets">
                            {[500, 1000, 2000, 5000, 10000].map(preset => (
                                <button
                                    key={preset}
                                    className={`preset-chip ${maxBudget === preset ? 'active' : ''}`}
                                    onClick={() => setMaxBudget(preset)}
                                >
                                    {preset === 10000 ? t('posts.filterDrawer.any') : `₹${preset}`}
                                </button>
                            ))}
                        </div>

                        <div className="slider-container">
                            <input
                                type="range"
                                min="300"
                                max="10000"
                                step="100"
                                value={maxBudget}
                                onChange={(e) => setMaxBudget(parseInt(e.target.value))}
                                className="filter-range-slider-v2"
                            />
                            <div className="range-labels-v2">
                                <span>₹300</span>
                                <span>{t('posts.filterDrawer.any')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Urgency Section */}
                    <div className="filter-section">
                        <label className="filter-label">
                            <div className="label-with-icon">
                                <Zap size={18} className="section-icon" />
                                <span>{t('posts.filterDrawer.urgency')}</span>
                            </div>
                        </label>
                        <div className="urgency-segmented-control">
                            <button
                                className={`segment-btn ${urgencyFilter === 'all' ? 'active' : ''}`}
                                onClick={() => setUrgencyFilter('all')}
                            >
                                {t('posts.filterDrawer.any')}
                            </button>
                            <button
                                className={`segment-btn urgent ${urgencyFilter === 'urgent' ? 'active' : ''}`}
                                onClick={() => setUrgencyFilter('urgent')}
                            >
                                <div className="urgent-dot"></div>
                                {t('posts.filterDrawer.urgent')}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="filter-drawer-footer">
                    <button className="filter-reset-btn-footer" onClick={onReset}>
                        {t('posts.filterDrawer.reset')}
                    </button>
                    <button className="filter-apply-btn" onClick={onApply}>
                        {t('posts.filterDrawer.apply')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterDashboard;
