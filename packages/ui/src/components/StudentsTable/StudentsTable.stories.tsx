import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { StudentsTable, type StudentTableRow } from "./StudentsTable";

const sampleStudents: StudentTableRow[] = [
  {
    id: "1",
    institutionId: "oxford",
    institutionName: "University of Oxford",
    firstName: "Amelia",
    lastName: "Hughes",
    email: "amelia.hughes@oxford.ac.uk",
    enrollmentYear: 2023,
    courseFocus: "Computer Science"
  },
  {
    id: "2",
    institutionId: "cambridge",
    institutionName: "University of Cambridge",
    firstName: "Noah",
    lastName: "Patel",
    email: "noah.patel@cam.ac.uk",
    enrollmentYear: 2022,
    courseFocus: "Engineering"
  }
];

const meta: Meta<typeof StudentsTable> = {
  title: "Dashboard/StudentsTable",
  component: StudentsTable,
  args: {
    students: sampleStudents,
    onEdit: fn(),
    onDelete: fn()
  },
  parameters: {
    layout: "fullscreen"
  }
};

export default meta;

type Story = StoryObj<typeof StudentsTable>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    students: [],
    loading: true
  }
};
