import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toggleTheme } from "../redux/themeSlice";
import { removeUser } from "../redux/userSlice";
import { RootState } from "../redux/store";
import { useState } from "react";
import { MdOutlineWbSunny } from "react-icons/md";
import { IoMoonOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";

const Header = () => {
  const dispatch = useDispatch();

  // Get current theme mode from Redux store
  const theme = useSelector((state: RootState) => state.theme.mode);
  const themeCheck = theme === "light";

  // Get user info from Redux store
  const { userName, userEmail } = useSelector((state: RootState) => state.user);

  // Toggle sign-out button visibility
  const [apeareSignout, setApeareSignout] = useState(false);

  return (
    <header className="px-6 py-2 flex justify-between items-center bg-indigo-200 dark:bg-slate-900 rounded-t-2xl h-16">
      {/* Logo/Title */}
      <Link
        to="./"
        className="text-shadow-lg dark:text-shadow-indigo-900 first-letter:text-primary dark:first-letter:text-indigo-500"
      >
        <h1 className="text-2xl font-bold text-indigo-950 dark:text-gray-100">
          Task
          <span className="text-primary dark:text-indigo-500">F</span>low
        </h1>
      </Link>

      <div className="flex">
        {/* Theme Toggle (light/dark) */}
        <label className="swap swap-rotate hover:scale-105 mx-4">
          <input
            type="checkbox"
            checked={themeCheck}
            onChange={() => dispatch(toggleTheme())}
          />

          {/* Light Icon */}
          <MdOutlineWbSunny className="swap-off h-8 w-8 fill-current" />

          {/* Dark Icon */}
          <IoMoonOutline className="swap-on h-8 w-8 fill-current" />
        </label>

        {/* User Info + Sign Out Button */}
        {userEmail && (
          <div className="relative">
            <FaUserCircle
              className="text-3xl text-indigo-950 dark:text-gray-100 cursor-pointer scale-95 shadow-md hover:scale-100 hover:shadow-lg rounded-full"
              onClick={() => setApeareSignout(!apeareSignout)}
            />
            <div
              className={`w-60 text-indigo-950 bg-gray-300 rounded border-2 border-indigo-300 p-1.5 transition-all z-20 -right-6 top-10 ${
                apeareSignout ? "absolute" : "hidden"
              }`}
            >
              <h3 className="text-sm whitespace-nowrap mb-2">{userName}</h3>
              <p className="text-sm border-y-2 border-zinc-400 py-2">
                {userEmail}
              </p>
              <p
                className="text-sm m-auto text-rose-600 hover:text-red-400 whitespace-nowrap cursor-pointer mt-2"
                onClick={() => {
                  dispatch(removeUser());
                }}
              >
                <LuLogOut className="inline" /> Log out
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
