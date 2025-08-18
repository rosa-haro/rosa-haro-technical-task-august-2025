import type { Meta, StoryObj } from "@storybook/react";
import SearchBarComponent from "./SearchBarComponent";
import { fn } from "storybook/test";

const meta: Meta<typeof SearchBarComponent> = {
  title: "Filters/SearchBarComponent",
  component: SearchBarComponent,
  args: {
    value: "ros",
    placeholder: "Search repositories by name",
    ariaLabel: "Repositories search",
    onChange: fn<React.ChangeEventHandler<HTMLInputElement>>(),
    onKeyDown: fn<React.KeyboardEventHandler<HTMLInputElement>>(),
    onSubmit: fn<React.FormEventHandler<HTMLFormElement>>(),
  },
};

export default meta;

type Story = StoryObj<typeof SearchBarComponent>;
export const Default: Story = {};
export const Empty: Story = { args: { value: "" } };
