import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import {
  CourseFormModal,
  type CourseFormValues
} from "./CourseFormModal";

const institutionOptions = [
  { label: "University of Edinburgh", value: "inst-1" },
  { label: "University of Oxford", value: "inst-2" }
];

const baseArgs = {
  open: true,
  loading: false,
  institutionOptions,
  onCancel: fn(),
  onSubmit: async (_values: CourseFormValues) => {}
};

const meta: Meta<typeof CourseFormModal> = {
  title: "Dashboard/CourseFormModal",
  component: CourseFormModal,
  args: baseArgs
};

export default meta;

type Story = StoryObj<typeof CourseFormModal>;

export const CreateMode: Story = {
  args: {
    mode: "create"
  }
};

export const EditMode: Story = {
  args: {
    mode: "edit",
    initialValues: {
      institutionId: "inst-1",
      title: "Computer Science BSc",
      code: "CS101",
      level: "Undergraduate",
      credits: 120,
      description: "Introductory computing degree"
    }
  }
};

export const WithError: Story = {
  args: {
    mode: "create",
    errorMessage: "Unable to save course"
  }
};
