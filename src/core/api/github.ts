const BASE_URL = "https://api.github.com";

export const fetchUserData = async (username: string) => {
  try {
    if (!username.trim()) return null;

    const res = await fetch(`${BASE_URL}/users/${username}`, {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
      },
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    }

    const result = await res.json();
    return {
      login: result.login,
      id: result.id,
      avatar_url: result.avatar_url,
      html_url: result.html_url,
      name: result.name,
      bio: result.bio,
      followers: result.followers,
      following: result.following,
      public_repos: result.public_repos,
      location: result.location,
      blog: result.blog,
      company: result.company
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const fetchUserRepos = async (username: string) => {
  try {
    if (!username.trim()) return [];

    const res = await fetch(
      `${BASE_URL}/users/${username}/repos?per_page=100&sort=updated`,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.github+json"
        }
      }
    );

    if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    }

    const result = await res.json();

    return result.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      html_url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      updated_at: repo.updated_at,
    }))
  } catch (error) {
    console.error("Error fetching user repositories:", error)
    return [];
  }
}

// export const searchUserFetch = async (query: string) => {
//   try {
//     if (!query.trim()) return [];

//     const res = await fetch(
//       `${BASE_URL}/search/users?q=${encodeURIComponent(query)}&per_page=5`,
//       {
//         method: "GET",
//         headers: {
//           Accept: "application/vnd.github+json",
//         },
//       }
//     );

//     if (!res.ok) {
//       throw new Error(`Error ${res.status}`);
//     }

//     const result = await res.json();

//     return result.items.map((user: any) => ({
//       login: user.login,
//       avatar_url: user.avatar_url,
//       html_url: user.html_url,
//     }));
//   } catch (error) {
//     console.error("Error buscando usuarios:", error);
//     return [];
//   }
// };
