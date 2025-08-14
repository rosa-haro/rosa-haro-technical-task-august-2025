import type { UserSuggestion } from "../../core/types/github";

type Props = {
  items: UserSuggestion[];
  activeIndex: number; // highlighted by keyboard
  onSelect: (item: UserSuggestion) => void; // click or MouseDown
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
