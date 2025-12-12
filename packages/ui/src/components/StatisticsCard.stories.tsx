import type { Meta, StoryObj } from "@storybook/react";
import { StatisticsCard } from "./StatisticsCard";

const meta: Meta<typeof StatisticsCard> = {
  title: "Dashboard/StatisticsCard",
  component: StatisticsCard,
  args: {
    title: "Enrollment",
    value: 12890,
    suffix: "students",
    trendLabel: "+4.1% vs last year"
  }
};

export default meta;

type Story = StoryObj<typeof StatisticsCard>;

export const Default: Story = {};

export const Compact: Story = {
  args: {
    size: "small",
    trendLabel: undefined
  }
};
