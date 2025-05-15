import { NavLink } from "react-router";
import { useParams } from "react-router";
import "./Error.css";
import Nav from "./Nav";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clickResult } from "../slices/searchSlice";
import errorGIF from "../assets/error.gif";
const Error = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const statusCode = params.statuscode;
  const message = params.message;
  useEffect(() => {
    dispatch(clickResult(null));
  });

  const ShowStatusCode = () => {
    if (statusCode) {
      return <div className="status-code">{statusCode}</div>;
    }
    return <img className="w-[200px] h-auto mx-auto" src={errorGIF} alt="" />;
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen w-full bg-ms-darker text-ms-almost-white grid place-items-center">
        <div className="error max-w-lg text-center ">
          <ShowStatusCode />
          <div className="message text-3xl capitalize text-ms-muted font-light py-3">
            Ops! Something went wrong: <br />
            {message}
          </div>

          <NavLink
            className="font-semibold w-full  inline-block text-ms-dark bg-ms-almost-white rounded-xl px-3 py-2 mt-6"
            to={"/dashboard"}
            replace
          >
            Go back
          </NavLink>
        </div>
      </div>
    </>
  );
};
export default Error;
