import type { UserSuggestion } from "../../core/types/github";

type Props = {
    items: UserSuggestion[];
    activeIndex: number; // highlighted by keyboard
    onSelect: (item: UserSuggestion) => void // click or MouseDown
    onHover?: (index: number) => void;
    emptyText?: string;
}

const SearchSuggestionsComponent = ({
    items,
    activeIndex,
    onSelect,
    onHover,
    emptyText = "No results",
} : Props ) => {
    if (!items || items.length === 0) return null

  return (
    <ul role="listbox" aria-label="User suggestions">
        {items.map((item, idx) => (
            <li key={item.login} role="option" aria-selected={idx === activeIndex}
            id={`suggestion-${idx}`}
            onMouseDown={(e) => {e.preventDefault(); onSelect(item); }}
            onMouseEnter={() => onHover?.(idx)}>
                <img src={item.avatar_url} alt="" width={20} height={20}/>
                <span>{item.login}</span>

            </li>
        ))}

    </ul>
  )
}

export default SearchSuggestionsComponent