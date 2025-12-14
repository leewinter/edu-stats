import type { Meta, StoryObj } from "@storybook/react";
import { NavigationHeader } from "./NavigationHeader";

const meta: Meta<typeof NavigationHeader> = {
  title: "Layout/NavigationHeader",
  component: NavigationHeader,
  parameters: {
    layout: "fullscreen"
  }
};

export default meta;

type Story = StoryObj<typeof NavigationHeader>;

export const Default: Story = {
  args: {
    title: "Edu Stats Explorer",
    subtitle: "Higher education insights powered by the Edu Stats API",
    selectedKey: "dashboard",
    logoSrc: "edu-stats-logo.svg",
    logoHref: "#",
    menuItems: [
      { key: "dashboard", label: "Dashboard" },
      { key: "courses", label: "Courses" }
    ]
  }
};

export const WithExtraContent: Story = {
  args: {
    ...Default.args,
    extra: <span style={{ color: "#fff" }}>v0.2.0</span>,
    selectedKey: "courses"
  }
};
