import React, { useState, useEffect } from 'react';
import './CreatedJob.css';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import CreatedJobFormteTeacher from '../../component/CreatedJobFormteTeacher';

const CreatedJob = () => {
  const [error, setError] = useState('');
  const [jobs, setJobs] = useState([]);
  const [creator, setCreator] = useState('');
  const [loading, setLoading] = useState(true);

  // Decode token and set creator
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        setCreator(decodedToken.id); // Ensure this matches your token structure
      } catch (err) {
        setError('Invalid Token');
        console.error("Token decoding error:", err);
      }
    } else {
      setError('No authentication token found');
    }
  }, []);

  // Fetch jobs only when creator is set
  useEffect(() => {
    if (creator) {
      axios
        .get(`/api/job/teacher-own-job/${creator}`)
        .then((response) => {
          setJobs(response.data);
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false);
          setError(err.response?.data?.message);
          console.error("Error fetching jobs:", err);
        });
    }
  }, [creator]);

  if (loading) {
    return <div className='loading'>Loading...</div>;
  }

  return (
    <div className='createdJob-main'>
      <div className="createdJob-under-main">
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <div className="all-job">
        <div className="jobs">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <CreatedJobFormteTeacher job={job} key={job._id} />
            ))
          ) : (
            !error && <div className='nojob'><p style={{ textAlign: "center" }}>No jobs available.</p></div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default CreatedJob;
