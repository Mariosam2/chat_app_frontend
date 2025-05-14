import { useSelector } from "react-redux";
import { chatApi } from "../helpers/axiosInterceptor";
import { type ChatType } from "../types";
import type { AppDispatch, RootState } from "../index";
import { useDispatch } from "react-redux";
import { setActiveChat } from "../slices/chatSlice";
import { useNavigate } from "react-router";

import "./Chat.css";
import { useEffect, useRef, useState } from "react";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { socket } from "../helpers/socket";
import { cleanError, getMessages, isAxiosError } from "../slices/messageSlice";

interface ChatProps {
  chat: ChatType;
  messageCreatedAt: string;
  removeChat: (chat_uuid: string) => void;
}

const Chat = ({ removeChat, chat, messageCreatedAt }: ChatProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { authUser } = useSelector((state: RootState) => state.authState);
  const { activeChat, chats } = useSelector(
    (state: RootState) => state.chatState
  );
  const { loading, error } = useSelector(
    (state: RootState) => state.messageState
  );
  const { searching } = useSelector((state: RootState) => state.searchState);
  const [isDeleting, setIsDeleting] = useState(false);
  const deletePanelRef = useRef<HTMLDivElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    window.addEventListener("contextmenu", (e: MouseEvent) => {
      const { current }: { current: HTMLDivElement | null } = chatRef;
      const target = e.target as Node;
      //console.log(target);
      if (current && !current.contains(target)) {
        setIsDeleting(false);
      }
    });
    //console.log(deletePanelRef.current);
    window.addEventListener("click", (e: MouseEvent) => {
      const { current }: { current: HTMLDivElement | null } = deletePanelRef;
      const target = e.target as Node;
      //console.log(target);
      if (current && !current.contains(target)) {
        setIsDeleting(false);
      }
    });
  }, []);

  useEffect(() => {
    //console.log(error);
    if (error && isAxiosError(error)) {
      navigate(`/error/${error.response.status}/${error.response.statusText}`);
      dispatch(setActiveChat(""));
      dispatch(cleanError());
    }
  }, [error]);

  useEffect(() => {
    if (
      activeChat.trim() !== "" &&
      activeChat === chat.uuid &&
      authUser &&
      !searching &&
      !loading
    ) {
      dispatch(getMessages({ userUUID: authUser.uuid, chatUUID: chat.uuid }));
    }
  }, [activeChat]);

  const setActive = () => {
    dispatch(setActiveChat(chat.uuid));
  };

  interface DeleteForMeResponse {
    success: boolean;
    message: string;
    chat_uuid: string;
  }

  const deleteForMe = (
    e: React.MouseEvent,
    chatUUID: string,
    userUUID: string
  ) => {
    e.stopPropagation();
    chatApi
      .delete<DeleteForMeResponse>(`/api/chats/${chatUUID}/${userUUID}`)
      .then((res) => {
        if (res.data.success) {
          //delete chat from parent chats
          const chatToRemove = res.data.chat_uuid;
          dispatch(setActiveChat(""));
          removeChat(chatToRemove);
        }
      })
      .catch((err) => {
        navigate(`/error/${err.response.status}/${err.response.data.message}`);
      });
  };

  const deleteForAll = (e: React.MouseEvent, chatUUID: string) => {
    e.stopPropagation();

    socket.emit("delete chat", { room: chatUUID, chats });
  };
  return (
    <div
      ref={chatRef}
      onContextMenu={() => setIsDeleting(true)}
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
        ref={deletePanelRef}
        className={`delete-panel ${
          isDeleting ? "show" : ""
        }  absolute right-0 z-10 top-0 text-sm font-light bg-ms-dark cursor-pointer p-3 pe-6 rounded-2xl text-ms-almost-white`}
      >
        <XMarkIcon
          onClick={(e) => {
            e.stopPropagation();
            setIsDeleting(false);
          }}
          className="size-5 p-0.5 absolute right-0.5 top-0.5 "
        />
        <div
          onClick={(e) => deleteForMe(e, chat.uuid, authUser!.uuid)}
          className="delete-for-me bg-ms-muted mb-3  p-2 rounded-xl flex items-center"
        >
          Delete for me <TrashIcon className="size-4 ms-0.5" />
        </div>
        <div
          onClick={(e) => deleteForAll(e, chat.uuid)}
          className="delete-for-me bg-amber-700 cursor-pointer  p-2 rounded-xl  flex items-center"
        >
          Delete for all <TrashIcon className="size-4 ms-0.5" />
        </div>
      </div>
    </div>
  );
};

export default Chat;
