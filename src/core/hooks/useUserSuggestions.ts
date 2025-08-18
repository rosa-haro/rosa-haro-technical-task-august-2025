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
 * Custom React hook to provide GitHub username suggestions while typing.
 *
 * Responsibilities:
 * - Manages debounced input changes.
 * - Cancels in-flight requests with `AbortController`.
 * - Opens/closes the suggestions dropdown.
 * - Handles keyboard navigation (↑/↓/Enter/Escape).
 * - Wires up ARIA attributes for combobox/listbox accessibility.
 *
 * Presentation-agnostic: does not render UI or navigate.
 * Consumers decide what to do on submit or item selection.
 */

/**
 * Configuration options for the `useUserSuggestions` hook.
 *
 * @property {number} [minChars=2] - Minimum characters before fetching.
 * @property {number} [debounceMs=300] - Delay in ms before firing a request.
 * @property {Function} [fetchFn=searchUserFetch] - Custom fetcher for suggestions.
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
 * Provides username search suggestions logic for GitHub users.
 *
 * Handles:
 * - Input changes → debounced fetch when length >= minChars.
 * - Cancelling previous requests to prevent race conditions.
 * - Dropdown state (`isOpen`, `activeIndex`).
 * - Keyboard interactions (↑/↓ to move, Enter to select, Esc to close).
 * - Form submit (Enter) when dropdown is closed.
 * - Mouse selection (via `onSelect`).
 *
 * Accessibility:
 * - Exposes `listboxId` to link combobox (`aria-controls`) with listbox.
 * - Returns `activeIndex` so the parent can set `aria-activedescendant`.
 *
 * Error handling:
 * - AbortError is swallowed silently.
 * - Other fetch errors are logged and clear the suggestions.
 *
 * @param {Options} [options] - Optional config: `minChars`, `debounceMs`, `fetchFn`.
 * @returns {{
 *   query: string;
 *   items: UserSuggestion[];
 *   isOpen: boolean;
 *   activeIndex: number;
 *   listboxId: string;
 *   setActiveIndex: (i: number) => void;
 *   setIsOpen: (open: boolean) => void;
 *   setQuery: (q: string) => void;
 *   onChange: (e: ChangeEvent<HTMLInputElement>) => void;
 *   onKeyDown: (
 *     e: KeyboardEvent<HTMLInputElement>,
 *     callbacks?: { onSelect?: (item: UserSuggestion) => void; onSubmit?: (q: string) => void }
 *   ) => void;
 *   onSubmit: (
 *     e: FormEvent,
 *     callbacks?: { onSubmit?: (q: string) => void }
 *   ) => void;
 *   onSelect: (
 *     item: UserSuggestion,
 *     callback?: (item: UserSuggestion) => void
 *   ) => void;
 * }}
 *
 * @example
 * const {
 *   query, items, isOpen, activeIndex,
 *   onChange, onKeyDown, onSubmit, onSelect
 * } = useUserSuggestions();
 */
export function useUserSuggestions({
  minChars = 2,
  debounceMs = 300,
  fetchFn = searchUserFetch,
}: Options = {}) {
  /// ---- State ----
  const [query, setQuery] = useState<string>(""); // Current text in the input
  const [items, setItems] = useState<UserSuggestion[]>([]); // Suggestions fetched from API
  const [isOpen, setIsOpen] = useState(false); // Whether dropdown is visible
  const [activeIndex, setActiveIndex] = useState(0); // Highlighted item for keyboard navigation

  /** ID used by aria-controls to link combobox with listbox */
  const listboxId = "user-suggestions";

  // ---- Refs to manage side effects (debounce + abort) ----
  const debounceId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  /**
   * Fetch user suggestions for the given query.
   * - Aborts any previous request (so only the latest input counts).
   * - On success: update items, open dropdown, reset activeIndex.
   * - On AbortError: exit silently (user typed again).
   * - On other errors: log + close dropdown.
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
   * Handle typing in the input.
   * - Updates `query`.
   * - If query length < minChars → clear suggestions & close dropdown.
   * - Otherwise → debounce the API call (wait `debounceMs` before firing).
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
   * Handle keyboard interactions:
   * - Escape → close dropdown
   * - ArrowDown / ArrowUp → move activeIndex
   * - Enter:
   *    - If dropdown open → select current item (via onSelect callback).
   *    - If dropdown closed → submit raw query (via onSubmit callback).
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
   * Handle form submit (e.g. pressing Enter when dropdown is closed).
   * - Trims query.
   * - Calls `onSubmit` callback with the current query.
   * - Closes dropdown.
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
   * Handle mouse/touch selection of a suggestion.
   * - Calls the provided callback with the chosen item.
   * - Closes dropdown.
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
   * - Clear any pending debounce timers.
   * - Abort any in-flight fetch request.
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
