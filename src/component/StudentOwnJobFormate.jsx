import React from 'react'
import {useNavigate} from 'react-router-dom';
 const StudentOwnJobFormate = ({job}) => {
    const navigate = useNavigate();
    function handleJob(){
        navigate(`/student-dashboard/apply-job/${job._id}`);
    }
  return (
    <div>
        <div className='ff' onClick={handleJob}>
      <div className="all-job-formate">
        <h3 className='companyName'>{job.companyName}</h3>
        <div className='company-details'>
       <p className='p-student'>Job Role: {job.jobRole}</p>
          <p className='p-student'>Job Location: {job.location}</p> 
          <p className='p-student'>Package: {job.salary}</p>
          <p className='p-student'>Eligible: {job.eligibility.join(', ') || no}</p>
          <p className='p-student'>Required Skill: {job.skills}</p>
        </div>
      </div>
    </div>
    </div>
  )
}
export default StudentOwnJobFormate;
