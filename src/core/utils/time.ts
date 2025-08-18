/**
 * Formats an ISO date string as a coarse “time ago” label.
 *
 * Behavior:
 * - Returns "just now" for < 1 minute.
 * - Otherwise returns "X minutes/hours/days ago" (pluralized).
 *
 * Limitations:
 * - Coarse granularity (no months/years).
 * - Assumes `iso` is a valid date string; invalid dates may produce unexpected results.
 *
 * @param {string} iso - ISO-8601 date string (e.g., 2025-08-18T10:24:00Z).
 * @returns {string} Human-friendly relative time label.
 *
 * @example
 * timeAgo("2025-08-18T10:24:00Z") //=> "2 hours ago"
 */

export function timeAgo(iso: string) {
    const ms = Date.now() - new Date(iso).getTime();
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    if (d > 0) return `${d} day${d === 1 ? "" : "s"} ago`;
    if (h > 0) return `${h} hour${h === 1 ? "" : "s"} ago`;
    if (m > 0) return `${m} minute${m === 1 ? "" : "s"} ago`;
    return "just now";
  };