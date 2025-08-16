import { useState } from "react";
import SearchBarComponent from "../search-bar/SearchBarComponent";
import LanguageFilterComponent from "../language-filter/LanguageFilterComponent";

/**
 * RepoFiltersComponent — combines a plain search bar (text filter) and a Language select.
 *
 * Responsibilities:
 * - Holds a local input state (`repoQuery`) to allow typing freely.
 * - Applies the text filter only on form submit (calls `onQuerySubmit(repoquery)`).
 * - Controls language via a controlled <select> with `onLanguageChange`.
 * - Does not fetch or filter data itself; emits the chosen criteria to the parent.
 *
 * Props:
 * - repoQuery: currently applied text filter.
 * - onQuerySubmit(value): called when user submits the search form.
 * - language: currently selected language value.
 * - languageOptions: list of available options (e.g., ["All", "TypeScript", "Go", ...]).
 * - onLanguageChange(lang): called when language changes.
 *
 * Accessibility:
 * - The search bar is a plain input form (no suggestions).
 * - The language control has a visible label or `aria-label`.
 *
 */
type Props = {
  repoQuery: string;
  onQuerySubmit: (value: string) => void;
  language: string;
  languageOptions: string[];
  onLanguageChange: (lang: string) => void;
};

const RepoFiltersComponent = ({
  repoQuery,
  onQuerySubmit,
  language,
  languageOptions,
  onLanguageChange,
}: Props) => {
  // Local input state.
  // Parent query updates only after submit.
  const [query, setQuery] = useState(repoQuery);

  return (
    <div className="card-base p-3 flex flex-col md:flex-row gap-3 md:items-center">
      <div className="flex-1">
        <SearchBarComponent
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onSubmit={(e) => {
            e.preventDefault();
            onQuerySubmit(query);
          }}
          placeholder="Search repositories by name..."
          ariaLabel="Repositories search"
        />
      </div>
      <LanguageFilterComponent
        value={language}
        options={languageOptions}
        onChange={onLanguageChange}
      />
    </div>
  );
};

export default RepoFiltersComponent;
