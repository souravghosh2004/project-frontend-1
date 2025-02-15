import React, { useState } from "react";
import './TeacherLogin.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
const TeacherLogin = () => {
    const [teacherMail, setEmail] = useState("");
    const [teacherPassword, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post('/api/teacher/login', {
                teacherMail,
                teacherPassword
            });
            if (response.data.token) {
                if (response.data.role == "teacher") {
                    localStorage.setItem('authToken', response.data.token);
                    alert("Login successful!");
                    navigate('/teacher-dashboard');
                } else {
                    setError("Invalid Access , you are not a teacher");
                }
            } else {
                setError("Invalid credentials. Please try again.");
            }

        } catch (error) {
            const message =
                error.response?.data?.message || "An error occurred during login.";
            setError(message);
        }

        // Log data for testing (Replace with actual API call)
        console.log("Teacher Login Details:", { teacherMail, teacherPassword });

        // Reset form fields


    };

    return (
        <div className="teacher-login-main">

            <div className="form-container">
                <h1>Teacher Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="teacherMail"
                            value={teacherMail}
                            placeholder="Enter Your University Email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="teacherPassword"
                            value={teacherPassword}
                            placeholder="Enter Your Password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn">Login</button>
                    <div className="error-message"> {error && <p >{error}</p>} {/* Display errors */}
                    </div>
                </form>

            </div>
        </div>

    );
};

export default TeacherLogin;
