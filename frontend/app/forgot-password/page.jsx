"use client";

import React, { useState } from "react";
import styles from "./forgot-password.module.css"; 

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password reset email sent. Check your inbox.");
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      setMessage("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Forgot Password</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <button
          type="submit"
          disabled={loading}
          className={`${styles.button} ${loading ? styles.buttonDisabled : ""}`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}

export default ForgotPassword;
