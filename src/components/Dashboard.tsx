import {
  useEffect,
  useState,
  type Dispatch,
  type JSX,
  type SetStateAction,
} from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../index";
import { chatApi } from "../helpers/axiosInterceptor";
import { NavLink, useNavigate } from "react-router";
import "./Dashboard.css";
import Chat from "./Chat";
import { type ChatType } from "../types";
import logo from "../assets/logo.png";
import MessageComponent from "./MessageComponent";
import logoutIcon from "../assets/logout.png";
import noMessagesImg from "../assets/no_messages.png";
import SendMessage from "./SendMessage";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { authenticate, saveAuthUser } from "../slices/authSlice";
import { useDispatch } from "react-redux";

interface ChatsResponse {
  success: true;
  chats: ChatType[];
}

const Dashboard = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state: RootState) => state.authState);
  const { messages, loading } = useSelector(
    (state: RootState) => state.chatState
  );
  const navigate = useNavigate();
  const [chats, setChats]: [ChatType[], Dispatch<SetStateAction<ChatType[]>>] =
    useState<ChatType[]>([]);

  useEffect(() => {
    if (authUser !== null) {
      getChats();
    }
  }, [authUser]);

  const getChats = () => {
    chatApi
      .get<ChatsResponse>(`/api/chats/${authUser?.uuid}`)
      .then((res) => {
        console.log(res.data.chats);
        setChats(res.data.chats);
      })
      .catch((err) => {
        navigate(`/error/${err.response.status}/${err.response.data.message}`);
      });
  };

  const getHoursMinutesFormatted = (stringDate: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedDate = new Date(stringDate)
      .toLocaleDateString("it-IT", options)
      .split(",")[1];

    return formattedDate;
  };

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
        }
      })
      .catch((err) => {
        navigate(`/error/${err.response.status}/${err.response.data.message}`);
      });
  };

  const ShowChats = (): JSX.Element => {
    return chats.length > 0 ? (
      <div className=" grid grid-rows-7">
        {chats.map((chat, index) => {
          const messageCreatedAt = getHoursMinutesFormatted(
            chat.lastMessage?.created_at
          );
          return (
            <Chat key={index} chat={chat} messageCreatedAt={messageCreatedAt} />
          );
        })}
      </div>
    ) : (
      <div>No chats yet</div>
    );
  };

  const ShowMessages = (): JSX.Element => {
    return !loading && messages.length > 0 ? (
      <div className="messages-container flex flex-col p-24  h-[calc(90vh-60px)] border-b border-ms-dark ">
        {messages.map((message, index) => {
          const messageCreatedAt = getHoursMinutesFormatted(message.created_at);
          return (
            <MessageComponent
              key={index}
              message={message}
              createdAt={messageCreatedAt}
            />
          );
        })}
      </div>
    ) : loading ? (
      <div className="h-[calc(90vh-60px)]">Loading...</div>
    ) : (
      <div className="h-[calc(90vh-60px)] grid place-items-center text-ms-almost-white">
        <img className="no-messages" src={noMessagesImg} alt="" />
      </div>
    );
  };

  return (
    <section className="dashboard h-screen grid grid-cols-10 grid-rows-10">
      <div className="top-panel col-span-10 row-span-1 col-start-1 grid grid-cols-10     bg-ms-darker border-b border-ms-dark items-center">
        <div className="user-profile col-span-2  p-4   flex items-center font-light text-ms-almost-white border-e border-ms-dark ">
          <div className="profile-picture   max-w-[60px] ">
            <img
              src={import.meta.env.VITE_BASE_URL + authUser?.profile_picture}
              alt=""
            />
          </div>

          <div className="username text-lg font-normal  ms-3">
            {authUser?.username}
          </div>
          <PencilSquareIcon className="size-6 ms-3 cursor-pointer " />
          <img
            onClick={logout}
            className="size-8 logout cursor-pointer ms-auto p-1.5 bg-ms-secondary rounded-[0.4rem]"
            src={logoutIcon}
            alt=""
          />
        </div>

        <NavLink
          to={"/"}
          id="logo"
          className="max-w-[120px] col-span-1 ms-4 p-2"
        >
          <img src={logo} alt="" />
        </NavLink>

        <div className="searchbar-users h-[40px] col-span-5 col-start-4 bg-ms-dark rounded-xl p-2 text-ms-muted flex items-center ">
          <MagnifyingGlassIcon className="size-5 me-1 " />
          <input
            className="p-1 flex-grow focus:outline-none"
            placeholder="Search..."
            type="text"
            name=""
            id=""
          />
        </div>

        {/* TODO: user edit panel */}
      </div>
      <div className="chats-panel  col-span-2 row-span-9  row-start-2 bg-ms-darker border-e border-ms-dark">
        <div className="searchbar-chats-container  p-3 border-b border-ms-dark">
          <div className="searchbar-chats h-[40px] bg-ms-dark rounded-xl p-2 text-ms-muted flex items-center ">
            <MagnifyingGlassIcon className="size-5 me-1 " />
            <input
              className="p-1 flex-grow focus:outline-none"
              placeholder="Search..."
              type="text"
              name=""
              id=""
            />
          </div>
        </div>

        <ShowChats />
      </div>
      <div className="chat-panel flex flex-col col-span-8 row-span-9 row-start-2  bg-ms-darker">
        <ShowMessages />
        <SendMessage />
      </div>
      {/* <div className="side-panel p-6 flex flex-col col-span-1 row-span-5 row-start-1 bg-ms-dark border-t border-ms-darker">
        <div className="logout w-fit rounded-2xl grid place-items-center mt-auto mx-auto p-4 ps-3 cursor-pointer  bg-ms-secondary">
          <img className="size-8" src={logoutIcon} alt="" />
        </div>
      </div> */}
    </section>
  );
};

export default Dashboard;
