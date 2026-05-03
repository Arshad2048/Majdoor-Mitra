import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * usePostFilters Hook
 * Encapsulates URL synchronization (multi-skill support) and draft state logic for the Posts page.
 */
export const usePostFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // ─── ACTIVE FILTERS (From URL) ───
    // Get all 'skill' parameters into an array for multi-filtering
    const activeSkills = useMemo(() => searchParams.getAll('skill') || [], [searchParams]);
    const activeMinExp = Number(searchParams.get('minExp')) || 0;
    const activeMinRating = Number(searchParams.get('minRating')) || 0;
    const activeMaxBudget = Number(searchParams.get('maxBudget')) || 10000;
    const activeUrgency = searchParams.get('urgency') || 'all';

    // ─── DRAFT STATES (For the UI) ───
    const [draftSkills, setDraftSkills] = useState(activeSkills);
    const [draftMinExp, setDraftMinExp] = useState(activeMinExp);
    const [draftMinRating, setDraftMinRating] = useState(activeMinRating);
    const [draftMaxBudget, setDraftMaxBudget] = useState(activeMaxBudget);
    const [draftUrgency, setDraftUrgency] = useState(activeUrgency);
    const [isExpDropdownOpen, setIsExpDropdownOpen] = useState(false);

    /**
     * Experience options for the filter dropdown
     */
    const expOptions = useMemo(() => [
        { value: 0, label: 'Any Experience' },
        { value: 1, label: '1+ Year' },
        { value: 3, label: '3+ Years' },
        { value: 5, label: '5+ Years' },
        { value: 10, label: '10+ Years' },
        { value: 15, label: '15+ Years' },
    ], []);

    // Sync drafts when URL changes (e.g. initial load or back button/external clear)
    useEffect(() => {
        setDraftSkills(activeSkills);
        setDraftMinExp(activeMinExp);
        setDraftMinRating(activeMinRating);
        setDraftMaxBudget(activeMaxBudget);
        setDraftUrgency(activeUrgency);
    }, [activeSkills, activeMinExp, activeMinRating, activeMaxBudget, activeUrgency]);

    /**
     * Applies the current draft states to the URL.
     */
    const applyFilters = () => {
        const params = new URLSearchParams();
        
        // Append multiple skill parameters for multi-selection support
        draftSkills.forEach(skill => {
            if (skill) params.append('skill', skill);
        });

        if (draftMinExp > 0) params.set('minExp', draftMinExp);
        if (draftMinRating > 0) params.set('minRating', draftMinRating);
        if (draftMaxBudget < 10000) params.set('maxBudget', draftMaxBudget);
        if (draftUrgency !== 'all') params.set('urgency', draftUrgency);
        
        setSearchParams(params);
        setIsExpDropdownOpen(false); // Close dropdown on apply
    };

    /**
     * Resets all filters and the URL.
     */
    const resetFilters = () => {
        setSearchParams({});
        setDraftSkills([]);
        setDraftMinExp(0);
        setDraftMinRating(0);
        setDraftMaxBudget(10000);
        setDraftUrgency('all');
        setIsExpDropdownOpen(false);
    };

    /**
     * Removes a single skill from the current active selection.
     */
    const removeSkill = (skillToRemove) => {
        const params = new URLSearchParams(searchParams);
        const currentSkills = params.getAll('skill');
        const updatedSkills = currentSkills.filter(s => s !== skillToRemove);
        
        params.delete('skill');
        updatedSkills.forEach(s => params.append('skill', s));
        
        setSearchParams(params);
    };

    /**
     * Toggles a skill in the current draft selection.
     */
    const handleToggleSkill = (skillId) => {
        setDraftSkills(prev => 
            prev.includes(skillId) 
                ? prev.filter(s => s !== skillId) 
                : [...prev, skillId]
        );
    };

    const filters = useMemo(() => ({
        activeSkills,
        minExp: activeMinExp,
        minRating: activeMinRating,
        maxBudget: activeMaxBudget,
        urgencyFilter: activeUrgency
    }), [activeSkills, activeMinExp, activeMinRating, activeMaxBudget, activeUrgency]);

    return {
        filters,
        activeSkills,
        draftStates: {
            skills: draftSkills, 
            setSkills: setDraftSkills,
            toggleSkill: handleToggleSkill,
            minExp: draftMinExp, setMinExp: setDraftMinExp,
            minRating: draftMinRating, setMinRating: setDraftMinRating,
            maxBudget: draftMaxBudget, setMaxBudget: setDraftMaxBudget,
            urgency: draftUrgency, setUrgency: setDraftUrgency,
            isExpDropdownOpen, setIsExpDropdownOpen
        },
        expOptions,
        applyFilters,
        resetFilters,
        removeSkill
    };
};

export default usePostFilters;
