import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
    Briefcase, Wrench, Clock, IndianRupee, CalendarDays, 
    FileText, Building2, Users, Zap, MapPin, Phone, 
    ChevronDown, Plus, Check, X 
} from 'lucide-react';
import Input from '../../ui/Input/Input';
import Button from '../../ui/Button/Button';
import SearchableSkillDropdown from '../SearchableSkillDropdown/SearchableSkillDropdown';
import './PostForm.css';

const SegmentedControl = ({ options, value, onChange, accentColor }) => {
    const selectedIndex = options.findIndex(opt => opt.value === value);
    
    return (
        <div className="cp-segmented">
            <div 
                className="cp-slider" 
                style={{ 
                    width: `calc((100% - 12px - ${(options.length - 1) * 4}px) / ${options.length})`,
                    transform: `translateX(calc(${selectedIndex * 100}% + ${selectedIndex * 4}px))`, 
                    background: accentColor 
                }}
            ></div>
            {options.map(opt => (
                <button
                    type="button"
                    key={opt.value}
                    className={`cp-segment ${value === opt.value ? 'cp-segment-active' : ''}`}
                    onClick={() => onChange(opt.value)}
                    style={value === opt.value ? { color: '#fff' } : {}}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};

const PostForm = ({ 
    initialData = null, 
    onSubmit, 
    isSubmitting, 
    role, 
    profile, 
    accentColor = '#1A3B2A' 
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    // ─── Shared State ───
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [customSkill, setCustomSkill] = useState('');
    const [showCustomSkillInput, setShowCustomSkillInput] = useState(false);

    // ─── Labour State ───
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [experience, setExperience] = useState('');
    const [expectedPay, setExpectedPay] = useState('');
    const [payType, setPayType] = useState('per_day');
    const [availability, setAvailability] = useState('available_now');
    const [isExpDropdownOpen, setIsExpDropdownOpen] = useState(false);
    const expDropdownRef = useRef(null);

    // ─── Contractor State ───
    const [workersNeeded, setWorkersNeeded] = useState('');
    const [requiredSkills, setRequiredSkills] = useState([]);
    const [duration, setDuration] = useState('');
    const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false);
    const durationDropdownRef = useRef(null);
    const [budgetMin, setBudgetMin] = useState('');
    const [budgetMax, setBudgetMax] = useState('');
    const [budgetType, setBudgetType] = useState('total');
    const [urgency, setUrgency] = useState('flexible');

    // ─── Normal User State ───
    const [lookingFor, setLookingFor] = useState('labour');
    const [skillNeeded, setSkillNeeded] = useState([]);
    const [budget, setBudget] = useState('');
    const [budgetNote, setBudgetNote] = useState('');
    const [preferredDate, setPreferredDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('anytime');
    const [isTimeSlotDropdownOpen, setIsTimeSlotDropdownOpen] = useState(false);
    const timeSlotDropdownRef = useRef(null);

    // Populate from initialData or profile
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            setLocation(initialData.location || '');
            setContactNumber(initialData.contact_number || '');
            setLat(initialData.lat || null);
            setLng(initialData.lng || null);

            const amountStr = initialData.amount ? initialData.amount.toString().replace('₹', '').replace(/,/g, '') : '';

            if (role === 'labour') {
                const skills = initialData.skill 
                    ? (Array.isArray(initialData.skill) ? initialData.skill : initialData.skill.split(',').map(s => s.trim()))
                    : [];
                setSelectedSkills(skills.filter(s => s));
                setExperience(initialData.experience || '');
                setPayType(initialData.pay_type || 'per_day');
                setAvailability(initialData.availability || 'available_now');
                const payMatch = amountStr.match(/\d+/);
                setExpectedPay(payMatch ? payMatch[0] : amountStr);
            } else if (role === 'contractor') {
                const skills = initialData.skill 
                    ? (Array.isArray(initialData.skill) ? initialData.skill : initialData.skill.split(',').map(s => s.trim()))
                    : [];
                setRequiredSkills(skills.filter(s => s));
                setWorkersNeeded(initialData.workers_needed ? String(initialData.workers_needed) : '');
                setDuration(initialData.duration || '');
                setBudgetMin(initialData.budget_min ? String(initialData.budget_min) : '');
                setBudgetMax(initialData.budget_max ? String(initialData.budget_max) : '');
                setUrgency(initialData.urgency || 'flexible');
            } else {
                const skills = initialData.skill 
                    ? (Array.isArray(initialData.skill) ? initialData.skill : initialData.skill.split(',').map(s => s.trim()))
                    : [];
                setSkillNeeded(skills.filter(s => s));
                setLookingFor(initialData.looking_for || 'labour');
                const budMatch = amountStr.match(/\d+/);
                setBudget(budMatch ? budMatch[0] : amountStr);
                setBudgetNote(initialData.budget_note || '');
                setPreferredDate(initialData.preferred_date || '');
                setTimeSlot(initialData.time_slot || 'anytime');
            }
        } else if (profile) {
            // Default from profile for new post
            setLocation(profile.location || '');
            setLat(profile.lat || null);
            setLng(profile.lng || null);
            setContactNumber(profile.phone || '');
            if (role === 'labour' && profile.skills) {
                const profileSkills = Array.isArray(profile.skills) 
                    ? profile.skills 
                    : profile.skills.split(',').map(s => s.trim());
                setSelectedSkills(profileSkills.filter(s => s));
            }
        }
    }, [initialData, profile, role]);

    const toggleSkill = (skill, setter) => {
        setter(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
    };

    const addCustomSkill = (setter) => {
        const trimmed = customSkill.trim();
        if (trimmed) {
            setter(prev => [...prev, trimmed]);
            setCustomSkill('');
            setShowCustomSkillInput(false);
        }
    };

    const experienceOptions = [
        { value: '', label: t('createPost.selectExperience') },
        { value: 'fresher', label: t('createPost.expFresher') },
        { value: '1-3', label: t('createPost.exp1_3') },
        { value: '3-5', label: t('createPost.exp3_5') },
        { value: '5-10', label: t('createPost.exp5_10') },
        { value: '10+', label: t('createPost.exp10Plus') }
    ];

    const durationOptions = [
        { value: '', label: t('createPost.selectDuration') },
        { value: '1-3_days', label: t('createPost.dur1_3Days') },
        { value: '1_week', label: t('createPost.dur1Week') },
        { value: '2-4_weeks', label: t('createPost.dur2_4Weeks') },
        { value: '1-3_months', label: t('createPost.dur1_3Months') },
        { value: '3+_months', label: t('createPost.dur3PlusMonths') }
    ];

    const timeSlotOptions = [
        { value: 'anytime', label: t('time.anytime') },
        { value: 'morning', label: t('time.morning') },
        { value: 'afternoon', label: t('time.afternoon') },
        { value: 'evening', label: t('time.evening') }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (expDropdownRef.current && !expDropdownRef.current.contains(event.target)) setIsExpDropdownOpen(false);
            if (durationDropdownRef.current && !durationDropdownRef.current.contains(event.target)) setIsDurationDropdownOpen(false);
            if (timeSlotDropdownRef.current && !timeSlotDropdownRef.current.contains(event.target)) setIsTimeSlotDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInternalSubmit = (e) => {
        e.preventDefault();
        
        const basePayload = {
            title: title.trim(),
            description: description.trim(),
            location: location.trim(),
            lat: lat,
            lng: lng,
            contact_number: contactNumber.trim(),
        };

        let payload = {};

        if (role === 'labour') {
            payload = {
                ...basePayload,
                type: 'labour',
                skill: selectedSkills.join(', '),
                amount: expectedPay ? `₹${expectedPay}` : '',
                experience,
                pay_type: payType,
                availability,
            };
        } else if (role === 'contractor') {
            payload = {
                ...basePayload,
                type: 'job',
                skill: requiredSkills.join(', '),
                amount: budgetMin ? `₹${budgetMin}${budgetMax ? '-₹' + budgetMax : ''}` : '',
                workers_needed: workersNeeded ? parseInt(workersNeeded) : null,
                duration,
                budget_min: budgetMin ? parseInt(budgetMin) : null,
                budget_max: budgetMax ? parseInt(budgetMax) : null,
                urgency,
            };
        } else {
            payload = {
                ...basePayload,
                type: 'job',
                looking_for: lookingFor,
                skill: skillNeeded.join(', '),
                amount: budget ? `₹${budget}` : '',
                budget_note: budgetNote.trim(),
                preferred_date: preferredDate || null,
                time_slot: timeSlot,
            };
        }

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleInternalSubmit} className="post-form-content">
            {/* ═══ ROLE-SPECIFIC SECTIONS ═══ */}
            {role === 'labour' && (
                <>
                    <div className="form-section">
                        <h3 className="form-section-title"><Briefcase size={18} /> {t('createPost.labourWhatCanYouDo')}</h3>
                        <Input label={t('createPost.headline')} id="title" placeholder={t('createPost.headlinePlaceholderLabour')} value={title} onChange={e => setTitle(e.target.value)} required icon={<Briefcase size={18} />} />
                    </div>
                    <div className="form-section">
                        <h3 className="form-section-title"><Wrench size={18} /> {t('createPost.yourSkills')}</h3>
                        <SearchableSkillDropdown 
                            selectedSkills={selectedSkills}
                            onToggle={(skill) => toggleSkill(skill, setSelectedSkills)}
                            multiple={true}
                            accentColor={accentColor}
                            placeholder={t('register.selectSkill')}
                        />
                        
                        {!showCustomSkillInput ? (
                            <button 
                                type="button" 
                                className="cp-smart-skill-btn"
                                onClick={() => setShowCustomSkillInput(true)}
                                style={{ color: accentColor }}
                            >
                                <Plus size={16} /> {t('createPost.addCustomSkill')}
                            </button>
                        ) : (
                            <div className="cp-custom-skill-row active">
                                <input
                                    type="text"
                                    className="cp-custom-skill-input"
                                    placeholder={t('createPost.addCustomSkill')}
                                    value={customSkill}
                                    onChange={e => setCustomSkill(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill(setSelectedSkills); } }}
                                    autoFocus
                                />
                                <button type="button" className="cp-custom-skill-btn" onClick={() => addCustomSkill(setSelectedSkills)} style={{ background: accentColor }}>
                                    <Check size={16} />
                                </button>
                                <button type="button" className="cp-custom-skill-close" onClick={() => setShowCustomSkillInput(false)}>
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="form-section">
                        <h3 className="form-section-title"><Clock size={18} /> {t('createPost.experienceLabel')}</h3>
                        <div className="filter-select-wrapper" ref={expDropdownRef}>
                            <button 
                                type="button"
                                className={`custom-dropdown-toggle ${isExpDropdownOpen ? 'active' : ''}`}
                                onClick={() => setIsExpDropdownOpen(!isExpDropdownOpen)}
                                style={isExpDropdownOpen ? { borderColor: accentColor, boxShadow: `0 0 0 3px ${accentColor}15` } : {}}
                            >
                                <span style={{ color: !experience ? '#A0AEC0' : '#2D3748' }}>
                                    {experienceOptions.find(opt => opt.value === experience)?.label || t('createPost.selectExperience')}
                                </span>
                                <ChevronDown size={20} className={`dropdown-icon ${isExpDropdownOpen ? 'rotate' : ''}`} />
                            </button>

                            {isExpDropdownOpen && (
                                <div className="custom-dropdown-menu">
                                    {experienceOptions.map(option => (
                                        <button
                                            type="button"
                                            key={option.value}
                                            className={`dropdown-item ${experience === option.value ? 'selected' : ''}`}
                                            onClick={() => {
                                                setExperience(option.value);
                                                setIsExpDropdownOpen(false);
                                            }}
                                            style={experience === option.value ? { background: `${accentColor}12`, color: accentColor } : {}}
                                        >
                                            <span className="item-label" style={experience === option.value ? { fontWeight: 700 } : {}}>{option.label}</span>
                                            {experience === option.value && <Check size={16} className="selected-icon" style={{ color: accentColor }} />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="form-section">
                        <h3 className="form-section-title"><IndianRupee size={18} /> {t('createPost.expectedPay')}</h3>
                        <Input label={t('createPost.amount')} id="expectedPay" type="number" placeholder={t('createPost.amountPlaceholder')} value={expectedPay} onChange={e => setExpectedPay(e.target.value)} icon={<IndianRupee size={18} />} />
                        <SegmentedControl
                            options={[
                                { value: 'per_day', label: t('pay.per_day') },
                                { value: 'per_job', label: t('pay.per_job') },
                                { value: 'negotiable', label: t('pay.negotiable') },
                            ]}
                            value={payType} onChange={setPayType} accentColor={accentColor}
                        />
                    </div>
                    <div className="form-section">
                        <h3 className="form-section-title"><CalendarDays size={18} /> {t('createPost.availabilityLabel')}</h3>
                        <SegmentedControl
                            options={[
                                { value: 'available_now', label: `🟢 ${t('status.available_now')}` },
                                { value: 'tomorrow', label: t('status.tomorrow') },
                                { value: 'this_week', label: t('status.this_week') },
                            ]}
                            value={availability} onChange={setAvailability} accentColor={accentColor}
                        />
                    </div>
                    <div className="form-section">
                        <h3 className="form-section-title"><FileText size={18} /> {t('createPost.additionalInfo')}</h3>
                        <textarea className="input-field textarea-field" placeholder={t('createPost.additionalInfoPlaceholder')} rows="3" value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                </>
            )}

            {role === 'contractor' && (
                <>
                    <div className="form-section">
                        <h3 className="form-section-title"><Building2 size={18} /> {t('createPost.projectInfo')}</h3>
                        <Input label={t('createPost.projectTitle')} id="title" placeholder={t('createPost.projectTitlePlaceholder')} value={title} onChange={e => setTitle(e.target.value)} required icon={<Briefcase size={18} />} />
                        <div className="input-group">
                            <label className="input-label"><FileText size={16} className="label-icon" /> {t('createPost.description')}</label>
                            <textarea className="input-field textarea-field" placeholder={t('createPost.projectDescPlaceholder')} rows="4" value={description} onChange={e => setDescription(e.target.value)} required />
                        </div>
                    </div>
                    <div className="form-section">
                        <h3 className="form-section-title"><Users size={18} /> {t('createPost.workersRequired')}</h3>
                        <Input label={t('createPost.numWorkers')} id="workersNeeded" type="number" placeholder="e.g., 5" value={workersNeeded} onChange={e => setWorkersNeeded(e.target.value)} icon={<Users size={18} />} />
                    </div>
                    <div className="form-section">
                        <h3 className="form-section-title"><Wrench size={18} /> {t('createPost.skillsRequired')}</h3>
                        <SearchableSkillDropdown 
                            selectedSkills={requiredSkills}
                            onToggle={(skill) => toggleSkill(skill, setRequiredSkills)}
                            multiple={true}
                            accentColor={accentColor}
                            placeholder={t('register.selectSkill')}
                        />
                        
                        {!showCustomSkillInput ? (
                            <button 
                                type="button" 
                                className="cp-smart-skill-btn"
                                onClick={() => setShowCustomSkillInput(true)}
                                style={{ color: accentColor }}
                            >
                                <Plus size={16} /> {t('createPost.addCustomSkill')}
                            </button>
                        ) : (
                            <div className="cp-custom-skill-row active">
                                <input
                                    type="text"
                                    className="cp-custom-skill-input"
                                    placeholder={t('createPost.addCustomSkill')}
                                    value={customSkill}
                                    onChange={e => setCustomSkill(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill(setRequiredSkills); } }}
                                    autoFocus
                                />
                                <button type="button" className="cp-custom-skill-btn" onClick={() => addCustomSkill(setRequiredSkills)} style={{ background: accentColor }}>
                                    <Check size={16} />
                                </button>
                                <button type="button" className="cp-custom-skill-close" onClick={() => setShowCustomSkillInput(false)}>
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="form-section">
                        <h3 className="form-section-title"><Clock size={18} /> {t('createPost.durationLabel')}</h3>
                        <div className="filter-select-wrapper" ref={durationDropdownRef}>
                            <button 
                                type="button"
                                className={`custom-dropdown-toggle ${isDurationDropdownOpen ? 'active' : ''}`}
                                onClick={() => setIsDurationDropdownOpen(!isDurationDropdownOpen)}
                                style={isDurationDropdownOpen ? { borderColor: accentColor, boxShadow: `0 0 0 3px ${accentColor}15` } : {}}
                            >
                                <span style={{ color: !duration ? '#A0AEC0' : '#2D3748' }}>
                                    {durationOptions.find(opt => opt.value === duration)?.label || t('createPost.selectDuration')}
                                </span>
                                <ChevronDown size={20} className={`dropdown-icon ${isDurationDropdownOpen ? 'rotate' : ''}`} />
                            </button>

                            {isDurationDropdownOpen && (
                                <div className="custom-dropdown-menu">
                                    {durationOptions.map(option => (
                                        <button
                                            type="button"
                                            key={option.value}
                                            className={`dropdown-item ${duration === option.value ? 'selected' : ''}`}
                                            onClick={() => {
                                                setDuration(option.value);
                                                setIsDurationDropdownOpen(false);
                                            }}
                                            style={duration === option.value ? { background: `${accentColor}12`, color: accentColor } : {}}
                                        >
                                            <span className="item-label" style={duration === option.value ? { fontWeight: 700 } : {}}>{option.label}</span>
                                            {duration === option.value && <Check size={16} className="selected-icon" style={{ color: accentColor }} />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="form-section">
                        <h3 className="form-section-title"><IndianRupee size={18} /> {t('createPost.budgetLabel')}</h3>
                        <div className="form-row">
                            <Input className="flex-1" label={`${t('createPost.budgetMin')} ₹`} id="budgetMin" type="number" placeholder="5000" value={budgetMin} onChange={e => setBudgetMin(e.target.value)} icon={<IndianRupee size={18} />} />
                            <Input className="flex-1" label={`${t('createPost.budgetMax')} ₹`} id="budgetMax" type="number" placeholder="15000" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} icon={<IndianRupee size={18} />} />
                        </div>
                        <SegmentedControl
                            options={[
                                { value: 'total', label: t('createPost.budgetTotal') },
                                { value: 'per_worker_day', label: t('createPost.budgetPerWorker') },
                            ]}
                            value={budgetType} onChange={setBudgetType} accentColor={accentColor}
                        />
                    </div>
                    <div className="form-section">
                        <h3 className="form-section-title"><Zap size={18} /> {t('createPost.urgencyLabel')}</h3>
                        <SegmentedControl
                            options={[
                                { value: 'urgent', label: `🔴 ${t('status.urgent')}` },
                                { value: 'this_week', label: `🟡 ${t('status.this_week')}` },
                                { value: 'flexible', label: `🟢 ${t('status.flexible')}` },
                            ]}
                            value={urgency} onChange={setUrgency} accentColor={accentColor}
                        />
                    </div>
                </>
            )}

            {role === 'normal_user' && (
                <>
                    <div className="form-section">
                        <h3 className="form-section-title"><Users size={18} /> {t('createPost.lookingFor')}</h3>
                        <SegmentedControl
                            options={[
                                { value: 'labour', label: t('register.labour') },
                                { value: 'contractor', label: t('register.contractor') },
                            ]}
                            value={lookingFor} onChange={setLookingFor} accentColor={accentColor}
                        />
                    </div>
                    <div className="form-section">
                        <h3 className="form-section-title"><Briefcase size={18} /> {t('createPost.userWhatDoYouNeed')}</h3>
                        <Input label={t('createPost.taskTitle')} id="title" placeholder={t('createPost.taskPlaceholder')} value={title} onChange={e => setTitle(e.target.value)} required icon={<Briefcase size={18} />} />
                        <div className="input-group">
                            <label className="input-label"><FileText size={16} className="label-icon" /> {t('createPost.details')}</label>
                            <textarea className="input-field textarea-field" placeholder={t('createPost.taskDetailsPlaceholder')} rows="4" value={description} onChange={e => setDescription(e.target.value)} required />
                        </div>
                    </div>
                    {lookingFor === 'labour' && (
                        <div className="form-section">
                            <h3 className="form-section-title"><Wrench size={18} /> {t('createPost.skillNeeded')}</h3>
                            <SearchableSkillDropdown 
                                selectedSkills={skillNeeded}
                                onToggle={(skill) => toggleSkill(skill, setSkillNeeded)}
                                multiple={true}
                                accentColor={accentColor}
                                placeholder={t('createPost.selectWorkerType')}
                            />
                            {!showCustomSkillInput ? (
                                <button 
                                    type="button" 
                                    className="cp-smart-skill-btn"
                                    onClick={() => setShowCustomSkillInput(true)}
                                    style={{ color: accentColor }}
                                >
                                    <Plus size={16} /> {t('createPost.addCustomSkill')}
                                </button>
                            ) : (
                                <div className="cp-custom-skill-row active">
                                    <input
                                        type="text"
                                        className="cp-custom-skill-input"
                                        placeholder={t('createPost.addCustomSkill')}
                                        value={customSkill}
                                        onChange={e => setCustomSkill(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill(setSkillNeeded); } }}
                                    />
                                    <button type="button" className="cp-custom-skill-btn" onClick={() => addCustomSkill(setSkillNeeded)} style={{ background: accentColor }}>
                                        <Check size={16} />
                                    </button>
                                    <button type="button" className="cp-custom-skill-close" onClick={() => setShowCustomSkillInput(false)}>
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="form-section">
                        <h3 className="form-section-title"><IndianRupee size={18} /> {t('createPost.yourBudget')}</h3>
                        <div className="form-row">
                            <Input className="flex-1" label={t('createPost.amount')} id="budget" type="number" placeholder="500" value={budget} onChange={e => setBudget(e.target.value)} icon={<IndianRupee size={18} />} />
                            <div className="flex-1">
                                <label className="input-label" style={{ marginBottom: '6px' }}>{t('createPost.budgetNote')}</label>
                                <input type="text" className="input-field" placeholder={t('createPost.budgetNotePlaceholder')} value={budgetNote} onChange={e => setBudgetNote(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="form-section">
                        <h3 className="form-section-title"><CalendarDays size={18} /> {t('createPost.whenDoYouNeedIt')}</h3>
                        <div className="form-row">
                            <div className="flex-1">
                                <label className="input-label" style={{ marginBottom: '6px' }}><CalendarDays size={16} className="label-icon" /> {t('createPost.preferredDate')}</label>
                                <input 
                                    type="date" 
                                    className="input-field cp-select" 
                                    value={preferredDate} 
                                    onChange={e => setPreferredDate(e.target.value)} 
                                    min={new Date().toISOString().split('T')[0]} 
                                />
                            </div>
                            <div className="flex-1">
                                <label className="input-label" style={{ marginBottom: '6px' }}><Clock size={16} className="label-icon" /> {t('createPost.timeSlot')}</label>
                                <div className="filter-select-wrapper" ref={timeSlotDropdownRef}>
                                    <button 
                                        type="button"
                                        className={`custom-dropdown-toggle ${isTimeSlotDropdownOpen ? 'active' : ''}`}
                                        onClick={() => setIsTimeSlotDropdownOpen(!isTimeSlotDropdownOpen)}
                                        style={isTimeSlotDropdownOpen ? { borderColor: accentColor, boxShadow: `0 0 0 3px ${accentColor}15` } : {}}
                                    >
                                        <span style={{ color: !timeSlot ? '#A0AEC0' : '#2D3748' }}>
                                            {timeSlotOptions.find(opt => opt.value === timeSlot)?.label || t('time.anytime')}
                                        </span>
                                        <ChevronDown size={20} className={`dropdown-icon ${isTimeSlotDropdownOpen ? 'rotate' : ''}`} />
                                    </button>

                                    {isTimeSlotDropdownOpen && (
                                        <div className="custom-dropdown-menu">
                                            {timeSlotOptions.map(option => (
                                                <button
                                                    type="button"
                                                    key={option.value}
                                                    className={`dropdown-item ${timeSlot === option.value ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        setTimeSlot(option.value);
                                                        setIsTimeSlotDropdownOpen(false);
                                                    }}
                                                    style={timeSlot === option.value ? { background: `${accentColor}12`, color: accentColor } : {}}
                                                >
                                                    <span className="item-label" style={timeSlot === option.value ? { fontWeight: 700 } : {}}>{option.label}</span>
                                                    {timeSlot === option.value && <Check size={16} className="selected-icon" style={{ color: accentColor }} />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ═══ SHARED: LOCATION & CONTACT ═══ */}
            <div className="form-section">
                <h3 className="form-section-title"><MapPin size={18} /> {t('createPost.locContact')}</h3>
                <div className="form-row">
                    <div className="flex-1">
                        <label className="input-label">{t('field.location')}</label>
                        <div className="cp-fixed-location">
                            <div className="cp-fixed-location-info">
                                <MapPin size={18} className="cp-fixed-location-icon" />
                                <div className="cp-fixed-location-text">
                                    {location || <span className="error-text" style={{ fontSize: '0.85rem' }}>{t('profile.noLocation')}</span>}
                                </div>
                            </div>
                            {!location && (
                                <button 
                                    type="button" 
                                    className="cp-fixed-location-btn"
                                    onClick={() => navigate('/profile/edit')}
                                    style={{ background: accentColor }}
                                >
                                    {t('profile.completeProfile')}
                                </button>
                            )}
                        </div>
                    </div>
                    <Input className="flex-1" label={t('createPost.contactNumber')} id="contactNumber" type="tel" prefix="+91" placeholder={t('createPost.phonePlaceholder')} value={contactNumber} onChange={e => setContactNumber(e.target.value)} required icon={<Phone size={18} />} />
                </div>
            </div>

            {/* ═══ FORM ACTIONS ═══ */}
            <div className="post-form-actions">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} className="btn-cancel">
                    <span className="btn-cancel-text">{t('common.cancel')}</span>
                </Button>
                <Button type="submit" className="btn-submit" disabled={isSubmitting} style={{ background: accentColor }}>
                    {isSubmitting ? (initialData ? t('editPost.saving') : t('common.posting')) : (initialData ? t('editPost.saveChanges') : (role === 'labour' ? t('createPost.submitLabour') : role === 'contractor' ? t('createPost.submitContractor') : t('createPost.submitUser')))}
                </Button>
            </div>
        </form>
    );
};

export default PostForm;
