import React, { useState, useEffect } from 'react';
import './Myjobs.css';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import StudentOwnJobFormate from '../../component/StudentOwnJobFormate';

export const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [eligibility, setEligibility] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Decode token and set eligibility
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        setEligibility(decodedToken.studentStream?.toUpperCase() || '');
      } catch (err) {
        console.error("Invalid Token:", err);
        alert("Invalid session. Please log in again.");
        localStorage.removeItem("authToken");
        window.location.href = "/student-login";
      }
    } else {
      alert("You are not eligible for this page.");

    }
  }, []);

  // Fetch jobs based on eligibility
  useEffect(() => {
    if (eligibility) {
      const fetchJobs = async () => {
        try {
          setLoading(true);
          const response = await axios.post('/api/job/student-own-job', { eligibility });
          setJobs(response.data);
        } catch (err) {
          console.error("Error fetching jobs:", err);
          setError(err.message || "An error occurred while fetching jobs.");
        } finally {
          setLoading(false);
        }
      };
      fetchJobs();
    }
  }, [eligibility]);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>All Jobs</h1>
      <div className="all-job">
        <div className="jobs">
          {loading ? (
            <div className='loading'>Loading...</div>
          ) : error ? (
            <div>
              <p style={{ color: "red" }}>Error: {error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <StudentOwnJobFormate job={job} key={job._id} />
            ))
          ) : (
            <p>No jobs available for eligibility: {eligibility}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyJobs;
