"use client";
import { useState } from "react";
import styles from "./SearchContainer.module.css";

const SearchContainer = ({ setDoctors }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [errorMessage, setErrorMessage] = useState("");

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      setSearchQuery(suggestions[selectedIndex].name);
      setSuggestions([]);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setErrorMessage("Please enter something to search.");
      return;
    }
    setErrorMessage(""); 
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctors/search?query=${searchQuery}`);
      const data = await response.json();
      setDoctors(Array.isArray(data) ? data : []);
      setSuggestions([]);
    } catch (error) {
      console.error("Error fetching doctors", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctors/search?query=${query}`);
        const data = await response.json();
        setSuggestions(Array.isArray(data) ? data : []);
        setSelectedIndex(-1); 
      } catch (error) {
        console.error("Error fetching suggestions", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.searchForm} onSubmit={handleSearch}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search doctors by name or speciality"
            className={styles.searchInput}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button type="submit" className={styles.searchButton} disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

      {suggestions.length > 0 && (
        <div className={styles.suggestions}>
          {suggestions.map((doctor, index) => (
            <div
              key={doctor.id}
              className={`${styles.suggestionItem} ${
                index === selectedIndex ? styles.activeSuggestion : ""
              }`}
              onClick={() => {
                setSearchQuery(doctor.name);
                setSuggestions([]);
              }}
            >
              {doctor.name} - {doctor.specialty}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchContainer;