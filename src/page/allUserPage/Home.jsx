import React from 'react'
import './Home.css'
import { useNavigate } from 'react-router-dom'
const Home = () => {
  const navigate = useNavigate();
  function student(){
    navigate('/student-login')
  }

  function loginTeacher(){
    navigate('/teacher-login')
  }

  return (
    <div>
      <main className="main-content">
        <div className="background-section">
          <section className="about-section">
            <div className="info-paragraph">
              <h3 className="main-heading">A One Portal for Placements & Internship</h3>
              <p className="welcome-text">Welcome to the recruitment website for Brainware University.</p>
              <p className="description-text">
                Brainware University is India's foremost industrial leadership development institution. Our graduates
                are a combination of rigorous thinking, hard work, and a fundamental stronghold. They are nurtured by
                the institute to strive for excellence and deliver impact in their field of work. Let us begin...
              </p>
            </div>
            <div className="login-buttons" >
              <button className="login-btn" onClick={student}>
                <i className="fa-solid fa-user" ></i> Student
              </button>
              <button className="login-btn">
                <i className="fa-solid fa-suitcase"></i> Recruiter
              </button>
              <button className="login-btn" onClick={loginTeacher}>
                <i className="fa-solid fa-cube"></i> Coordinator
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>

    
  )
}

export default Home;