import { type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";

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
    <form onSubmit={onSubmit} className="relative w-full flex items-center gap-2">
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
      <button type="submit" disabled={!value.trim()} className="button-primary disabled:opacity-50 disabled:cursor-not-allowed">
        Search
      </button>
    </form>
  );
};

export default SearchBarComponent;
