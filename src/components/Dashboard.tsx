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
import SendMessage from "./SendMessage";

interface ChatsResponse {
  success: true;
  chats: ChatType[];
}

const Dashboard = () => {
  const { authUser } = useSelector((state: RootState) => state.authState);
  const { messages, loading } = useSelector(
    (state: RootState) => state.chatState
  );
  const navigate = useNavigate();
  const [chats, setChats]: [ChatType[], Dispatch<SetStateAction<ChatType[]>>] =
    useState<ChatType[]>([]);
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

  const ShowChats = (): JSX.Element => {
    return chats.length > 0 ? (
      <>
        {chats.map((chat, index) => {
          const messageCreatedAt = getHoursMinutesFormatted(
            chat.lastMessage?.created_at
          );
          return (
            <Chat key={index} chat={chat} messageCreatedAt={messageCreatedAt} />
          );
        })}
      </>
    ) : (
      <div>No chats yet</div>
    );
  };

  const ShowMessages = (): JSX.Element => {
    return !loading && messages.length > 0 ? (
      <div className="messages-container flex flex-col p-24  h-[80vh] ">
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
      <div className=" h-[80vh]">Loading...</div>
    ) : (
      <div className=" h-[80vh] text-ms-almost-white">No messages here...</div>
    );
  };

  useEffect(() => {
    if (authUser !== null) {
      getChats();
    }
  }, [authUser]);
  return (
    <section className="dashboard h-screen grid grid-cols-10 grid-row-6">
      <div className="top-panel col-span-10 row-span-1 bg-ms-dark flex items-center p-4">
        <NavLink to={"/"} id="logo" className="max-w-[120px]">
          <img src={logo} alt="" />
        </NavLink>
        {/* TODO: user edit panel */}
      </div>
      <div className="chats-panel  col-span-2 row-span-5 row-start-2 bg-ms-dark grid grid-rows-6">
        <ShowChats />
      </div>
      <div className="chat-panel flex flex-col col-span-7 row-span-5 row-start-2  bg-ms-darker">
        <ShowMessages />
        <SendMessage />
      </div>
      <div className="side-panel p-6 flex flex-col col-span-1 row-span-5 row-start-2 bg-ms-dark border-t border-ms-darker">
        <div className="user-profile  flex flex-col items-center bg-ms-dark p-4 rounded-4xl font-light text-ms-almost-white">
          <div className="profile-picture max-w-[60px] ">
            <img
              src={import.meta.env.VITE_BASE_URL + authUser?.profile_picture}
              alt=""
            />
          </div>

          <div className="username mt-2">{authUser?.username}</div>
          <div className="edit  bg-ms-secondary font-normal cursor-pointer text-ms-almost-white px-4 py-1 rounded-2xl mt-6">
            Edit profile
          </div>
        </div>
        <div className="logout w-fit rounded-2xl grid place-items-center mt-auto mx-auto p-4 ps-3 cursor-pointer  bg-ms-secondary">
          <img className="size-8" src={logoutIcon} alt="" />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
