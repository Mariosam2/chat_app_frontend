import type { Message } from "../types";

const MessageComponent = ({
  message,
  createdAt,
}: {
  message: Message;
  createdAt: string;
}) => {
  return (
    <div
      className={`message relative max-w-xs w-max my-4 rounded-4xl pb-7 p-4 pe-8  ${
        message.status === "sent"
          ? "bg-ms-almost-white text-ms-dark me-auto"
          : "  bg-ms-secondary text-ms-almost-white ms-auto"
      }`}
    >
      {message.content}
      <span
        className={`created-at absolute text-xs right-0 bottom-0 me-6 mb-1.5 ${
          message.status === "sent" ? "text-ms-dark" : "text-ms-almost-white"
        }`}
      >
        {createdAt}
      </span>
    </div>
  );
};

export default MessageComponent;
