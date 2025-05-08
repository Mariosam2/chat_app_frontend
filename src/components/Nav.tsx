import { NavLink } from "react-router";
import logo from "../assets/logo.png";

const Nav = () => {
  return (
    <nav className="container absolute top-0 z-10 left-1/2 translate-x-[-50%] flex items-center   p-4">
      <div id="logo" className="p-2 max-w-[120px]">
        <img className="max-w-full" src={logo} alt="chat app logo" />
      </div>
      <div className="navlinks ms-auto font-light text-ms-almost-white ">
        <NavLink to={"/login"} className="sign-in p-2 px-4">
          Sign in
        </NavLink>
        <NavLink to={"/register"} className="signup px-4">
          Sign up
        </NavLink>
      </div>
    </nav>
  );
};

export default Nav;
