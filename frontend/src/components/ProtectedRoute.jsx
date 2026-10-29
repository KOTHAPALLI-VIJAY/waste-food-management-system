import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role) {
    if (Array.isArray(role)) {
      if (!role.includes(userRole)) {
        return <Navigate to="/" />;
      }
    } else if (userRole !== role) {
      return <Navigate to="/" />;
    }
  }

  return children;
}

export default ProtectedRoute;