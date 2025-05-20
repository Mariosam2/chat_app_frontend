import { NavLink, useNavigate } from "react-router";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import "./LoginAndRegister.css";
import { useEffect, useLayoutEffect, useState } from "react";
import logo from "../assets/logo.png";
import axios from "axios";

import { chatApi } from "../helpers/axiosInterceptor";
import { useDispatch } from "react-redux";
import { authenticate, saveAuthUser } from "../slices/authSlice";
import { useSelector } from "react-redux";
import type { RootState } from "..";
import type { User } from "../types";

interface LoginResponse {
  success: boolean;
  token: string;
  authUser: User;
}

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authenticated } = useSelector((state: RootState) => state.authState);
  const [passwordOrTextType, setPasswordOrTextType] = useState("text");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [email, setEmail] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    if (authenticated) {
      navigate("/dashboard");
    }
  }, []);

  useEffect(() => {
    setEmailError("");
    setError("");
  }, [password, email]);

  useEffect(() => {
    setPasswordOrTextType(passwordHidden ? "password" : "text");
  }, [passwordHidden]);

  const submitLogin = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailError("");
    setPasswordError("");
    setError("");
    //console.log("login");
    //console.log("submit");
    const userToLogIn = {
      email,
      password,
    };
    await axios
      .post<LoginResponse>("/api/auth/login", userToLogIn, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          //save the token and redirect to dashboard
          chatApi.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.data.token}`;
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
          dispatch(authenticate(true));
          dispatch(saveAuthUser(res.data.authUser));
        }
      })
      .catch((err) => {
        if (err.response?.data.invalidField === "email") {
          setEmailError(err.response.data.message);
        } else if (err.response?.data.invalidField === "password") {
          setPasswordError(err.response.data.message);
        } else if (err.response?.status === 500) {
          navigate(
            `/error/${err.response.status}/${err.response.data.message}`
          );
        } else if (err?.code === "ERR_NETWORK") {
          navigate(`/error/500/service unavailable`);
        } else {
          setError(err.response.data.message);
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
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
      <div className="login-panel relative h-full w-4/6   hidden lg:block">
        <div className="layover absolute left-0 right-0 bottom-0 top-0"></div>
      </div>
      <div className="login-form relative grid place-items-center h-full flex-grow bg-ms-darker">
        <NavLink to={"/"} className="max-w-[120px] absolute left-0 top-0 m-3">
          <img src={logo} alt="chat app logo" />
        </NavLink>
        <div className="flex flex-col w-xs text-ms-almost-white  ">
          <h2 className="heading ps-4 pb-4 ms-2 xxs:ms-0">Log in</h2>
          <form
            onSubmit={submitLogin}
            action=""
            className="bg-ms-dark p-4 rounded-2xl mx-4 xxs:mx-0 "
          >
            <div className=" flex flex-col py-3">
              <label htmlFor="email" className="pb-2 font-light">
                Email address
              </label>
              <input
                onChange={handleEmailChange}
                className={`bg-ms-almost-white h-[35px] p-2 focus:outline-none ${
                  error || emailError ? "border border-red-400" : ""
                } rounded-xl text-ms-dark`}
                type="email"
                name="email"
                id="email"
                value={email}
              />
              <span className="text-red-500 text-[12px] xs:text-sm h-[20px] p-0.5">
                {emailError}
              </span>
            </div>
            <div className=" flex flex-col pb-3">
              <label htmlFor="password" className="pb-2 font-light">
                Password
              </label>
              <div className="password-input relative">
                <input
                  onChange={handlePasswordChange}
                  value={password}
                  className={`w-full ${
                    passwordOrTextType === "password" ? "font-extrabold" : ""
                  }${
                    error || passwordError ? "border border-red-400" : ""
                  } bg-ms-almost-white h-[35px] p-2 focus:outline-none rounded-xl text-ms-dark`}
                  type={passwordOrTextType}
                  name="password"
                  id="password"
                />

                <ShowEye />
              </div>
              <span className="text-red-500 text-[12px] xs:text h-[20px] p-0.5">
                {error ? error : passwordError ? passwordError : ""}
              </span>
            </div>

            <button
              type="submit"
              id="submit"
              className={`px-6 ${
                isLoading
                  ? "brightness-90 pointer-events-none cursor-not-allowed"
                  : ""
              } w-full cursor-pointer py-3 mt-10 text-center font-medium bg-ms-secondary rounded-xl`}
            >
              Sign in
            </button>
          </form>
          <span className="font-light mt-3 ps-4 ms-2 xxs:ms-0">
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
