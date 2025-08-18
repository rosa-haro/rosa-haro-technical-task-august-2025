import { http, HttpResponse } from "msw";
import { server } from "../test/server";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import UserPage from "../pages/UserPage";

const BASE_URL = "https://api.github.com";

describe("UserPage — states (loader, empty, error", () => {
  it("shows Loader while fetching user and repos", async () => {
    server.use(
      http.get(`${BASE_URL}/users/:username`, async ({ params }) => {
        await new Promise((r) => setTimeout(r, 150));
        const { username } = params as { username: string };
        return HttpResponse.json(
          {
            login: username,
            id: 1,
            avatar_url: "https://example.com/avatar.png",
            name: "Rosa",
          },
          { status: 200 }
        );
      }),
      http.get(`${BASE_URL}/users/:username/repos`, async () => {
        await new Promise((r) => setTimeout(r, 150));
        return HttpResponse.json(
          [
            {
              id: 1,
              name: "demo-repo",
              language: "TypeScript",
              description: "This is a TypeScript repo",
              stargazers_count: 0,
              forks: 0,
            },
          ],
          { status: 200 }
        );
      })
    );

    render(
      <MemoryRouter initialEntries={["/user/rosa-haro"]}>
        <Routes>
          <Route path="/user/:username" element={<UserPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Loading user and repositories/i)
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("heading", { name: /demo-repo/i })
    ).toBeInTheDocument();
  });

  it("shows RepoList empty state when the user has 0 repositories", async () => {
    server.use(
      http.get(`${BASE_URL}/users/:username`, ({ params }) => {
        const { username } = params as { username: string };
        return HttpResponse.json(
          {
            login: username,
            id: 1,
            avatar_url: "https://example.com/avatar.png",
            name: "Rosa",
          },
          { status: 200 }
        );
      }),
      http.get(`${BASE_URL}/users/:username/repos`, () => {
        return HttpResponse.json([], { status: 200 });
      })
    );

    render(
      <MemoryRouter initialEntries={["/user/rosa-haro"]}>
        <Routes>
          <Route path="/user/:username" element={<UserPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("heading", {
        name: /No repositories match your filters/i,
      })
    ).toBeInTheDocument();
  });

  it("shows error state when API fails", async () => {
    server.use(
        http.get(`${BASE_URL}/users/:username`, () => {
            return HttpResponse.json({ message: "Server error "}, { status: 500 });
        }),
        http.get(`${BASE_URL}/users/:username/repos`, () => {
            return HttpResponse.json({ message: "Server error "}, { status: 500 });
        })
    );

    render(
        <MemoryRouter initialEntries={["/user/rosa-haro"]}>
            <Routes>
                <Route path="/user/:username" element={<UserPage />} />
            </Routes>
        </MemoryRouter>
    );

    expect(
        await screen.findByRole("alert", { name: undefined })
    ).toBeInTheDocument();
    expect(
        screen.getByText(/Failed to load user data and repositories/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Back to search/i)).toBeInTheDocument();
  });
});
