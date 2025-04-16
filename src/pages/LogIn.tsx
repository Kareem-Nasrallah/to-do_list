import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeUser } from "../redux/userSlice";
import { RootState } from "../redux/store";
import users from "../../data/users.json";

// form input type
interface formType {
  email: string;
  password: string;
}

const LogIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get current user state from Redux store
  const user = useSelector((state: RootState) => state.user.userEmail);

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  // Local state
  const [form, setForm] = useState<formType>({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [validate, setValidat] = useState<boolean>(false);
  const [isUser, setIsUser] = useState<boolean>(false);

  // Handle form submission
  const formSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate inputs
    const isEmailFilled = form.email !== "";
    const isPasswordValid = form.password.length > 7;

    if (isEmailFilled && isPasswordValid) {
      // Search for matching user
      const foundUser = users.users.find(
        (user: { email: string; password: string; name: string }) =>
          user.email === form.email && user.password === form.password
      );

      if (foundUser) {
        // Reset states and clear form
        setValidat(false);
        setIsUser(false);
        setForm({
          email: "",
          password: "",
        });

        // Update Redux state
        dispatch(changeUser({ email: foundUser.email, name: foundUser.name }));

        // Persist user info in local or session storage
        if (rememberMe) {
          localStorage.setItem("userEmail", foundUser.email);
          localStorage.setItem("userName", foundUser.name);
        } else {
          sessionStorage.setItem("userEmail", foundUser.email);
          sessionStorage.setItem("userName", foundUser.name);
        }

        // Navigate to home
        navigate("/", { replace: true });
      } else {
        // No user matched
        setIsUser(true);
      }
    } else {
      // Form is incomplete or password is too short
      setValidat(true);
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center flex-col dark:text-primary-content bg-primary-content dark:bg-slate-950">
      <form
        className="w-1/2 min-w-xs mb-4 p-4 text-primary border border-primary"
        onSubmit={formSubmit}
      >
        {/* Email Field */}
        <label
          className={`floating-label mt-4 ${
            validate && form.email == "" ? "text-error" : "text-primary "
          }`}
        >
          <span>Your Email</span>
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm({ ...form, email: e.target.value })
            }
            value={form.email}
            type="email"
            placeholder="Your Email"
            className={`text-info-content input input-md w-full input-primary ${
              validate && form.email == ""
                ? "border-error focus:border-error"
                : "border-indigo-300 focus:border-primary"
            }`}
          />
        </label>

        {/* Password Field */}
        <label
          className={`floating-label my-6 ${
            validate && form.password.length < 8 ? "text-error" : "text-primary"
          }`}
        >
          <span>Your Password</span>
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm({ ...form, password: e.target.value })
            }
            value={form.password}
            type="password"
            placeholder="Your Password"
            className={`text-info-content input input-md w-full ${
              validate && form.password.length < 8
                ? "border-error focus:outline-primary focus:border-error"
                : "border-indigo-300 focus:outline-primary focus:border-primary"
            }`}
          />
        </label>

        {/* Submit Button */}
        <div className="my-6 flex justify-center">
          <button type="submit" className="btn btn-primary w-full max-w-2xs">
            Login
          </button>
        </div>

        {/* Remember Me Checkbox */}
        <label className="fieldset-label w-fit m-auto dark:text-primary-content">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          Remember me
        </label>
      </form>

      {/* Error Message */}
      <p className="w-1/2 min-w-xs mb-16 text-error">
        {isUser && "Incorrect email or password"}
      </p>
    </div>
  );
};

export default LogIn;
