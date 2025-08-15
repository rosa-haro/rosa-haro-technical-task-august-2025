import { useNavigate } from "react-router-dom";
import type { UserSuggestion } from "../../core/types/github";
import { useUserSuggestions } from "../../core/hooks/useUserSuggestions";
import UserSuggestionsComponent from "../user-suggestions/UserSuggestionsComponent";
import SearchBarComponent from "../search-bar/SearchBarComponent";

/**
 * UserSearchComponent — wrapper that wires the base SearchBarComponent to GitHub
 * username suggestions using the `useUserSuggestions` hook.
 * 
 * Responsibilities:
 * - Manages debounced input, in-flight request cancellation, dropdown open/close,
 *   and keyboard navigation through the hook.
 * - Renders the presentational SearchBarComponent (input+form) and the 
 *   SearchSuggestionsComponent (listbox).
 * - Navigates to `/user/:username` on submit (typed value) or when selecting
 *   a suggestion.
 * 
 * Accessibility:
 * - The wrapper exposes a combobox container with `role="combobox"`,
 *   `aria-expanded`, and `aria-controls` pointing to the suggestions listbox.
 * - The input receives `aria-activedescendant` referencing the active option
 *   when the dropdown is open.
 * - The suggestions list is rendered with `role="listbox"` and each item as
 *   `role="option"` (handled in SearchSuggestionsComponent).
 * 
 * Keyboard behavior:
 * - Escape: closes the dropdown.
 * - ArrowUp/ArrowDown (when open): moves the active item.
 * - Enter: when open, selects the active suggestion; when closed, submits 
 *   the typed value.
 * 
 * Notes:
 * - This component does not perform data fetching directly; `useUserSuggestions`
 *   owns all state and side effects.
 * - The base SearchBarComponent stays presentation-only and is reusable for
 *   repository filters (without suggestions)
 */

const UserSearchComponent = () => {
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

  // Navigate to the selected/typed username.
  // Kept here (not in the hook) so the hook stays routing-agnostic.
  const goToUser = (username: string) => {
    navigate(`/user/${encodeURIComponent(username)}`);
  };

  // Mouse selection from the listbox delegates to the hook, then navigates.
  const handleSelect = (item: UserSuggestion) => {
    onSelect(item, (i) => goToUser(i.login));
  };

  return (
    <div
    role="combobox"
    aria-haspopup="listbox"
    aria-expanded={isOpen}
    aria-controls={listboxId}
  >
      <SearchBarComponent 
      value={query}
      onChange={onChange}
      onKeyDown={(e) =>
        onKeyDown(e, {
          onSelect: (item) => goToUser(item.login),
          onSubmit: goToUser,
        })
      }
      onSubmit={(e) => onSubmit(e, { onSubmit: goToUser })}
      placeholder="Search by username"
      ariaLabel="GitHub username"
      ariaActivedescendant={isOpen ? `suggestion-${activeIndex}` : undefined}
      />

      {isOpen && (
        <UserSuggestionsComponent
          items={items}
          activeIndex={activeIndex}
          onSelect={handleSelect}
          onHover={setActiveIndex}
        />
      )}
    </div>
  );
};

export default UserSearchComponent;
