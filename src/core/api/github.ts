import type {
  GithubRepo,
  GithubUser,
  GithubUserSearchResponse,
  UserSuggestion,
} from "../types/github";

const BASE_URL = "https://api.github.com";

/**
 * Fetches GitHub user profile by username.
 * @param username - GitHub login
 * @returns GithubUser or null on error/empty input.
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
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError")
      return null;
    throw Error;
  }
};

/**
 * Fetches a single page of repositories for a given GitHub user.
 *
 * Pagination:
 * - Uses `page` (1-based) and (default 30, max 100).
 * - Inspects the HTTP `Link` response header; if it contains `rel="next"`,
 *   `hasNextPage` will be `true`, otherwise `false`.
 *
 * Errors:
 * - On network or HTTP errors, it logs to the console and returns `{ data: [], hasNextPage: false }`.
 *
 * @param username - Github username (whitespace is trimmed).
 * @param opts - Optional setting:
 *    @property page    - Page number (1-based). Default: 1.
 *    @property perPage - Items per page. Default: 30 (max 100).
 *    @property signal  - Optional AbortSignal to cancel the request.
 * @returns Promise<{ data: GithubRepo[]; hasNextPage: boolean }>
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
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { data: [], hasNextPage: false };
    }
    console.error("Error fetching user repositories: ", error);
    return { data: [], hasNextPage: false };
  }
};

/**
 * Fetches ALL repositories for a user by walking through pages.
 * Uses `perPage=100` to minimize requests.
 *
 * Notes:
 * - This is a high-level convenience API built on top of `fetchUserRepos`.
 * - Prefer this in the UI if you want filters to operate on the full dataset
 *   and keep the UI pagination purely local.
 * @param username
 * @param opts
 * @returns
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
 * Searches GitHub users for the given query and returns a simplified list
 * of suggestions (login, avatar_url, html_url).
 *
 * Uses the optional AbortSignal to cancel in-flight requests (useful when typing),
 *
 * @param query - Raw user input. It will be trimmed and URL-encoded.
 * @param opts - Optional options object.
 * @param - opts.signal - AbortSignal to cancel the underlying fetch request.
 * @returns Promise<UserSuggestion[]> - An array of suggestions (empty on error or no results).
 *
 * @example
 * const controller = new AbortController();
 * const suggestions = await searchUserFetch("rosa", { signal: controller.signal });
 * // controller.abort() will cancel the request if needed.
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
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
};
