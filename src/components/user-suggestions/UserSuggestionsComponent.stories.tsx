import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import UserSuggestionsComponent from "./UserSuggestionsComponent";
import { fn } from "storybook/test";

const items = [
  {
    login: "rosa-haro",
    avatar_url: "https://picsum.photos/40?1",
    html_url: "#",
  },
  { login: "jane", avatar_url: "https://picsum.photos/40?2", html_url: "#" },
  { login: "alice", avatar_url: "https://picsum.photos/40?3", html_url: "#" },
];

type Props = ComponentProps<typeof UserSuggestionsComponent>;
type OnSelect = Props["onSelect"];
type OnHover = NonNullable<Props["onHover"]>;

const meta: Meta<typeof UserSuggestionsComponent> = {
  title: "Search/UserSuggestionsComponent",
  component: UserSuggestionsComponent,
  decorators: [
    (Story) => (
      <div className="relative mx-auto w-[28rem] min-h-10 pt-2">
        <Story />
      </div>
    ),
  ],
  args: {
    items,
    activeIndex: 0,
    onSelect: fn<OnSelect>(),
    onHover: fn<OnHover>(),
  },
};
export default meta;

type Story = StoryObj<typeof UserSuggestionsComponent>;

export const WithItems: Story = {};

export const Empty: Story = {
  args: { items: [] },
};
