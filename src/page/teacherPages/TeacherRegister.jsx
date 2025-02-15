import React, { useState } from "react";
import './TeacherRegister.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const TeacherRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      axios.post('/api/teacher/register',{
        teacherName:formData.name,
        teacherMail:formData.email,
        teacherDepatment:formData.department,
        teacherPassword: formData.confirmPassword
      })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          alert("Student Registered Successfully");
          console.log(response.data);
          setFormData({
            name: "",
            email: "",
            department: "",
            password: "",
            confirmPassword: "",
          });
          navigate("/teacher-login"); // Redirect after successful registration
        } else {
          setError(`Unexpected response: ${response.status} - ${response.data}`);
        }
      })
      
    } catch (error) {
      setError(error);
    }
    // Log data for testing (Replace with actual API call)
    console.log("Teacher Registration Details:", formData);

  };

  return (
    <div className="teacher-register-main">
      <div className="teacher-register-form-container">
        <h1>Teacher Registration</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              placeholder="Enter Your Full Name "
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              placeholder="Enter Your University Email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="department">Department:</label>
            <input
              type="text"
              id="department"
              value={formData.department}
              placeholder="Enter Your Department Name"
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              placeholder="Enter Your Password"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="text"
              id="confirmPassword"
              placeholder="Re-Enter Your Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />
          </div>
          <button type="submit" className="btn">Register</button>
        </form>
      </div>
    </div>
  );
};

export default TeacherRegister;
