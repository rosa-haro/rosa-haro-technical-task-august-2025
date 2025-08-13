const BASE_URL = "https://api.github.com";

export const searchUserFetch = async (query: string) => {
  try {
    if (!query.trim()) return [];

    const res = await fetch(
      `${BASE_URL}/search/users?q=${encodeURIComponent(query)}&per_page=5`,
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

    return result.items.map((user: any) => ({
      login: user.login,
      avatar_url: user.avatar_url,
      html_url: user.html_url,
    }));
  } catch (error) {
    console.error("Error buscando usuarios:", error);
    return [];
  }
};
