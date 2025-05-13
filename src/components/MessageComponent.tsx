import { useEffect, useState } from "react";
import type { Message } from "../types";
import { useSelector } from "react-redux";
import type { RootState } from "..";

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
  const { clickedResult, query } = useSelector(
    (state: RootState) => state.searchState
  );

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
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

  return (
    <>
      <div
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
      </div>
    </>
  );
};

export default MessageComponent;
