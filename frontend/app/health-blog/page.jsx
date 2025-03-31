import styles from "./healthBlog.module.css";

async function fetchBlogs() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs`, {
    cache: "force-cache", 
  });
  return response.json();
}

export default async function HealthBlog() {
  const blogs = await fetchBlogs(); 

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Health Blogs</h1>
      <div className={styles.blogList}>
        {blogs.map((blog) => (
          <div key={blog.id} className={styles.blogCard}>
            {blog.image && (
              <div className={styles.imageContainer}>
                <img src={blog.image} alt={blog.title} className={styles.blogImage} />
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
}
