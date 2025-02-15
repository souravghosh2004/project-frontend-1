import StudentNavbar from '../navbar/StudentNavbar'
import { Outlet } from 'react-router-dom'
import React from 'react'
import './StudentLayout.css'
export const StudentLayout = () => {
  return (
    <div>
      <div className="student-navbar-sourav">
        <StudentNavbar/>
      </div>
       <div className="student-layout">
        <Outlet/>
       </div>
      
        
    </div>
  )
}
export default StudentLayout;
