import React, { useState, useEffect } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ForgetPasswordOtp.module.css";

const StudentForgatePassword = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [buttonMessage, setButtonMessage] = useState("Verify");
    const [timer, setTimer] = useState(60); // 1-minute timer for Resend OTP
    const [canResend, setCanResend] = useState(false);
    const [passwordShow, setPasswordShow] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const location = useLocation();
    const { studentMail } = location.state || {}; // Registration details passed from the previous page

    useEffect(()=>{
        if(!studentMail) navigate("/student-login");
    },[])
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

    const handleResendOtp = async () => {
        try {
            if(!studentMail) {
                navigate("/student-login");
                return;
            }
            setCanResend(false);
            setTimer(60); // Reset timer
            setError("");
            setOtp(new Array(6).fill(""));
            // Call API to resend OTP
            const response = await axios.post("/api/mail/forgot-password-otp", {
                email: studentMail.toLowerCase(),
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
       // alert(`Mail : ${studentMail}, OTP: ${enteredOtp}`);

        if (enteredOtp.length !== 6) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }
        if(!studentMail){
            setError("Please enter your email.");
        }
        try {
            setLoading(true);
            setButtonMessage("Verifying...");
            // Verify OTP
            const response = await axios.post("/api/mail/verify-otp", {
                email: studentMail.toLowerCase(),
                otp: enteredOtp,
            });
            if (response.status === 200 || response.status === 201) {
                setButtonMessage("Verified");
                setPasswordShow(true);
                setError("")
            }

        } catch (error) {
            const message = error.response.data.message || "An error occurred.";
            setError(message);
            
        }finally{
            setLoading(false);
            setButtonMessage("Verify");
        }
    };

    const handleSavePassword = async () => {
        if (!password || !confirmPassword) {
            setError("Both password fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        try {
            setLoading(true);
            // Call API to save the new password
            const response = await axios.post("/api/student/forgot-password", {
                studentMail: studentMail.toLowerCase(),
                newPassword: password,
                confirmPassword: confirmPassword
            });

            if (response.status === 200) {
                alert("Password reset successful. You can now log in.");
                navigate("/student-login"); // Redirect to login page
            } else {
                setError("Failed to reset password. Please try again.");
            }
        } catch (err) {
            const message =
                err.response?.data?.message || "An error occurred while saving the password.";
            setError(message);
            console.error("Save Password Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.mainBox}>
            <>
                {passwordShow ? (
                    <div className={styles.passwordForm}>
                        <h1>Reset Password</h1>
                        <div className={styles.formGroup}>
                            <label htmlFor="password">New Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your new password"
                                required
                                style={{ width: "100%" }}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your new password"
                                required
                            />
                        </div>
                        {error && <p className={styles.error}>{error}</p>}
                        <button className={styles.buttonSave} onClick={handleSavePassword} disabled={loading}>
                            {loading ? "Saving..." : "Save Password"}
                        </button>
                    </div>
                ) : (
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
                                    style={{ width: "70px", fontSize: "25px" }}
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
                        {canResend ? (
                            <button className={styles.resendButton} onClick={handleResendOtp}>
                                Resend OTP
                            </button>
                        ) : (
                            <p className={styles.timer}>Resend OTP in {timer} seconds</p>
                        )}
                    </div>
                )}
            </>
        </div>
    );
};

export default StudentForgatePassword;
