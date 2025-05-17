import { NavLink, useNavigate } from "react-router";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import "./LoginAndRegister.css";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import registeredLottie from "../assets/success.lottie";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/solid";
const Register = () => {
  const navigate = useNavigate();
  const [registered, setRegistered] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(false);
  const [passwordOrTextType, setPasswordOrTextType] = useState("text");
  const [confirmPasswordOrTextType, setConfirmPasswordOrTextType] =
    useState("text");

  const [confirmPasswordHidden, setConfirmPasswordHidden] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (passwordHidden) {
      setPasswordOrTextType("password");
    } else {
      setPasswordOrTextType("text");
    }
  }, [passwordHidden]);

  useEffect(() => {
    if (confirmPasswordHidden) {
      setConfirmPasswordOrTextType("password");
    } else {
      setConfirmPasswordOrTextType("text");
    }
  }, [confirmPasswordHidden]);

  const togglePasswordEye = () => {
    setPasswordHidden(!passwordHidden);
  };

  const toggleConfirmPasswordEye = () => {
    setConfirmPasswordHidden(!confirmPasswordHidden);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const changedUsername = e.target.value;
    setUsername(changedUsername);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const changedEmail = e.target.value;
    setEmail(changedEmail);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const changedPassword = e.target.value;
    setPassword(changedPassword);
  };
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const changedConfirmPassword = e.target.value;
    setConfirmPassword(changedConfirmPassword);
  };

  interface RegisterReponse {
    success: boolean;
    message: string;
  }

  const submitRegister = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setError("");
    setUsernameError("");
    setEmailError("");
    setPasswordError("");

    const userToRegister = {
      username,
      email,
      password,
      confirm_password: confirmPassword,
    };

    await axios
      .post<RegisterReponse>(
        import.meta.env.VITE_BASE_URL + "/api/auth/register",
        userToRegister,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.success) {
          setRegistered(true);
          setUsername("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data.invalidField === "username") {
          setUsernameError(err.response.data.message);
        } else if (err.response?.data.invalidField === "email") {
          console.log("email error");
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
          setError(err.response?.data.message);
        }
      });
  };

  useEffect(() => {
    console.log(error);
  }, [error]);

  const ShowPasswordEye = () => {
    if (!passwordHidden) {
      return (
        <EyeIcon
          onClick={togglePasswordEye}
          className="size-5 cursor-pointer text-ms-dark absolute right-0 me-2 bottom-[17.5px] translate-y-[50%]"
        />
      );
    } else {
      return (
        <EyeSlashIcon
          onClick={togglePasswordEye}
          className="size-5 cursor-pointer text-ms-dark absolute right-0 me-2 bottom-[17.5px] translate-y-[50%]"
        />
      );
    }
  };

  const ShowConfirmPasswordEye = () => {
    if (!confirmPasswordHidden) {
      return (
        <EyeIcon
          onClick={toggleConfirmPasswordEye}
          className="size-5 cursor-pointer text-ms-dark absolute right-0 me-2 bottom-[17.5px] translate-y-[50%]"
        />
      );
    } else {
      return (
        <EyeSlashIcon
          onClick={toggleConfirmPasswordEye}
          className="size-5 cursor-pointer text-ms-dark absolute right-0 me-2 bottom-[17.5px] translate-y-[50%]"
        />
      );
    }
  };

  return (
    <section className="register h-screen w-full flex">
      <div className="register-panel h-full w-4/6  hidden lg:block">
        <div className="layover absolute left-0 right-0 bottom-0 top-0"></div>
      </div>
      <div className="register-form relative grid place-items-center h-full flex-grow bg-ms-darker">
        <NavLink to={"/"} className="max-w-[120px] absolute left-0 top-0 m-3">
          <img src={logo} alt="chat app logo" />
        </NavLink>
        <div className="flex flex-col w-xs text-ms-almost-white  ">
          <h2 className="heading ps-4 pb-4 ms-2 xxs:ms-0">Register</h2>
          <form
            onSubmit={submitRegister}
            action=""
            className="bg-ms-dark p-4 rounded-2xl mx-4 xxs:mx-0 "
          >
            <div className=" flex flex-col py-3">
              <label htmlFor="username" className="pb-2 font-light">
                Username
              </label>
              <input
                onChange={handleUsernameChange}
                className={`bg-ms-almost-white h-[35px] ${
                  error || usernameError ? "border border-red-400" : ""
                } p-2 focus:outline-none  rounded-xl text-ms-dark`}
                type="username"
                name="username"
                id="username"
                value={username}
                required
              />
              <span className="text-red-500 text-sm h-[20px]">
                {usernameError}
              </span>
            </div>

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
                required
              />
              <span className="text-red-500 text-sm h-[20px]">
                {emailError}
              </span>
            </div>
            <div className="flex flex-col ">
              <div className="password-input  relative my-3 w-full ">
                <label htmlFor="password" className=" font-light">
                  Password
                </label>
                <input
                  onChange={handlePasswordChange}
                  value={password}
                  className={`w-full mt-2 h-[35px] ${
                    passwordOrTextType === "password" ? "font-extrabold" : ""
                  }  ${
                    error || passwordError ? "border border-red-400" : ""
                  }  bg-ms-almost-white p-1.5 focus:outline-none rounded-xl text-ms-dark`}
                  type={passwordOrTextType}
                  name="password"
                  id="password"
                  required
                />

                <ShowPasswordEye />
              </div>

              <div className="confirm-password  relative my-3 w-full ">
                <label htmlFor="confirm-password" className=" font-light">
                  Confirm Password
                </label>
                <input
                  onChange={handleConfirmPasswordChange}
                  value={confirmPassword}
                  className={`w-full mt-2  h-[35px] ${
                    confirmPasswordOrTextType === "password"
                      ? "font-extrabold"
                      : ""
                  } ${
                    error || passwordError ? "border border-red-400" : ""
                  }  bg-ms-almost-white p-1.5 focus:outline-none rounded-xl text-ms-dark`}
                  type={confirmPasswordOrTextType}
                  name="confirm-password"
                  id="confirm-password"
                  required
                />

                <ShowConfirmPasswordEye />
              </div>
              <span className="text-red-500  col-span-2  text-sm min-h-[20px]">
                {error.trim() !== ""
                  ? error
                  : passwordError.trim() !== ""
                  ? passwordError
                  : ""}
              </span>
            </div>

            <button
              type="submit"
              id="submit"
              className="px-6 w-full py-3 cursor-pointer mt-10 text-center font-medium bg-ms-secondary rounded-xl"
            >
              Sign up
            </button>
          </form>
          <span className="font-light mt-3 ps-4 ms-2 xxs:ms-0">
            Already have an account?{" "}
            <NavLink className="text-ms-secondary font-medium" to={"/login"}>
              Sign in
            </NavLink>
          </span>
        </div>
      </div>
      <div className="registered">
        <div
          className={`registered-popup z-10 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] p-4 rounded-2xl text-ms-almost-white fixed w-sm bg-ms-dark ${
            registered ? "show" : ""
          }`}
        >
          <XMarkIcon
            onClick={() => setRegistered(false)}
            className="size-6 absolute top-[12px] right-[12px] cursor-pointer"
          />
          <DotLottieReact src={registeredLottie} loop autoplay speed={0.75} />
          <span className="block p-2 text-center">
            Account registered successfully
          </span>
        </div>
        <div
          className={`layover z-9 fixed top-0 left-0 right-0 bottom-0 ${
            registered ? "block" : "hidden"
          }`}
        ></div>
      </div>
    </section>
  );
};
export default Register;
