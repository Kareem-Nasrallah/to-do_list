import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeUser } from "../redux/userSlice";

const AlreadyLoggedIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4 text-primary">
        🚀 You are already logged in
      </h1>
      <p className="text-gray-600 mb-6 dark:text-slate-300">
        You’re already signed in. Would you like to go back home or log out?
      </p>
      <div className="flex gap-4">
        <button
          className="btn btn-primary"
          onClick={() => {
            navigate("/", { replace: true });
          }}
        >
          Go to Home
        </button>
        <button
          className="w-24 btn bg-rose-600 text-gray-100 hover:bg-red-400"
          onClick={() => {
            dispatch(removeUser());
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AlreadyLoggedIn;
