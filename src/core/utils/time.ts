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