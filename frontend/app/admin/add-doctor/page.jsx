"use client";
import styles from "./add-doctor.module.css";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

function AddDoctor() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "admin") {
      alert("You are not an admin. Redirecting...");
      setTimeout(() => {
        router.replace("/");
      }, 1000);
    }
  }, [user, loading, router]);

  const [doctorData, setDoctorData] = useState({
    name: "",
    specialty: "",
    experience: "",
    rating: "",
    gender: "",
    profile_image: null,
    degree: "",
    consultation_fee: "",
    contact_number: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    let newErrors = {};

    if (!doctorData.name.trim() || doctorData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }
    if (!doctorData.specialty.trim() || doctorData.specialty.length < 3) {
      newErrors.specialty = "Specialty must be at least 3 characters";
    }
    if (
      !doctorData.experience ||
      isNaN(doctorData.experience) ||
      doctorData.experience < 0
    ) {
      newErrors.experience = "Experience must be a valid number (≥ 0)";
    }
    if (
      !doctorData.rating ||
      isNaN(doctorData.rating) ||
      doctorData.rating < 1 ||
      doctorData.rating > 5
    ) {
      newErrors.rating = "Rating must be between 1 and 5";
    }
    if (!doctorData.gender) {
      newErrors.gender = "Please select a gender";
    }
    if (!doctorData.profile_image) {
      newErrors.profile_image = "Please upload an image";
    } else {
      const validFormats = ["image/jpeg", "image/png", "image/jpg"];
      if (!validFormats.includes(doctorData.profile_image.type)) {
        newErrors.profile_image = "Invalid file format. Use JPEG, PNG, or JPG";
      }
      if (doctorData.profile_image.size > 2 * 1024 * 1024) {
        newErrors.profile_image = "File size must be ≤ 2MB";
      }
    }
    if (!doctorData.degree.trim()) {
      newErrors.degree = "Degree is required";
    }
    if (
      !doctorData.consultation_fee ||
      isNaN(doctorData.consultation_fee) ||
      doctorData.consultation_fee < 0
    ) {
      newErrors.consultation_fee =
        "Consultation fee must be a valid number (≥ 0)";
    }
    if (
      doctorData.contact_number &&
      !/^\d{10}$/.test(doctorData.contact_number)
    ) {
      newErrors.contact_number = "Contact number must be 10 digits (optional)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorData({ ...doctorData, [name]: value });
  };

  const handleFileChange = (e) => {
    setDoctorData({ ...doctorData, profile_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("name", doctorData.name);
    formData.append("specialty", doctorData.specialty);
    formData.append("experience", doctorData.experience);
    formData.append("rating", doctorData.rating);
    formData.append("gender", doctorData.gender);
    formData.append("profile_image", doctorData.profile_image);
    formData.append("degree", doctorData.degree);
    formData.append("consultation_fee", doctorData.consultation_fee);
    if (doctorData.contact_number)
      formData.append("contact_number", doctorData.contact_number);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/add-doctor`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        setSuccessMessage("Doctor added successfully!");
        setDoctorData({
          name: "",
          specialty: "",
          experience: "",
          rating: "",
          gender: "",
          profile_image: null,
          degree: "",
          consultation_fee: "",
          contact_number: "",
        });
        setErrors({});
      } else {
        setSuccessMessage("Error adding doctor. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setSuccessMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {successMessage && <div className={styles.alert}>{successMessage}</div>}
      <form
        onSubmit={handleSubmit}
        className={styles.form}
        encType="multipart/form-data"
      >
        <div className={styles.formContainer}>
          <input
            type="text"
            name="name"
            placeholder="Doctor's Name"
            value={doctorData.name}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <input
            type="text"
            name="specialty"
            placeholder="Specialty"
            value={doctorData.specialty}
            onChange={handleChange}
            required
            className={styles.input}
          />

          <input
            type="number"
            name="experience"
            placeholder="Experience (years)"
            value={doctorData.experience}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <input
            type="number"
            name="rating"
            placeholder="Rating (1-5)"
            value={doctorData.rating}
            onChange={handleChange}
            step="0.1"
            min="1"
            max="5"
            required
            className={styles.input}
          />

          <select
            name="gender"
            value={doctorData.gender}
            onChange={handleChange}
            required
            className={`${styles.select} ${styles.fullWidth}`}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input
            type="text"
            name="degree"
            placeholder="Degree (e.g., MBBS, MD)"
            value={doctorData.degree}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <input
            type="number"
            name="consultation_fee"
            placeholder="Consultation Fee (₹)"
            value={doctorData.consultation_fee}
            onChange={handleChange}
            required
            className={styles.input}
          />

          <input
            type="text"
            name="contact_number"
            placeholder="Contact Number (Optional)"
            value={doctorData.contact_number}
            onChange={handleChange}
            className={styles.input}
          />

          <input
            type="file"
            name="profile_image"
            accept="image/*"
            onChange={handleFileChange}
            required
            className={`${styles.file} ${styles.fullWidth}`}
          />
        </div>

        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? (
            <span className={styles.buttonLoader}></span>
          ) : (
            "Add Doctor"
          )}
        </button>
      </form>
    </div>
  );
}

export default AddDoctor;
