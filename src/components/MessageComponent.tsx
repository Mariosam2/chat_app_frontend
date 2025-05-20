import { useEffect, useRef, useState } from "react";
import type { Message } from "../types";
import { useSelector } from "react-redux";
import type { RootState } from "..";
import { useDispatch } from "react-redux";
import { chatApi } from "../helpers/axiosInterceptor";
import { useNavigate } from "react-router";
import "./MessageComponent.css";
import {
  XMarkIcon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { socket } from "../helpers/socket";
import { editingMessage, removeMessage } from "../slices/messageSlice";

interface MessageComponentProps {
  message: Message;
  createdAt: string;
  index: number;
}

const MessageComponent = ({
  message,
  createdAt,
  index,
}: MessageComponentProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authUser } = useSelector((state: RootState) => state.authState);
  const { clickedResult, query } = useSelector(
    (state: RootState) => state.searchState
  );
  const { messageToEdit } = useSelector(
    (state: RootState) => state.messageState
  );
  const { activeChat } = useSelector((state: RootState) => state.chatState);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const deletePanel = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    window.addEventListener("contextmenu", (e: MouseEvent) => {
      const { current }: { current: HTMLDivElement | null } = messageRef;
      const target = e.target as Node;
      //console.log(target);
      if (current && !current.contains(target)) {
        setIsDeleting(false);
      }
    });

    window.addEventListener("click", (e: MouseEvent) => {
      const { current }: { current: HTMLDivElement | null } = deletePanel;
      const target = e.target as Node;
      //console.log(target);
      if (current && !current.contains(target)) {
        setIsDeleting(false);
      }
    });
  }, []);

  useEffect(() => {
    if (message && clickedResult) {
      if (message.uuid === clickedResult.uuid) {
        //console.log(clickedResult.uuid, message.uuid);
        setActiveIndex(index);
        setTimeout(() => {
          messageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 250);
      }
    }
  }, [message, clickedResult]);

  useEffect(() => {
    if (messageRef.current && messageToEdit?.uuid === message.uuid) {
      //console.log(messageRef.current);
      messageRef.current.scrollIntoView({
        behavior: "instant",
        block: "center",
      });
    }
  }, [messageToEdit]);

  const highlightMatch = (string: string, query: string) => {
    const newBody = string.replace(
      new RegExp(query, "gi"),
      (match) =>
        `<mark style="font-weight: 700; background-color:transparent;">${match}</mark>`
    );

    return { __html: newBody };
  };
  interface DeleteForMeResponse {
    success: boolean;
    message: string;
    message_uuid: string;
    isSender: boolean;
  }

  const deleteForMe = (message: Message, userUUID: string) => {
    chatApi
      .delete<DeleteForMeResponse>(
        `/api/messages/delete-for-user/${message.uuid}/${userUUID}?sent=${
          message.status === "sent" ? true : false
        }`
      )
      .then((res) => {
        if (res.data.success) {
          //delete chat from parent chats

          const messageToRemove = res.data.message_uuid;

          //dispatch remove message
          dispatch(removeMessage(messageToRemove));
        }
      })
      .catch((err) => {
        navigate(`/error/${err.response.status}/${err.response.data.message}`);
      });
  };

  const deleteForAll = () => {
    socket.emit("delete message", {
      room: activeChat?.uuid,
      message: message.uuid,
      status: message.status,
    });
  };

  const ShowEditButton = () => {
    if (message.status === "sent") {
      return (
        <div
          onClick={() =>
            dispatch(
              editingMessage({ isEditing: true, messageToEdit: message })
            )
          }
          className="edit-message flex items-center h-full p-2 bg-ms-secondary rounded-xl"
        >
          Edit
          <PencilSquareIcon className="size-4 ms-0.5" />
        </div>
      );
    }
  };

  return (
    <div
      className={`message-container ${
        messageToEdit && messageToEdit.uuid === message.uuid ? "selected" : ""
      }`}
    >
      <div
        ref={messageRef}
        onContextMenu={() => {
          setIsDeleting(!isDeleting);
          if (messageRef.current) {
            messageRef.current.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }}
        data-index={index}
        className={`message min-w-[80px] max-w-full xs:max-w-xs cursor-pointer text-sm md:text-base relative  w-max my-4 rounded-[20px] p-2  pb-4  pe-4 xs:p-4  xs:pb-6 xs:pe-6  ${
          message.status === "sent"
            ? "bg-ms-almost-white text-ms-dark me-auto"
            : "  bg-ms-secondary text-ms-almost-white ms-auto"
        }`}
      >
        <div
          dangerouslySetInnerHTML={
            index === activeIndex && query
              ? highlightMatch(message.content, query)
              : { __html: message.content }
          }
          className="content wrap-break-word"
        ></div>

        <span
          className={`created-at absolute text-[10px] md:text-xs right-0 bottom-0 me-4 mb-0.5 ${
            message.status === "sent" ? "text-ms-dark" : "text-ms-almost-white"
          }`}
        >
          {createdAt}
        </span>
        <div
          ref={deletePanel}
          className={`delete-panel flex flex-col w-max ${
            isDeleting ? "show" : ""
          }  absolute left-3/6 z-10 top-0 text-[10px] md:text-sm font-light  bg-ms-dark p-2 md:p-3 pe-6 rounded-2xl text-ms-almost-white`}
        >
          <XMarkIcon
            onClick={() => setIsDeleting(false)}
            className="size-5 p-0.5 absolute right-0.5 top-0.5 "
          />
          <ShowEditButton />

          <div
            onClick={() => deleteForMe(message, authUser ? authUser?.uuid : "")}
            className={`delete-for-me bg-ms-muted  ${
              message.status === "sent" ? "my-3" : "mb-3"
            }  h-full cursor-pointer  p-2 rounded-xl flex items-center`}
          >
            Delete for me <TrashIcon className="size-4 ms-0.5" />
          </div>
          <div
            onClick={() => deleteForAll()}
            className="delete-for-me bg-amber-700 cursor-pointer h-full p-2 rounded-xl  flex items-center"
          >
            Delete for all <TrashIcon className="size-4 ms-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageComponent;
