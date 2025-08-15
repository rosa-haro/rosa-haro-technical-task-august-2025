import { useNavigate } from "react-router-dom";
import type { UserSuggestion } from "../../core/types/github";
import SearchSuggestionsComponent from "../search-suggestions/SearchSuggestionsComponent";
import { useUserSuggestions } from "../../core/hooks/useUserSuggestions";

const SearchBarComponent = () => {
  const navigate = useNavigate();

  const {
    query,
    items,
    isOpen,
    activeIndex,
    listboxId,
    setActiveIndex,
    onChange,
    onKeyDown,
    onSubmit,
    onSelect,
  } = useUserSuggestions();

  const goToUser = (username: string) => {
    navigate(`/user/${encodeURIComponent(username)}`);
  };

  const handleSelect = (item: UserSuggestion) => {
    onSelect(item, (i) => goToUser(i.login));
  };

  return (
    <div
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls={listboxId}
      aria-owns={listboxId}
    >
      <form onSubmit={(e) => onSubmit(e, { onSubmit: goToUser })}>
        <input
          type="text"
          inputMode="search"
          enterKeyHint="search"
          placeholder="Search by username"
          value={query}
          onChange={onChange}
          onKeyDown={(e) =>
            onKeyDown(e, {
              onSelect: (item) => goToUser(item.login),
              onSubmit: goToUser,
            })
          }
          aria-label="GitHub username"
          aria-autocomplete="list"
          aria-activedescendant={
            isOpen ? `suggestion-${activeIndex}` : undefined
          }
          autoComplete="off"
        />
        <button type="submit" disabled={!query.trim()}>
          Search
        </button>
      </form>

      {isOpen && (
        <SearchSuggestionsComponent
          items={items}
          activeIndex={activeIndex}
          onSelect={handleSelect}
          onHover={setActiveIndex}
        />
      )}
    </div>
  );
};

export default SearchBarComponent;
