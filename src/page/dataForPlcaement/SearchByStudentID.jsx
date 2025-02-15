import React, { useState } from "react";
import axios from "axios";
import "./SearchStudentId.css"; // Updated CSS file

const SearchByStudentID = () => {
  const [studentCode, setStudentID] = useState("");
  const [results, setResults] = useState(null);
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    setStudent(null);
    try {
      const response = await axios.post("/api/track/job/one-student-track", { studentCode:studentCode.toLowerCase() });
      setResults(response.data.result);
      setStudent(response.data.student);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while searching.");
    } finally {
      setLoading(false);
    }
  };

  // Function to convert student details and results to CSV format
  const convertToCSV = () => {
    const studentDetails = [
      ["Student Name :", student?.studentName || "--"],
      ["Email :", student?.studentMail || "--"],
      ["Student Code :", student?.studentCode || "--"],
      ["Stream :", student?.studentStream || "--"],
      ["Contact :", student?.contactNumber || "--"]
    ];

    const headers = [
      "Company Name", "Location", "Job Role", "Salary", "Skills", 
      "Resume Select", "First Round", "Second Round", "Third Round", 
      "Fourth Round", "Final Round"
    ];

    const rows = results.map(result => [
      result.jobDetails.companyName,
      result.jobDetails.location,
      result.jobDetails.jobRole,
      result.jobDetails.salary,
      result.jobDetails.skills,
      result.studentInRounds.resumeRoundCompleted ? (result.studentInRounds.resumeSelect ? "True" : "False") : "--",
      result.studentInRounds.firstRoundCompleted ? (result.studentInRounds.firstRound ? "True" : "False") : "--",
      result.studentInRounds.secondRoundCompleted ? (result.studentInRounds.secondRound ? "True" : "False") : "--",
      result.studentInRounds.thirdRoundCompleted ? (result.studentInRounds.thirdRound ? "True" : "False") : "--",
      result.studentInRounds.fourthRoundCompleted ? (result.studentInRounds.fourthRound ? "True" : "False") : "--",
      result.studentInRounds.finalRoundCompleted ? (result.studentInRounds.finalRound ? "True" : "False") : "--"
    ]);

    // Convert student details and results to CSV
    const csvContent = [
      ...studentDetails.map(row => row.join(",")), // Student details
      "", // Empty row for separation
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    return csvContent;
  };

  // Function to trigger the download of the CSV
  const downloadCSV = () => {
    const csvData = convertToCSV();
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download",student?.studentCode || "student_job_tracker_results.csv");
    link.click();
  };

  return (
    <div className="container">
      <div className="search-box">
        <h1 className="heading">Search by Student ID</h1>
        <div className="input-container">
          <input
            className="input-field"
            type="text"
            placeholder="Enter Student ID"
            value={studentCode}
            onChange={(e) => setStudentID(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>

      {student && (
        <div className="student-details">
          <h2 className="section-heading">Student Details</h2>
          <div className="details-container">
            <p><strong>Name:</strong> {student.studentName.toUpperCase()}</p>
            <p><strong>Email:</strong> {student.studentMail}</p>
            <p><strong>Student Code:</strong> {student.studentCode.toUpperCase()}</p>
            <p><strong>Stream:</strong> {student.studentStream}</p>
            <p><strong>Contact:</strong> {student.contactNumber}</p>
          </div>
        </div>
      )}

      {results && results.length > 0 && (
        <div className="results">
          <h2 className="section-heading">Job Tracker Results</h2>
          <table className="results-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Company Name</th>
                <th>Location</th>
                <th>Job Role</th>
                <th>Salary</th>
                <th>Skills</th>
                <th>Resume Select</th>
                <th>First Round</th>
                <th>Second Round</th>
                <th>Third Round</th>
                <th>Fourth Round</th>
                <th>Final Round</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={result.jobTrackerID}>
                  <td>{index + 1}</td>
                  <td>{result.jobDetails.companyName}</td>
                  <td>{result.jobDetails.location}</td>
                  <td>{result.jobDetails.jobRole}</td>
                  <td>{result.jobDetails.salary}</td>
                  <td>{result.jobDetails.skills}</td>
                  <td>
                    {result.studentInRounds.resumeRoundCompleted
                      ? result.studentInRounds.resumeSelect ? "✔️" : "❌"
                      : "--"
                    }
                  </td>
                  <td>{result.studentInRounds.firstRoundCompleted 
                        ? result.studentInRounds.firstRound ? "✔️" : "❌"
                        : "--"
                      }
                    </td>
                  <td>{result.studentInRounds.secondRoundCompleted 
                        ? result.studentInRounds.secondRound ? "✔️" : "❌"
                        : "--"
                      }
                  </td>
                  <td>{result.studentInRounds.thirdRoundCompleted 
                        ? result.studentInRounds.thirdRound ? "✔️" : "❌"
                        : "--"
                    }
                  </td>
                  <td>{result.studentInRounds.fourthRoundCompleted 
                        ? result.studentInRounds.fourthRound ? "✔️" : "❌"
                        : "--"
                    }
                 </td>
                  <td>{result.studentInRounds.finalRoundCompleted 
                     ? result.studentInRounds.finalRound ? "✔️" : "❌"
                     :"--"                  
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="download-button" onClick={downloadCSV}>Download CSV</button>
        </div>
      )}
    </div>
  );
};

export default SearchByStudentID;
