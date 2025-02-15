import React from 'react';
import TeacherNavbar from '../navbar/TeacherNavbar';
import { Outlet } from 'react-router-dom';

const TeacherLayout = () => {
    return (
        <div className="teacher-layout">
            {/* Navbar */}
            <TeacherNavbar />
            
            {/* Nested Routes Content */}
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default TeacherLayout;
