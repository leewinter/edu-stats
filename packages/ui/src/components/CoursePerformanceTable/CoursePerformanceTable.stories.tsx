import type { Meta, StoryObj } from "@storybook/react";
import { CoursePerformanceTable } from "./CoursePerformanceTable";

const meta: Meta<typeof CoursePerformanceTable> = {
  title: "Dashboard/CoursePerformanceTable",
  component: CoursePerformanceTable,
  args: {
    data: [
      {
        courseId: "1",
        institutionName: "University of Oxford",
    title: "Computer Science BSc",
    code: "CS101",
    activeEnrollments: 42,
    completedEnrollments: 12,
    droppedEnrollments: 3,
    capacity: 40
  },
  {
        courseId: "2",
        institutionName: "University of Cambridge",
    title: "Engineering MEng",
    code: "ENG401",
    activeEnrollments: 30,
    completedEnrollments: 8,
    droppedEnrollments: 2,
    capacity: 35
  }
    ]
  }
};

export default meta;

type Story = StoryObj<typeof CoursePerformanceTable>;

export const Default: Story = {};
