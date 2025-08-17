import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { server } from "../test/server";
import { http, HttpResponse } from "msw";
import UserSearchComponent from "../components/user-search-component/UserSearchComponent";

const BASE_URL = "https://api.github.com";

describe("Home — user suggestions", () => {
    it("shows my GitHub user when typing", async () => {
      server.use(
        http.get(`${BASE_URL}/search/users`, ({ request }) => {
          const url = new URL(request.url);
          const q = (url.searchParams.get("q") ?? "").toLowerCase();
  
          const items = q.includes("rosa")
            ? [
                {
                  login: "rosa-haro",
                  id: 123,
                  avatar_url: "https://avatars.githubusercontent.com/u/123?v=4",
                },
              ]
            : [];
  
          return HttpResponse.json(
            { total_count: items.length, incomplete_results: false, items },
            { status: 200 }
          );
        })
      );
  
      render(
        <MemoryRouter>
          <UserSearchComponent />
        </MemoryRouter>
      );
  
      const input = screen.getByRole("textbox", { name: /gitHub username/i });
  
      await userEvent.type(input, "rosa");
  
      expect(await screen.findByRole("listbox", { name: /user suggestions/i })).toBeInTheDocument();
      expect(await screen.findByText(/rosa-haro/i)).toBeInTheDocument();
    });
  });