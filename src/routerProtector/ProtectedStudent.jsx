import { Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const ProtectedRouteStudent = ({ children, redirectPath = '/student-login' }) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    return <Navigate to={redirectPath} />;
  }

  try {
    const decodedToken = jwt_decode(token);
    if (decodedToken.role !== 'student') {
      return <Navigate to={redirectPath} />;
    }
  } catch (error) {
    console.error('Invalid Token:', error);
    return <Navigate to={redirectPath} />;
  }

  return children;
};

export default ProtectedRouteStudent;
