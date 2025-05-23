import { useEffect, type JSX } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "..";
import { Navigate } from "react-router";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { authenticated } = useSelector((state: RootState) => state.authState);
  useEffect(() => {
    console.log(authenticated);
  }, []);

  return authenticated ? children : <Navigate to={"/login"} />;
};

export default RequireAuth;
