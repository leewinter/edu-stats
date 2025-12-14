import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import {
  InstitutionFormModal,
  type InstitutionFormValues
} from "./InstitutionFormModal";

const baseArgs = {
  open: true,
  loading: false,
  onCancel: fn(),
  onSubmit: async (_values: InstitutionFormValues) => {}
};

const meta: Meta<typeof InstitutionFormModal> = {
  title: "Forms/InstitutionFormModal",
  component: InstitutionFormModal,
  args: baseArgs
};

export default meta;

type Story = StoryObj<typeof InstitutionFormModal>;

export const CreateMode: Story = {
  args: {
    mode: "create",
    errorMessage: undefined
  }
};

export const EditMode: Story = {
  args: {
    mode: "edit",
    initialValues: {
      name: "University of Glasgow",
      enrollment: 26500,
      addresses: [
        {
          line1: "University Avenue",
          line2: "",
          city: "Glasgow",
          county: "Glasgow City",
          country: "United Kingdom",
          postalCode: "G12 8QQ"
        }
      ]
    }
  }
};

export const WithError: Story = {
  args: {
    mode: "create",
    errorMessage: "API unavailable - please try again."
  }
};
