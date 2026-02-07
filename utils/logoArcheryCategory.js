/**
 * Utility to get the appropriate icon for an archery category/division
 * @param name The name of the division or category
 * @returns Filename of the SVG icon in /public/category-icon
 */
export const getCategoryIcon = (name) => {
    const lower = (name || '').toLowerCase();

    // Determine team type first
    if (lower.includes('mix') || lower.includes('mixed')) {
        return 'category-icon/mix-team.svg';
    }

    if (lower.includes('beregu') || lower.includes('team')) {
        if (lower.includes('putri') || lower.includes('woman') || lower.includes('women') || lower.includes('female')) {
            return 'category-icon/woman-team.svg';
        }
        return 'category-icon/men-team.svg';
    }

    // Determine gender for single
    let gender = 'men';
    if (lower.includes('putri') || lower.includes('woman') || lower.includes('women') || lower.includes('female')) {
        gender = 'woman';
    }

    // Determine bow type
    let bow = 'recurve';
    if (lower.includes('compound')) bow = 'compound';
    else if (lower.includes('barebow')) bow = 'barebow';
    else if (lower.includes('standard') || lower.includes('nasional')) bow = 'standard';
    else if (lower.includes('traditional')) bow = 'traditional';

    return `category-icon/${gender}-single-${bow}.svg`;
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
