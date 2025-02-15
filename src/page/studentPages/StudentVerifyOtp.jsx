import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./StudentVerifyOtp.module.css";

const StudentVerifyOtp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonMessage, setButtonMessage] = useState("Verify");
  const [timer, setTimer] = useState(60); // 1-minute timer for Resend OTP
  const [canResend, setCanResend] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { details } = location.state || {}; // Registration details passed from the previous page

  useEffect(() => {
    // Timer logic
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval); // Cleanup on unmount
    } else {
      setCanResend(true); // Enable Resend OTP
    }
  }, [timer]);
  useEffect(() => {
    const mail = details?.studentMail || '';
    if(!mail){
      navigate("/student-register")
    }
  },[])

  const handleResendOtp = async () => {
    try {
      setCanResend(false);
      setTimer(60); // Reset timer
      setError("");

      // Call API to resend OTP
      const response = await axios.post("/api/mail/send-otp", {
        email: details.studentMail.toLowerCase(),
      });

      if (response.status === 200) {
        alert("OTP has been resent to your email.");
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "An error occurred while resending OTP.";
      setError(message);
      console.error("Resend OTP Error:", err);
    }
  };

  const handleChange = (element, index) => {
    if (!isNaN(element.value) && element.value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = element.value;
      setOtp(newOtp);

      // Automatically focus on the next input
      if (element.nextSibling && element.value) {
        element.nextSibling.focus();
      }
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && otp[index] === "") {
      // Focus on the previous input if it's not the first box
      if (index > 0) {
        const previousInput = event.target.previousSibling;
        if (previousInput) {
          previousInput.focus();
        }
      }
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join(""); // Combine the OTP digits

    if (enteredOtp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setButtonMessage("Verifying...");
      // Verify OTP
      const response = await axios.post("/api/mail/verify-otp", {
        email: details.studentMail.toLowerCase(),
        otp: enteredOtp,
      });

      if (response.status === 200) {
        setButtonMessage("Registering...");
        // Register user after OTP verification
        const registerResponse = await axios.post("/api/student/register", details);

        if (registerResponse.status === 200 || registerResponse.status === 201) {
          alert("Registration Successful!");
          navigate("/student-login"); // Redirect to login page
        } else {
          setError("Failed to complete registration. Please try again.");
        }
      } else {
        setError("Failed to verify OTP. Please try again.");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "An error occurred during verification.";
      setError(message);
      console.error("Verification Error:", err);
    } finally {
      setButtonMessage("Verify");
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Verify OTP</h1>
      <p className={styles.instructions}>Enter the 6-digit OTP sent to your email.</p>
      <div className={styles.otpInputs}>
        {otp.map((value, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={value}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={styles.otpInput}
            style={{width:"70px"}}
          />
        ))}
      </div>
      {error && <p className={styles.error}>{error}</p>}

      <button
        className={styles.button}
        onClick={handleVerifyOtp}
        disabled={loading}
      >
        {buttonMessage}
      </button>

      {/* Resend OTP Section */}
      {canResend ? (
        <button className={styles.resendButton} onClick={handleResendOtp}>
          Resend OTP
        </button>
      ) : (
        <p className={styles.timer}>
          Resend OTP in {timer} seconds
        </p>
      )}
    </div>
  );
};

export default StudentVerifyOtp;
