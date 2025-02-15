import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const ApplyJob = () => {
  const {id} = useParams();
  const jobId = id;
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(true);
  const [jobLoaded, setJobLoaded] = useState(false);

  // Fetch studentId from token
  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Please try again later.');
        return;
      }
      const decodedToken = jwt_decode(token);
      console.log('Decoded Token:', decodedToken);
      setStudentId(decodedToken.id);
    } catch (error) {
      console.error('Error decoding token:', error);
      alert('An error occurred while decoding the token.');
    }
  }, []);

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`/api/job/onejob/${id}`);
        console.log('Job Details Fetched:', response.data);
        setJob(response.data);
        setLoading(false);
        setJobLoaded(true);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError(err.message || 'Failed to fetch job details.');
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  // Check if student has already applied for the job
  useEffect(() => {
    if (jobLoaded && studentId) {
      console.log('Job:', job);
      console.log('Student ID:', studentId);
      const isAlreadyApplied = job.appliedStudent.some(
        (appliedStudent) => appliedStudent === studentId
      );
      console.log('Is Already Applied:', isAlreadyApplied);
      setIsChecked(isAlreadyApplied);
    } else {
      console.log('Job or studentId not ready:', job, studentId);
    }
  }, [jobLoaded, studentId]);

  const handleCheckboxChange = async (event) => {
    setIsChecked(event.target.checked);
    console.log('Checkbox is checked: ', event.target.checked);
    if(isChecked != true){
      try {
        alert("Student id =  "+studentId+" has been applied for job id = "+jobId);
       await axios.post('/api/student/store/student-applied-job',{jobId,studentId});
       
      } catch (error) {
        console.log(error)
      }

      console.log("abcd")
    }
  };

  if (loading) {
    return <div className='loading'>Loading...</div>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <div className="student-show-one-job-details-main">
        <div className="student-show-one-job-details-left-box">
          <div className="job-details">
            <h1>{job.companyName}</h1>
            <p className="job-details-oneByone">
              <strong>Job Role:</strong> {job.jobRole}
            </p>
            <p className="job-details-oneByone">
              <strong>Job Location:</strong> {job.location}
            </p>
            <p className="job-details-oneByone">
              <strong>Salary:</strong> {job.salary}
            </p>
            <p className="job-details-oneByone">
              <strong>Eligibility:</strong> {job.eligibility?.join(', ') || 'No criteria provided'}
            </p>
            <p className="job-details-oneByone">
              <strong>Required Skills:</strong> {job.skills || 'Not specified'}
            </p>
          </div>
          <div className="apply-and-toggle-btn">
          {!isChecked && (
            <a
            href={job.applyLink || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="apply-button-link"
          >
            Apply Now
          </a>
          )}
          {isChecked &&(
            <p>Already applied</p>
          )}
          <label className="switch">
            <input
              type="checkbox"
              onChange={handleCheckboxChange}
              checked={isChecked}
            />
            <span className="slider round"></span>
          </label>
          </div>
        </div>

        <div className="student-show-one-job-details-right-box">
          <div className="job-descp-stud-show">
            <h1>Job Description</h1>
            <p className="job-descp-details">
              {job.description || 'No description provided.'}
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt totam porro quo facere
              ipsa dolor vel non alias incidunt laudantium, fugit explicabo officiis mollitia incidunt
              sapiente voluptatum, cum quisquam odio architecto aut.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;
