import type { Meta, StoryObj } from "@storybook/react";
import { EnrollmentStatusChart } from "./EnrollmentStatusChart";

const meta: Meta<typeof EnrollmentStatusChart> = {
  title: "Dashboard/EnrollmentStatusChart",
  component: EnrollmentStatusChart,
  args: {
    data: [
      { label: "Oxford", active: 42, completed: 12, dropped: 3 },
      { label: "Cambridge", active: 30, completed: 8, dropped: 2 },
      { label: "Imperial", active: 25, completed: 5, dropped: 1 }
    ]
  }
};

export default meta;

type Story = StoryObj<typeof EnrollmentStatusChart>;

export const Default: Story = {};
