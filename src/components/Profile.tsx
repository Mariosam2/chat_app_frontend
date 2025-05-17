import { useDispatch } from "react-redux";
import logoutIcon from "../assets/logout.png";
import { editing } from "../slices/profileSlice";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { createPortal } from "react-dom";
import EditProfile from "./EditProfile";
import "./Profile.css";
import type { User } from "../types";

interface ProfileProps {
  authUser: User | null;
  logout: () => void;
}

const Profile = ({ authUser, logout }: ProfileProps) => {
  const dispatch = useDispatch();
  const editingProfile = () => {
    dispatch(editing(true));
  };

  return (
    <div className="user-profile col-span-1 row-span-1 md:col-span-4 lg:col-span-3 2xl:col-span-2  p-4   flex items-center font-light text-ms-almost-white border-e border-ms-dark ">
      <div className="profile-picture">
        <img
          className=" w-[60px] aspect-square  rounded-full object-cover"
          src={import.meta.env.VITE_BASE_URL + authUser?.profile_picture}
          alt=""
        />
      </div>

      <div className="username text-lg font-normal  ms-3">
        {authUser?.username}
      </div>
      <PencilSquareIcon
        onClick={editingProfile}
        className="size-6 ms-3 cursor-pointer "
      />
      <img
        onClick={logout}
        className="size-8 logout cursor-pointer ms-auto p-1.5 bg-ms-secondary rounded-[0.4rem]"
        src={logoutIcon}
        alt=""
      />
      {createPortal(<EditProfile authUser={authUser} />, document.body)}
    </div>
  );
};
export default Profile;
