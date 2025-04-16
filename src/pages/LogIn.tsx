import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { changeUser } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface formType {
  email: string;
  password: string;
}

const LogIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.userEmail);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const [isUser, setIsUser] = useState<boolean>(false);
  const [validate, setValidat] = useState<boolean>(false);
  const [form, setForm] = useState<formType>({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const formSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.email != "" && form.password.length > 7) {
      const foundUser = users.users.find(
        (user) => user.email === form.email && user.password === form.password
      );

      if (foundUser) {
        setValidat(false);
        setIsUser(false);

        setForm({
          email: "",
          password: "",
        });
        navigate("/", { replace: true });

        dispatch(changeUser({ email: foundUser.email, name: foundUser.name }));

        if (rememberMe) {
          localStorage.setItem("userEmail", foundUser.email);
          localStorage.setItem("userName", foundUser.name);
        } else {
          sessionStorage.setItem("userEmail", foundUser.email);
          sessionStorage.setItem("userName", foundUser.name);
        }
      } else {
        setIsUser(true);
      }
    } else {
      setValidat(true);
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center flex-col dark:text-primary-content bg-primary-content dark:bg-slate-950">
      <form
        className="w-1/2 min-w-xs mb-4 p-4 text-primary border border-primary"
        onSubmit={formSubmit}
      >
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
        <div className="my-6 flex justify-center">
          <button type="submit" className="btn btn-primary w-full max-w-2xs">
            Login
          </button>
        </div>
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
      <p className="w-1/2 min-w-xs mb-16 text-error">
        {isUser && "Incorrect email or password"}
      </p>
    </div>
  );
};

export default LogIn;
