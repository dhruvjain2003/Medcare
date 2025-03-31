"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./delete-doctor.module.css";
import { Search, Trash2 } from "lucide-react";

export default function DeleteDoctor() {
    const { user,loading } = useAuth();
    const router = useRouter();
    const [doctors, setDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [loadings, setLoadings] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (loading) return;
    
        if (!user || user.role !== "admin") {
            alert("You are not an admin. Redirecting...");
            router.replace("/");
            return;
        }

        fetchDoctors();
    }, [user,loading, router]);

    const fetchDoctors = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctors`);
            if (!response.ok) throw new Error("Failed to fetch doctors");
            const data = await response.json();
            setDoctors(data);
            setFilteredDoctors(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadings(false);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (!query.trim()) {
            setFilteredDoctors(doctors);
            return;
        }
        const filtered = doctors.filter(doctor => 
            doctor.name.toLowerCase().includes(query.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredDoctors(filtered);
    };

    const handleDelete = async (doctorId) => {
        if (!confirm("Are you sure you want to delete this doctor?")) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctors/${doctorId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete doctor");

            setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
            setFilteredDoctors(filteredDoctors.filter(doctor => doctor.id !== doctorId));
            alert("Doctor deleted successfully!");
        } catch (err) {
            alert("Failed to delete doctor: " + err.message);
        }
    };

    if (loadings) return (<div className={styles.loaderContainer}>
            <div className={styles.loader}></div>
        </div>);
    if (error) return <div className={styles.container}>Error: {error}</div>;

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Delete Doctor</h2>
            
            <div className={styles.searchContainer}>
                <Search className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Search doctors by name or specialty..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.doctorsGrid}>
                {filteredDoctors.map((doctor) => (
                    <div key={doctor.id} className={styles.doctorCard}>
                        <div className={styles.doctorInfo}>
                            <h3>{doctor.name}</h3>
                            <p>{doctor.specialty}</p>
                            <p>Experience: {doctor.experience} years</p>
                            <p>Rating: {doctor.rating}/5</p>
                        </div>
                        <button
                            onClick={() => handleDelete(doctor.id)}
                            className={styles.deleteButton}
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>

            {filteredDoctors.length === 0 && (
                <p className={styles.noResults}>No doctors found</p>
            )}
        </div>
    );
} 