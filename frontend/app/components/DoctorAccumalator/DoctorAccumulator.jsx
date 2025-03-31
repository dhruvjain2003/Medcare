import React, { useState, useEffect } from "react";
import DoctorCard from "../DoctorCards/DoctorCards";
import Filter from "../LeftSideBar/LeftSideBar";
import SearchContainer from "../SearchContainer/SearchContainer";
import styles from "./DoctorAccumulator.module.css";

// const doctors = [
//     {
//         id: 1,
//         name: "Dr. Ayesha Kapoor",
//         specialty: "Cardiologist",
//         experience: "12 Years",
//         image: "https://randomuser.me/api/portraits/women/50.jpg",
//         ratings: 4,
//     },
//     {
//         id: 2,
//         name: "Dr. Rohan Verma",
//         specialty: "Dermatologist",
//         experience: "8 Years",
//         image: "https://randomuser.me/api/portraits/men/45.jpg",
//         ratings: 3,
//     },
//     {
//         id: 3,
//         name: "Dr. Neha Sharma",
//         specialty: "Pediatrician",
//         experience: "10 Years",
//         image: "https://randomuser.me/api/portraits/women/60.jpg",
//         ratings: 4,
//     },
//     {
//         id: 4,
//         name: "Dr. Vikram Patel",
//         specialty: "Neurologist",
//         experience: "15 Years",
//         image: "https://randomuser.me/api/portraits/men/55.jpg",
//         ratings: 3,
//     },
//     {
//         id: 5,
//         name: "Dr. Simran Kaur",
//         specialty: "Gynecologist",
//         experience: "7 Years",
//         image: "https://randomuser.me/api/portraits/women/30.jpg",
//         ratings: 2,
//     },
//     {
//         id: 6,
//         name: "Dr. Arjun Nair",
//         specialty: "Orthopedic",
//         experience: "9 Years",
//         image: "https://randomuser.me/api/portraits/men/35.jpg",
//         ratings: 1,
//     },
//     {
//         id: 7,
//         name: "Dr. Arjun Nair",
//         specialty: "Orthopedic",
//         experience: "9 Years",
//         image: "https://randomuser.me/api/portraits/men/35.jpg",
//         ratings: 1,
//     },
// ];

const DoctorList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 6;
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctors`
        );
        const data = await response.json();
        // console.log(data);
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={styles.container}>
      <SearchContainer
        setDoctors={(filteredDoctors) => {
          setDoctors(filteredDoctors);
          setCurrentPage(1);
        }}
      />
      <h1 className={styles.title}>{doctors.length} doctors available</h1>
      <p className={styles.para}>
        Book appointments with minimum wait-time & verified doctor details
      </p>
      <br />
      <div className={styles.subContainer}>
        <div className={styles.left}>
          <Filter
            setDoctors={(filteredDoctors) => {
              setDoctors(filteredDoctors);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className={styles.right}>
          {loading ? ( 
            <div className={styles.loaderContainer}>
                <div className={styles.loader}></div>
            </div>
          ) : (
            <>
              <div className={styles.cardContainer}>
                {currentDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
              <Pagination
                doctorsPerPage={doctorsPerPage}
                totalDoctors={doctors.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Pagination = ({
  doctorsPerPage,
  totalDoctors,
  paginate,
  currentPage,
}) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalDoctors / doctorsPerPage);

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1);
    if (currentPage > 3) pageNumbers.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pageNumbers.push(i);
    }
    if (currentPage < totalPages - 2) pageNumbers.push("...");
    pageNumbers.push(totalPages);
  }

  return (
    <nav>
      <ul className={styles.pagination}>
        <li className={styles.pageItem}>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={currentPage === 1 ? styles.disabled : ""}
          >
            &lt; Prev
          </button>
        </li>

        {pageNumbers.map((number, index) =>
          number === "..." ? (
            <span key={`ellipsis-${index}`} className={styles.ellipsis}>
              ...
            </span>
          ) : (
            <li
              key={number}
              className={`${styles.pageItem} ${
                currentPage === number ? styles.active : ""
              }`}
            >
              <button onClick={() => paginate(number)}>{number}</button>
            </li>
          )
        )}

        <li className={styles.pageItem}>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={currentPage === totalPages ? styles.disabled : ""}
          >
            Next &gt;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default DoctorList;
