import MessageComponent from "./MessageComponent";
import noMessagesImg from "../assets/no_messages.png";
import { useSelector } from "react-redux";
import type { RootState } from "..";
import { type JSX } from "react";
import { getHoursMinutesFormatted } from "../helpers/helpers";

const Messages = () => {
  const { messages, loading } = useSelector(
    (state: RootState) => state.chatState
  );

  const ShowMessages = (): JSX.Element => {
    return !loading && messages.length > 0 ? (
      <div className="messages-container flex flex-col p-24  h-[calc(90vh-60px)] border-b border-ms-dark ">
        {messages.map((message, index) => {
          const messageCreatedAt = getHoursMinutesFormatted(message.created_at);
          return (
            <MessageComponent
              key={index}
              index={index}
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

  return <ShowMessages />;
};

export default Messages;
