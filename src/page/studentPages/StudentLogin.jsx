import { useState } from "react";
import "./StudentLogin.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentLogin = () => {
  const [studentMail, setStudentMail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [error, setError] = useState(null); // Track login errors
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state before making a request
    if(!studentMail){
      setError("Please enter your email");
    }
    else if(!studentPassword){
      setError("Please enter your password");
    }

    try {
      const response = await axios.post("project-backend-orpin.vercel.app/api/student/login", {
        studentMail,
        studentPassword,
      })
      
     
      if (response.data.token) {      
        if (response.data.role === "student") {
          localStorage.setItem("authToken", response.data.token);
          navigate("/student-dashboard");
        } else {
          setError("Access denied. You are not a student.");
        }
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      const message =
        err.response?.data?.error || "An error occurred during login.";
      setError(message);
    }
  };

  const onSwitch = () => {
    navigate("/student-register");
  };

  const studentForgetPassord = async () => {  
    if(!studentMail){
      setError("Please enter your email");
      return;
    }
    

    try {
      const response = await axios.post("/api/mail/forgot-password-otp", {
        email: studentMail.toLowerCase(),
      });

  
      if (response.status === 200) {
        alert("OTP sent to your email. Please verify.");
        navigate("/student/forgot-password", { state: { studentMail } }); // Pass details to the OTP page
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to send OTP. Please try again.";
      setError(message);
      console.error("OTP Error:", err);
    }


  }

  return (
    <div className="main-student">
      <div className="login-container">
        <h1>Student Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="studentMail">Email:</label>
            <input
              type="email"
              id="studentMail"
              value={studentMail}
              placeholder="Enter Your University Email"
              onChange={(e) => setStudentMail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="studentPassword">Password:</label>
            <input
              type="password"
              id="studentPassword"
              value={studentPassword}
              placeholder="Enter Your Password"
              onChange={(e) => setStudentPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn">
            Login
          </button>
          <p id="f-password" onClick={studentForgetPassord}>Forgot password?</p>
          <div className="error-message"> 
            {error && <p >{error}</p>} {/* Display errors */}
          </div>
        </form>
        <p>
          New here?{" "}
          <button className="link-btn" onClick={onSwitch}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;
