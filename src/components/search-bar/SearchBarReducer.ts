import type { UserSuggestion } from "../../core/types/github";
import type { Action } from "../../core/types/store";

type SearchBarState = {
    query: string;
    suggestions: UserSuggestion[];
    loading: boolean;
    error: string | null;
};

type SearchBarAction = 
| Action<string>
| Action<UserSuggestion[]>
| Action;
  
const initialState: SearchBarState = {
  query: "",
  suggestions: [] as UserSuggestion[],
  loading: false,
  error: null,
};

const searchBarReducer = (
  state: SearchBarState = initialState,
  action: SearchBarAction
): SearchBarState => {
  switch (action.type) {
    case "SET_QUERY":
      return {
        ...state,
        query: action.payload,
      };
    case "GET_SUGGESTIONS_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "GET_SUGGESTIONS_SUCCESS":
      return {
        ...state,
        loading: false,
        suggestions: action.payload,
      };
    case "GET_SUGGESTIONS_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
        suggestions: [],
      };
    case "CLEAR_SUGGESTIONS":
      return {
        ...state,
        suggestions: [],
      };
    default:
      return state;
  }
};

export default searchBarReducer;
