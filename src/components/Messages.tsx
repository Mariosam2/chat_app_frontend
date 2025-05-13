import MessageComponent from "./MessageComponent";
import noMessagesImg from "../assets/no_messages.png";
import { useSelector } from "react-redux";
import type { RootState } from "..";
import { type JSX } from "react";

const Messages = () => {
  const { messages, loading } = useSelector(
    (state: RootState) => state.chatState
  );

  const getHoursMinutesFormatted = (stringDate: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedDate = new Date(stringDate)
      .toLocaleDateString("it-IT", options)
      .split(",")[1];

    return formattedDate;
  };

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
