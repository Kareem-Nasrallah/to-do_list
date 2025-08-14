import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeUser } from "../../redux/userSlice";
import { useFormik } from "formik";
import registerSchema from "../../Schemas/registerSchema";
import bcrypt from "bcryptjs";
import users from "../../../data/users.json";

// form input type
interface formType {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm = () => {
  const [isAlreadyUser, setIsAlreadyUser] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const usersData = users.users;
  const registeredUsersKey = localStorage.getItem("registeredUsers");
  const registeredUsers: { email: string }[] | null = registeredUsersKey
    ? JSON.parse(registeredUsersKey)
    : null;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik<formType>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,

    // Handle form submission
    onSubmit: (values: formType) => {
      const isUsersData = usersData.some((user) => user.email === values.email);
      const isRegisteredUser = registeredUsers?.some(
        (user) => user.email === values.email
      );
      if (isUsersData || isRegisteredUser) {
        setIsAlreadyUser(true);
      } else {
        // Update Redux state
        dispatch(
          changeUser({
            email: values.email,
            name: values.name,
            rememberMe: rememberMe,
          })
        );
        // Navigate to home
        navigate("/", { replace: true });

        const registeredUsers = localStorage.getItem("registeredUsers");

        const hashPass = bcrypt.hashSync(values.password, 10);

        const allRegisteredUsers = () => {
          if (registeredUsers === null) {
            return [
              {
                email: values.email,
                name: values.name,
                password: hashPass,
              },
            ];
          } else {
            return [
              ...JSON.parse(registeredUsers),
              {
                email: values.email,
                name: values.name,
                password: hashPass,
              },
            ];
          }
        };

        localStorage.setItem(
          "registeredUsers",
          JSON.stringify(allRegisteredUsers())
        );
      }
    },
  });

  return (
    <form
      className="w-full mb-4 p-4 text-primary border border-primary backdrop-blur-xl md:w-1/2 md:min-w-sm"
      onSubmit={formik.handleSubmit}
    >
      <div className="flex gap-4 mt-4 flex-col sm:flex-row">
        <div className="sm:w-1/2">
          {/* Name Field */}
          <label
            className={`floating-label ${
              formik.touched.name && formik.errors.name
                ? "text-error"
                : "text-primary "
            }`}
          >
            <span>Your Name</span>
            <input
              id="name"
              type="text"
              placeholder="Your Name"
              className={`text-info-content input input-md w-full input-primary ${
                formik.touched.name && formik.errors.name
                  ? "border-error focus:border-error"
                  : "border-indigo-300 focus:border-primary"
              }`}
              {...formik.getFieldProps("name")}
            />
          </label>

          {formik.errors.name && formik.touched.name && (
            <p className="text-error mt-1 text-sm">{formik.errors.name}</p>
          )}
        </div>
        <div className="sm:w-1/2">
          {/* Email Field */}
          <label
            className={`floating-label ${
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
                (formik.touched.email && formik.errors.email) || isAlreadyUser
                  ? "border-error focus:border-error"
                  : "border-indigo-300 focus:border-primary"
              }`}
              {...formik.getFieldProps("email")}
            />
          </label>

          {formik.errors.email && formik.touched.email && (
            <p className="text-error mt-1 text-sm">{formik.errors.email}</p>
          )}
          {isAlreadyUser && (
            <p className="text-error mt-1 text-sm">
              this email Already has an Account
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-4 mt-6 flex-col sm:flex-row">
        <div className="sm:w-1/2">
          {/* Password Field */}
          <label
            className={`floating-label ${
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
        </div>
        <div className="sm:w-1/2">
          {/* confirm Password Field */}
          <label
            className={`floating-label ${
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? "text-error"
                : "text-primary "
            }`}
          >
            <span>confirm Your Password</span>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Your Password"
              className={`text-info-content input input-md w-full input-primary ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "border-error focus:border-error"
                  : "border-indigo-300 focus:border-primary"
              }`}
              {...formik.getFieldProps("confirmPassword")}
            />
          </label>

          {formik.errors.confirmPassword && formik.touched.confirmPassword && (
            <p className="text-error mt-1 text-sm">
              {formik.errors.confirmPassword}
            </p>
          )}
        </div>
      </div>

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
          Register
        </button>
      </div>

      {/* Register Button */}
      <p
        className="underline text-blue-600 hover:text-blue-500 h-1 w-fit ms-auto cursor-pointer my-4"
        onClick={() => navigate("/login")}
      >
        You have an Account
      </p>
    </form>
  );
};

export default RegisterForm;
