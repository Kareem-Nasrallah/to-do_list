import { JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../redux/store";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();

  const authenticated = useSelector((store:RootState)=>store.user.userEmail) == '';

  if (authenticated) {
    return <Navigate to="./login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
