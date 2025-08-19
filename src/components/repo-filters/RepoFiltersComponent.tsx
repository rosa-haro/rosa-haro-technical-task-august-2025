import { useState } from "react";
import SearchBarComponent from "../search-bar/SearchBarComponent";
import LanguageFilterComponent from "../language-filter/LanguageFilterComponent";
import ResetIcon from "../../assets/icons/reset.svg?react";

/**
 * RepoFiltersComponent — combines a plain search bar and a language select.
 *
 * Responsibilities:
 * - Holds local state (`query`) so the input is editable without committing until submit.
 * - Calls `onQuerySubmit(query)` when the form is submitted.
 * - Passes `language` and `languageOptions` to the LanguageFilterComponent.
 * - Provides a "Reset filters" button to clear both query and language.
 *
 * Accessibility:
 * - Search bar uses a simple input form with `aria-label="Repositories search"`.
 * - Language select has its own label/aria-label.
 * - Reset button has `aria-label="Reset filters"` and is disabled if no filters are active.
 *
 * Notes:
 * - Does not fetch or filter data itself; it only emits the chosen criteria.
 */

/**
 * Props for RepoFiltersComponent.
 *
 * @property {string} repoQuery - Current applied text filter.
 * @property {(value: string) => void} onQuerySubmit - Called on search form submit.
 * @property {string} language - Currently selected language.
 * @property {string[]} languageOptions - Available language options.
 * @property {(lang: string) => void} onLanguageChange - Called when language changes.
 */

type Props = {
  repoQuery: string;
  onQuerySubmit: (value: string) => void;
  language: string;
  languageOptions: string[];
  onLanguageChange: (lang: string) => void;
};

/**
 * RepoFiltersComponent
 *
 * UI block that lets users filter repositories by name (text search) and by language.
 * Includes a reset button to clear filters in one click.
 *
 * @example
 * <RepoFiltersComponent
 *   repoQuery={repoQuery}
 *   onQuerySubmit={setRepoQuery}
 *   language={language}
 *   languageOptions={languageOptions}
 *   onLanguageChange={setLanguage}
 * />
 */

const RepoFiltersComponent = ({
  repoQuery,
  onQuerySubmit,
  language,
  languageOptions,
  onLanguageChange,
}: Props) => {
  const [query, setQuery] = useState(repoQuery);

  return (
    <div className="card-base p-4 flex flex-col md:flex-row gap-4 md:items-center">
      <div className="flex-1">
        <SearchBarComponent
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onSubmit={(e) => {
            e.preventDefault();
            onQuerySubmit(query);
          }}
          placeholder="Search repositories by name"
          ariaLabel="Repositories search"
        />
      </div>
      <LanguageFilterComponent
        value={language}
        options={languageOptions}
        onChange={onLanguageChange}
      />
      <button
        type="button"
        onClick={() => {
          setQuery("");
          onQuerySubmit("");
          onLanguageChange("");
        }}
        className="button-secondary h-9 px-3 self-stretch md:self-auto cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
        aria-label="Reset filters"
        disabled={!query.trim() && !language}
      >
        <ResetIcon className="text-[color:var(--color-muted)] fill-current" />
        <span className="sm:inline md:hidden">Reset filters</span>
      </button>
    </div>
  );
};

export default RepoFiltersComponent;
