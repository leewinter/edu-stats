import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { CoursesTable, type CourseTableRow } from "./CoursesTable";

const sampleCourses: CourseTableRow[] = [
  {
    id: "cs101",
    institutionId: "inst-1",
    institutionName: "University of Edinburgh",
    title: "Computer Science BSc",
    code: "CS101",
    level: "Undergraduate",
    credits: 120
  },
  {
    id: "ds501",
    institutionId: "inst-1",
    institutionName: "University of Edinburgh",
    title: "Data Science MSc",
    code: "DS501",
    level: "Postgraduate",
    credits: 90
  },
  {
    id: "eng401",
    institutionId: "inst-2",
    institutionName: "University of Oxford",
    title: "Engineering MEng",
    code: "ENG401",
    level: "Undergraduate",
    credits: 140
  }
];

const meta: Meta<typeof CoursesTable> = {
  title: "Dashboard/CoursesTable",
  component: CoursesTable,
  args: {
    courses: sampleCourses,
    onEdit: fn(),
    onDelete: fn()
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
