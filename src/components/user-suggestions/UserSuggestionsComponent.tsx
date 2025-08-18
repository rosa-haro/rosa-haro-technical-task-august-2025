import type { UserSuggestion } from "../../core/types/github";

/**
 * Presentational listbox for username suggestions.
 * 
 * Responsibilities:
 * - Renders a `<ul role="listbox">` with `<li role="option">` items.
 * - Highlights the active item via `aria-selected` for keyboard users.
 * - Emits `onSelect(item)` on mouse selection (mousedown to keep focus).
 * - Emits `onHover(index)` when the pointer moves across options (optional).
 * 
 * Accessibility:
 * - The parent "combobox" should reference this listbox via `aria-controls`
 *   and manage `aria-activedescendant` on the input.
 * - Each item gets a stable `id="suggestion-${index}"` to be used upstream.
 * 
 * Empty state:
 * - Always renders the `<ul>`. When `items.length === 0`, shows a single
 *   disabled `<li>` with "No results".
 * 
 * Notes:
 * - This component is intentionally UI-only: no fetching or navigation here.
 */

/**
 * Props for `UserSuggestionsComponent`.
 *
 * @property {UserSuggestion[]} items - List of suggestions to display.
 * @property {number} activeIndex - Zero-based index of the highlighted item.
 * @property {(item: UserSuggestion) => void} onSelect - Called on mouse selection.
 * @property {(index: number) => void} [onHover] - Optional; updates active index on pointer hover.
 * @property {string} [emptyText="No results"] - Optional message when `items` is empty.
 */

type Props = {
  items: UserSuggestion[];
  activeIndex: number;
  onSelect: (item: UserSuggestion) => void;
  onHover?: (index: number) => void;
  emptyText?: string;
};

/**
 * UserSuggestionsComponent
 *
 * Renders GitHub user suggestions with proper listbox semantics. Uses
 * `onMouseDown` to allow selection without losing focus on the input (important
 * for the combobox pattern).
 *
 * @example
 * <UserSuggestionsComponent
 *   items={items}
 *   activeIndex={activeIndex}
 *   onSelect={(item) => navigate(`/user/${item.login}`)}
 *   onHover={(i) => setActiveIndex(i)}
 * />
 */

const UserSuggestionsComponent = ({
  items,
  activeIndex,
  onSelect,
  onHover
}: Props) => {
  const hasItems = items && items.length > 0;

  return (
    <ul id="user-suggestions" role="listbox" aria-label="User suggestions" className="absolute z-20 mt-2 w-full card-base p-1 max-h-72 overflow-y-auto">
      {!hasItems ? (
        <li role="option" aria-disabled="true" className="px-3 py-2 text-[color:var(--color-muted)]">
          No results
        </li>
      ) : (
        items.map((item, idx) => (
          <li
            key={item.login}
            role="option"
            aria-selected={idx === activeIndex}
            id={`suggestion-${idx}`}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(item);
            }}
            onMouseEnter={() => onHover?.(idx)}
            className={`flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] cursor-pointer
              ${idx === activeIndex ? "bg-white/10" : "hover:bg-white/5 focus-visible:bg-white/10"}`}
          >
            <img src={item.avatar_url} alt="" className="h-6 w-6 rounded-full border border-[var(--color-border)]" />
            <span className="truncate">{item.login}</span>
          </li>
        ))
      )}
    </ul>
  );
};

export default UserSuggestionsComponent;
