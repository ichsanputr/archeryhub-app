/**
 * Utility to get the appropriate icon for an archery bow type from /public/bow
 * @param name The name of the division or category
 * @returns Path to the SVG icon in /public/bow
 */
export const getBowIcon = (name) => {
    const lower = (name || '').toLowerCase();

    if (lower.includes('barebow')) return 'bow/barebow.svg';
    if (lower.includes('compound')) return 'bow/compound.svg';
    if (lower.includes('recurve')) return 'bow/recurve.svg';
    if (lower.includes('standard') || lower.includes('nasional')) return 'bow/standard.svg';
    if (lower.includes('traditional')) return 'bow/traditional.svg';

    // Default fallback
    return 'bow/recurve.svg';
};
