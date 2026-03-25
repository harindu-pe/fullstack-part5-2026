const { test, describe, expect, beforeEach } = require("@playwright/test");

describe("Blog app", async () => {
  beforeEach(async ({ page, request }) => {
    // empty the db here
    await request.post("http://localhost:3003/api/testing/reset");
    // create a user for the backend here
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });
    // go to page
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    const locator1 = page.getByText("Log in to application");
    await expect(locator1).toBeVisible();

    const locator2 = page.getByRole("button", { name: "login" });
    await expect(locator2).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByRole("textbox").first().fill("mluukkai");
      await page.getByRole("textbox").last().fill("salainen");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("mluukkai logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByRole("textbox").first().fill("mluukkai");
      await page.getByRole("textbox").last().fill("wrong");
      await page.getByRole("button", { name: "login" }).click();

      await expect(
        page.getByText("invalid username or password"),
      ).toBeVisible();
    });
  });

  test("a new blog can be created", async ({ page }) => {
    await page.getByRole("textbox").first().fill("mluukkai");
    await page.getByRole("textbox").last().fill("salainen");
    await page.getByRole("button", { name: "login" }).click();

    await page.getByRole("button", { name: "new blog post" }).click();

    await page.getByRole("textbox", { name: "title" }).fill("Test Blog Post");
    await page.getByRole("textbox", { name: "author" }).fill("John Doe");
    await page
      .getByRole("textbox", { name: "url" })
      .fill("https://example.com");

    await page.getByRole("button", { name: "save" }).click();

    await page.waitForTimeout(3500);

    await expect(page.getByText("John Doe: Test Blog Post")).toBeVisible();
  });
});
