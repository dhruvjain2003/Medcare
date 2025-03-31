"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import styles from "./AppointmentScheduler.module.css";
import { ChevronDown, CircleChevronLeft, CircleChevronRight, Sun, Sunset } from "lucide-react";
import DatesToSelect from "../DatesToSelect/DatesToSelect";
import { useRouter } from "next/navigation";

const AppointmentScheduler = ({doctorId}) => {
    const router = useRouter();
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedOption, setSelectedOption] = useState("MedicareHeart Institute, Okhla Road");
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [slots, setSlots] = useState({ morning: [], evening: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [appointmentType, setAppointmentType] = useState('online');
    const [selectedTime, setSelectedTime] = useState(null);

    useEffect(() => {
        const fetchSlots = async () => {
            if (!doctorId) return;
            setIsLoading(true);
            try {
                console.log('Selected Date:', selectedDate); 
                const dateToFormat = new Date(selectedDate);
                console.log('Date to format:', dateToFormat); 
                
                try {
                    const formattedDate = format(dateToFormat, 'yyyy-MM-dd');
                    console.log('Formatted date:', formattedDate);
                } catch (formatError) {
                    console.error('Error formatting date:', formatError);
                    console.log('Date value causing error:', dateToFormat);
                    return;
                }
    
                const formattedDate = format(dateToFormat, 'yyyy-MM-dd');
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/slots/${doctorId}?date=${formattedDate}`);
                const { data } = await response.json();
                console.log('Received data from API:', data); 
    
                const formatTimeToAMPM = (timeStr) => {
                    console.log('Formatting time:', timeStr); 
                    const [hours, minutes] = timeStr.split(':');
                    const hour = parseInt(hours);
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    const hour12 = hour % 12 || 12;
                    return `${hour12}:${minutes} ${ampm}`;
                };
    
                const morningSlots = data
                    .filter(slot => {
                        console.log('Filtering slot:', slot); 
                        return slot.slot_type === 'morning';
                    })
                    .map(slot => {
                        console.log('Processing morning slot:', slot); 
                        return {
                            time: formatTimeToAMPM(slot.slot_time),
                            available: slot.available,
                            id: slot.id
                        };
                    });
                
                const eveningSlots = data
                    .filter(slot => slot.slot_type === 'evening')
                    .map(slot => {
                        console.log('Processing evening slot:', slot); 
                        return {
                            time: formatTimeToAMPM(slot.slot_time),
                            available: slot.available,
                            id: slot.id
                        };
                    });
    
                console.log('Processed slots:', { morning: morningSlots, evening: eveningSlots }); 
    
                setSlots({
                    morning: morningSlots,
                    evening: eveningSlots
                });
            } catch (error) {
                console.error('Error in fetchSlots:', error);
                console.error('Error stack:', error.stack);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchSlots();
    }, [doctorId, selectedDate]);
    

    console.log('Current date state:', date);
    console.log('Current selectedDate state:', selectedDate);
    
    const generateDatesForMonth = (currentDate) => {
        console.log('Generating dates for:', currentDate);
        try {
            
            const dateObj = new Date(currentDate);
            
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth();
            console.log('Year and Month:', { year, month });
    
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const today = new Date();
            const startDay = today.getMonth() === month && today.getFullYear() === year 
                ? today.getDate() 
                : 1;
    
            const dates = [];
            for (let day = startDay; day <= daysInMonth; day++) {
                const dateObj = new Date(year, month, day);
                dates.push({
                    day: format(dateObj, "EEE"),
                    date: format(dateObj, "MMM dd"),
                });
            }
            console.log('Generated dates:', dates);
            return dates;
        } catch (error) {
            console.error('Error in generateDatesForMonth:', error);
            console.error('Input currentDate:', currentDate);
            return [];
        }
    };
    

    const changeMonth = (offset) => {
        setDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setMonth(prevDate.getMonth() + offset);
            return newDate;
        });
    };

    const handleProceedToBooking = () => {
        if (!selectedSlot || !selectedDate) return;
        
        const currentSlot = slots.morning.find(s => s.id === selectedSlot) || 
                           slots.evening.find(s => s.id === selectedSlot);
        
        const bookingData = {
            doctorId,
            slotId: selectedSlot,
            appointmentDate: format(new Date(selectedDate), 'yyyy-MM-dd'), 
            appointmentType,
            selectedTime: currentSlot?.time
        };
    
        const queryString = new URLSearchParams({
            doctorId: bookingData.doctorId,
            slotId: bookingData.slotId.toString(),
            appointmentDate: bookingData.appointmentDate,
            appointmentType: bookingData.appointmentType,
            selectedTime: bookingData.selectedTime || ''
        }).toString();
    
        router.push(`/booking?${queryString}`);
    };


    const isCurrentMonth = date.getFullYear() === new Date().getFullYear() && date.getMonth() === new Date().getMonth();
    const dates = generateDatesForMonth(date);

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <h2 className={styles.title}>Schedule Appointment</h2>
                <button 
                    className={styles.bookButton}
                    onClick={handleProceedToBooking}
                    disabled={!selectedSlot}
                >
                    Proceed to Booking
                </button>
            </div>

            <div className={styles.tabContainer}>
                <button 
                    className={`${styles.tab} ${appointmentType === 'online' ? styles.activeTab : ''}`}
                    onClick={() => setAppointmentType('online')}
                >
                    Book Video Consult
                </button>
                <button 
                    className={`${styles.tab} ${appointmentType === 'offline' ? styles.activeTab : ''}`}
                    onClick={() => setAppointmentType('offline')}
                >
                    Book Hospital Visit
                </button>
            </div>

            <div className={styles.dropdownWrapper}>
                <select
                    className={styles.dropdown}
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                >
                    <option value="MedicareHeart Institute, Okhla Road">MedicareHeart Institute, Okhla Road</option>
                    <option value="Apollo Hospital, Delhi">Apollo Hospital, Delhi</option>
                    <option value="Max Healthcare, Gurgaon">Max Healthcare, Gurgaon</option>
                </select>
                <ChevronDown className={styles.icon} size={28} />
            </div>

            <div className={styles.dateHeader}>
                <button
                    className={styles.dateButton}
                    onClick={() => !isCurrentMonth && changeMonth(-1)}
                    disabled={isCurrentMonth}
                    style={{ opacity: isCurrentMonth ? 0.5 : 1 }}
                >
                    <CircleChevronLeft size={28} className={styles.icon} />
                </button>
                <h3 className={styles.heading}>
                    {format(date, "MMMM yyyy")}
                </h3>
                <button className={styles.dateButton} onClick={() => changeMonth(1)}>
                    <CircleChevronRight size={28} className={styles.icon} />
                </button>
            </div>

            <DatesToSelect dates={dates} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

            <div className={styles.slotSection}>
                <h3 className={styles.slotTitle}>
                    <Sun /> Morning <span className={styles.slotCount}>{slots.morning.length} Slots</span>
                </h3>
                <hr className={styles.slotHr} />
                <div className={styles.slotGrid}>
                    {isLoading ? (
                        <div className={styles.loaderWrapper}>
                            <div className={styles.loader}></div>
                            <p>Loading Slots</p>
                        </div>
                    ) : (
                        slots.morning.map((slot) => (
                            <button
                                key={slot.id}
                                className={`${styles.slotButton} ${!slot.available ? styles.disabledSlot : ""} ${
                                    selectedSlot === slot.id ? styles.selectedSlot : ""
                                }`}
                                disabled={!slot.available}
                                onClick={() => {
                                    setSelectedSlot(slot.id);
                                    setSelectedTime(slot.time);
                                }}
                            >
                                {slot.time}
                            </button>
                        ))
                    )}
                </div>
            </div>

            <div className={styles.slotSection}>
                <h3 className={styles.slotTitle}>
                    <Sunset /> Evening <span className={styles.slotCount}>{slots.evening.length} Slots</span>
                </h3>
                <hr className={styles.slotHr} />
                <div className={styles.slotGrid}>
                    {isLoading ? (
                        <div className={styles.loaderWrapper}>
                            <div className={styles.loader}></div>
                            <p>Loading Slots</p>
                        </div>
                    ) : (
                        slots.evening.map((slot) => (
                            <button
                                key={slot.id}
                                className={`${styles.slotButton} ${!slot.available ? styles.disabledSlot : ""} ${
                                    selectedSlot === slot.id ? styles.selectedSlot : ""
                                }`}
                                disabled={!slot.available}
                                onClick={() => {
                                    setSelectedSlot(slot.id);
                                    setSelectedTime(slot.time);
                                }}
                            >
                                {slot.time}
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentScheduler;