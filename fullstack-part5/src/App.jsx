import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const getBlogs = async () => {
      const blogsArray = await blogService.getAll();
      const sortedBlogs = [...blogsArray].sort((a, b) => b.likes - a.likes);
      setBlogs(sortedBlogs);
    };
    getBlogs();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);
      setUsername("");
      setPassword("");
      console.log(user);
    } catch (error) {
      console.log(error);
      // update error message
      setNotification({
        message: `${error.response.data.error}`,
        code: "error",
      });
      setTimeout(() => {
        setNotification(null);
      }, 4000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    window.location.reload();
  };

  const addBlogPost = async (blogObject) => {
    try {
      blogService.setToken(user.token);
      await blogService.create(blogObject);

      // update success message
      setNotification({
        message: `a new blog ${blogObject.title} by ${blogObject.author} added`,
        code: "success",
      });
      setTimeout(() => {
        setNotification(null);
      }, 2000);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      // update error message
      setNotification({
        message: `Cannot be created`,
        code: "error",
      });
      setTimeout(() => {
        setNotification(null);
      }, 4000);
    }
  };

  const updateLike = async (blog) => {
    try {
      blogService.setToken(user.token);
      await blogService.update(blog.id, {
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url,
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  if (user === null) {
    return (
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleLogin={handleLogin}
        notification={notification}
      />
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification
        message={notification?.message}
        className={notification?.code}
      />
      <div>
        {user.username} logged in <button onClick={handleLogout}>logout</button>
      </div>
      <br />

      <Togglable buttonLabel="new blog post">
        <BlogForm createBlogPost={addBlogPost} />
      </Togglable>

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} user={user} updateLike={updateLike} />
      ))}
    </div>
  );
};

export default App;
