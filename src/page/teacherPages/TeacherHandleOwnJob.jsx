import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./TeacherHandleOwnJob.css";

const TeacherHandleOwnJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [job, setJob] = useState(null);
 // const [error, setError] = useState(null); // For general error messages
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showCredentialsPopup, setShowCredentialsPopup] = useState(false);
  const [jobUsername, setJobUsername] = useState("");
  const [jobPassword, setJobPassword] = useState("");
  const [usernameError, setUsernameError] = useState(""); // For username validation error
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple form submissions
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Fetch job details when the component mounts
  useEffect(() => {
    axios
      .get(`/api/job/onejob/${id}`)
      .then((response) => {
        setJob(response.data);
      })
      .catch((error) => {
        console.error("Error fetching job:", error);
        setError("Failed to load job details.");
      });
  }, [id]);

  const handleCreateCredentialsClick = () => {
    setShowCredentialsPopup(true);
  };

  // Real-time username validation
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setJobUsername(value);

    const usernameRegex = /^[a-zA-Z0-9_]{5,}$/; // Letters, numbers, and underscores only
    if (!usernameRegex.test(value)) {
      setUsernameError("Username can only contain letters, numbers, and underscores.");
    } else {
      setUsernameError(""); // Clear error if valid
    }
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
  
    // Validate if the username is correct and not empty
    if (usernameError || jobUsername.trim() === "") {
      alert("Please fix the username error before submitting.");
      return;
    }
  
    // Prevent multiple submissions while processing
    if (isSubmitting) return;
  
    setIsSubmitting(true);
    setError(null); // Clear previous errors before new request
  
    try {
      const response = await axios.post(`/api/track/job/create-job-tracker`, {
        jobId: jobUsername,
        jobDetails: id,
        password: jobPassword,
      });
  
      if (response.status === 201) {
        // Successful job tracker creation
        setShowCredentialsPopup(false);
        setJobUsername("");
        setJobPassword("");
        alert("Job tracker created successfully");
      }
    } catch (err) {
      // Handle error if the request fails
      const message =
        err.response?.data?.message ||
        "An error occurred during registration. Please try again.";
        console.log(message);
       // setError(message);
     setApiError(message);
    } finally {
      setIsSubmitting(false); // Reset submission state
    }
  };
  

  const cancelCredentials = () => {
    setShowCredentialsPopup(false);
    setError(null); // Clear error when cancelling
  };

  const handleShowStudent = () => {
    navigate(`/teacher-dashboard/teacher-show-applied-student/${id}`);
  };

  const handleDeleteClick = () => {
    setShowDeletePopup(true);
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
  };

  const confirmDelete = () => {
    axios
      .delete(`/api/job/delete-a-job/${id}`)
      .then((response) => {
        if (response.status === 200) {
          alert("Job deleted successfully");
          setShowDeletePopup(false);
          navigate("/teacher-dashboard/my-job");
        } else {
          alert("Failed to delete job");
        }
      })
      .catch((error) => {
        console.error("Error deleting job:", error);
        alert("An error occurred while deleting the job");
      });
  };

  // Loading and error UI
  if (!job) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
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
            <strong>Eligible:</strong> {job.eligibility.join(", ")}
          </p>
          <p className="job-details-oneByone">
            <strong>Required Skills:</strong> {job.skills || "Not specified"}
          </p>
        </div>

        <div>
          <button className="btn btn-primary" onClick={handleShowStudent}>
            Show Students
          </button>
          <button className="btn btn-primary" onClick={handleDeleteClick}>
            Delete
          </button>
          <button className="btn btn-primary" onClick={handleCreateCredentialsClick}>
            Create Job Username and Password
          </button>
        </div>
      </div>

      <div className="student-show-one-job-details-right-box">
        <div className="job-descp-stud-show">
          <h1>Job Description</h1>
          <p className="job-descp-details">{job.description || "No description provided."}</p>
        </div>
      </div>

      {/* Delete Job Popup */}
      {showDeletePopup && (
        <div className="popup">
          <p>Are you sure you want to delete this job?</p>
          <button onClick={confirmDelete} style={{ marginRight: "10px" }}>
            Yes
          </button>
          <button onClick={cancelDelete}>No</button>
        </div>
      )}

      {/* Create Credentials Popup */}
      {showCredentialsPopup && (
        <div className="popup">
          <h2>Create Job Credentials</h2>
          <form onSubmit={handleCredentialsSubmit}>
            <div>
              <label>Username:</label>
              <input
                type="text"
                value={jobUsername}
                onChange={handleUsernameChange}
                required
              />
              {usernameError && <p className="error-message" style={{ color: "red" }}>{usernameError}</p>}
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={jobPassword}
                onChange={(e) => setJobPassword(e.target.value)}
                required
              />
            </div>
            {apiError && (<p className="error-message" style={{ color: "red" }}>{apiError}</p>)}
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button type="button" onClick={cancelCredentials} style={{ marginLeft: "10px" }}>
              Cancel
            </button>

            {/* {error && <p className="error-message" style={{ color: "red" }}>{error}</p>} */}
          </form>
        </div>
      )}
    </div>
  );
};

export default TeacherHandleOwnJob;
