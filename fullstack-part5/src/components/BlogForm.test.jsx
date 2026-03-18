import { render, screen } from "@testing-library/react";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

test("<BlogForm /> updates parent state and calls onSubmit", async () => {
  const createBlogPost = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlogPost={createBlogPost} />);

  const titleInput = screen.getByPlaceholderText("title");
  const authorInput = screen.getByPlaceholderText("author");
  const urlInput = screen.getByPlaceholderText("url");
  const createButton = screen.getByText("save");

  await user.type(titleInput, "Blog Post New");
  await user.type(authorInput, "admin");
  await user.type(urlInput, "http://example.com");

  await user.click(createButton);

  expect(createBlogPost).toHaveBeenCalledTimes(1);
  expect(createBlogPost).toHaveBeenCalledWith({
    title: "Blog Post New",
    author: "admin",
    url: "http://example.com",
    likes: 0, // default from your component state
  });
});
