import { http, HttpResponse } from "msw";

/** Default MSW handlers for GitHub API endpoints used in tests (search users, user, repos). */

const BASE_URL = "https://api.github.com";

export const handlers = [

  http.get(`${BASE_URL}/search/users`, () => {

    return HttpResponse.json(
      { total_count: 0, incomplete_results: false, items: [] },
      { status: 200 }
    );
  }),

  http.get(`${BASE_URL}/users/:username`, ({ params }) => {
    const { username } = params as { username: string };
    return HttpResponse.json(
      {
        login: username,
        id: 1,
        avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
      },
      { status: 200 }
    );
  }),

  http.get(`${BASE_URL}/users/:username/repos`, () => {
    return HttpResponse.json([], { status: 200 });
  }),
];
