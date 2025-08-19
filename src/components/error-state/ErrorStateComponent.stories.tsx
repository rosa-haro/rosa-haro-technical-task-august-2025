import type { Meta, StoryObj } from "@storybook/react";
import ErrorStateComponent from "./ErrorStateComponent";

const meta: Meta<typeof ErrorStateComponent> = {
  title: "UI/States/ErrorStateComponent",
  component: ErrorStateComponent,
  args: {
    message: "Failed to load user data and repositories.",
    action: (
      <a className="button-secondary px-4 py-2" href="/">
        Back to search
      </a>
    ),
  },
};
export default meta;

type Story = StoryObj<typeof ErrorStateComponent>;

export const Default: Story = {};
