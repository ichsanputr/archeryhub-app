/**
 * Utility to get the appropriate icon for an archery category/division
 * @param name The name of the division or category
 * @returns Filename of the SVG icon in /public
 */
export const getCategoryIcon = (name) => {
    const lower = (name || '').toLowerCase();

    // Determine gender
    let gender = 'men';
    if (lower.includes('putri') || lower.includes('woman') || lower.includes('women') || lower.includes('female')) {
        gender = 'woman';
    }

    // Determine type (default to single as most icons are single)
    let type = 'single';
    if (lower.includes('beregu') || lower.includes('team')) {
        // Special case: we have woman-team-compound.svg
        if (gender === 'woman' && lower.includes('compound')) {
            return 'woman-team-compound.svg';
        }
        // Fallback or more team icons if they existed, but for now we follow the available files
    }

    if (lower.includes('recurve')) return `${gender}-single-recurve.svg`;
    if (lower.includes('compound')) return `${gender}-single-compound.svg`;
    if (lower.includes('barebow')) return `${gender}-single-barebow.svg`;
    if (lower.includes('traditional')) return `${gender}-single-traditional.svg`;

    // Default fallback
    return 'men-single-recurve.svg';
};

/**
 * Utility to get the appropriate color for an archery category/division
 * @param name The name of the division or category
 * @returns CSS class string for background and text
 */
export const getCategoryColorClass = (name) => {
    const lower = (name || '').toLowerCase();

    if (lower.includes('recurve')) return 'bg-blue-100 text-blue-600 border-blue-200';
    if (lower.includes('compound')) return 'bg-orange-100 text-orange-600 border-orange-200';
    if (lower.includes('barebow')) return 'bg-gray-100 text-gray-600 border-gray-200';
    if (lower.includes('nasional') || lower.includes('standard')) return 'bg-red-100 text-red-600 border-red-200';
    if (lower.includes('traditional')) return 'bg-amber-100 text-amber-600 border-amber-200';

    return 'bg-navy/5 text-navy border-navy/10';
};
