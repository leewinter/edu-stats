import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming";

const theme = create({
  base: "dark",
  brandTitle: "Edu Stats UI",
  brandImage: "edu-stats-logo.svg",
  brandTarget: "_self"
});

addons.setConfig({
  theme
});

