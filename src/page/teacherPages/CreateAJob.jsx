import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./CreateJob.css";
import jwt_decode from 'jwt-decode';
const CreateAJob = () => {
    const[creator,setCreator] = useState('');
    const [error , setError] = useState(null);

    useEffect(() => {
      const token = localStorage.getItem("authToken");
      if (token) {
          try {
              const decodedToken = jwt_decode(token);
              setCreator(decodedToken.id); // Update the creator state
          } catch (error) {
              console.error("Invalid Token:", error);
          }
      }
    }, []);

  useEffect(() => {
      // Log the creator after it updates
      console.log("Updated creator:", creator);
  }, [creator]); // This runs whenever `creator` is updated
  
    const [isOpen, setIsOpen] = useState(false); // Track dropdown open/close state
    const dropdownRef = useRef(null); // Reference for dropdown container
    const [formData, setFormData] = useState({
        companyName: "",
        jobRole: "",
        location: "",
        salary: "",
        skills: "",
        description: "",
        eligibility: [],
        applyLink: "", // New field for application link
    });

    // Toggle dropdown visibility
    const toggleDropdown = () => setIsOpen((prev) => !prev);

    // Handle input change
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    // Handle eligibility checkbox change
    const handleEligibilityChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevData) => {
            const newEligibility = checked
                ? [...prevData.eligibility, value]
                : prevData.eligibility.filter((dept) => dept !== value);
            return {
                ...prevData,
                eligibility: newEligibility,
            };
        });
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Handle form submission with Axios POST
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/job/create",{
              companyName:formData.companyName,
              jobRole:formData.jobRole,
              location:formData.location,
              salary:formData.salary,
              eligibility:formData.eligibility,
              description:formData.description,
              applyLink:formData.applyLink,
              skills:formData.skills,
              creator:creator
            });
            console.log("Response:", response.data);
            alert("Job created successfully!");
        } catch (err) {
            alert(`${err.response?.data?.message}`);
            setError(err.response?.data?.message);
            
        }
    };

    return (
        <div>
            <div className="create-job-main-container">
                <form action="POST" id="job-form" onSubmit={handleSubmit}>
                    <div className="job-full-form">
                        <div className="create-job-left-container">
                            <div className="create-job-desc">Job Details</div>
                            <div className="input-field-box" >
                                <div className="input-field">
                                    <label htmlFor="companyName">Company Name: </label>
                                    <input
                                        type="text"
                                        id="companyName"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                        placeholder="Enter Company Name"
                                        
                                    />
                                </div>

                                <div className="input-field">
                                    <label htmlFor="jobRole">Job Role: </label>
                                    <input
                                        type="text"
                                        id="jobRole"
                                        value={formData.jobRole}
                                        onChange={handleInputChange}
                                        placeholder="Enter Job Role"
                                    />
                                </div>

                                <div className="eligible-outer-box">
                                    <div className="dropdown" ref={dropdownRef}>
                                        <label htmlFor="dropdown-button">Eligibility:</label>
                                        <div
                                            className="dropdown-button"
                                            role="textbox"
                                            aria-label="Editable input"
                                            onClick={toggleDropdown}
                                        >
                                            Select Departments
                                        </div>
                                        {isOpen && (
                                            <div className="dropdown-options">
                                                {["BCA", "MCA", "BBA", "MBA", "BTech", "MTech"].map((dept) => (
                                                    <label key={dept}>
                                                        <input
                                                            type="checkbox"
                                                            value={dept}
                                                            checked={formData.eligibility.includes(dept)}
                                                            onChange={handleEligibilityChange}
                                                        />{" "}
                                                        {dept}
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="selected-dept">
                                        {formData.eligibility.map((dept) => (
                                            <div key={dept} className="dept">
                                                {dept}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="input-field">
                                    <label htmlFor="location">Location: </label>
                                    <input
                                        type="text"
                                        id="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="Enter Location"
                                    />
                                </div>

                                <div className="input-field">
                                    <label htmlFor="salary">Salary: </label>
                                    <input
                                        type="text"
                                        id="salary"
                                        value={formData.salary}
                                        onChange={handleInputChange}
                                        placeholder="Enter Salary"
                                    />
                                </div>

                                <div className="input-field">
                                    <label htmlFor="skills">Required Skills: </label>
                                    <input
                                        type="text"
                                        id="skills"
                                        value={formData.skills}
                                        onChange={handleInputChange}
                                        placeholder="Enter Skills"
                                    />
                                </div>

                                <div className="input-field">
                                    <label htmlFor="LastDate">Last Date: </label>
                                    <input
                                        type="text"
                                        id="LastDate"
                                        value={formData.LastDate}
                                        onChange={handleInputChange}
                                        placeholder="Enter Last date"
                                    />
                                </div>

                                <div className="input-field">
                                    <label htmlFor="applyLink">Apply Link: </label>
                                    <input
                                        type="text"
                                        id="applyLink"
                                        value={formData.applyLink}
                                        onChange={handleInputChange}
                                        placeholder="Enter Apply Link"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="create-job-right-container">
                            <div className="create-job-desc">Job Description</div>
                            <div className="create-job-outer-descp">
                                <div className="input-field-descp">
                                    <textarea
                                        id="description"
                                        placeholder="Write Description"
                                        cols={80}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    ></textarea>
                                </div>
                                <button type="submit" className="addJob">
                                    Submit
                                </button>
                                <div className="error-message"> 
                                    {error && <p >{error}</p>} {/* Display errors */}
                                </div>
                            </div>
                            <p>{creator} aa</p>
                        </div>
                    </div>
                </form>
            </div>
            
        </div>
    );
};

export default CreateAJob;
