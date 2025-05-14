import { useEffect, useRef, useState } from "react";
import type { Message } from "../types";
import { useSelector } from "react-redux";
import type { RootState } from "..";
import { useDispatch } from "react-redux";
import { chatApi } from "../helpers/axiosInterceptor";
import { useNavigate } from "react-router";
import { removeMessage } from "../slices/chatSlice";
import "./MessageComponent.css";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";

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
        const activeMessage = document.querySelector(
          `.message[data-index="${index}"`
        );
        activeMessage?.scrollIntoView();
        setActiveIndex(index);
      }
    }
  }, [message, clickedResult]);

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

  /*  interface DeleteForAllResponse {
    success: boolean;
    message: string;
    message_uuid: string;
  } */

  const deleteForAll = () => {
    /* chatApi
      .delete<DeleteForAllResponse>(
        `/api/messages/delete-for-all/${messageUUID}`
      )
      .then((res) => {
        if (res.data.success) {
          const messageToRemove = res.data.message_uuid;
          //dispatch remove message
          dispatch(removeMessage(messageToRemove));
        }
      })
      .catch((err) => {
        navigate(`/error/${err.response.status}/${err.response.data.message}`);
      }); */
    //emit socket event for message deletion
  };

  return (
    <>
      <div
        ref={messageRef}
        onContextMenu={() => setIsDeleting(!isDeleting)}
        data-index={index}
        className={`message cursor-pointer relative max-w-xs w-max my-4 rounded-4xl pb-7 p-4 pe-8  ${
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
          className="content"
        ></div>

        <span
          className={`created-at absolute text-xs right-0 bottom-0 me-6 mb-1.5 ${
            message.status === "sent" ? "text-ms-dark" : "text-ms-almost-white"
          }`}
        >
          {createdAt}
        </span>
        <div
          ref={deletePanel}
          className={`delete-panel ${
            isDeleting ? "show" : ""
          }  absolute right-0 z-10 top-0 text-sm font-light  bg-ms-dark p-3 pe-6 rounded-2xl text-ms-almost-white`}
        >
          <XMarkIcon
            onClick={() => setIsDeleting(false)}
            className="size-5 p-0.5 absolute right-0.5 top-0.5 "
          />

          <div
            onClick={() => deleteForMe(message, authUser ? authUser?.uuid : "")}
            className="delete-for-me bg-ms-muted mb-3  cursor-pointer  p-2 rounded-xl flex items-center"
          >
            Delete for me <TrashIcon className="size-4 ms-0.5" />
          </div>
          <div
            onClick={() => deleteForAll()}
            className="delete-for-me bg-amber-700 cursor-pointer  p-2 rounded-xl  flex items-center"
          >
            Delete for all <TrashIcon className="size-4 ms-0.5" />
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageComponent;
