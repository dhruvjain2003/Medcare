"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";

const Dashboard = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [optionalFields, setOptionalFields] = useState({
    phone: "",
    address: "",
    weight: "",
    height: "",
    bloodGroup: "",
  });

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/user/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("Account deleted successfully.");
        logout();
        router.push("/signup");
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleUpdateFields = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/user/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(optionalFields),
        }
      );

      if (response.ok) {
        alert("Fields updated successfully.");
        setUser((prevUser) => ({
          ...prevUser,
          ...optionalFields, 
        }));
      } else {
        const data = await response.json();
        alert(data.message || "Failed to update fields. Please try again.");
      }
    } catch (error) {
      console.error("Error updating fields:", error);
      alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/user/details`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setOptionalFields({
            phone: data.phone || "",
            address: data.address || "",
            weight: data.weight || "",
            height: data.height || "",
            bloodGroup: data.bloodGroup || "",
          });
        } else {
          console.error("Failed to fetch user details");
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [router]);

  if (loading) {
    return (<div className={styles.loaderContainer}>
              <div className={styles.loader}></div>
          </div>);
  }

  return (
    <div className={styles.dashboard}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Welcome, {user?.name || "User"}!</h1>
          <p>Manage your account details below.</p>
        </header>

        <section className={styles.currentDetails}>
          <h2>Current Information</h2>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <strong>Email:</strong>
              <span>{user?.email}</span>
            </div>
            <div className={styles.detailItem}>
              <strong>Phone:</strong>
              <span>{user?.phone || 'Not set'}</span>
            </div>
            <div className={styles.detailItem}>
              <strong>Address:</strong>
              <span>{user?.address || 'Not set'}</span>
            </div>
            <div className={styles.detailItem}>
              <strong>Weight:</strong>
              <span>{user?.weight ? `${user.weight} kg` : 'Not set'}</span>
            </div>
            <div className={styles.detailItem}>
              <strong>Height:</strong>
              <span>{user?.height ? `${user.height} cm` : 'Not set'}</span>
            </div>
            <div className={styles.detailItem}>
              <strong>Blood Group:</strong>
              <span>{user?.bloodGroup || 'Not set'}</span>
            </div>
          </div>
        </section>

        <section className={styles.formSection}>
          <h2>Update Information</h2>
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone:</label>
            <input
              type="text"
              id="phone"
              value={optionalFields.phone}
              onChange={(e) =>
                setOptionalFields({ ...optionalFields, phone: e.target.value })
              }
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              value={optionalFields.address}
              onChange={(e) =>
                setOptionalFields({
                  ...optionalFields,
                  address: e.target.value,
                })
              }
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="weight">Weight (kg):</label>
            <input
              type="number"
              id="weight"
              value={optionalFields.weight}
              onChange={(e) =>
                setOptionalFields({ ...optionalFields, weight: e.target.value })
              }
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="height">Height (cm):</label>
            <input
              type="number"
              id="height"
              value={optionalFields.height}
              onChange={(e) =>
                setOptionalFields({ ...optionalFields, height: e.target.value })
              }
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="bloodGroup">Blood Group:</label>
            <input
              type="text"
              id="bloodGroup"
              value={optionalFields.bloodGroup}
              onChange={(e) =>
                setOptionalFields({
                  ...optionalFields,
                  bloodGroup: e.target.value,
                })
              }
            />
          </div>
          <div className={styles.buttonContainer}>
            <button
              className={styles.updateButton}
              onClick={handleUpdateFields}
              aria-label="Update Details"
            >
              Update Details
            </button>
            <button
              className={styles.deleteButton}
              onClick={handleDeleteAccount}
              aria-label="Delete Account"
            >
              Delete Account
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;