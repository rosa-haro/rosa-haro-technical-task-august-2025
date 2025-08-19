import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import RepoCardComponent from "../repo-card/RepoCardComponent";
import RepoListComponent from "./RepoListComponent";

type Repo = ComponentProps<typeof RepoCardComponent>["repo"];
const fakeRepo = (o: Partial<Repo> = {}): Repo =>
  ({
    id: 1,
    name: "remember-me",
    description: "A TS repo",
    language: "TypeScript",
    stargazers_count: 5,
    forks: 0,
    updated_at: new Date().toISOString(),
    html_url: "#",
    ...o,
  }) as unknown as Repo;

const meta: Meta<typeof RepoListComponent> = {
  title: "Repos/RepoListComponent",
  component: RepoListComponent,
};
export default meta;

type Story = StoryObj<typeof RepoListComponent>;

export const WithRepos: Story = {
  args: {
    repos: [
      fakeRepo({ id: 1 }),
      fakeRepo({ id: 2, name: "remix-app", language: "JavaScript" }),
    ],
  },
};

export const Empty: Story = { args: { repos: [] } };
