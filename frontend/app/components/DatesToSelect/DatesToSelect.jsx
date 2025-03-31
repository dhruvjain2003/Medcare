import { useRef } from "react";
import { CircleChevronRight } from "lucide-react";
import styles from "./DatesToSelect.module.css";
import { format } from "date-fns";

const DatesToSelect = ({ dates, selectedDate, setSelectedDate }) => {
  const scrollContainerRef = useRef(null);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount =
        scrollContainerRef.current.querySelector(`.${styles.dateButton}`)
          .offsetWidth * 7;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleDateSelection = (item) => {
    const newDate = new Date(selectedDate);
    const [month, day] = item.date.split(" ");
    const year = newDate.getFullYear();
    const months = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };

    newDate.setMonth(months[month]);
    newDate.setDate(parseInt(day));
    setSelectedDate(newDate);
  };
  
  return (
    <div className={styles.dateSelectorWrapper}>
      <div className={styles.dateSelector} ref={scrollContainerRef}>
        {dates.map((item) => {
          const formattedSelectedDate = format(selectedDate, "MMM dd");
          
          return (
            <button
              key={item.date}
              className={`${styles.dateButton} ${
                formattedSelectedDate === item.date ? styles.activeDate : ""
              }`}
              onClick={() => handleDateSelection(item)}
            >
              <span className={styles.day}>{item.day}</span>
              <span className={styles.date}>{item.date}</span>
            </button>
          );
        })}
      </div>

      <button className={styles.scrollButton} onClick={scrollRight}>
        <CircleChevronRight size={28} />
      </button>
    </div>
  );
};

export default DatesToSelect;
