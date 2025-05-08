import { NavLink } from "react-router";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import "./Login.css";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

const Login = () => {
  const [password, setPassword] = useState("");
  const [passwordCopy, setPasswordCopy] = useState(password);
  const [passwordHidden, setPasswordHidden] = useState(false);

  useEffect(() => {
    if (!passwordHidden) {
      setPassword(passwordCopy);
    } else {
      setPassword(
        passwordCopy
          .split("")
          .map(() => "*")
          .join("")
      );
    }
  }, [passwordHidden]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const changedPassword = e.target.value;

    setPasswordCopy(changedPassword);
    if (!passwordHidden) {
      setPassword(changedPassword);
    } else {
      const hiddenPassword = changedPassword
        .split("")
        .map(() => "*")
        .join("");
      setPassword(hiddenPassword);
    }
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
          <form action="" className="bg-ms-dark p-4 rounded-2xl">
            <div className=" flex flex-col py-3">
              <label htmlFor="email" className="pb-2 font-light">
                Email address
              </label>
              <input
                className="bg-ms-almost-white p-2 focus:outline-none  rounded-xl text-ms-dark"
                type="email"
                name="email"
                id="email"
              />
            </div>
            <div className=" flex flex-col py-3">
              <label htmlFor="password" className="pb-2 font-light">
                Password
              </label>
              <div className="password-input relative">
                <input
                  onChange={handlePasswordChange}
                  value={password}
                  className="w-full bg-ms-almost-white p-2 focus:outline-none rounded-xl text-ms-dark"
                  type="text"
                  name="password"
                  id="password"
                />
                <ShowEye />
              </div>
            </div>

            <div
              id="submit"
              className="px-6 py-3 mt-10 text-center font-medium bg-ms-secondary rounded-xl"
            >
              Sign in
            </div>
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
