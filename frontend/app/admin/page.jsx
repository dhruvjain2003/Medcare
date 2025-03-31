"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, ClipboardCheck, CheckCircle, Trash2, Users, Stethoscope } from "lucide-react"; 
import styles from "./admin.module.css";

export default function AdminDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({ totalDoctors: 0, totalUsers: 0 });

    useEffect(() => {
        if (loading) return;
        if (!user || user.role !== "admin") {
            alert("You are not an admin. Redirecting...");
            router.replace("/");
        }

        const fetchStats = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/stats`);
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, [user, loading, router]);

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Admin Dashboard</h2>
            <div className={styles.dashboard}>
                <div className={styles.grid}>
                    <Link href="/admin/add-doctor" className={styles.card}>
                        <UserPlus size={40} className={styles.icon} />
                        <h3 className={styles.heading2}>Add Doctor</h3>
                        <p className={styles.para}>Manage and add new doctors to the system.</p>
                    </Link>
                    <Link href="/admin/delete-doctor" className={styles.card}>
                        <Trash2 size={40} className={styles.icon} />
                        <h3 className={styles.heading2}>Delete Doctor</h3>
                        <p className={styles.para}>Remove doctors from the system.</p>
                    </Link>
                    <Link href="/admin/notifications" className={styles.card}>
                        <ClipboardCheck size={40} className={styles.icon} />
                        <h3 className={styles.heading2}>Confirm/Reject Appointments</h3>
                        <p className={styles.para}>Approve or decline pending appointments.</p>
                    </Link>
                    <Link href="/admin/approved-appointments" className={styles.card}>
                        <CheckCircle size={40} className={styles.icon} />
                        <h3 className={styles.heading2}>Approved Appointments</h3>
                        <p className={styles.para}>View and manage approved appointments.</p>
                    </Link>
                </div>
                <div className={styles.stats}>
                    <div className={styles.statCard}>
                        <Stethoscope size={40} className={styles.statIcon} />
                        <h3>{stats.totalDoctors}</h3>
                        <p>Total Doctors</p>
                    </div>
                    <div className={styles.statCard}>
                        <Users size={40} className={styles.statIcon} />
                        <h3>{stats.totalUsers}</h3>
                        <p>Total Users</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
