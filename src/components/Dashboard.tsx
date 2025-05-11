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
import noMessagesImg from "../assets/no_messages.png";
import SendMessage from "./SendMessage";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import Profile from "./Profile";

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
      <div className="top-panel col-span-10 row-span-1 col-start-1 grid grid-cols-10  bg-ms-darker border-b border-ms-dark items-center">
        <Profile authUser={authUser} />
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
            name="search-users"
            id="search-users"
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
              name="search-chats"
              id="search-chats"
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
