export function normalizeUrl(raw?: string | null): string | null {
    const value = raw?.trim();
    if (!value) return null;
    return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}