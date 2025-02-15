import React from 'react'
import { useNavigate } from 'react-router-dom'
const AppliedJobTrackFromate = ({job}) => {
    const navigate = useNavigate()
    function handleTrack (){
        
        navigate(`/student-dashboard/applied-job-track/${job._id}`);
    }

    return (

        <div className='ff' onClick={handleTrack}>
            <div className="all-job-formate">
                <h3 className='companyName'>{job.companyName}</h3>
                <div className='company-details'>
                    <p className='p-student'>Job Role: {job.jobRole}</p>
                    <p className='p-student'>Job Location: {job.location}</p>
                    <p className='p-student'>Package: {job.salary}</p>
                    <p className='p-student'>Eligible: {job.eligibility.join(', ')}</p>
                    <p className='p-student'>Required Skill: {job.skills}</p>
                    <p>it is for testing</p>
                </div>
            </div>
        </div>

    )


}

export default AppliedJobTrackFromate
