import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './AppliedStudentList.css';

const AppliedStudentList = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appliedStudents, setAppliedStudents] = useState([]);
  const [selectedRound, setSelectedRound] = useState('appliedStudent');
  const [trackDetails, setTrackDetails] = useState(null);
  const [roundName, setRoundName] = useState("Applied Student List"); 
  // Fetch Job Details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/job/applied-student-list/${jobId}`);
        setJob(response.data);
        setAppliedStudents(response.data?.appliedStudent || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch job details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [jobId]);

  // Fetch Track Details
  useEffect(() => {
    let isMounted = true;
    const fetchTrackDetails = async () => {
      try {
        const response = await axios.post('/api/track/job/job-track', { jobDetails: jobId });
        if (isMounted && response.status === 200) {
          setTrackDetails(response.data.jobTrack);
          // console.log(response.data.jobTrack)
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError('Failed to fetch track details. Please try again later.');
      }
    };
    if (jobId) fetchTrackDetails();
    return () => {
      isMounted = false;
    };
  }, [jobId]);

  // Handle Round Selection
  const handleRoundChange = (event) => {
    const round = event.target.value;
    setSelectedRound(round);
  };

  // Update Students List Based on Selected Round
  useEffect(() => {
    if (selectedRound === 'appliedStudent') {
      setAppliedStudents(job?.appliedStudent || []);
      setRoundName("Applied Student List");
    } else if (trackDetails && trackDetails[selectedRound]) {
      setAppliedStudents(trackDetails[selectedRound] || []);
    } else {
      setAppliedStudents([]);
    }
    if(selectedRound == "resumeSelect"){
      setRoundName("Resume selceted Student List");
    }else if(selectedRound  == "firstRound"){
      setRoundName("First Round Student List");
    }else if(selectedRound  == "secondRound"){
      setRoundName("Second Round Student List");
    } else if(selectedRound  == "thirdRound"){
      setRoundName("Third Round Student List");
    } else if(selectedRound  == "finalRound"){
      setRoundName("Final Round Student List");
    } else if(selectedRound == "fourthRound"){
      setRoundName("Fourth Round Student List");
    }
  }, [selectedRound, trackDetails, job]);

  // Retry Fetching Data
  const retryFetchingData = () => {
    setError(null);
    setLoading(true);
    setJob(null);
    setTrackDetails(null);
  };

  // Download CSV
  const downloadCSV = () => {
    if (!job) return;

    const jobDetails = [
      ['Company Name', job.companyName],
      ['Job Role', job.jobRole],
      ['Location', job.location],
      ['Skills Required', job.skills],
      ['Salary', job.salary],
      ['Eligibility', job.eligibility.join(', ')],
      ['Apply Link', job.applyLink],
    ];

    const jobDetailsCsv = jobDetails.map((detail) => detail.join(': ')).join('\n');

    const headers = ['Student Code', 'Name', 'Stream', 'Contact Number'];
    const rows = appliedStudents.map((student) => [
      student.studentCode,
      student.studentName,
      student.studentStream,
      student.contactNumber,
    ]);

    const studentDataCsv = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const csvContent = `${jobDetailsCsv}\n\n${roundName}:\n\n${studentDataCsv}`;
    const fileName = `${job.companyName.replace(/\s+/g, '_')}_${job.jobRole.replace(/\s+/g, '_')}.csv`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    link.click();

    URL.revokeObjectURL(url);
  };

  // Render Loading State
  if (loading) {
    return <div className="applied-student-list__loading">Loading...</div>;
  }

  // Render Error State
  if (error) {
    return (
      <div className="applied-student-list__error">
        <p>{error}</p>
        <button onClick={retryFetchingData} className="applied-student-list__retry-button">
          Retry
        </button>
      </div>
    );
  }

  // Render No Job Details
  if (!job) {
    return <div className="applied-student-list__error">No job details available.</div>;
  }

  // Main Component UI
  return (
    <div className="applied-student-list">
      <h1 className="applied-student-list__header">Job Details</h1>
      <div>
        <h2 className="applied-student-list__sub-header">Company Name: {job.companyName}</h2>
        <p className="applied-student-list__info"><strong>Location:</strong> {job.location}</p>
        <p className="applied-student-list__info"><strong>Job Role:</strong> {job.jobRole}</p>
        <p className="applied-student-list__info"><strong>Skills Required:</strong> {job.skills}</p>
        <p className="applied-student-list__info"><strong>Salary:</strong> {job.salary}</p>
        <p className="applied-student-list__info"><strong>Eligibility:</strong> {job.eligibility.join(', ')}</p>
        <p className="applied-student-list__info">
          <strong>Apply Link:</strong>{' '}
          <a
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="applied-student-list__link"
          >
            {job.applyLink}
          </a>
        </p>
      </div>
      <div>
        <div className="applied-student-list__header-container">
          <div className="applied-student-list__dropdown">
            <label htmlFor="roundSelect"><p className='ss'>Select Round:</p></label>
            <select
              id="roundSelect"
              value={selectedRound}
              onChange={handleRoundChange}
              className="applied-student-list__select"
            >
              <option value="appliedStudent">Applied Student</option>
              {trackDetails?.resumeRoundCompleted && <option value="resumeSelect">Resume Round</option>}
              {trackDetails?.firstRoundCompleted && <option value="firstRound">First Round</option>}
              {trackDetails?.secondRoundCompleted && <option value="secondRound">Second Round</option>}
              {trackDetails?.thirdRoundCompleted && <option value="thirdRound">Third Round</option>}
              {trackDetails?.fourthRoundCompleted && <option value="fourthRound">Fourth Round</option>}
              {trackDetails?.finalRoundCompleted && <option value="finalRound">Final Round</option>}
            </select>
          </div>
           <p className='roundName'>{roundName}</p>
          <button
            onClick={downloadCSV}
            className="applied-student-list__download-button"
          >
            Download CSV
          </button>
        </div>

      </div>
      {appliedStudents && appliedStudents.length > 0 ? (
        <table className="applied-student-list__table">
          <thead>
            <tr>
              <th>Student Code</th>
              <th>Name</th>
              <th>Stream</th>
              <th>Contact Number</th>
            </tr>
          </thead>
          <tbody>
            {appliedStudents.map((student) => (
              <tr key={student._id}>
                <td>{student.studentCode}</td>
                <td>{student.studentName}</td>
                <td>{student.studentStream}</td>
                <td>{student.contactNumber}</td>
              </tr>
            ))}
          </tbody>

        </table>
      ) : (
        <p className="applied-student-list__info">No students have applied for this job yet.</p>
      )}
    </div>
  );
};

export default AppliedStudentList;
