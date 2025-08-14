import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import LogInForm from "../componentes/forms/LogInForm";
import RegisterForm from "../componentes/forms/RegisterForm";
import Quotes from "../componentes/Quotes";
import AlreadyLoggedIn from "../componentes/AlreadyLoggedIn";
import { useEffect, useState } from "react";

const AuthPage = () => {
  const [isUser, setIsUser] = useState(false);
  const path = location.pathname;

  // Get current user state from Redux store
  const user = useSelector((state: RootState) => state.user.userEmail);

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user) {
      setTimeout(() => setIsUser(true), 1000);
    } else {
      setTimeout(() => setIsUser(false), 1000);
    }
  }, [user]);

  return (
    <div
      className="flex justify-evenly items-center gap-4 flex-col-reverse md:flex-row sm:p-10 px-6 py-4"
      style={{ height: "calc(100vh - 94px - 94px )" }}
    >
      {isUser ? (
        <AlreadyLoggedIn />
      ) : (
        <>
          <Quotes />
          {path === "/login" ? <LogInForm /> : <RegisterForm />}
        </>
      )}
    </div>
  );
};

export default AuthPage;
