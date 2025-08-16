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
  className?: string;
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
  className,
}: Props) => {
  return (
    <form onSubmit={onSubmit}>
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
        className={className}
      />
      <button type="submit" disabled={!value.trim()}>
        Search{" "}
      </button>
    </form>
  );
};

export default SearchBarComponent;
