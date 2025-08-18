import type { Meta, StoryObj } from "@storybook/react";
import LanguageFilterComponent from "./LanguageFilterComponent";

const meta: Meta<typeof LanguageFilterComponent> = {
  title: "Filters/LanguageFilterComponent",
  component: LanguageFilterComponent,
  args: {
    value: "",
    options: ["TypeScript", "JavaScript", "CSS"],
  },
  argTypes: {
    onChange: { action: "onChange" },
  },
};
export default meta;

type Story = StoryObj<typeof LanguageFilterComponent>;
export const Default: Story = {};
export const Selected: Story = { args: { value: "TypeScript" } };