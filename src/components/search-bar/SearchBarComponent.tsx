import {
  useEffect,
  useRef,
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
  const debounceId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controllerRef = useRef<AbortController | null>(null);


/**
 * Fetches user suggestions for the given query (length >=2).
 * Cancels any in-flight request via the internal `controllerRef` before
 * starting a new one to prevent race conditions and stale results.
 * On success, it opens the dropdown even when the list is empty so the
 * "No results" message can be displayed in an accessible way.
 * @param q - Trimmed search query (length >= 2).
 * @returns Promise<void>
 */
  const requestSuggestions = async (q: string) => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const res = await searchUserFetch(q, { signal: controller.signal });

      setItems(res);
      setIsOpen(true);
      setActiveIndex(0);
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Suggestions error:", error);

      setItems([]);
      setIsOpen(false);
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
    }
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSearchQuery(v);

    const q = v.trim();

    if (q.length < 2) {
      if (debounceId.current) {
        clearTimeout(debounceId.current);
        debounceId.current = null;
      }
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = null;
      }
      setItems([]);
      setIsOpen(false);
      setActiveIndex(0);
      return;
    }

    if (debounceId.current) {
      clearTimeout(debounceId.current);
    }
    debounceId.current = setTimeout(() => {
      requestSuggestions(q);
    }, 300);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/user/${encodeURIComponent(q)}`);
    setIsOpen(false);
  };

  // Keyboard behavior for the combobox:
  // - Escape: closes the dropdown (does NOT clear the input; we use type="text").
  // - ArrowDown/ArrowUp: moves the active index while the dropdown is open.
  // - Enter: if the dropdown is open and the active item exists, it selects it and 
  //   navigates. Otherwise, it lets the form submit with the typed text.
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

  useEffect(() => {
    return () => {
      if (debounceId.current) {
        clearTimeout(debounceId.current);
        debounceId.current = null;
      }
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = null;
      }
    };
  }, []);

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
