import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./PlacedStudents.module.css";

const PlacedStudents = () => {
  const [placedStudet, setPlaceStudent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getPlacedStudent() {
      setLoading(true);
      try {
        const response = await axios.get("/api/track/job/placed-student");
        if (response.status === 200) {
          setPlaceStudent(response.data);
          setLoading(false);
          if (response.data.length > 0) {
            setMessage("");
          }
        }
      } catch (error) {
        const message =
          error.response?.data?.message || "Internal server error";
        setError(message);
        setLoading(false);
      }
    }
    getPlacedStudent();
  }, []);

  useEffect(() => {
    if (placedStudet.length === 0 && !loading) {
      setMessage("No student placed yet");
    }
  }, [placedStudet]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Placed Students</h1>
      {message && <p className={styles.message}>{message}</p>}
      <div className={styles.studentsList}>
        {placedStudet.map((placement) =>
          placement.slecetedStudent.map((student) => (
            <div key={student._id} className={styles.studentCard}>
              <div className={styles.profileContainer}>
                <img
                  src={student?.profilePic || "https://media.istockphoto.com/id/1341046662/vector/picture-profile-icon-human-or-people-sign-and-symbol-for-template-design.jpg?s=612x612&w=0&k=20&c=A7z3OK0fElK3tFntKObma-3a7PyO8_2xxW0jtmjzT78="} // Temporary placeholder if no profilePic
                  alt={student.studentName}
                  className={styles.profilePic}
                />
              </div>
              <p className={styles.studentName}>{student.studentName}</p>
              <p className={styles.studentStream}>
                Stream: {student.studentStream}
              </p>
              <p className={styles.companyName}>
                Company: {placement.jobDetails.companyName}
              </p>
              <p className={styles.jobRole}>
                Role: {placement.jobDetails.jobRole}
              </p>
              <p className={styles.salary}>
                Salary: {placement.jobDetails.salary}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlacedStudents;
