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
import SendMessage from "./SendMessage";
import type { MessageSearchResult, User } from "../types";
import Profile from "./Profile";
import Searchbar from "./Searchbar";
import { useDispatch } from "react-redux";
import { setActiveChat } from "../slices/chatSlice";
import Messages from "./Messages";
import { getHoursMinutesFormatted } from "../helpers/helpers";

interface ChatsResponse {
  success: true;
  chats: ChatType[];
}

const Dashboard = () => {
  const { authUser } = useSelector((state: RootState) => state.authState);

  const dispatch = useDispatch();

  const { clickedResult } = useSelector(
    (state: RootState) => state.searchState
  );
  const navigate = useNavigate();
  const [chats, setChats]: [ChatType[], Dispatch<SetStateAction<ChatType[]>>] =
    useState<ChatType[]>([]);

  useEffect(() => {
    console.log(chats);
  }, [chats]);

  useEffect(() => {
    if (authUser !== null) {
      getChats();
    }
  }, [authUser]);

  interface CreateChatResponse {
    success: boolean;
    message: string;
    chat: ChatType;
  }

  useEffect(() => {
    //console.log(clickedResult);
    if (isUser(clickedResult)) {
      //create a new chat with the user
      // console.log(clickedResult);
      chatApi
        .post<CreateChatResponse>("/api/chats", {
          senderUUID: authUser?.uuid,
          receiverUUID: clickedResult.uuid,
        })
        .then((res) => {
          if (res.data.success) {
            const newChat = res.data.chat;
            setChats([...chats, newChat]);
            dispatch(setActiveChat(newChat.uuid));
          }
        })
        .catch((err) => {
          if (err.response.status === 400 && err.response.data.chat) {
            const chatInCommon = err.response.data.chat;
            dispatch(setActiveChat(chatInCommon));
          } else {
            navigate(
              `/error/${err.response.status}/${err.response.data.message}`
            );
          }
        });
    } else if (isMessageSearchResult(clickedResult)) {
      //look for the chat in the chats panel, set it active, look for the message and scroll it into view
      const userChatsUUIDS = chats.map((chat) => chat.uuid);
      if (userChatsUUIDS.includes(clickedResult.chat.uuid)) {
        const findChat = userChatsUUIDS.find(
          (uuid) => uuid === clickedResult.chat.uuid
        );
        if (findChat && findChat?.trim() !== "") {
          //console.log(findChat);
          dispatch(setActiveChat(findChat));
        }
      }
    }
  }, [clickedResult]);

  const isUser = (obj: unknown): obj is User => {
    if (obj) {
      return (
        typeof (obj as User).username === "string" &&
        typeof (obj as User).profile_picture === "string" &&
        typeof (obj as User).uuid === "string"
      );
    }
    return false;
  };

  const isMessageSearchResult = (obj: unknown): obj is MessageSearchResult => {
    let contentValid: boolean = false;
    let chatValid: boolean = false;
    let userValid: boolean = false;
    if (obj) {
      if (typeof (obj as MessageSearchResult).content === "string") {
        contentValid = true;
      }

      if (
        (obj as MessageSearchResult).chat &&
        typeof (obj as MessageSearchResult).chat.uuid === "string"
      ) {
        chatValid = true;
      }

      if (isUser((obj as MessageSearchResult).user)) {
        userValid = true;
      }

      return contentValid && chatValid && userValid;
    }

    return false;
  };

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

  type MessageOrChatCreatedAt =
    | { messageCreatedAt: string; chatCreatedAt: string }
    | { messageCreatedAt: null; chatCreatedAt: string };

  const removeChat = (chat_uuid: string) => {
    const updatedChats = chats.filter((chat) => chat.uuid !== chat_uuid);

    setChats(updatedChats);
  };

  const ShowChats = (): JSX.Element => {
    return chats.length > 0 ? (
      <div className="flex flex-col">
        {chats.map((chat, index) => {
          const createdAt: MessageOrChatCreatedAt = {
            messageCreatedAt: chat.lastMessage
              ? chat.lastMessage.created_at
              : null,
            chatCreatedAt: chat.created_at,
          };
          return (
            <Chat
              removeChat={removeChat}
              key={index}
              chat={chat}
              messageCreatedAt={
                createdAt.messageCreatedAt
                  ? getHoursMinutesFormatted(createdAt.messageCreatedAt)
                  : getHoursMinutesFormatted(createdAt.chatCreatedAt)
              }
            />
          );
        })}
      </div>
    ) : (
      <div>No chats yet</div>
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
        <Searchbar authUser={authUser ? authUser : null} />
      </div>
      <div className="chats-panel overflow-y-scroll relative  col-span-2 row-span-9  row-start-2 bg-ms-darker border-e border-ms-dark">
        <div className="sticky w-full top-0 h-[20px] bg-ms-dark"></div>
        <ShowChats />
      </div>
      <div className="chat-panel flex flex-col col-span-8 row-span-9 row-start-2  bg-ms-darker">
        <Messages />
        <SendMessage />
      </div>
    </section>
  );
};

export default Dashboard;
