import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeUser } from "../../redux/userSlice";
import users from "../../../data/users.json";
import { useFormik } from "formik";
import loginSchema from "../../Schemas/loginSchema";
import bcrypt from "bcryptjs";

// form input type
interface formType {
  email: string;
  password: string;
}

const LogInForm = () => {
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isUser, setIsUser] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik<formType>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,

    // Handle form submission
    onSubmit: (values: formType) => {
      // Search for matching user
      const foundUser = users.users.find(
        (user: { email: string; password: string; name: string }) =>
          user.email === values.email && user.password === values.password
      );

      const registeredUsersKey = localStorage.getItem("registeredUsers");
      const registeredUsers = registeredUsersKey
        ? JSON.parse(registeredUsersKey)
        : null;

      if (foundUser) {
        // Reset states and clear form
        setIsUser(false);

        // Update Redux state
        dispatch(
          changeUser({
            email: foundUser.email,
            name: foundUser.name,
            rememberMe: rememberMe,
          })
        );

        // Navigate to home
        navigate("/", { replace: true });
      } else if (Array.isArray(registeredUsers)) {
        const foundRegisteredUser: {
          email: string;
          password: string;
          name: string;
        } = registeredUsers.find(
          (user: { email: string; password: string; name: string }) =>
            user.email === values.email
        );
        if (foundRegisteredUser != undefined) {
          bcrypt.compare(
            values.password,
            foundRegisteredUser.password,
            (_, result) => {
              if (result) {
                // Reset states and clear form
                setIsUser(false);

                // Update Redux state
                dispatch(
                  changeUser({
                    email: foundRegisteredUser.email,
                    name: foundRegisteredUser.name,
                    rememberMe: rememberMe,
                  })
                );

                // Navigate to home
                navigate("/", { replace: true });
              } else {
                setIsUser(true);
              }
            }
          );
        } else {
          setIsUser(true);
        }
      }
    },
  });

  return (
    <form
      className="w-full mb-4 p-4 text-primary border border-primary backdrop-blur-xl md:w-1/2 "
      onSubmit={formik.handleSubmit}
    >
      {/* Email Field */}
      <label
        className={`floating-label mt-4 ${
          formik.touched.email && formik.errors.email
            ? "text-error"
            : "text-primary "
        }`}
      >
        <span>Your Email</span>
        <input
          id="email"
          type="email"
          placeholder="Your Email"
          className={`text-info-content input input-md w-full input-primary ${
            formik.touched.email && formik.errors.email
              ? "border-error focus:border-error"
              : "border-indigo-300 focus:border-primary"
          }`}
          {...formik.getFieldProps("email")}
        />
      </label>

      {formik.errors.email && formik.touched.email && (
        <p className="text-error mt-1 text-sm">{formik.errors.email}</p>
      )}

      {/* Password Field */}
      <label
        className={`floating-label mt-6 ${
          formik.touched.password && formik.errors.password
            ? "text-error"
            : "text-primary"
        }`}
      >
        <span>Your Password</span>
        <input
          id="password"
          type="password"
          placeholder="Your Password"
          className={`text-info-content input-primary input input-md w-full ${
            formik.touched.password && formik.errors.password
              ? "border-error focus:outline-primary"
              : "border-indigo-300 focus:border-primary"
          }`}
          {...formik.getFieldProps("password")}
        />
      </label>

      {formik.errors.password && formik.touched.password && (
        <p className="text-error mt-1 text-sm ">{formik.errors.password}</p>
      )}

      {/* Error Message */}
      {isUser && (
        <p className="text-error w-full text-center mt-6">
          Incorrect email or password
        </p>
      )}

      {/* Remember Me Checkbox */}
      <label className="fieldset-label w-fit my-4 text-gray-500">
        <input
          type="checkbox"
          className="checkbox checkbox-primary"
          checked={rememberMe}
          onChange={() => setRememberMe(!rememberMe)}
        />
        Remember me
      </label>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button type="submit" className="btn btn-primary w-full max-w-2xs">
          Login
        </button>
      </div>

      {/* Register Link */}
      <p
        className="underline text-blue-600 hover:text-blue-500 h-1 w-fit ms-auto cursor-pointer my-4"
        onClick={() => navigate("/register")}
      >
        Or creat a new Account
      </p>
    </form>
  );
};

export default LogInForm;
