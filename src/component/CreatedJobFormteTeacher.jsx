import React from 'react'
import "./AllJobsFormate.css"
import { useNavigate } from 'react-router-dom'
const CreatedJobFormteTeacher = ({ job }) => {
  const navigate = useNavigate();
  function showCreatedJob(){
    navigate(`/teacher-dashboard/teacher-handle-own-job/${job._id}`)
  }

  return (
    <div className='ff'onClick={showCreatedJob} >
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

      export default CreatedJobFormteTeacher;
