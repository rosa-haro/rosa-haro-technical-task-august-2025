import type {
  GithubRepo,
  GithubUser,
  GithubUserSearchResponse,
  UserSuggestion,
} from "../types/github";

/**
 * GitHub REST API (v3) helpers used by the app.
 * 
 * Notes:
 * - All requests send `Accept: application/vns.github+json`.
 * - `AbortError` is always treated as benign (returns empty/null silently).
 * - Error-handling contract is documented per function.
 */

const BASE_URL = "https://api.github.com";

/**
 * Fetches a GitHub user profile by username.
 * 
 * Behavior:
 * - Success: returns a `GithubUser`.
 * - 404 Non Found: return `null` (username does not exist).
 * - AbortError (request cancelled): returns `null`.
 * - Other HTTP/Network errors: **throws** the original error (caller must handle).
 * 
 * Rationale:
 * Profile data is critical for the UI. Throwing on unexpected errors allows the 
 * caller to distinguish "there is no such user" (404) from "something went wrong"
 * @param {string} username - GitHub login (whitespace is trimmed). 
 * @returns {Promise<GithubUser|null>} Resolves to the user or `null` (404/empty input/aborted).
 * @throws {Error} When the response is not OK and not a 404 (e.g., 500, 403 rate limit).
 * 
 * @example
 * const user = await fetchUserData("rosaharo");
 * if (!user) { show "User not found" }
 */
export const fetchUserData = async (username: string) => {
  try {
    if (!username.trim()) return null;

    const res = await fetch(
      `${BASE_URL}/users/${encodeURIComponent(username)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (res.status === 404) return null;
    if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    }

    const result = await res.json();
    return result as GithubUser;
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return null;
    }
    throw error;
  }
};

/**
 * Fetches a single page of repositories for a given GitHub user.
 *
 * Pagination:
 * - Uses `page` (1-based) and `perPage` (default 30, max 100).
 * - Inspects the HTTP `Link` header; if it contains `rel="next"`, then `hasNextPage = true`.
 *
 * Behavior:
 * - Success: returns `{ data, hasNextPage }`.
 * - 404 Not Found: returns `{ data: [], hasNextPage: false }`.
 * - AbortError (request cancelled): returns `{ data: [], hasNextPage: false }`.
 * - Other HTTP/Network errors: returns `{ data: [], hasNextPage: false }` (no throw).
 *
 * Rationale:
 * Repos are non-critical compared to the profile. Returning empty results keeps the
 * UI simple (show “no repos”) without bubbling errors unnecessarily.
 * 
 * @param {string} username - GitHub username (whitespace is trimmed).
 * @param {Object} [opts] - Optional settings.
 * @param {number} [opts.page=1] - Page number (1-based).
 * @param {number} [opts.perPage=30] - Items per page (max 100).
 * @param {AbortSignal} [opts.signal] - Used to cancel the request.
 * @returns {Promise<{ data: GithubRepo[]; hasNextPage: boolean }>}
 *
 * @example
 * const { data, hasNextPage } = await fetchUserRepos("rosa-haro", { perPage: 100 });
 */
export const fetchUserRepos = async (
  username: string,
  opts?: { page?: number; perPage?: number; signal?: AbortSignal }
): Promise<{ data: GithubRepo[]; hasNextPage: boolean }> => {
  try {
    const page = opts?.page ?? 1;
    const perPage = opts?.perPage ?? 30;

    if (!username.trim()) return { data: [], hasNextPage: false };

    const res = await fetch(
      `${BASE_URL}/users/${encodeURIComponent(
        username
      )}/repos?per_page=${perPage}&page=${page}&sort=updated`,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.github+json",
        },
        signal: opts?.signal,
      }
    );

    if (res.status === 404) return { data: [], hasNextPage: false };
    if (!res.ok) throw new Error(`Error ${res.status}`);

    const data = (await res.json()) as GithubRepo[];

    // GitHub paginates with the 'Link' header; rel="next" indicates more pages.
    const link = res.headers.get("Link") || "";
    const hasNextPage = /rel="next"/.test(link);

    return { data: Array.isArray(data) ? data : [], hasNextPage };
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { data: [], hasNextPage: false };
    }
    return { data: [], hasNextPage: false };
  }
};

/**
 * Fetches ALL repositories for a user by walking through pages.
 * Uses `perPage=100` by default to minimize the number of requests.
 *
 * Built on top of `fetchUserRepos`.
 *
 * Behavior:
 * - Success: returns a flat array with all repositories.
 * - Empty/invalid username: returns `[]`.
 * - AbortError (request cancelled): returns `[]`.
 * - Other HTTP/Network errors: returns `[]` (inherits behavior from `fetchUserRepos`).
 * 
 * @param {string} username - GitHub username.
 * @param {Object} [opts] - Optional settings.
 * @param {number} [opts.perPage=100] - Items per page to use while walking pages (max 100).
 * @param {AbortSignal} [opts.signal] - Used to cancel ongoing pagination.
 * @returns {Promise<GithubRepo[]>}
 *
 * @example
 * const repos = await fetchAllUserRepos("rosa-haro");
 * // Great for local filtering + client-side paging.
 */
export const fetchAllUserRepos = async (
  username: string,
  opts?: { perPage?: number; signal?: AbortSignal }
): Promise<GithubRepo[]> => {
  const perPage = opts?.perPage ?? 100;
  if (!username.trim()) return [];

  let page = 1;
  let all: GithubRepo[] = [];

  while (true) {
    const { data, hasNextPage } = await fetchUserRepos(username, {
      page,
      perPage,
      signal: opts?.signal,
    });
    all = all.concat(data);
    if (!hasNextPage) break;
    page += 1;
  }

  return all;
};

/**
 * Searches GitHub users for a given query and returns simplified suggestions
 * (login, avatar_url, html_url). Intended for the username autocomplete.
 *
 * Behavior:
 * - Success: returns an array of `UserSuggestion`.
 * - Empty/whitespace query: returns `[]`.
 * - AbortError (request cancelled): returns `[]`.
 * - Other HTTP/Network errors: returns `[]` (no throw).
 * 
 * @param {string} query - Raw user input (trimmed and URL-encoded).
 * @param {Object} [opts] - Optional settings.
 * @param {AbortSignal} [opts.signal] - Used to cancel the request (typing).
 * @returns {Promise<UserSuggestion[]>} Empty array on error or no results.
 *
 * @example
 * const controller = new AbortController();
 * const items = await searchUserFetch("rosa", { signal: controller.signal });
 * // controller.abort() to cancel if the user keeps typing.
 */
export const searchUserFetch = async (
  query: string,
  opts?: { signal?: AbortSignal }
): Promise<UserSuggestion[]> => {
  try {
    const q = query.trim();
    if (!q) return [];

    const res = await fetch(
      `${BASE_URL}/search/users?q=${encodeURIComponent(q)}&per_page=5`,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.github+json",
        },
        signal: opts?.signal,
      }
    );

    if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    }

    const result = (await res.json()) as GithubUserSearchResponse;

    if (!result || !Array.isArray(result.items)) return [];

    return result.items.map(({ login, avatar_url, html_url }) => ({
      login,
      avatar_url,
      html_url,
    }));
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return [];
    }
    return [];
  }
};
