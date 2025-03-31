"use client";
import { useEffect, useState } from "react";
import styles from "./LeftSideBar.module.css";

const LeftSideBar = ({ setDoctors }) => {
  const [filters, setFilters] = useState({
    rating: "Show all",
    experience: "Show all",
    gender: "Show all",
  });

  const handleChange = (category, value) => {
    setFilters({ ...filters, [category]: value });
  };

  const resetFilters = () => {
    setFilters({
      rating: "Show all",
      experience: "Show all",
      gender: "Show all",
    });
  };

  const fetchFilteredDoctors = async () => {
    try {
      const { rating, experience, gender } = filters;
      const filterMap = new Map();
  
      filterMap.set("rating", rating !== "Show all" ? parseInt(rating) : -1);
  
      if (experience !== "Show all") {
        if (experience === "15+ years") {
          filterMap.set("experience", [15, 50]);;
        } else {
          const expRange = experience.split("-").map((num) => parseInt(num));
          filterMap.set("experience", expRange);
        }
      } else {
        filterMap.set("experience", -1);
      }
  
      filterMap.set("gender", gender !== "Show all" ? gender : -1);
      const filterObject = Object.fromEntries(filterMap);
      console.log(filterObject);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctors/filter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filterObject),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch filtered doctors');
      }
      const data = await response.json();
      setDoctors(data); 
    } catch (error) {
      console.log(error);
    }
  };
  

  useEffect(() => {
    fetchFilteredDoctors();
  }, [filters]);

  const renderFilterSection = (title, category, options) => (
    <div className={styles.filterSection}>
      <h4 className={styles.filterTitle}>{title}</h4>
      {options.map((option) => (
        <label key={option} className={styles.filterLabel}>
          <input
            type="radio"
            name={category}
            value={option}
            checked={filters[category] === option}
            onChange={() => handleChange(category, option)}
            className={styles.filterInput}
          />
          {option}
        </label>
      ))}
    </div>
  );

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterHeader}>
        <span className={styles.filterSpan}>Filter By:</span>
        <button className={styles.resetButton} onClick={resetFilters}>
          Reset
        </button>
      </div>
      {renderFilterSection("Rating", "rating", [
        "Show all",
        "1 star",
        "2 star",
        "3 star",
        "4 star",
        "5 star",
      ])}
      {renderFilterSection("Experience", "experience", [
        "Show all",
        "15+ years",
        "10-15 years",
        "5-10 years",
        "3-5 years",
        "1-3 years",
        "0-1 years",
      ])}
      {renderFilterSection("Gender", "gender", ["Show all", "Male", "Female"])}
    </div>
  );
};

export default LeftSideBar;
