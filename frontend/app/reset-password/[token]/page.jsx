"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";  
import styles from "./reset-password.module.css";
import { useRouter } from "next/navigation"; 

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();  
  const router = useRouter(); 

  useEffect(() => {
    if (!token) {
      setMessage("Invalid or missing reset token.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password reset successful. You can now log in.");
        setTimeout(() => {
          router.push("/login"); 
        }, 2000); 
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Reset Password Error:", error);
      setMessage("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Reset Password</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputContainer}>
          <input
            type={showPassword ? "text" : "password"} 
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className={styles.input}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)} 
            className={styles.toggleButton}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`${styles.button} ${loading ? styles.buttonDisabled : ""}`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}

export default ResetPassword;
