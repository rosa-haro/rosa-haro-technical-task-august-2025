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

const SearchSuggestionsComponent = ({
  items,
  activeIndex,
  onSelect,
  onHover
}: Props) => {
  const hasItems = items && items.length > 0;

  return (
    <ul id="user-suggestions" role="listbox" aria-label="User suggestions">
      {!hasItems ? (
        <li role="option" aria-disabled="true">
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
            style={idx === activeIndex ? { background: "#eef6ff" } : undefined} //TODO: just to test, erase later
          >
            <img src={item.avatar_url} alt="" width={20} height={20} />
            <span>{item.login}</span>
          </li>
        ))
      )}
    </ul>
  );
};

export default SearchSuggestionsComponent;
