import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "./StudentNavbar.css";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const StudentNavbar = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [profileIcon, setProfileIcon] = useState("");
  const [showDropDown, setDropDown] = useState(false);
  const [stream, setStream] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [studentDetails ,setStudentDetails] = useState("");

  const profileRef = useRef(null); // Reference for the profile container

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        setStudentDetails(decodedToken.id);
        setName(decodedToken.studentName);
        setStream(decodedToken.studentStream);
        setStudentCode(decodedToken.studentCode);
      } catch (error) {
        console.error("Invalid Token:", error);
        navigate("/student-login");
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (name) {
      setProfileIcon(name.charAt(0).toUpperCase());
    }
  }, [name, studentCode, stream]);

  function handleProfileClick() {
    setDropDown(!showDropDown);
  }

  function logout() {
    localStorage.removeItem("authToken");
    navigate("/");
  }

  // Add event listener to close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setDropDown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function profile (){
    navigate(`/student-dashboard/student-full-profile/${studentDetails}`);
  }

  return (
    <nav className="navbar-student">
      <div className="welcome-text">
        <p id="Welcome-para">Welcome, </p>
        <span className="username">{name}</span>
      </div>
      <div className="student-navber-links">
        <ul className="nav-links-student">
          <li>
            <NavLink
              to="/student-dashboard"
              className={({ isActive }) =>
                isActive ? "active-link-student-navbar" : ""
              }
              end
            >
              All Jobs
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student-dashboard/my-job"
              className={({ isActive }) =>
                isActive ? "active-link-student-navbar" : ""
              }
            >
              Your Jobs
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student-dashboard/applied-jobs"
              className={({ isActive }) =>
                isActive ? "active-link-student-navbar" : ""
              }
            >
              Applied Jobs
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/announcements"
              className={({ isActive }) =>
                isActive ? "active-link-student-navbar" : ""
              }
            >
              Announcements
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student-dashboard/placed-students"
              className={({ isActive }) =>
                isActive ? "active-link-student-navbar" : ""
              }
            >
              Placed Students
            </NavLink>
          </li>
        </ul>
        <div className="profile-container" ref={profileRef}>
          <div className="profile-icon" onClick={handleProfileClick}>
            <p className="profile">{profileIcon}</p>
          </div>
          {showDropDown && (
            <div className="drop-down-menu">
              <p>Name: {name}</p>
              <p>Stream: {stream}</p>
              <p>{studentCode}</p>
              <button onClick={profile}>Profile</button>
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar;
