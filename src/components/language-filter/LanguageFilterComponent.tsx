import ArrowDropdownIcon from "../../assets/icons/arrow-dropdown.svg?react";
/**
 * LanguageFilterComponent — presentational select for repository language.
 *
 * Props:
 * - value: current selected language (e.g., "TypeScript").
 * - options: list of available language options.
 * onChange(lang): emits the selected language value to parent.
 *
 * Acessibility:
 * - Provides a visible label or `aria-label="Filter by language"`
 */
type Props = {
  value: string;
  options: string[];
  onChange: (lang: string) => void;
};

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

        <ArrowDropdownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(-color-muted)] transition-colors group-focus-within:text-[color:var(--color-text)]/80 fill-current" />
      </div>
    </label>
  );
};

export default LanguageFilterComponent;
