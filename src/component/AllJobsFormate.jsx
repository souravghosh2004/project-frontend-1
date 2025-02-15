import React, { useEffect, useState } from 'react'
import './AllJobsFormate.css'
import { useNavigate } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
const AllJobsFormate = ({ job }) => {
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        setRole(decodedToken.role)

      } catch (error) {
        console.error('Invalid Token:', error);

      }
    }
  }, []);


  // If the role is not 'student', redirect to login page
  //   if (decodedToken.role === 'student') {
  //     navigate('/student-dashboard');
  //   }else if(decodedToken.role === 'teacher'){
  //     navigate('/teacher-dashboard');
  //   }
  // } catch (error) {
  //   console.error('Invalid Token:', error);
  //   navigate('/student-login');
  // }


  function handleJob() {
    if (role === 'student') {
      navigate(`/student-dashboard/show-one-job/${job._id}`);
    } else if (role === 'teacher') {
      navigate(`/teacher-dashboard/show-one-job/${job._id}`)
    }
  }
  return (
    <div className='ff' onClick={handleJob}>
      <div className="all-job-formate">
        <h3 className='companyName'>{job.companyName}</h3>
        <div className='company-details'>
       <p className='p-student'>Job Role: {job.jobRole}</p>
          <p className='p-student'>Job Location: {job.location}</p>
          <p className='p-student'>Package: {job.salary}</p>
          <p className='p-student'>Eligible: {job.eligibility.join(', ')}</p>
          <p className='p-student'>Required Skill: {job.skills}</p>
        </div>
      </div>
    </div>


  )
}

export default AllJobsFormate
