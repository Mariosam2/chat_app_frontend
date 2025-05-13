import { useEffect, useState } from "react";
import type { Message } from "../types";
import { useSelector } from "react-redux";
import type { RootState } from "..";
import { useDispatch } from "react-redux";
import { chatApi } from "../helpers/axiosInterceptor";
import { useNavigate } from "react-router";
import { TrashIcon } from "@heroicons/react/24/solid";
import { removeMessage } from "../slices/chatSlice";
import "./MessageComponent.css";

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

  useEffect(() => {
    window.addEventListener("click", (e: MouseEvent) => {
      const deletePanel = document.querySelector(
        `.message[data-index="${index}"] .delete-panel`
      );
      const target = e.target as Node;
      //console.log(target);
      if (deletePanel && !deletePanel.contains(target)) {
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
  }

  const deleteForMe = (messageUUID: string, userUUID: string) => {
    chatApi
      .delete<DeleteForMeResponse>(`/api/messages/${messageUUID}/${userUUID}`)
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

  interface DeleteForAllResponse {
    success: boolean;
    message: string;
    message_uuid: string;
  }

  const deleteForAll = (messageUUID: string) => {
    chatApi
      .delete<DeleteForAllResponse>(`/api/messages/${messageUUID}`)
      .then((res) => {
        if (res.data.success) {
          const messageToRemove = res.data.message_uuid;
          //dispatch remove message
          dispatch(removeMessage(messageToRemove));
        }
      })
      .catch((err) => {
        navigate(`/error/${err.response.status}/${err.response.data.message}`);
      });
  };

  return (
    <>
      <div
        onContextMenu={() => setIsDeleting(!isDeleting)}
        data-index={index}
        className={`message relative max-w-xs w-max my-4 rounded-4xl pb-7 p-4 pe-8  ${
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
          className={`delete-panel ${
            isDeleting ? "show" : ""
          }  absolute right-0 z-10 top-0 bg-ms-dark p-2 rounded-2xl text-ms-almost-white`}
        >
          <div
            onClick={() => deleteForMe(message.uuid, authUser!.uuid)}
            className="delete-for-me bg-ms-muted my-2 cursor-pointer  p-2 rounded-xl flex items-center"
          >
            Delete for me <TrashIcon className="size-6" />
          </div>
          <div
            onClick={() => deleteForAll(message.uuid)}
            className="delete-for-me bg-amber-700 cursor-pointer my-2 p-2 rounded-xl  flex items-center"
          >
            Delete for all <TrashIcon className="size-6" />
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageComponent;
