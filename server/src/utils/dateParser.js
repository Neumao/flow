// src/utils/dateParser.js

/**
 * Parses a date string in various formats (Excel serial, ISO, DD/MM/YYYY, MM/DD/YYYY, etc.)
 * @param {string} dateStr
 * @returns {Date|null}
 */
export function parseDateFlexible(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') return null;
    const trimmed = dateStr.trim();
    let date = null;
    if (!isNaN(trimmed) && !isNaN(parseFloat(trimmed))) {
        // Excel serial date
        const serial = parseFloat(trimmed);
        date = new Date((serial - 25569) * 86400 * 1000);
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        // YYYY-MM-DD
        const [year, month, day] = trimmed.split('-').map(Number);
        date = new Date(year, month - 1, day);
    } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
        // Try DD/MM/YYYY then MM/DD/YYYY
        const [d1, d2, d3] = trimmed.split('/').map(Number);
        date = new Date(d3, d2 - 1, d1);
        if (isNaN(date.getTime())) date = new Date(d3, d1 - 1, d2);
    } else {
        // Fallback to Date constructor
        date = new Date(trimmed);
    }
    return !isNaN(date.getTime()) ? date : null;
}
