import { useSelector } from "react-redux";
import { chatApi } from "../helpers/axiosInterceptor";
import { type ChatType } from "../types";
import type { RootState } from "../index";
import { useDispatch } from "react-redux";
import {
  chatLoading,
  finishedChatLoading,
  setActiveChat,
  setMessages,
  type ChatState,
} from "../slices/chatSlice";
import { useNavigate } from "react-router";

import "./Chat.css";
import { useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

interface ChatProps {
  chat: ChatType;
  messageCreatedAt: string;
  removeChat: (chat_uuid: string) => void;
}
interface MessagesResponse extends ChatState {
  success: boolean;
}

const Chat = ({ removeChat, chat, messageCreatedAt }: ChatProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authUser } = useSelector((state: RootState) => state.authState);
  const { activeChat } = useSelector((state: RootState) => state.chatState);
  const { searching } = useSelector((state: RootState) => state.searchState);
  const [isDeleting, setIsDeleting] = useState(false);

  const getMessages = (userUUID: string, chatUUID: string) => {
    dispatch(chatLoading());
    chatApi
      .get<MessagesResponse>(`/api/messages/${userUUID}/${chatUUID}`)
      .then((res) => {
        if (res.data.success) {
          //dispatch setMessages
          //console.log(res.data);
          dispatch(setMessages(res.data.messages));
          dispatch(finishedChatLoading());
        }
      })
      .catch((err) => {
        finishedChatLoading();
        navigate(`/error/${err.response.status}/${err.response.data.message}`);
      });
  };

  useEffect(() => {
    window.addEventListener("click", (e: MouseEvent) => {
      const deletePanel = document.querySelector(".chat .delete-panel");
      const target = e.target as Node;
      //console.log(target);
      if (deletePanel && !deletePanel.contains(target)) {
        setIsDeleting(false);
      }
    });

    if (
      activeChat.trim() !== "" &&
      activeChat === chat.uuid &&
      authUser &&
      !searching
    ) {
      //console.log(activeChat);
      getMessages(authUser.uuid, chat.uuid);
    }
  }, [activeChat, searching]);

  const setActive = () => {
    dispatch(setActiveChat(chat.uuid));
  };

  interface DeleteForMeResponse {
    success: boolean;
    message: string;
    chat_uuid: string;
  }

  const deleteForMe = (chatUUID: string, userUUID: string) => {
    chatApi
      .delete<DeleteForMeResponse>(`/api/chats/${chatUUID}/${userUUID}`)
      .then((res) => {
        if (res.data.success) {
          //delete chat from parent chats
          const chatToRemove = res.data.chat_uuid;
          removeChat(chatToRemove);
        }
      })
      .catch((err) => {
        navigate(`/error/${err.response.status}/${err.response.data.message}`);
      });
  };
  interface DeleteForAllResponse {
    success: boolean;
    message: string;
    chat_uuid: string;
  }

  const deleteForAll = (chatUUID: string) => {
    chatApi
      .delete<DeleteForAllResponse>(`/api/chats/${chatUUID}`)
      .then((res) => {
        if (res.data.success) {
          const chatToRemove = res.data.chat_uuid;
          removeChat(chatToRemove);
        }
      })
      .catch((err) => {
        navigate(`/error/${err.response.status}/${err.response.data.message}`);
      });
  };
  return (
    <div
      onContextMenu={() => setIsDeleting(!isDeleting)}
      onClick={setActive}
      className={`chat bg-ms-darker relative row-span-1 py-4 flex items-center px-4 cursor-pointer ${
        activeChat === chat.uuid ? "active" : ""
      }`}
    >
      <div className="receiver  ">
        <div className="profile-picture max-w-[60px] pe-1.5 ">
          <img
            className="rounded-full"
            src={import.meta.env.VITE_BASE_URL + chat.receiver?.profile_picture}
            alt=""
          />
        </div>
      </div>
      <div className="content p-2 grow">
        <h5 className="text-normal font-light  username ">
          {chat.receiver?.username}
        </h5>
        <span className="text-ms-muted block font-light text-sm pt-2 ">
          {chat.lastMessage?.content}
        </span>
      </div>
      <div className="last-message font-light self-start pt-4">
        <span className="created-at  text-ms-almost-white">
          {messageCreatedAt}
        </span>
      </div>
      <div
        className={`delete-panel ${
          isDeleting ? "show" : ""
        }  absolute right-0 z-10 top-0 bg-ms-dark cursor-pointer p-2 rounded-2xl text-ms-almost-white`}
      >
        <div
          onClick={() => deleteForMe(chat.uuid, authUser!.uuid)}
          className="delete-for-me bg-ms-muted my-2  p-2 rounded-xl flex items-center"
        >
          Delete for me <TrashIcon className="size-6" />
        </div>
        <div
          onClick={() => deleteForAll(chat.uuid)}
          className="delete-for-me bg-amber-700 cursor-pointer my-2 p-2 rounded-xl  flex items-center"
        >
          Delete for all <TrashIcon className="size-6" />
        </div>
      </div>
    </div>
  );
};

export default Chat;
