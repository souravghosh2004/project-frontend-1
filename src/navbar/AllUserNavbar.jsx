import React from 'react'
import { NavLink } from 'react-router-dom'
import './AllUserNavbar.css'
const AlluserNavbar = () => {
    return (
        <div className='main-navbar'>
            <div className="nav-container">
                <nav className="navbar-all">
                    <ul className="nav-list">
                        <li>
                            <div className="logo">
                                <img
                                    src="https://brainwareuniversity.in/pluginfile.php/1/theme_academi/logo/1725170595/bwu%20logo1.jpg"
                                    alt="brainware-university-logo"
                                /> 
                                <p>Placement Cell, Brainware University</p>
                            </div>
                        </li>
                        <li>
                            <div className="nav-links">
                                <NavLink to="/" className={({isActive})=>(isActive ? "active":"")}> Home </NavLink>
                                <NavLink to="/overview" className={({isActive})=>(isActive ? "active":"")}> Overview </NavLink>
                             
                                <NavLink to="/placement-report" className={({isActive})=>(isActive ? "active":"")}> Report</NavLink>
                                <NavLink to="/contact" className={({isActive})=>(isActive ? "active":"")}> Contact Us </NavLink>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default AlluserNavbar; 