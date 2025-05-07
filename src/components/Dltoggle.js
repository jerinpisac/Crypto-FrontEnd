import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun } from "@fortawesome/free-solid-svg-icons";
import { faMoon } from "@fortawesome/free-solid-svg-icons";

function Dltoggle() {
  const [theme, setTheme] = useState("light");

  // Use useEffect to check and apply theme when the component mounts
  useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) {
      setTheme(savedTheme); // Set the theme based on localStorage
      document.body.classList.add(savedTheme); // Apply the saved theme class to the body
      document.body.classList.remove(savedTheme === "dark" ? "light" : "dark");
    } else {
      setTheme("light"); // Default theme if none saved
      document.body.classList.add("light");
    }
  }, []); // Run only once on mount

  const setDarkMode = () => {
    document.body.classList.add("dark");
    document.body.classList.remove("light");
    localStorage.setItem("selectedTheme", "dark");
    setTheme("dark");
  };

  const setLightMode = () => {
    document.body.classList.add("light");
    document.body.classList.remove("dark");
    localStorage.setItem("selectedTheme", "light");
    setTheme("light");
  };

  const toggleTheme = (e) => {
    if (e.target.checked) {
      setDarkMode();
    } else {
      setLightMode();
    }
  };

  return (
    <div className="DL">
      <input
        type="checkbox"
        id="darkmode-toggle"
        onChange={toggleTheme}
        checked={theme === "dark"} // Toggle based on theme state
      />
      <label htmlFor="darkmode-toggle">
        <div className="sun">
          <i>
            <FontAwesomeIcon icon={faSun} />
          </i>
        </div>
        <div className="moon">
          <i>
            <FontAwesomeIcon icon={faMoon} />
          </i>
        </div>
      </label>
    </div>
  );
}

export default Dltoggle;
