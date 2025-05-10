import { NavLink, useNavigate } from "react-router";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import "./Login.css";
import { useEffect, useLayoutEffect, useState } from "react";
import logo from "../assets/logo.png";
import axios from "axios";

import { chatApi } from "../helpers/axiosInterceptor";
import { useDispatch } from "react-redux";
import { authenticate } from "../slices/authSlice";
import { useSelector } from "react-redux";
import type { RootState } from "..";

interface LoginResponse {
  success: boolean;
  token: string;
}

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authenticated } = useSelector((state: RootState) => state.authState);
  const [passwordOrTextType, setPasswordOrTextType] = useState("text");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [email, setEmail] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(false);

  useLayoutEffect(() => {
    if (authenticated) {
      navigate("/dashboard");
    }
  }, []);

  useEffect(() => {
    setPasswordOrTextType(passwordHidden ? "password" : "text");
  }, [passwordHidden]);

  const submitLogin = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setEmailError("");
    //console.log("login");
    //console.log("submit");
    const userToLogIn = {
      email,
      username: null,
      password,
    };
    await axios
      .post<LoginResponse>(
        import.meta.env.VITE_BASE_URL + "/api/auth/login",
        userToLogIn,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.success) {
          //save the token and redirect to dashboard
          chatApi.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.data.token}`;
          dispatch(authenticate(true));
        }
      })
      .catch((err) => {
        if (err.response.data.invalid_field) {
          setEmailError(err.response.data.message);
        } else {
          navigate(
            `/error/${err.response.status}/${err.response.data.message}`
          );
        }
      });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const changedEmail = e.target.value;
    setEmail(changedEmail);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const changedPassword = e.target.value;
    setPassword(changedPassword);
  };

  const toggleEye = () => {
    setPasswordHidden(!passwordHidden);
  };

  const ShowEye = () => {
    if (!passwordHidden) {
      return (
        <EyeIcon
          onClick={toggleEye}
          className="size-5 cursor-pointer text-ms-dark absolute right-0 me-2 top-1/2 translate-y-[-50%]"
        />
      );
    } else {
      return (
        <EyeSlashIcon
          onClick={toggleEye}
          className="size-5 cursor-pointer text-ms-dark absolute right-0 me-2 top-1/2 translate-y-[-50%]"
        />
      );
    }
  };
  return (
    <section className="login h-screen w-full flex">
      <div className="login-panel h-full w-4/6 bg-ms-secondary"></div>
      <div className="login-form relative grid place-items-center h-full flex-grow bg-ms-darker">
        <NavLink to={"/"} className="max-w-[120px] absolute left-0 top-0 m-3">
          <img src={logo} alt="chat app logo" />
        </NavLink>
        <div className="flex flex-col w-xs text-ms-almost-white  ">
          <h2 className="heading ps-4 pb-4">Log in</h2>
          <form
            onSubmit={submitLogin}
            action=""
            className="bg-ms-dark p-4 rounded-2xl"
          >
            <div className=" flex flex-col py-3">
              <label htmlFor="email" className="pb-2 font-light">
                Email address
              </label>
              <input
                onChange={handleEmailChange}
                className="bg-ms-almost-white p-2 focus:outline-none  rounded-xl text-ms-dark"
                type="email"
                required
                name="email"
                id="email"
              />
              <span className="text-red-500 text-sm h-[20px] p-0.5">
                {emailError.length > 0 ? emailError : ""}
              </span>
            </div>
            <div className=" flex flex-col py-3">
              <label htmlFor="password" className="pb-2 font-light">
                Password
              </label>
              <div className="password-input relative">
                <input
                  onChange={handlePasswordChange}
                  value={password}
                  className={`w-full ${
                    passwordOrTextType === "password" ? "font-extrabold" : ""
                  } bg-ms-almost-white p-2 focus:outline-none rounded-xl text-ms-dark`}
                  type={passwordOrTextType}
                  name="password"
                  id="password"
                  required
                />

                <ShowEye />
              </div>
              <span className="text-red-500 text-sm h-[20px] p-0.5">
                password errors to implement
              </span>
            </div>

            <button
              type="submit"
              id="submit"
              className="px-6 w-full py-3 mt-10 text-center font-medium bg-ms-secondary rounded-xl"
            >
              Sign in
            </button>
          </form>
          <span className="font-light mt-3 ps-4">
            Don't have an account?{" "}
            <NavLink className="text-ms-secondary font-medium" to={"/register"}>
              Sign up
            </NavLink>
          </span>
        </div>
      </div>
    </section>
  );
};

export default Login;
