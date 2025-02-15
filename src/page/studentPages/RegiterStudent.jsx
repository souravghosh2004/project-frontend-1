import { useState } from "react";
import "./RegisterStudent.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentRegister = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    studentName: "",
    studentMail: "",
    studentCode: "",
    contactNumber: "",
    studentStream: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const onSwitch = () => {
    navigate("/student-login");
  };

  const validateContactNumber = (number) => /^[0-9]{10}$/.test(number);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (details.password !== details.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
  
    if (!validateContactNumber(details.contactNumber)) {
      setError("Contact number must be a 10-digit number.");
      return;
    }
  
    if (!details.studentStream || details.studentStream === "Select Stream") {
      setError("Please select a valid stream.");
      return;
    }
  
    try {
      setLoading(true);
      // Send OTP first
      const response = await axios.post("/api/mail/send-otp", {
        email: details.studentMail.toLowerCase(),
      });
  
      if (response.status === 200) {
        alert("OTP sent to your email. Please verify.");
        navigate("/student/verify-otp", { state: { details } }); // Pass details to the OTP page
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "An error occurred during registration. Please try again.";
      setError(message);
      console.error("OTP Error:", err);
    } finally {
      setLoading(false);
    }
  };
  

  const streams = ["Select Stream", "BCA", "MCA", "MBA", "BBA", "AI&ML"];

  return (
    <div className="main-register-student">
      <div className="register-container">
        <h1>Student Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="studentName">
              Name:<span className="star">*</span>
            </label>
            <input
              type="text"
              id="studentName"
              value={details.studentName}
              onChange={(e) =>
                setDetails({ ...details, studentName: e.target.value })
              }
              placeholder="Enter Your Full Name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="studentCode">
              Student Code:<span className="star">*</span>
            </label>
            <input
              type="text"
              id="studentCode"
              value={details.studentCode}
              onChange={(e) =>
                setDetails({ ...details, studentCode: e.target.value })
              }
              placeholder="Enter Your Student Code"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contactNumber">
              Contact Number:<span className="star">*</span>
            </label>
            <input
              type="text"
              id="contactNumber"
              value={details.contactNumber}
              onChange={(e) =>
                setDetails({ ...details, contactNumber: e.target.value })
              }
              placeholder="Enter Your Contact Number"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="studentStream">
              Stream:<span className="star">*</span>
            </label>
            <select
              id="studentStream"
              value={details.studentStream}
              onChange={(e) =>
                setDetails({ ...details, studentStream: e.target.value })
              }
              required
            >
              {streams.map((stream, index) => (
                <option key={index} value={stream}>
                  {stream}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="studentMail">
              Email:<span className="star">*</span>
            </label>
            <input
              type="email"
              id="studentMail"
              value={details.studentMail}
              onChange={(e) =>
                setDetails({ ...details, studentMail: e.target.value })
              }
              placeholder="Enter Your University Email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              Password:<span className="star">*</span>
            </label>
            <input
              type="password"
              id="password"
              value={details.password}
              onChange={(e) =>
                setDetails({ ...details, password: e.target.value })
              }
              placeholder="Enter Your Password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password:<span className="star">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={details.confirmPassword}
              onChange={(e) =>
                setDetails({ ...details, confirmPassword: e.target.value })
              }
              placeholder="Confirm Password"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
        <p id="p-id">
          Already have an account?{" "}
          <button className="link-btn" onClick={onSwitch}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default StudentRegister;
