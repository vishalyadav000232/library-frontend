import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");


  if (!token) return <Navigate to="/login" replace />;


  if (allowedRoles && !allowedRoles.includes(role?.toUpperCase())) {
   
    return <Navigate to="/dashboard" replace />; 
  }

 
  return children;
};

export default ProtectedRoute;

