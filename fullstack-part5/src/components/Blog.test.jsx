import { render, screen, fireEvent } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

test("renders content", () => {
  const post = {
    title: "Blog Post New",
    author: "admin",
    url: "http://example.com",
    likes: 0,
  };

  const user = {
    name: "admin",
    username: "Admin",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluMiIsImlkIjoiNjgyNGRlNzRlYzNkZTNjNzA0ZmQ5MTZhIiwiaWF0IjoxNzQ3MjQ2ODAzfQ.g6d2AnJQDmegJq-4bPozCezlS2FC3COtKhKkSq7t3Mk",
  };

  render(<Blog blog={post} user={user} />);

  // Title and author are visible
  const element1 = screen.getByText("Blog Post New");
  const element2 = screen.getByText("admin");
  expect(element1).toBeDefined();
  expect(element2).toBeDefined();

  // URL and likes should not be in the document
  const url = screen.queryByText("http://example.com");
  expect(url).toBeNull();

  const likes = screen.queryByText(/likes/i);
  expect(likes).toBeNull();
});

test("shows URL and likes when view button is clicked", async () => {
  const post = {
    title: "Blog Post New",
    author: "admin",
    url: "http://example.com",
    likes: 0,
    user: [
      {
        name: "admin",
        username: "Admin",
        id: "1234",
      },
    ],
  };

  const user = {
    name: "admin",
    username: "Admin",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluMiIsImlkIjoiNjgyNGRlNzRlYzNkZTNjNzA0ZmQ5MTZhIiwiaWF0IjoxNzQ3MjQ2ODAzfQ.g6d2AnJQDmegJq-4bPozCezlS2FC3COtKhKkSq7t3Mk",
  };

  render(<Blog blog={post} user={user} />);

  const simulateUser = userEvent.setup();
  const viewButton = screen.getByText("view");
  await simulateUser.click(viewButton);

  expect(screen.getByText("http://example.com")).toBeDefined();
  expect(screen.getByText("likes 0")).toBeInTheDocument();
});

test("calls like handler twice when like button is clicked twice", async () => {
  const post = {
    title: "Blog Post New",
    author: "admin",
    url: "http://example.com",
    likes: 0,
    user: [
      {
        name: "admin",
        username: "Admin",
        id: "1234",
      },
    ],
  };

  const user = {
    name: "admin",
    username: "Admin",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluMiIsImlkIjoiNjgyNGRlNzRlYzNkZTNjNzA0ZmQ5MTZhIiwiaWF0IjoxNzQ3MjQ2ODAzfQ.g6d2AnJQDmegJq-4bPozCezlS2FC3COtKhKkSq7t3Mk",
  };

  const mockHandler = vi.fn();

  render(<Blog blog={post} user={user} updateLike={mockHandler} />);

  const simulateUser = userEvent.setup();

  // open the hidden element
  const viewButton = screen.getByText("view");
  await simulateUser.click(viewButton);

  // click the like button twice
  const likeButton = screen.getByText("like");
  await simulateUser.click(likeButton);
  await simulateUser.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
