import { useState } from "react";

const BlogForm = ({ createBlogPost }) => {
  const [blogPost, setBlogPost] = useState({
    title: "",
    author: "",
    url: "",
    likes: 0,
  });

  const addBlogPost = (event) => {
    event.preventDefault();

    createBlogPost(blogPost);

    setBlogPost({
      title: "",
      author: "",
      url: "",
      likes: 0,
    });
  };

  return (
    <div>
      <h2>Create a new blog post</h2>
      <form onSubmit={addBlogPost}>
        <div>
          title:
          <input
            type="text"
            value={blogPost.title}
            name="title"
            placeholder="title"
            onChange={({ target }) =>
              setBlogPost((prevState) => ({
                ...prevState,
                title: target.value,
              }))
            }
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={blogPost.author}
            name="author"
            placeholder="author"
            onChange={({ target }) =>
              setBlogPost((prevState) => ({
                ...prevState,
                author: target.value,
              }))
            }
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={blogPost.url}
            name="url"
            placeholder="url"
            onChange={({ target }) =>
              setBlogPost((prevState) => ({
                ...prevState,
                url: target.value,
              }))
            }
          />
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default BlogForm;
