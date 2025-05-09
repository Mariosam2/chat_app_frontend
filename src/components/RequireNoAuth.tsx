import type { JSX } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "..";
import { Navigate } from "react-router";

const RequireNoAuth = ({ children }: { children: JSX.Element }) => {
  const { authenticated } = useSelector((state: RootState) => state.authState);

  return authenticated ? <Navigate to={"/dashboard"} /> : children;
};

export default RequireNoAuth;
