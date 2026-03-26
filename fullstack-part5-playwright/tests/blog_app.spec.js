const { test, describe, expect, beforeEach } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

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
      await loginWith(page, "mluukkai", "salainen");

      await expect(page.getByText("mluukkai logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "mluukkai", "wrong");

      await expect(
        page.getByText("invalid username or password"),
      ).toBeVisible();
    });
  });

  test("a new blog can be created", async ({ page }) => {
    await loginWith(page, "mluukkai", "salainen");
    await createBlog(page, "Test Blog Post", "John Doe", "https://example.com");

    await page.waitForTimeout(3500);

    await expect(page.getByText("John Doe: Test Blog Post")).toBeVisible();
  });

  test("a new blog can be liked", async ({ page }) => {
    await loginWith(page, "mluukkai", "salainen");
    await createBlog(page, "Test Blog Post", "John Doe", "https://example.com");

    await page.waitForTimeout(3500);

    await expect(page.getByText("John Doe: Test Blog Post")).toBeVisible();

    await page.getByRole("button", { name: "view" }).click();

    await page.getByRole("button", { name: "like" }).click();

    await page.getByRole("button", { name: "view" }).click();

    await expect(page.getByText("likes 1like")).toBeVisible();
  });

  test.only("a new blog can be deleted", async ({ page }) => {
    await loginWith(page, "mluukkai", "salainen");
    await createBlog(page, "Test Blog Post", "John Doe", "https://example.com");

    await page.waitForTimeout(3500);

    await expect(page.getByText("John Doe: Test Blog Post")).toBeVisible();

    await page.getByRole("button", { name: "view" }).click();

    page.on("dialog", async (dialog) => {
      expect(dialog.type()).toBe("confirm");
      await dialog.accept();
    });

    await page.getByRole("button", { name: "remove" }).click();

    await expect(page.getByText("John Doe: Test Blog Post")).not.toBeVisible();
  });
});
