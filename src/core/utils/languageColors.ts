const LANGUAGE_COLORS: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    HTML: '#e34c26',
    CSS: '#563d7c',
    SCSS: '#c6538c',
    Python: '#3572A5',
    Java: '#b07219',
    'C#': '#178600',
    'C++': '#f34b7d',
    C: '#555555',
    Go: '#00ADD8',
    Rust: '#dea584',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    Shell: '#89e051',
    Vue: '#41b883',
    Svelte: '#ff3e00',
    Markdown: '#083fa1',
}

/**
 * Derives a stable HSL color from a string via a simple hash.
 * @param {string} name
 * @returns {string} e.g., "hsl(210 75% 60%)"
 */

function hashToHsl(name: string) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
    const hue = Math.abs(h) % 360;
    const sat = 75;
    const light = 60;
    return `hsl(${hue} ${sat}% ${light}%)`;
  }

/**
 * Returns a representative color for a programming language.
 *
 * Behavior:
 * - If `lang` is known, returns a hex color from the map.
 * - If unknown, generates a stable HSL color by hashing the language name.
 * - If `lang` is falsy, falls back to `var(--color-muted)`.
 *
 * @param {string|null|undefined} lang - Language name as returned by the API.
 * @returns {string} A CSS color (hex, HSL, or CSS var).
 *
 * @example
 * getLanguageColor("TypeScript") //=> "#3178c6"
 * getLanguageColor("Elixir")     //=> "hsl(…)" (stable per name)
 */

  export function getLanguageColor(lang?: string | null): string {
    if (!lang) return 'var(--color-muted)';
    return LANGUAGE_COLORS[lang] ?? hashToHsl(lang);
  }