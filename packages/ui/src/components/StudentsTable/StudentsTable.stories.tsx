import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { StudentsTable, type StudentTableRow } from "./StudentsTable";

const sampleStudents: StudentTableRow[] = Array.from({ length: 14 }).map((_, index) => ({
  id: `${index + 1}`,
  institutionId: index % 2 === 0 ? "oxford" : "cambridge",
  institutionName: index % 2 === 0 ? "University of Oxford" : "University of Cambridge",
  firstName: ["Amelia", "Noah", "Sophie", "Ethan", "Maya", "Leo"][index % 6],
  lastName: ["Hughes", "Patel", "Davies", "Wong", "O'Connor", "Nguyen"][index % 6],
  email: `student${index + 1}@example.edu`,
  enrollmentYear: 2020 + (index % 5),
  courseFocus: ["Computer Science", "Engineering", "Economics", "Medicine"][index % 4],
  activeEnrollmentCount: (index % 3) + 1
}));

const meta: Meta<typeof StudentsTable> = {
  title: "Students/StudentsTable",
  component: StudentsTable,
  args: {
    students: sampleStudents,
    onEdit: fn(),
    onDelete: fn(),
    onManageEnrollments: fn(),
    pageSize: 5
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
