import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { StudentFormModal } from "./StudentFormModal";

const meta: Meta<typeof StudentFormModal> = {
  title: "Forms/StudentFormModal",
  component: StudentFormModal,
  args: {
    open: true,
    mode: "create",
    institutionOptions: [
      { value: "oxford", label: "University of Oxford" },
      { value: "edinburgh", label: "University of Edinburgh" }
    ],
    onCancel: fn(),
    onSubmit: fn()
  }
};

export default meta;

type Story = StoryObj<typeof StudentFormModal>;

export const Default: Story = {};

export const EditMode: Story = {
  args: {
    mode: "edit",
    initialValues: {
      institutionId: "edinburgh",
      firstName: "Amelia",
      lastName: "Hughes",
      email: "amelia.hughes@example.com",
      enrollmentYear: 2023,
      courseFocus: "Computer Science"
    }
  }
};
