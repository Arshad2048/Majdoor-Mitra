/**
 * Formats a date string to "DD-MM-YYYY" format using English numerals.
 * Even in Hindi mode, this will return English digits as requested.
 * @param {string|Date} dateInput 
 * @returns {string}
 */
export const formatDate = (dateInput) => {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
};

/**
 * Formats a date string to "MMM YYYY" for profile "Member since" sections.
 * @param {string|Date} dateInput 
 * @returns {string}
 */
export const formatMonthYear = (dateInput) => {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';
    
    const options = { month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
};

/**
 * Get relative time string (e.g. "5m ago")
 * @param {string|Date} dateString 
 * @param {Function} t Translation function from useTranslation()
 */
export const getRelativeTime = (dateString, t) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return t('time.justNow');
        if (diffInSeconds < 3600) return `${Math.max(0, Math.floor(diffInSeconds / 60))}${t('time.m')} ${t('time.ago')}`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}${t('time.h')} ${t('time.ago')}`;
        return `${Math.floor(diffInSeconds / 86400)}${t('time.d')} ${t('time.ago')}`;
    } catch (e) {
        return '';
    }
};

/**
 * Get deterministic color from user UUID
 */
export const getAvatarColor = (userId) => {
    if (!userId) return '#cbd5e0';
    const colors = [
        '#4299E1', '#48BB78', '#F6AD55', '#ED64A6', 
        '#9F7AEA', '#667EEA', '#ED8936', '#38B2AC'
    ];
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

/**
 * Get leading initials from name
 */
export const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
};
