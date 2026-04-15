import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed
  if (allowedRoles && !allowedRoles.includes(role?.toUpperCase())) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;


