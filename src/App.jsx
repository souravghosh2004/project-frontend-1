import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

import Home from './page/allUserPage/Home';
import Overview from './page/allUserPage/Overview';
import PlacementReport from './page/allUserPage/PlacementReport';
import Contact from './page/allUserPage/Contact';
import AllUser from './layOut/AllUser.jsx';
import TeacherLogin from './page/teacherPages/TeacherLogin';
import TeacherRegister from './page/teacherPages/TeacherRegister';
import StudentLogin from './page/studentPages/StudentLogin';
import StudentRegister from './page/studentPages/RegiterStudent';
import AllJobs from './page/studentPages/AllJobs';
import StudentLayout from './layOut/StudentLayout';
import MyJobs from './page/studentPages/MyJobs';
import AppliedJobs from './page/studentPages/AppliedJobs';
import ProtectedRouteStudent from './routerProtector/ProtectedStudent';
import TeacherLayout from './layOut/TeacherLayout';
import AddStudent from './page/teacherPages/AddStudent';
import CreateAJob from './page/teacherPages/CreateAJob';
import CreatedJob from './page/teacherPages/CreatedJob';
import StudentShowOneJob from './page/studentPages/StudentShowOneJob';
import TeacherHandleOwnJob from './page/teacherPages/TeacherHandleOwnJob';
import ProtectedTeacherRouter from './routerProtector/ProtectedTeacherRouter';
import ApplyJob from './page/studentPages/ApplyJob';
import AppliedStudentList from './page/teacherPages/AppliedStudentList';
import SelectRound from './page/dataForPlcaement/SelectRound';
import SearchByStudentID from './page/dataForPlcaement/SearchByStudentID';
import AppliedJobTrack from './page/studentPages/AppliedJobTrack';
import StudentFullProfile from './page/studentPages/StudentFullprofile';
import JobLogin from './page/jobPages/JobLogin';
import PlacedStudents from './page/dataForPlcaement/PlacedStudents';
import StudentVerifyOtp from './page/studentPages/StudentVerifyOtp';
import StudentForgatePassword from './verifyOtp/StudentForgetPassword';
function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        const currentPath = window.location.pathname;
  
        // Handle student redirection
        if (decodedToken.role === 'student' && !currentPath.startsWith('/student-dashboard')) {
          navigate('/student-dashboard');
        }
  
        // Handle teacher redirection
        if (decodedToken.role === 'teacher' && !currentPath.startsWith('/teacher-dashboard')) {
          navigate('/teacher-dashboard');
        }
      } catch (error) {
        console.error('Invalid Token:', error);
        navigate('/'); // Redirect to home if the token is invalid
      }
    }
  }, [navigate]);
  

  return (
    <Routes>
      {/* Root Route */}
      <Route path="/" element={<AllUser />}>
        <Route index element={<Home />} />
        <Route path="overview" element={<Overview />} />
        <Route path="placement-report" element={<PlacementReport />} />
        <Route path="contact" element={<Contact />} />
        <Route path="student-login" element={<StudentLogin />} />
        <Route path="student-register" element={<StudentRegister />} />
        <Route path="teacher-register" element={<TeacherRegister />} />
        <Route path="teacher-login" element={<TeacherLogin />} />
        <Route path="/job-login/select-student/:jobTrackerId" element={<SelectRound />} />
        <Route path="search-by-student-id" element={<SearchByStudentID />} />
        <Route path="job-login" element={<JobLogin/>} />
        <Route path="student/verify-otp" element={<StudentVerifyOtp />} />
        <Route path="student/forgot-password" element={<StudentForgatePassword />} />
      </Route>

      {/* Protected Student Dashboard */}
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRouteStudent>
            <StudentLayout />
          </ProtectedRouteStudent>
        }
      >
        <Route index element={<AllJobs />} />
        <Route path="my-job" element={<MyJobs />} />
        <Route path="applied-jobs" element={<AppliedJobs />} />
        <Route path='show-one-job/:id' element={<StudentShowOneJob/>}/>
        <Route path="apply-job/:id" element={<ApplyJob/>} />
        <Route path="applied-job-track/:id" element={<AppliedJobTrack/>} />
        <Route path="student-full-profile/:studentDetails" element={<StudentFullProfile/>} />
        <Route path="placed-students" element={<PlacedStudents />} />
      </Route>

        <Route path="/teacher-dashboard" 
          element={
            <ProtectedTeacherRouter>
               <TeacherLayout />
            </ProtectedTeacherRouter>
          }
        >
        <Route index element={<AllJobs />} />
        <Route path='show-one-job/:id' element={<StudentShowOneJob/>}/>
        <Route path="my-job" element={<CreatedJob/>} />
        <Route path="create-a-job" element={<CreateAJob/>} />
        {/* Uncomment the route below if needed */}
        <Route path="add-student" element={<AddStudent />} />
        <Route path="teacher-handle-own-job/:id" element={<TeacherHandleOwnJob />} />
        <Route path="teacher-show-applied-student/:jobId" element={<AppliedStudentList />} />
      </Route>

    </Routes>
  );
}

export default App;
