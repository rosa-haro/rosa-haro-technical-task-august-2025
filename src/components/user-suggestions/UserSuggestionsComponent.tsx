import type { UserSuggestion } from "../../core/types/github";

/**
 * Presentational listbox for user search suggestions.
 * 
 * Accessibility:
 * - The root element is a <ul id="user-suggestions" role="listbox">
 * - Each item is rendered as <li role="option" aria-selected={boolean}>
 * - The parent combobox should reference this listbox via aria-controls="user-suggestions"
 *   and manage focus/active item via aria-activedescendant="suggestion-{index}".
 * 
 * Empty state: - The Component always renders the <ul>. When `items.length === 0`,
 * it shows a single disabled <li> with the "No results" message.
 * 
 * Interaction:
 * - Mouse selection uses onMouseDown to avoid losing focus before selecting.
 * - Keyboard navigation (↑/↓/Enter) is habled by the parent combobox.
 * 
 * @param items - Suggestions to render (login, avatar_url, html_url).
 * @param activeIndex - Zero-based index of the highlighted suggestion.
 * @param onSelect - Called when a suggestion is chosen (click or mouse down).
 * @param onHover - Optional callback when the pointer hovers an item (updates activeIndex)
 */

type Props = {
  items: UserSuggestion[];
  activeIndex: number;
  onSelect: (item: UserSuggestion) => void;
  onHover?: (index: number) => void;
  emptyText?: string;
};

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
