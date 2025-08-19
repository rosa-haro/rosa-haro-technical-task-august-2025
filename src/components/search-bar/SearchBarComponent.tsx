import { type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";
import SearchIcon from "../../assets/icons/search.svg?react";

/**
 * Presentational search input + submit button.
 *
 * Responsibilities:
 * - Controlled input: value + onChange.
 * - Optional onKeyDown passthrough (for custom keyboard handling upstream).
 * - Form submit calls `onSubmit` with the native event.
 *
 * Accessibility:
 * - Sets `type="text"`, `inputMode="search"`, and `enterKeyHint="search"`.
 * - Uses `aria-label` (or an explicit label upstream) to announce purpose.
 * - `aria-activedescendant` can be forwarded for combobox patterns.
 *
 * Notes:
 * - This component does not fetch data or navigate. It emits events and stays
 *   fully presentation-only so it can be reused (e.g., in repo filters).
 */

/**
 * Props for `SearchBarComponent`.
 *
 * @property {string} value - Current input value (controlled).
 * @property {(e: ChangeEvent<HTMLInputElement>) => void} onChange - Called on every keystroke.
 * @property {(e: KeyboardEvent<HTMLInputElement>) => void} [onKeyDown] - Optional keyboard handler.
 * @property {(e: FormEvent<HTMLFormElement>) => void} onSubmit - Called on form submit.
 * @property {string} placeholder - Placeholder text for the input.
 * @property {string} [ariaLabel="Search"] - Accessible label for screen readers.
 * @property {string} [ariaActivedescendant] - ID of the active option (combobox pattern).
 * @property {string} [autoComplete="off"] - Browser autocomplete behavior.
 */

type Props = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  placeholder: string;
  ariaLabel?: string;
  ariaActivedescendant?: string;
  autoComplete?: string;
};

/**
 * SearchBarComponent
 *
 * Simple, reusable search bar with a submit button. Disables the submit button
 * when the trimmed value is empty to prevent accidental submissions.
 *
 * @example
 * <SearchBarComponent
 *   value={query}
 *   onChange={(e) => setQuery(e.target.value)}
 *   onSubmit={(e) => { e.preventDefault(); doSearch(query); }}
 *   placeholder="Search repositories by name"
 *   ariaLabel="Repositories search"
 * />
 */

const SearchBarComponent = ({
  value,
  onChange,
  onKeyDown,
  onSubmit,
  placeholder,
  ariaLabel = "Search",
  ariaActivedescendant,
  autoComplete = "off",
}: Props) => {
  return (
    <form
      onSubmit={onSubmit}
      className="relative w-full flex items-center gap-1"
    >
      <input
        type="text"
        inputMode="search"
        enterKeyHint="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        aria-label={ariaLabel}
        aria-activedescendant={ariaActivedescendant}
        autoComplete={autoComplete}
        className="input-base flex-1"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="button-primary button-primary--search-icon h-9 w-9 p-0 flex items-center justify-center 
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
        aria-label="Search"
      >
        <SearchIcon aria-hidden={true} />
      </button>
    </form>
  );
};

export default SearchBarComponent;
