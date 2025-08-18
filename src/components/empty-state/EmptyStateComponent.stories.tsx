import type { Meta, StoryObj } from "@storybook/react";
import EmptyStateComponent from "./EmptyStateComponent";

const meta: Meta<typeof EmptyStateComponent> = {
  title: "UI/States/EmptyStateComponent",
  component: EmptyStateComponent,
  args: {
    title: "No repositories match your filters.",
    description: "Try adjusting the search or language filter.",
    className: "card-base mx-auto max-w-md px-10 py-8 text-center",
  },
  argTypes: {
    className: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof EmptyStateComponent>;

export const Default: Story = {};

export const WithAction: Story = {
  // Example only: the app currently doesn't render an action for this state.
  args: {
    action: (
      <button className="button-secondary px-4 py-2 mt-5">Reset filters</button>
    ),
  },
};
