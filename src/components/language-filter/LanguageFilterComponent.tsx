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
}

  const LanguageFilterComponent = ({ value, options, onChange }: Props) => {
  return (
    <label>
      Main language
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filter by language"
        className="input-base pr-8 appearance-none bg-[image:var(--tw-select-indicator,none)]"
        >

          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}

      </select>
    </label>
  )
}

export default LanguageFilterComponent