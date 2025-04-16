import { JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../redux/store";

// Redirect to login if user is not authenticated
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();

  const userEmail = useSelector((store: RootState) => store.user.userEmail);

  // User is considered authenticated if userEmail exists
  const isAuthenticated = typeof userEmail === "string" && userEmail.length > 1;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
