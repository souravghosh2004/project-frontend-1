import React, { useEffect, useState } from 'react';
import './AppliedJobTrack.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const AppliedJobTrack = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);
  const [trackData, setTrackData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        setStudentId(decodedToken.id);
      } catch (err) {
        setError('Invalid token. Please log in again.');
      }
    } else {
      setError('No authentication token found. Please log in.');
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setError('Job ID is missing.');
      return;
    }

    axios
      .get(`/api/job/onejob/${id}`)
      .then((response) => {
        setJob(response.data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        const errorMessage =
          err.response?.data?.message || 'Failed to fetch job details. Please try again.';
        setError(errorMessage);
      });
  }, [id]);

  const trackJob = async () => {
    try {
      const response = await axios.post('/api/track/job/one-job-track', {
        studentId,
        jobDetails: id,
      });
      if (response.data) {
        setTrackData(response.data);
        setShowPopup(true);
        setError(null);
      }
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message || 'Failed to track job application. Please try again.';
      setError(errorMessage);
    }
  };

  const retryFetchJob = () => {
    setError(null);
    axios
      .get(`/api/job/onejob/${id}`)
      .then((response) => {
        setJob(response.data);
      })
      .catch((err) => {
        console.error(err);
        const errorMessage =
          err.response?.data?.message || 'Retry failed. Please check your connection.';
        setError(errorMessage);
      });
  };

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={retryFetchJob} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  if (!job) return <p>Loading...</p>;

  return (
    <div className="student-show-one-job-details-main">
      <div className="student-show-one-job-details-left-box">
        <div className="job-details">
          <h1>{job.companyName}</h1>
          <p className="job-details-oneByone"><strong>Job Role:</strong> {job.jobRole || 'N/A'}</p>
          <p className="job-details-oneByone"><strong>Job Location:</strong> {job.location || 'N/A'}</p>
          <p className="job-details-oneByone"><strong>Salary:</strong> {job.salary || 'N/A'}</p>
          <p className="job-details-oneByone"><strong>Eligibility:</strong> {job.eligibility?.join(', ') || 'N/A'}</p>
          <p className="job-details-oneByone"><strong>Required Skills:</strong> {job.skills || 'Not specified'}</p>
        </div>
        <button onClick={trackJob} className="trackJob">Track Application</button>
      </div>
      <div className="student-show-one-job-details-right-box">
        <div className="job-descp-stud-show">
          <h1>Job Description</h1>
          <p className="job-descp-details">{job.description || 'No description provided.'}</p>
        </div>
      </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            
            <div style={{ display: "grid", gap: "10px" }}>
            <h2>Application Tracking</h2>
              <p><strong>Resume:</strong> {trackData?.studentInRounds?.resumeRoundCompleted ? (trackData?.studentInRounds?.resumeSelect ? '✔️' : '❌') : '--'}</p>
              <p><strong>First Round:</strong> {trackData?.studentInRounds?.firstRoundCompleted ? (trackData?.studentInRounds?.firstRound ? '✔️' : '❌') : '--'}</p>
              <p><strong>Second Round:</strong> {trackData?.studentInRounds?.secondRoundCompleted ? (trackData?.studentInRounds?.secondRound ? '✔️' : '❌') : '--'}</p>
              <p><strong>Third Round:</strong> {trackData?.studentInRounds?.thirdRoundCompleted ? (trackData?.studentInRounds?.thirdRound ? '✔️' : '❌') : '--'}</p>
              <p><strong>Fourth Round:</strong> {trackData?.studentInRounds?.fourthRoundCompleted ? (trackData?.studentInRounds?.fourthRound ? '✔️' : '❌') : '--'}</p>
              <p><strong>Final Round:</strong> {trackData?.studentInRounds?.finalRoundCompleted ? (trackData?.studentInRounds?.finalRound ? '✔️' : '❌') : '--'}</p>
           
            <button onClick={() => setShowPopup(false)} className="close-popup-button">
              Close
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliedJobTrack;
