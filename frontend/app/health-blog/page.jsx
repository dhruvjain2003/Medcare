"use client";

import { useEffect, useState } from "react";
import styles from "./healthBlog.module.css";

const HealthBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs`
        );
        const data = await response.json();
        console.log(data);
        setBlogs(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className={styles.loader}>
        <div className={styles.loaderCircle}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Health Blogs</h1>
      <div className={styles.blogList}>
        {blogs.map((blog) => (
          <div key={blog.id} className={styles.blogCard}>
            {blog.image && (
              <div className={styles.imageContainer}>
                <img
                  src={blog.image}
                  alt={blog.title}
                  className={styles.blogImage}
                />
              </div>
            )}
            <h2 className={styles.title}>{blog.title}</h2>
            <p className={styles.content}>{blog.content}</p>
            <p className={styles.author}>By {blog.author}</p>
            <p className={styles.category}>Category: {blog.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthBlog;
