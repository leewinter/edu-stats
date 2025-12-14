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
  },
  {
    id: "manchester",
    name: "University of Manchester",
    enrollment: 40500,
    addresses: [
      {
        line1: "Oxford Rd",
        city: "Manchester",
        county: "Greater Manchester",
        country: "United Kingdom",
        postalCode: "M13 9PL"
      }
    ]
  },
  {
    id: "warwick",
    name: "University of Warwick",
    enrollment: 26500,
    addresses: [
      {
        line1: "Gibbet Hill Rd",
        city: "Coventry",
        county: "Warwickshire",
        country: "United Kingdom",
        postalCode: "CV4 7AL"
      }
    ]
  },
  {
    id: "bristol",
    name: "University of Bristol",
    enrollment: 23500,
    addresses: [
      {
        line1: "Senate House",
        city: "Bristol",
        county: "Bristol",
        country: "United Kingdom",
        postalCode: "BS8 1TH"
      }
    ]
  }
];

const meta: Meta<typeof InstitutionsTable> = {
  title: "Institutions/InstitutionsTable",
  component: InstitutionsTable,
  args: {
    institutions: sampleInstitutions,
    onEdit: fn(),
    onDelete: fn(),
    pageSize: 4
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
