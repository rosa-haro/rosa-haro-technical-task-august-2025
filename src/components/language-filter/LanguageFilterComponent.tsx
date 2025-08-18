import ArrowDropdownIcon from "../../assets/icons/arrow-dropdown.svg?react";

/**
 * LanguageFilterComponent — presentational <select> for filtering repositories by language.
 *
 * Responsibilities:
 * - Controlled value: receives the current language.
 * - Emits `onChange(lang)` when the selection changes.
 * - Provides a default "All languages" option.
 *
 * Accessibility:
 * - Wraps the <select> in a <label> with `aria-label="Filter by language"`.
 * - Includes a decorative dropdown icon (SVG).
 *
 * Notes:
 * - This component does not perform any filtering itself; it only exposes user intent.
 */

/**
 * Props for LanguageFilterComponent.
 *
 * @property {string} value - Currently selected language ("" means all).
 * @property {string[]} options - Available languages (already pre-sorted by parent).
 * @property {(lang: string) => void} onChange - Called when user selects a language.
 */

type Props = {
  value: string;
  options: string[];
  onChange: (lang: string) => void;
};

/**
 * LanguageFilterComponent
 *
 * Reusable select dropdown to filter repositories by programming language.
 *
 * @example
 * <LanguageFilterComponent
 *   value={language}
 *   options={languageOptions}
 *   onChange={(lang) => setLanguage(lang)}
 * />
 */

const LanguageFilterComponent = ({ value, options, onChange }: Props) => {
  return (
    <label className="flex flex-col gap-1 text-[color:var(--color-muted)] text-[length:var(--font-meta)]">
      <div className="group relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Filter by language"
          className="input-base !pr-9 appearance-none cursor-pointer"
        >
          <option value="">All languages</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <ArrowDropdownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-muted)] transition-colors group-focus-within:text-[color:var(--color-text)]/80 fill-current" />
      </div>
    </label>
  );
};

export default LanguageFilterComponent;
