import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import RepoCardComponent from "./RepoCardComponent";

type Repo = ComponentProps<typeof RepoCardComponent>["repo"];

const fakeRepo = (overrides: Partial<Repo> = {}): Repo =>
  ({
    id: 1,
    name: "remember-me",
    description: "A TypeScript repo",
    language: "TypeScript",
    stargazers_count: 5,
    forks: 1,
    updated_at: new Date().toISOString(),
    html_url: "#",
    ...overrides,
  }) as unknown as Repo;

const meta: Meta<typeof RepoCardComponent> = {
  title: "Repos/RepoCardComponent",
  component: RepoCardComponent,
};
export default meta;

type Story = StoryObj<typeof RepoCardComponent>;

export const Default: Story = { args: { repo: fakeRepo() } };

export const LongDescription: Story = {
  args: {
    repo: fakeRepo({
      description: "This is a very long description. ".repeat(8),
    }),
  },
};

export const NoCounters: Story = {
  args: { repo: fakeRepo({ stargazers_count: 0, forks: 0 }) },
};
