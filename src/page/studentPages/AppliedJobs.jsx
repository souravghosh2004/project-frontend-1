import React, { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import jwt_decode from 'jwt-decode';

import AppliedJobTrackFromate from '../../component/AppliedJobTrackFromate';
const AppliedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [studentId , setStudentId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken');
      if(!token){
        alert("please Try letter..");
      }
      const decodedToken = jwt_decode(token);
      const dstudentId = decodedToken.id;
      setStudentId(dstudentId);
    } catch (error) {
      console.log(error);
    }
    
  },[]);
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        axios.post('/api/student/get/applied-jobs',{studentId})
        .then((response) => {
          setJobs(response.data.appliedJobs);
          if(jobs.length<1){}
          setLoading(false);
        })
      }catch (error){
        console.log(error);
        setLoading(false);
      }
    }
    fetchJobs();
  },[studentId]);
  if (loading) {
    return <div className='loading'>Loading...</div>;
  }
  return (
    <div>
       <div>
      <h1 style={{ textAlign: "center" }}>AllJobs</h1>
      <div className="all-job">
        <div className="jobs">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <AppliedJobTrackFromate job={job} key={job._id} />
            ))
          ) : (
            <p>No jobs available.</p>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}

export default AppliedJobs
