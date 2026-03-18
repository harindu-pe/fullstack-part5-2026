import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, user, updateLike }) => {
  const [visible, setVisible] = useState(false);
  console.log(blog);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLike = async () => {
    updateLike(blog);
  };

  const handleRemove = async () => {
    if (window.confirm("Are you sure?") == true) {
      try {
        blogService.setToken(user.token);
        await blogService.remove(blog.id);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="blogPost" style={blogStyle}>
      <div>
        <span>{blog.author}</span>: <span>{blog.title}</span>
        <button onClick={() => setVisible(!visible)}>
          {visible ? "hide" : "view"}
        </button>
      </div>

      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            {blog.user[0].username === user.username && (
              <button onClick={handleLike}>like</button>
            )}
          </div>
          <button onClick={handleRemove}>remove</button>
        </div>
      )}
    </div>
  );
};

export default Blog;
