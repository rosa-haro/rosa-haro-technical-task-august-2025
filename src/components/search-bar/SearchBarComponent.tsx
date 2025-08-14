import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import type { UserSuggestion } from "../../core/types/github";
import { searchUserFetch } from "../../core/api/github";
import SearchSuggestionsComponent from "../search-suggestions/SearchSuggestionsComponent";

const SearchBarComponent = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [items, setItems] = useState<UserSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const navigate = useNavigate();
  const listboxId = "user-suggestions";

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSearchQuery(v);

    const q = v.trim();
    if (q.length < 2) {
      setItems([]);
      setIsOpen(false);
      setActiveIndex(0);
      return;
    }

    const res = await searchUserFetch(q);
    setItems(res);
    setIsOpen(res.length > 0);
    setActiveIndex(0);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/user/${encodeURIComponent(q)}`);
    setIsOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {

    if (e.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (items[activeIndex]) {
        e.preventDefault();
        navigate(`/user/${encodeURIComponent(items[activeIndex].login)}`);
        setIsOpen(false);
      }
    }
  };

  const handleSelect = (item: UserSuggestion) => {
    navigate(`/user/${encodeURIComponent(item.login)}`);
    setIsOpen(false);
  };

  return (
    <div
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls={listboxId}
      aria-owns={listboxId}
    >
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          inputMode="search"
          enterKeyHint="search"
          placeholder="Search by username"
          value={searchQuery}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-label="GitHub username"
          aria-autocomplete="list"
          aria-activedescendant={
            isOpen ? `suggestion-${activeIndex}` : undefined
          }
          autoComplete="off"
        />
        <button type="submit" disabled={!searchQuery.trim()}>
          Search
        </button>
      </form>

      {isOpen && items.length > 0 && (
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
