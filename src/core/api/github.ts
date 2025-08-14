import type {
  GithubRepo,
  GithubUser,
  GithubUserSearchResponse,
  UserSuggestion,
} from "../types/github";

const BASE_URL = "https://api.github.com";

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

    if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    }

    const result = await res.json();

    return result as GithubUser;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const fetchUserRepos = async (username: string) => {
  try {
    if (!username.trim()) return [];

    const res = await fetch(
      `${BASE_URL}/users/${encodeURIComponent(
        username
      )}/repos?per_page=100&sort=updated`,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    }

    const result = await res.json();

    return Array.isArray(result) ? (result as GithubRepo[]) : [];
  } catch (error) {
    console.error("Error fetching user repositories:", error);
    return [];
  }
};

export const searchUserFetch = async (
  query: string
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
