const loginWith = async (page, username, password) => {
  await page.getByRole("textbox").first().fill(username);
  await page.getByRole("textbox").last().fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole("button", { name: "new blog post" }).click();

  await page.getByRole("textbox", { name: "title" }).fill(title);
  await page.getByRole("textbox", { name: "author" }).fill(author);
  await page.getByRole("textbox", { name: "url" }).fill(url);

  await page.getByRole("button", { name: "save" }).click();
};

export { loginWith, createBlog };
