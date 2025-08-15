import { useNavigate } from "react-router-dom";
import type { UserSuggestion } from "../../core/types/github";
import { useUserSuggestions } from "../../core/hooks/useUserSuggestions";
import UserSuggestionsComponent from "../user-suggestions/UserSuggestionsComponent";
import SearchBarComponent from "../search-bar/SearchBarComponent";

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
