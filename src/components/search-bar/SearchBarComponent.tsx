import { useState, type ChangeEvent, type FormEvent } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "../../core/types/store";
import { useNavigate } from "react-router-dom";

// https://api.github.com/users/rosa-haro/repos

const SearchBarComponent = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
//   const dispatch = useDispatch();
  const navigate = useNavigate();
  // const {loading, error} = useSelector((state: RootState) => state.searchBarReducer)

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = searchQuery.trim()
    if (!q) return;
    navigate(`/user/${q}`);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by username..."
          value={searchQuery}
          onChange={handleChange}
          autoComplete='on'
          aria-label='GitHub username'
        />
        <button type="submit" disabled={!searchQuery.trim()}>Search</button>
      </form>
    </div>
  );
};

export default SearchBarComponent;
