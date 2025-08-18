import type { Meta, StoryObj } from "@storybook/react";
import LoaderComponent from "./LoaderComponent";

const meta: Meta<typeof LoaderComponent> = {
  title: "UI/States/LoaderComponent",
  component: LoaderComponent,
  args: { label: "Loading repositories...", size: 40, hideLabel: false },
};
export default meta;

type Story = StoryObj<typeof LoaderComponent>;
export const Default: Story = {};
export const HiddenLabel: Story = { args: { hideLabel: true, label: "Loading…" } };
export const Bigger: Story = { args: { size: 64 } };
