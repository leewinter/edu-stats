import { test, expect } from "@playwright/test";

const headingText = "Edu Stats Explorer";

const seedInstitution = "Northwind University";

test.describe("Institutions dashboard", () => {
  test("lists seed data from the API", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: headingText })).toBeVisible();

    const table = page.getByRole("table");
    await expect(table).toBeVisible();

    await expect(table.getByRole("row", { name: new RegExp(seedInstitution, "i") })).toBeVisible();
  });
});
