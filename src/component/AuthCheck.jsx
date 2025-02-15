// // src/components/TokenCheck.js
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const AuthCheck = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check if token exists in localStorage
//     const token = localStorage.getItem('token');

//     if (token) {
//       // Decode the JWT to extract user data (role in this case)
//       const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the JWT token

//       // Check if the role is 'student'
//       if (decodedToken.role === 'student') {
//         // Navigate to student dashboard
//         navigate('/student/dashboard');
//       }
//     }
//   }, [navigate]);

//   return null; // This component doesn't render anything, it only handles the token check
// };

// export default AuthCheck;
