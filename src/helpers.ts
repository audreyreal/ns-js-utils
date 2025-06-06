/**
 * Parses an HTML string and returns a Document object.
 * @param html The HTML string to parse
 * @returns The parsed Document
 */
export function parseHtml(html: string): Document {
    const parser = new DOMParser();
    return parser.parseFromString(html, 'text/html');
}

/**
 * Canonicalizes a string by lowering its case and trimming whitespace and replacing spaces with underscores.
 * @param str The string to canonicalize
 */
export function canonicalize(str: string | undefined): string | undefined {
    if (!str) return undefined; // Handle undefined input
    return str
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '_'); // Replace spaces with underscores
}

/**
 * Prettifies a string for display by replacing underscores with spaces and capitalizing the first letter of each word except for certain small words.
 * @param str The string to prettify
 */
export function prettify(str: string): string {
    return str
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/\b(a|an|the|and|but|or|for|nor|on|at|to|in)\b/gi, (match) => match.toLowerCase())
        .replace(/\b\w/g, (match) => match.toUpperCase());
}