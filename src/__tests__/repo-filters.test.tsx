import { MemoryRouter, Route, Routes } from "react-router-dom";
import UserPage from "../pages/UserPage";
import { server } from "../test/server";
import { http, HttpResponse } from "msw";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const BASE_URL = "https://api.github.com";

describe("UserPage — repo filters", () => {
  it("filters repositories by text on sumbit (e.g., 'rem')", async () => {
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
        return HttpResponse.json(
          [
            {
              id: 1,
              name: "remember-me",
              language: "TypeScript",
              stargazers_count: 5,
              forks: 0,
              description: "A TS repo",
            },
            {
              id: 2,
              name: "remix-app",
              language: "JavaScript",
              stargazers_count: 3,
              forks: 2,
              description: "A JS app",
            },
            {
              id: 3,
              name: "my-portfolio",
              language: "CSS",
              stargazers_count: 1,
              forks: 1,
              description: "Personal website",
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
      await screen.findByRole("heading", { name: /remember-me/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /remix-app/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /my-portfolio/i })
    ).toBeInTheDocument();

    const input = screen.getByRole("textbox", { name: /repositories search/i });

    await userEvent.clear(input);
    await userEvent.type(input, "rem{enter}");

    expect(
      await screen.findByRole("heading", { name: /remember-me/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /remix-app/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /my-portfolio/i })
    ).not.toBeInTheDocument();
  });

  it("filters repositories by language (TypeScript)", async () => {
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
        return HttpResponse.json(
          [
            {
              id: 1,
              name: "remember-me",
              language: "TypeScript",
              stargazers_count: 5,
              forks: 0,
              description: "A TS repo",
            },
            {
              id: 2,
              name: "remix-app",
              language: "JavaScript",
              stargazers_count: 3,
              forks: 2,
              description: "A JS app",
            },
            {
              id: 3,
              name: "my-portfolio",
              language: "CSS",
              stargazers_count: 1,
              forks: 1,
              description: "Personal website",
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
      await screen.findByRole("heading", { name: /remember-me/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /remix-app/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /my-portfolio/i })
    ).toBeInTheDocument();

    const select = screen.getByRole("combobox", {
      name: /filter by language/i,
    });
    await userEvent.selectOptions(select, "TypeScript");

    expect(
      await screen.findByRole("heading", { name: /remember-me/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: /remix-app/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /my-portfolio/i })
    ).not.toBeInTheDocument();
  });

  it("combines text('rem') and language (TypeScript) filters", async () => {
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
        return HttpResponse.json(
          [
            {
              id: 1,
              name: "remember-me",
              language: "TypeScript",
              stargazers_count: 5,
              forks: 0,
              description: "A TS repo",
            },
            {
              id: 2,
              name: "remix-app",
              language: "JavaScript",
              stargazers_count: 3,
              forks: 2,
              description: "A JS app",
            },
            {
              id: 3,
              name: "my-portfolio",
              language: "CSS",
              stargazers_count: 1,
              forks: 1,
              description: "Personal website",
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
      await screen.findByRole("heading", { name: /remember-me/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /remix-app/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /my-portfolio/i })
    ).toBeInTheDocument();

    const input = screen.getByRole("textbox", { name: /repositories search/i });
    await userEvent.clear(input);
    await userEvent.type(input, "rem{enter}");

    expect(
      await screen.findByRole("heading", { name: /remember-me/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /remix-app/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /my-portfolio/i })
    ).not.toBeInTheDocument();

    const select = screen.getByRole("combobox", {
      name: /filter by language/i,
    });
    await userEvent.selectOptions(select, "TypeScript");

    expect(
      await screen.findByRole("heading", { name: /remember-me/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /remix-app/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /my-portfolio/i })
    ).not.toBeInTheDocument();
  });
});
