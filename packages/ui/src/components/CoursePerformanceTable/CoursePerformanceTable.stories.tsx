import type { Meta, StoryObj } from "@storybook/react";
import { CoursePerformanceTable } from "./CoursePerformanceTable";

const meta: Meta<typeof CoursePerformanceTable> = {
  title: "Dashboard/CoursePerformanceTable",
  component: CoursePerformanceTable,
  args: {
    pageSize: 5,
    data: Array.from({ length: 12 }).map((_, index) => ({
      courseId: `${index + 1}`,
      institutionName: index % 2 === 0 ? "University of Oxford" : "University of Cambridge",
      title: `Program ${index + 1}`,
      code: `C${100 + index}`,
      activeEnrollments: 20 + index,
      completedEnrollments: 5 + index,
      droppedEnrollments: index % 3,
      capacity: 30 + index
    }))
  }
};

export default meta;

type Story = StoryObj<typeof CoursePerformanceTable>;

export const Default: Story = {};
