"use client";
import { useState, useEffect } from "react";
import styles from "./my-appointments.module.css";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token === null) return; 
  
    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }
  
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/appointments/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setAppointments(data.data);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAppointments();
  }, [token, isLoggedIn]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return { color: "#FFA500", background: "#FFF3E0" };
      case "confirmed":
        return { color: "#4CAF50", background: "#E8F5E9" };
      case "rejected":
        return { color: "#FF0000", background: "#FFEBEE" };
      case "completed":
        return { color: "#2196F3", background: "#E3F2FD" };
      default:
        return { color: "#000000", background: "#F5F5F5" };
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (<div className={styles.loaderContainer}>
                <div className={styles.loader}></div>
            </div>);
  }

  return (
    <div className={styles.container}>
      <h1>My Appointments</h1>
      <div className={styles.appointmentsGrid}>
        {appointments.length === 0 ? (
          <div className={styles.noAppointments}>
            <p>You have no appointments scheduled.</p>
          </div>
        ) : (
          appointments.map((appointment) => {
            const statusStyle = getStatusColor(appointment.status);
            return (
              <div key={appointment.id} className={styles.appointmentCard}>
                <div className={styles.doctorInfo}>
                  <h3>{appointment.doctor_name}</h3>
                  <span
                    className={styles.status}
                    style={{
                      color: statusStyle.color,
                      backgroundColor: statusStyle.background
                    }}
                  >
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
                <div className={styles.appointmentDetails}>
                  <p>
                    <strong>Date:</strong>{" "}
                    {formatDate(appointment.appointment_date)}
                  </p>
                  <p>
                    <strong>Time:</strong> {appointment.slot_time}
                  </p>
                  <p>
                    <strong>Type:</strong> {appointment.slot_type}
                  </p>
                  {appointment.problem_description && (
                    <p>
                      <strong>Problem:</strong> {appointment.problem_description}
                    </p>
                  )}
                  {appointment.status.toLowerCase() === "completed" && (
                    <Link 
                      href={`/add-review?appointmentId=${appointment.id}&doctorId=${appointment.doctor_id}&doctorName=${encodeURIComponent(appointment.doctor_name)}`}
                      className={styles.reviewButton}
                    >
                      Add Review
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
