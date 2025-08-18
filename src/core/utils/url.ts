/**
 * Normalizes a user-provided URL by ensuring it has a protocol.
 *
 * Behavior:
 * - Trims input.
 * - Returns `null` if empty/whitespace.
 * - If the value lacks `http://` or `https://`, prefixes `https://`.
 *
 * @param {string|null|undefined} raw - Raw URL from the API or user input.
 * @returns {string|null} Normalized absolute URL or `null` if empty.
 *
 * @example
 * normalizeUrl("myblog.com")     //=> "https://myblog.com"
 * normalizeUrl(" https://x.dev") //=> "https://x.dev"
 * normalizeUrl("")               //=> null
 */

export function normalizeUrl(raw?: string | null): string | null {
    const value = raw?.trim();
    if (!value) return null;
    return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}