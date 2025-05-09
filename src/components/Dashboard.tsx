import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../index";

const Dashboard = () => {
  const { authUser } = useSelector((state: RootState) => state.authState);

  useEffect(() => {
    console.log(authUser);
  }, [authUser]);
  return <div>Dashboard</div>;
};

export default Dashboard;
