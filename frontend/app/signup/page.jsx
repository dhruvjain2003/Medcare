"use client";
import React, { useState } from "react";
import Link from "next/link";
import { User, AtSign, Lock, Eye, EyeOff } from "lucide-react";
import styles from "./signup.module.css";
import { useRouter } from "next/navigation";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    let errors = {};
  
    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    } else if (formData.name.length < 3) {
      errors.name = "Name must be at least 3 characters long";
    }
  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailPattern.test(formData.email)) {
      errors.email = "Enter a valid email address";
    }
  
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (!passwordPattern.test(formData.password)) {
      errors.password =
        "Password must be at least 6 characters and contain at least one uppercase and one lowercase letter";
    }
  
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Successfully signed up! Now login.");
        router.push("/login");
      } else {
        const error = await response.json();
        alert(error.message || "Signup failed");
      }
    } catch (err) {
      console.error("An error occurred:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authBox}>
        <h2 className={styles.heading}>Sign Up</h2>
        <p className={styles.text}>
          Already have an account?{" "}
          <Link href="/login" className={styles.authLink}>Login.</Link>
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Full Name</label>
            <div className={styles.inputWrapper}>
              <User className={styles.inputIcon} size={20} color="#555" />
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className={styles.inputField}
                required
              />
            </div>
            {errors.name && <p className={styles.errorText}>{errors.name}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Email</label>
            <div className={styles.inputWrapper}>
              <AtSign className={styles.inputIcon} size={20} color="#555" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={styles.inputField}
                required
              />
            </div>
            {errors.email && <p className={styles.errorText}>{errors.email}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={20} color="#555" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={styles.inputField}
                required
              />
              {showPassword ? (
                <EyeOff className={styles.eyeIcon} size={20} color="#555" onClick={() => setShowPassword(false)} />
              ) : (
                <Eye className={styles.eyeIcon} size={20} color="#555" onClick={() => setShowPassword(true)} />
              )}
            </div>
            {errors.password && <p className={styles.errorText}>{errors.password}</p>}
          </div>

          <button type="submit" className={styles.authBtn}>Sign Up</button>
          <button
            type="reset"
            className={styles.resetBtn}
            onClick={() => {
              setFormData({ name: "", email: "", password: "" });
              setErrors({});
            }}
          >
            Reset
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
