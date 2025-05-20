import { useEffect, type JSX } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../index";
import { chatApi } from "../helpers/axiosInterceptor";
import { NavLink, useNavigate } from "react-router";
import Chat from "./Chat";
import { type ChatType } from "../types";
import logo from "../assets/logo.png";
import type { MessageSearchResult, User } from "../types";
import Profile from "./Profile";
import Searchbar from "./Searchbar";
import { useDispatch } from "react-redux";
import { removeChat, setActiveChat, setChats } from "../slices/chatSlice";
import Messages from "./Messages";
import { getHoursMinutesFormatted } from "../helpers/helpers";
import { socket } from "../helpers/socket";
import SendMessage from "./SendMessage";
import { authenticate, saveAuthUser } from "../slices/authSlice";
import { isSearching, setQuery } from "../slices/searchSlice";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";

const Dashboard = () => {
  const { authUser } = useSelector((state: RootState) => state.authState);
  const { chats } = useSelector((state: RootState) => state.chatState);

  const dispatch = useDispatch();

  const { clickedResult } = useSelector(
    (state: RootState) => state.searchState
  );
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
          chatApi.defaults.headers.common["Authorization"] = "";
          socket.io.opts.auth = {};
          socket.removeAllListeners(); // rimuove TUTTI gli event listener
          socket.disconnect();
          dispatch(setQuery(""));
          dispatch(isSearching(false));
          dispatch(saveAuthUser(null));
          dispatch(authenticate(false));
        }
      })
      .catch((err) => {
        console.log(err);
        navigate(`/error/${err.response.status}/${err.response.data.message}`);
      });
  };

  useEffect(() => {
    socket.on(
      "connect",

      () => {
        console.log("connected");
      }
    );
    socket.on("logout", () => {
      logout();
    });
    socket.on("chat error", ({ error }: { error: Error | string }) => {
      navigate(`/error/${error instanceof Error ? error.message : error}`);
    });
    socket.on("message error", ({ error }: { error: Error | string }) => {
      console.log(error);
      navigate(`/error/${error instanceof Error ? error.message : error}`);
    });
    socket.on("chat deleted", ({ chatUUID }: { chatUUID: string }) => {
      dispatch(removeChat(chatUUID));
    });

    socket.connect();
  }, []);

  useEffect(() => {
    if (chats.length > 0) {
      for (let i = 0; i < chats.length; i++) {
        const chat = chats[i];
        socket.emit("join", { room: chat.uuid });
      }
    }
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
            dispatch(setChats([...chats, newChat]));
            dispatch(
              setActiveChat({ uuid: newChat.uuid, receiver: newChat.receiver })
            );
          }
        })
        .catch((err) => {
          if (err.response.status === 400 && err.response.data.chat) {
            const chatInCommon = err.response.data.chat;
            dispatch(setActiveChat(chatInCommon));
          } else {
            navigate(`/error/${err.response.data.message}`);
          }
        });
    } else if (isMessageSearchResult(clickedResult)) {
      console.log(clickedResult);
      //look for the chat in the chats panel, set it active, look for the message and scroll it into view
      const userChatsUUIDS = chats.map((chat) => chat.uuid);
      if (userChatsUUIDS.includes(clickedResult.chat.uuid)) {
        const findChat = chats.find(
          (chat) => chat.uuid === clickedResult.chat.uuid
        );
        if (findChat) {
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

  interface ChatsResponse {
    success: true;
    chats: ChatType[];
  }

  const getChats = () => {
    chatApi
      .get<ChatsResponse>(`/api/chats/${authUser?.uuid}`)
      .then((res) => {
        //console.log(res.data.chats);
        //setChats(res.data.chats);
        dispatch(setChats(res.data.chats));
      })
      .catch((err) => {
        navigate(`/error/${err.response.status}/${err.response.data.message}`);
      });
  };

  type MessageOrChatCreatedAt =
    | { messageCreatedAt: string; chatCreatedAt: string }
    | { messageCreatedAt: null; chatCreatedAt: string };

  const ShowChats = (): JSX.Element => {
    return chats.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-rows-6 h-[150px]  md:min-h-[727px] md:h-[calc(90vh-20px)] overflow-y-auto border-b md:border-b-0 border-ms-dark">
        {chats.map((chat, index) => {
          const createdAt: MessageOrChatCreatedAt = {
            messageCreatedAt: chat.lastMessage
              ? chat.lastMessage.created_at
              : null,
            chatCreatedAt: chat.created_at,
          };
          return (
            <Chat
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
      <div className="flex flex-col justify-center items-center py-3 md:pt-20 text-ms-almost-white border-b md:border-b-0 border-ms-dark">
        <ChatBubbleOvalLeftEllipsisIcon className="size-32" />
        <div className="text-lg p-3"> No chats yet</div>
      </div>
    );
  };

  return (
    <section className="dashboard  min-h-[830px] h-screen flex flex-col md:grid md:grid-cols-10 md:grid-rows-10">
      <div className="top-panel flex flex-col md:col-span-10 md:row-span-1 col-start-1 md:grid md:grid-cols-10  bg-ms-darker border-b border-ms-dark items-center">
        <Profile logout={logout} authUser={authUser} />
        <NavLink
          to={"/"}
          id="logo"
          className="max-w-[120px] hidden md:block md:col-span-2 2xl:col-span-1 ms-4 p-2"
        >
          <img src={logo} alt="" />
        </NavLink>
        <Searchbar authUser={authUser ? authUser : null} />
      </div>
      <div className="chats-panel relative  md:col-span-4 md:row-span-9  md:row-start-2 bg-ms-darker border-e border-ms-dark">
        <div className="sticky w-full top-0 h-[20px] bg-ms-dark"></div>
        <ShowChats />
      </div>
      <div className="chat-panel flex flex-col grow md:col-span-6 md:row-span-9 md:row-start-2  bg-ms-darker">
        <Messages />
        <SendMessage />
      </div>
    </section>
  );
};

export default Dashboard;
