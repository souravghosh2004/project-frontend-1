// src/JobLoginPage.js
import React, { useEffect, useState } from 'react';
import styles from './JobLogin.module.css';  // Importing CSS Module
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const JobLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
    useEffect(()=>{
        setError("");
    },[username,password]);
  const handleLogin = async(e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    try {
      setLoading(true);
        const response = await axios.post("/api/track/job//login-job-tracker",{jobId:username,password});
        if (response.status === 201 || 200) {
            const jobTrackerId = response.data._id;
            navigate(`select-student/${jobTrackerId}`);
        }
    } catch (err) {
        const message = err?.response?.data?.message || "Please try letter";
        setError(message);
    }finally{
      setLoading(false);
    }
    
  };
  

  return (
    <div className={styles.jobLoginContainer}>
      <div>
      <h2 className={styles.jobLoginHeader}>Job Login</h2>
      <form onSubmit={handleLogin} className={styles.jobLoginForm}>
        <div className={styles.jobLoginInputGroup}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            placeholder='Enter Job Username'
            id="username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>

        <div className={styles.jobLoginInputGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder='Enter Job Password'
            value={password}
            onChange={handlePasswordChange}
            required
            style={{
                width:'100%'
            }}
          />
        </div>

        {error && <p className={styles.jobLoginErrorMessage}>{error}</p>}

        <button className={styles.jobLoginButton} type="submit">{loading ? "Loging...":"Login"}</button>
      </form>
      </div>
    </div>
  );
};

export default JobLogin;
