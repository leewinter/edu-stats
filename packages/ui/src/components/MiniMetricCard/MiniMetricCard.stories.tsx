import type { Meta, StoryObj } from "@storybook/react";
import { MiniMetricCard } from "./MiniMetricCard";

const meta: Meta<typeof MiniMetricCard> = {
  title: "Dashboard/MiniMetricCard",
  component: MiniMetricCard,
  args: {
    title: "Active enrollments",
    value: "2,480",
    deltaLabel: "+8% vs last term",
    deltaType: "positive",
    caption: "Latest synchronized snapshot"
  }
};

export default meta;

type Story = StoryObj<typeof MiniMetricCard>;

export const Default: Story = {};
