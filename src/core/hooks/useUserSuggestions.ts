import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { searchUserFetch } from "../api/github";
import type { UserSuggestion } from "../types/github";

/**
 * Configuration options for the `useUserSuggestions` hook.
 * @property minChars   Minimum characters before fetching suggestions (default: 2).
 * @property debounceMs Debounce delay in milliseconds before triggering a fetch (default: 300).
 * @property fetchFn    Function that fetches suggestions; defaults to the GitHub users API wrapper.
 */
type Options = {
  minChars?: number;
  debounceMs?: number;
  fetchFn?: (
    q: string,
    init?: { signal?: AbortSignal }
  ) => Promise<UserSuggestion[]>;
};

/**
 * Custom hook to manage user search suggestions for GitHub usernames.
 * 
 * Handles:
 * - Debounced input changes with minimum character threshold.
 * - Cancelling in-flight requests via AbortController to prevent race conditions.
 * - Opening/closing of suggestions dropdown.
 * - Keyboard navigation (↑/↓/Enter/Escape).
 * - Accesible listbox/combobox ARIA bindings.
 * 
 * This hook is presentation-agnostic: it does not navigate or render UI.
 * Callers decide what to do when the form is submitted (`onSubmit`) or an item is selected.
 * 
 * @param options - Optional configuration: minChars, debounceMs, fetchFn.
 * @returns State and handlers to wire up an input + suggestions listbox.
 */

export function useUserSuggestions({
  minChars = 2,
  debounceMs = 300,
  fetchFn = searchUserFetch,
}: Options = {}) {
  /// ---- State ----
  const [query, setQuery] = useState<string>("");
  const [items, setItems] = useState<UserSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  /** ID used by aria-controls to link combobox with listbox */
  const listboxId = "user-suggestions";

  // ---- Refs for side-effect management ----
  const debounceId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  /**
   * Fetches user suggestions for a given query.
   * Cancels any ongoing request before starting a new one.
   * 
   * @param q - Trimmed search query (length >= minChars).
   */
  const requestSuggestions = async (q: string) => {
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const res = await fetchFn(q, { signal: controller.signal });
      setItems(res);
      setIsOpen(true);
      setActiveIndex(0);
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Suggestions error:", error);
      setItems([]);
      setIsOpen(false);
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null;
    }
  };

  /**
   * Handles changes in the search input.
   * Debounces the query and triggers suggestions fetch if length >= minChars.
   */
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);

    const q = v.trim();

    if (q.length < minChars) {
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

    if (debounceId.current) clearTimeout(debounceId.current);
    debounceId.current = setTimeout(() => {
      requestSuggestions(q);
    }, debounceMs);
  };

  /**
   * Handles keyboard navigation and selection within the suggestions list.
   * 
   * @param e - Keyboard event from the input element. 
   * @param callbacks - Optional callbacks:
   *  - onSelect: called when selecting an item via Enter key.
   *  - onSubmit: called when pressing Enter without selecting from suggestions. 
   */
  const onKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    callbacks: {
      onSelect?: (item: UserSuggestion) => void;
      onSubmit?: (query: string) => void;
    } = {}
  ) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (isOpen) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, items.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter") {
        const active = items[activeIndex];
        if (active && callbacks.onSelect) {
          e.preventDefault();
          callbacks.onSelect(active);
          setIsOpen(false);
        }
        return;
      }
    } else {
      if (e.key === "Enter") {
        const q = query.trim();
        if (!q) return;
        callbacks.onSubmit?.(q);
        setIsOpen(false);
      }
    }

    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const q = query.trim();
      if (!q) return;
      callbacks.onSubmit?.(q);
      setIsOpen(false);
    }
  };

  /**
   * Handles form submission.
   * Calls the provided onSubmit callback with the current query.
   */

  const onSubmit = (
    e: FormEvent,
    callbacks: { onSubmit?: (query: string) => void } = {}
  ) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    callbacks.onSubmit?.(q);
    setIsOpen(false);
  };

  /**
   * Handles selection of a suggestion via mouse or touch.
   * Calls the provided callback with the selected item.
   */

  const onSelect = (
    item: UserSuggestion,
    callback?: (item: UserSuggestion) => void
  ) => {
    callback?.(item);
    setIsOpen(false);
  };

  /**
   * Cleanup on unmount:
   *  - Clears pending debounce timers.
   *  - Aborts any in-flight fetch request.
   */
  useEffect(() => {
    return () => {
      if (debounceId.current) {
        clearTimeout(debounceId.current);
        debounceId.current = null;
      }
    };
  }, []);

  return {
    query,
    items,
    isOpen,
    activeIndex,
    listboxId,
    setActiveIndex,
    setIsOpen,
    setQuery,
    onChange,
    onKeyDown,
    onSubmit,
    onSelect,
  };
}
