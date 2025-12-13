import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { InstitutionsTable, type InstitutionTableRow } from "./InstitutionsTable";

const sampleInstitutions: InstitutionTableRow[] = [
  {
    id: "edinburgh",
    name: "University of Edinburgh",
    enrollment: 32000,
    addresses: [
      {
        line1: "Old College",
        city: "Edinburgh",
        county: "Midlothian",
        country: "United Kingdom",
        postalCode: "EH8 9YL"
      }
    ]
  },
  {
    id: "oxford",
    name: "University of Oxford",
    enrollment: 24500,
    addresses: [
      {
        line1: "Wellington Square",
        city: "Oxford",
        county: "Oxfordshire",
        country: "United Kingdom",
        postalCode: "OX1 2JD"
      }
    ]
  },
  {
    id: "kcl",
    name: "King's College London",
    enrollment: 29000,
    addresses: [
      {
        line1: "Strand",
        city: "London",
        county: "Greater London",
        country: "United Kingdom",
        postalCode: "WC2R 2LS"
      }
    ]
  }
];

const meta: Meta<typeof InstitutionsTable> = {
  title: "Dashboard/InstitutionsTable",
  component: InstitutionsTable,
  args: {
    institutions: sampleInstitutions,
    onEdit: fn(),
    onDelete: fn()
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
