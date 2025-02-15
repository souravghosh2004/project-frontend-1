import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './StudentShowOneJob.css';

const StudentShowOneJob = () => {
  const { id } = useParams(); // Fetch job ID from the URL
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/job/onejob/${id}`) // Fetch job details by ID
      .then((response) => {
        setJob(response.data);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      });
  }, [id]);

  if (error) return <p>Error loading job details.</p>;
  if (!job) return <p>Loading...</p>;

  return (
    <div className="student-show-one-job-details-main">
      <div className="student-show-one-job-details-left-box">
        <div className="job-details">
          <h1>{job.companyName}</h1>
          <p className='job-details-oneByone'><strong>Job Role:</strong> {job.jobRole}</p>
          <p className='job-details-oneByone'><strong>Job Location:</strong> {job.location}</p>
          <p className='job-details-oneByone'><strong>Salary:</strong> {job.salary}</p>
          <p className='job-details-oneByone'><strong>Eligible:</strong> {job.eligibility.join(', ')}</p>
          <p className='job-details-oneByone'><strong>Required Skills:</strong> {job.skills || 'Not specified'}</p>
          
        </div>
      </div>
      <div className="student-show-one-job-details-right-box">
        <div className="job-descp-stud-show">
          <h1>Job Description</h1>
          <p className='job-descp-details'>{job.description || 'No description provided.'}
            Lorem ipsum Lorem, ipsum quuntur dicta nihil cum aspernatur quibusdam similique! Sunt totam porro quo facere ipsa dolor vel non alias incidunt laudantium?s, fugit explicabo officiis mollitia incidunt sapiente voluptatum, cum quisquam odio architecto aut, dolor ut assumenda temporibus. Animi, atque.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentShowOneJob;
