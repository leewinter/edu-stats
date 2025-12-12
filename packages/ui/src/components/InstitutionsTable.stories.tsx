import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { InstitutionsTable, type InstitutionTableRow } from "./InstitutionsTable";

const sampleInstitutions: InstitutionTableRow[] = [
  {
    id: "edinburgh",
    name: "University of Edinburgh",
    county: "Midlothian",
    country: "United Kingdom",
    enrollment: 32000
  },
  {
    id: "oxford",
    name: "University of Oxford",
    county: "Oxfordshire",
    country: "United Kingdom",
    enrollment: 24500
  },
  {
    id: "kcl",
    name: "King's College London",
    county: "Greater London",
    country: "United Kingdom",
    enrollment: 29000
  }
];

const meta: Meta<typeof InstitutionsTable> = {
  title: "Dashboard/InstitutionsTable",
  component: InstitutionsTable,
  args: {
    institutions: sampleInstitutions,
    onEdit: fn()
  },
  parameters: {
    layout: "fullscreen"
  }
};

export default meta;

type Story = StoryObj<typeof InstitutionsTable>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    institutions: [],
    loading: true
  }
};
