"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import styles from './booking.module.css';
import { useAuth } from '@/app/context/AuthContext';
import { toast, Toaster } from "react-hot-toast";

const BookingPageContent = () => {
    const router = useRouter();
    const { user, isLoggedIn } = useAuth();
    const searchParams = useSearchParams();
    const [doctorDetails, setDoctorDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [problemDescription, setProblemDescription] = useState('');
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            alert('Please login to book an appointment');
            router.push('/login');
            return;
        }
    }, [isLoggedIn, router]);

    const bookingData = {
        doctorId: searchParams.get('doctorId'),
        slotId: searchParams.get('slotId'),
        appointmentDate: searchParams.get('appointmentDate'),
        appointmentType: searchParams.get('appointmentType'),
        selectedTime: searchParams.get('selectedTime')
    };

    useEffect(() => {
        console.log("Updated doctorDetails:", doctorDetails);
    }, [doctorDetails]);

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                console.log('Fetching doctor details for ID:', bookingData.doctorId); 
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctors/${bookingData.doctorId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Received doctor data:', data); 
                
                if (data.success && data.data) {
                    setDoctorDetails(data.data);
                } else {
                    console.error('No doctor data in response:', data);
                }
            } catch (error) {
                console.error('Error fetching doctor details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (bookingData.doctorId) {
            fetchDoctorDetails();
        } else {
            console.error('No doctorId provided in URL params');
            setLoading(false);
        }
    }, [bookingData.doctorId]);

    const handleBookAppointment = async () => {
        if (isBooking) return;
        setIsBooking(true);
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    doctor_id: bookingData.doctorId,
                    slot_id: bookingData.slotId,
                    appointment_date: bookingData.appointmentDate,
                    appointment_type: bookingData.appointmentType,
                    problem_description: problemDescription
                })
            });
    
            const data = await response.json();
    
            if (response.ok && data.success) {
                // toast.success('Appointment booked successfully!');
                router.push(`/appointments/?message=success`);
            } else {
                if (data.message.includes("duplicate key value violates unique constraint")) {
                    toast.error("This time slot is already booked. Please select another slot.");
                    setTimeout(() => {
                        router.back(); 
                    }, 2000); 
                } else {
                    toast.error(data.message || "Failed to book appointment.");
                }
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
            console.error('Error booking appointment:', error);
        } finally {
            setIsBooking(false);
        }
    };    

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Confirm Appointment</h1>
            <Toaster position="top-right" reverseOrder={false} />
            
            {doctorDetails ? (
                <div className={styles.card}>
                    <div className={styles.doctorInfo}>
                        {doctorDetails.profile_image && (
                            <div className={styles.imageWrapper}>
                                <Image 
                                    src={doctorDetails.profile_image}
                                    alt={doctorDetails.name}
                                    fill
                                    className={styles.doctorImage}
                                />
                            </div>
                        )}
                        <div className={styles.doctorDetails}>
                            <h2 className={styles.doctorName}>{doctorDetails.name}</h2>
                            <p className={styles.specialty}>{doctorDetails.specialty}</p>
                            <p className={styles.experience}>{doctorDetails.experience} years of experience</p>
                            <div className={styles.rating}>
                                <span className={styles.star}>★</span>
                                <span>{doctorDetails.rating}</span>
                            </div>
                            <p className={styles.gender}>{doctorDetails.gender}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.errorCard}>
                    <p>Could not load doctor details</p>
                </div>
            )}

            <div className={styles.card}>
                <h3 className={styles.cardTitle}>Appointment Details</h3>
                <p className={styles.detail}>Date: {bookingData.appointmentDate}</p>
                <p className={styles.detail}>Time: {bookingData.selectedTime}</p>
                <p className={styles.detail}>
                    Type: {bookingData.appointmentType === 'online' 
                        ? 'Video Consultation' 
                        : 'Hospital Visit'}
                </p>
            </div>

            <div className={styles.card}>
                <h3 className={styles.cardTitle}>Describe Your Problem</h3>
                <textarea
                    className={styles.textarea}
                    rows="4"
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="Please describe your medical concern..."
                />
            </div>

            <button
                className={`${styles.button} ${isBooking ? styles.buttonDisabled : ''}`}
                onClick={handleBookAppointment}
                disabled={isBooking || !problemDescription.trim()}
            >
                {isBooking ? 'Booking...' : 'Confirm Booking'}
            </button>
        </div>
    );
};

export default function BookingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BookingPageContent />
        </Suspense>
    );
}
