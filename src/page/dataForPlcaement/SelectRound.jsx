import React, { useState, useEffect } from "react";
import axios from "axios";
import './SelectRound.css';
import { useParams } from "react-router-dom";

const SelectRound = () => {
  const {jobTrackerId} = useParams(); 
  const [studentIds, setStudentIds] = useState([]);
  const [selectedRound, setSelectedRound] = useState('');
  const [students, setStudents] = useState([]);
//  const [jobTrackerId, setJobTrackerId] = useState('6773c44501e43fd95e352066');
  const [jobTrack, setJobTrack] = useState({});
  const [error, setError] = useState(null);
  const [lastCompleteRoundName, setLastCompleteRoundName] = useState('');
  const [change, setChange] = useState(true);
  const [checkboxTrue, setCheckboxTrue] = useState([]);
  const [loading, setLoading] = useState(false);

  const rounds = [
    { label: 'Resume Select', value: 'resumeSelect' },
    { label: 'First Round', value: 'firstRound' },
    { label: 'Second Round', value: 'secondRound' },
    { label: 'Third Round', value: 'thirdRound' },
    { label: 'Fourth Round', value: 'fourthRound' },
    { label: 'Final Round', value: 'finalRound' },
  ];

  const roundCompletionMap = {
    resumeSelect: jobTrack.resumeRoundCompleted,
    firstRound: jobTrack.firstRoundCompleted,
    secondRound: jobTrack.secondRoundCompleted,
    thirdRound: jobTrack.thirdRoundCompleted,
    fourthRound: jobTrack.fourthRoundCompleted,
    finalRound: jobTrack.finalRoundCompleted,
  };

  const getOptionClassName = (roundValue) =>
    roundCompletionMap[roundValue] ? "completed-round" : "incomplete-round";

  const handleSelectChange = (event) => {
    setSelectedRound(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/track/job/one/${jobTrackerId}`);
        if (response.data && response.data.jobDetails) {
          setJobTrack(response.data);
        } else {
          console.error('Job details are not available.');
        }
      } catch (error) {
        setError('Error fetching job details.');
        console.error('Error fetching job details:', error);
      }
    };
    fetchData();
  }, [jobTrackerId, change]);

  useEffect(() => {
    if (jobTrack.finalRoundCompleted) {
      setSelectedRound('finalRound');
      setStudentIds(jobTrack.finalRound || []);
    } else if (selectedRound === 'finalRound') {
      if (jobTrack.fourthRoundCompleted) {
        setStudentIds(jobTrack.fourthRound || []);
      } else if (jobTrack.thirdRoundCompleted) {
        setStudentIds(jobTrack.thirdRound || []);
      } else if (jobTrack.secondRoundCompleted) {
        setStudentIds(jobTrack.secondRound || []);
      } else if (jobTrack.firstRoundCompleted) {
        setStudentIds(jobTrack.firstRound || []);
      } else if (jobTrack.resumeRoundCompleted) {
        setStudentIds(jobTrack.resumeSelect || []);
      } else {
        setStudentIds(jobTrack.jobDetails?.appliedStudent || []);
      }
    } else if (selectedRound && jobTrack.jobDetails) {
      const roundMapping = {
        resumeSelect: jobTrack.jobDetails?.appliedStudent || [],
        firstRound: jobTrack.resumeSelect || [],
        secondRound: jobTrack.firstRound || [],
        thirdRound: jobTrack.secondRound || [],
        fourthRound: jobTrack.thirdRound || [],
      };
      setStudentIds(roundMapping[selectedRound] || []);
    }

    if (jobTrack.fourthRoundCompleted) {
      setLastCompleteRoundName("Fourth Round");
    } else if (jobTrack.thirdRoundCompleted) {
      setLastCompleteRoundName("Third Round");
    } else if (jobTrack.secondRoundCompleted) {
      setLastCompleteRoundName("Second Round");
    } else if (jobTrack.firstRoundCompleted) {
      setLastCompleteRoundName("First Round");
    } else if (jobTrack.resumeRoundCompleted) {
      setLastCompleteRoundName("Resume Round");
    } else {
      setLastCompleteRoundName("You have not completed any round");
    }
  }, [selectedRound, jobTrack]);

  useEffect(() => {
    if (jobTrack.fourthRoundCompleted) {
      setSelectedRound("finalRound");
    } else if (jobTrack.thirdRoundCompleted) {
      setSelectedRound("fourthRound");
    } else if (jobTrack.secondRoundCompleted) {
      setSelectedRound("thirdRound");
    } else if (jobTrack.firstRoundCompleted) {
      setSelectedRound("secondRound");
    } else if (jobTrack.resumeRoundCompleted) {
      setSelectedRound("firstRound");
    }
  }, [jobTrack]);

  useEffect(() => {
    if (roundCompletionMap[selectedRound]) {
      const completedRoundStudents = jobTrack[selectedRound] || [];
      setCheckboxTrue(completedRoundStudents);

      if (studentIds.length > 0 && checkboxTrue.length > 0) {
        const updatedStudents = studentIds.map((student) => ({
          ...student,
          isSelected: checkboxTrue.includes(student._id),
        }));
        setStudents(updatedStudents);
      } else {
        setStudents([]); // Clear students if no round is completed
      }
    } else {
      setCheckboxTrue([]); // Clear checkboxes if no round is completed
    }
  }, [selectedRound, studentIds]);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (studentIds.length > 0) {
          const response = await axios.post('/api/student/track/details', { studentIds });
          const updatedStudents = response.data.map((student) => ({
            ...student,
            isSelected: checkboxTrue.includes(student._id),
          }));
          setStudents(updatedStudents);
        } else {
          setStudents([]); // Clear students if no round is completed
        }
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };
    fetchStudent();
  }, [studentIds, checkboxTrue]);

  const handleCheckboxChange = (index) => {
    const updatedStudents = [...students];
    updatedStudents[index].isSelected = !updatedStudents[index].isSelected;
    setStudents(updatedStudents);
  };

  const handleSave = async () => {
    const selectedStudentIds = students
      .filter((student) => student.isSelected)
      .map((student) => student._id);

    if (selectedStudentIds.length === 0) {
      const confirmNoSelection = window.confirm(
        'No students are selected. Do you want to proceed with an empty selection?'
      );
      if (!confirmNoSelection) {
        return;
      }
    }

    try {
      const response = await axios.post('/api/track/job/select-student', {
        studentIds: selectedStudentIds,
        roundName: selectedRound,
        jobTrackerId,
      });
      if (response.status === 200) {
        alert('Selection saved successfully.');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error saving selection:', error);
      alert('Failed to save selection.');
    }
    setChange(!change);
  };

  return (
    <div className="app-container">
      <div className="round-info">
        {!jobTrack.finalRoundCompleted && (
          <h3>Last Completed Round: {lastCompleteRoundName}</h3>
        )}
      </div>

      <div className="select-container">
        <label htmlFor="rounds">Select a round:</label>
        <select
          id="rounds"
          value={selectedRound}
          onChange={handleSelectChange}
          disabled={jobTrack.finalRoundCompleted}
        >
          <option value="">-- Select --</option>
          {rounds.map((round) => (
            <option
              key={round.value}
              value={round.value}
              className={getOptionClassName(round.value)}
            >
              {round.label}
            </option>
          ))}
        </select>
        {jobTrack.finalRoundCompleted && (
          <p className="info-message">Final round is completed. Showing selected students.</p>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="student-list">
        <h3>Student List</h3>
        {students.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Student Code</th>
                <th>Stream</th>
                {!jobTrack.finalRoundCompleted && <th>Select</th>}
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student._id}>
                  <td>{student.studentName}</td>
                  <td>{student.studentCode}</td>
                  <td>{student.studentStream}</td>
                  {!jobTrack.finalRoundCompleted && (
                    <td className="checkbox">
                      <input
                        type="checkbox"
                        checked={student.isSelected}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No students available for the selected round.</p>
        )}
        {students.length > 0 && !jobTrack.finalRoundCompleted && (
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default SelectRound;
