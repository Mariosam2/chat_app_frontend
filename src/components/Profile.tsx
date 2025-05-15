import { useDispatch } from "react-redux";
import logoutIcon from "../assets/logout.png";
import { chatApi, type AuthUser } from "../helpers/axiosInterceptor";
import { authenticate, saveAuthUser } from "../slices/authSlice";
import { useNavigate } from "react-router";
import { editing } from "../slices/profileSlice";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { createPortal } from "react-dom";
import EditProfile from "./EditProfile";
import "./Profile.css";
import { socket } from "../helpers/socket";

interface ProfileProps {
  authUser: AuthUser | null;
}

const Profile = ({ authUser }: ProfileProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  interface LogoutResponse {
    success: boolean;
    message: string;
  }

  const logout = () => {
    chatApi
      .post<LogoutResponse>("/api/auth/logout")
      .then((res) => {
        if (res.data.success) {
          //set the authUser to null and authenticated to false
          dispatch(saveAuthUser(null));
          dispatch(authenticate(false));
          chatApi.defaults.headers.common["Authorization"] = "";
          socket.disconnect();
        }
      })
      .catch((err) => {
        navigate(`/error/${err.response.status}/${err.response.data.message}`);
      });
  };

  const editingProfile = () => {
    dispatch(editing(true));
  };

  return (
    <div className="user-profile col-span-2  p-4   flex items-center font-light text-ms-almost-white border-e border-ms-dark ">
      <div className="profile-picture">
        <img
          className=" w-[60px] aspect-square  rounded-full"
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
