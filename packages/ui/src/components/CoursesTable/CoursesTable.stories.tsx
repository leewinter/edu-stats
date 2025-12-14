import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { CoursesTable, type CourseTableRow } from "./CoursesTable";

const sampleCourses: CourseTableRow[] = Array.from({ length: 12 }).map((_, index) => ({
  id: `course-${index + 1}`,
  institutionId: index % 2 === 0 ? "inst-1" : "inst-2",
  institutionName: index % 2 === 0 ? "University of Edinburgh" : "University of Oxford",
  title: `Program ${index + 1}`,
  code: `C${100 + index}`,
  level: index % 2 === 0 ? "Undergraduate" : "Postgraduate",
  credits: 90 + index * 5,
  capacity: 40 + index * 2
}));

const meta: Meta<typeof CoursesTable> = {
  title: "Courses/CoursesTable",
  component: CoursesTable,
  args: {
    courses: sampleCourses,
    onEdit: fn(),
    onDelete: fn(),
    pageSize: 5
  },
  parameters: {
    layout: "fullscreen"
  }
};

export default meta;

type Story = StoryObj<typeof CoursesTable>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    courses: [],
    loading: true
  }
};
