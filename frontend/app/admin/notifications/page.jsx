"use client";
import { useEffect, useState } from "react";
import styles from "./notifications.module.css";
import { format } from "date-fns";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function Notifications() {
    const [appointments, setAppointments] = useState([]);
    const [loadings, setLoadings] = useState(true);
    const [error, setError] = useState(null);
    const { user,loading } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (loading) return;
        if (!user || user.role !== "admin") {
            alert("You are not an admin. Redirecting...");
            setTimeout(() => {
                router.replace("/");
            }, 1000);
        }
    }, [user,loading, router]);

    useEffect(() => {
        fetchPendingAppointments();
        const interval = setInterval(fetchPendingAppointments, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchPendingAppointments = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/appointments/pending`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setAppointments(data.data);
                setError(null);
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setError('Failed to fetch appointments');
        } finally {
            setLoadings(false);
        }
    };

    const handleDecision = async (id, status) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/appointments/${id}/status`, {
                method: "PATCH",
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status })
            });

            const data = await response.json();
            if (response.ok) {
                setAppointments(appointments.filter(app => app.id !== id));
                setError(null);
                toast.success(`Appointment ${status === "confirmed" ? "confirmed" : "rejected"} successfully!`);
            } else {
                toast.error(data.message || 'Failed to update appointment status');
                setError(data.message || 'Failed to update appointment status');
            }
        } catch (error) {
            toast.error('Failed to update appointment status');
            console.error('Error updating appointment:', error);
            setError('Failed to update appointment status');
        }
    };

    if (loadings) {
        return (<div className={styles.loaderContainer}>
                    <div className={styles.loader}></div>
                </div>);
    }

    return (
        <div className={styles.container}>
            <Toaster position="top-right" reverseOrder={false} />
            <h1 className={styles.title}>Pending Appointments</h1>
            {error && <div className={styles.error}>{error}</div>}
            {appointments.length === 0 ? (
                <p className={styles.noAppointments}>No pending appointments</p>
            ) : (
                <div className={styles.appointmentsList}>
                    {appointments.map(app => (
                        <div key={app.id} className={styles.appointmentCard}>
                            <div className={styles.appointmentInfo}>
                                <h3>Patient: {app.patient_name}</h3>
                                <p>Doctor: {app.doctor_name}</p>
                                <p>Date: {format(new Date(app.appointment_date), 'MMMM d, yyyy')}</p>
                                <p>Time: {app.slot_time}</p>
                                <p>Type: {app.appointment_type}</p>
                                {app.problem_description && (
                                    <p>Problem: {app.problem_description}</p>
                                )}
                            </div>
                            <div className={styles.actions}>
                                <button 
                                    className={`${styles.button} ${styles.approve}`}
                                    onClick={() => handleDecision(app.id, "confirmed")}
                                >
                                    Confirm
                                </button>
                                <button 
                                    className={`${styles.button} ${styles.reject}`}
                                    onClick={() => handleDecision(app.id, "rejected")}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
