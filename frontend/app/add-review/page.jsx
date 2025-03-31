"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Toaster, toast } from "react-hot-toast";
import styles from "./add-review.module.css";

const AddReviewContent = () => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, user } = useAuth();

  const appointmentId = searchParams.get("appointmentId");
  const doctorId = searchParams.get("doctorId");
  const doctorName = searchParams.get("doctorName");

  useEffect(() => {
    if (user === null) return;
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointment_id: appointmentId,
          doctor_id: doctorId,
          rating,
          comment,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Review submitted successfully!");
        setTimeout(() => {
          router.push("/reviews");
        }, 2000);
      } else {
        setError(data.message || "Failed to submit review");
      }
    } catch (err) {
      setError("An error occurred while submitting the review");
    } finally {
      setLoading(false);
    }
  };

  if (!appointmentId || !doctorId || !doctorName) {
    return <div className={styles.error}>Invalid review request</div>;
  }

  return (
    <div className={styles.container}>
      <Toaster position="top-right" autoClose={3000} />
      <h1>Add Review</h1>
      <div className={styles.reviewForm}>
        <div className={styles.doctorInfo}>
          <h2>Review for {decodeURIComponent(doctorName)}</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.ratingSection}>
            <label>Rating:</label>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`${styles.star} ${star <= rating ? styles.active : ""}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className={styles.commentSection}>
            <label htmlFor="comment">Your Review:</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with the doctor..."
              required
              rows="5"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => router.back()}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddReview = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddReviewContent />
    </Suspense>
  );
};

export default AddReview;
