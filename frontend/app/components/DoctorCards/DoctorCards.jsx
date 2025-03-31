"use client"

import { useRouter } from "next/navigation";
import styles from "./DoctorCards.module.css";
import { Stethoscope, Clock,Star as StarFilled, Star as StarEmpty } from "lucide-react";

const DoctorCards = ({ doctor }) => {
    const router = useRouter();
    const fullStars = Math.floor(doctor.rating || 0);
    const emptyStars = 5 - fullStars;
    const handleProfileClick = () => {
        router.push(`/doctor-profile/${doctor.id}`);
    };
    const handleBooking = ()=>{
        router.push(`/appointments/${doctor.id}`);
    }
    return (
        <div className={styles.card}>
            <img src={doctor.profile_image} alt={doctor.name} className={styles.profileImage} onClick={handleProfileClick} />
            <h3 className={styles.name}>{doctor.name}</h3>
            <div className={styles.details}>
                <span className={styles.detail}>
                    <Stethoscope className={styles.icon} /> {doctor.specialty}
                </span>
                <span className={styles.detail}>
                    <Clock className={styles.icon} /> {doctor.experience}
                </span>
            </div>
            <div className={styles.ratings}>
                <span>Ratings: </span>
                {Array.from({ length: fullStars }).map((_, index) => (
                    <StarFilled key={`full-${index}`} className={styles.star} fill="gold" stroke="gold" />
                ))}
                {Array.from({ length: emptyStars }).map((_, index) => (
                    <StarEmpty key={`empty-${index}`} className={styles.star} fill="none" />
                ))}
            </div>
            <button className={styles.bookButton} onClick={handleBooking}>Book Appointment</button>
        </div>
    );
};

export default DoctorCards;
