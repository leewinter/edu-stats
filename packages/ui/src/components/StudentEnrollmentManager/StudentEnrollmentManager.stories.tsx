import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { StudentEnrollmentManager } from "./StudentEnrollmentManager";

const meta: Meta<typeof StudentEnrollmentManager> = {
  title: "Students/StudentEnrollmentManager",
  component: StudentEnrollmentManager,
  parameters: {
    layout: "fullscreen"
  },
  args: {
    open: true,
    studentName: "Amelia Hughes",
    enrollments: [
      {
        id: "1",
        courseTitle: "Computer Science BSc",
        courseCode: "CS101",
        status: "Active",
        enrolledAtUtc: new Date().toISOString()
      },
      {
        id: "2",
        courseTitle: "Data Science MSc",
        courseCode: "DS501",
        status: "Completed",
        enrolledAtUtc: new Date().toISOString()
      }
    ],
    availableCourses: [
      { value: "cs101", label: "Computer Science BSc" },
      { value: "ds501", label: "Data Science MSc" }
    ],
    onDropEnrollment: fn(),
    onCompleteEnrollment: fn()
  }
};

export default meta;

type Story = StoryObj<typeof StudentEnrollmentManager>;

export const Default: Story = {};
