import MessageComponent from "./MessageComponent";
import noMessagesImg from "../assets/no_messages.png";
import { useSelector } from "react-redux";
import type { RootState } from "..";
import { useEffect, useRef, type JSX } from "react";
import { getHoursMinutesFormatted } from "../helpers/helpers";
import { socket } from "../helpers/socket";
import type { Message } from "../types";
import { useDispatch } from "react-redux";
import { addMessage, editMessage, removeMessage } from "../slices/messageSlice";
import "./Messages.css";

const Messages = () => {
  const dispatch = useDispatch();
  const messageContainer = useRef<HTMLDivElement | null>(null);
  const { authUser } = useSelector((state: RootState) => state.authState);
  const { messages, loading, isEditing } = useSelector(
    (state: RootState) => state.messageState
  );

  interface MessageSentOrReceived extends Message {
    senderUUID: string;
  }

  useEffect(() => {
    socket.on(
      "message created",
      ({ message }: { message: MessageSentOrReceived }) => {
        const { senderUUID, ...rest } = message;
        if (senderUUID === authUser?.uuid) {
          dispatch(addMessage({ ...rest, status: "sent" }));
        } else {
          dispatch(addMessage({ ...rest, status: "received" }));
        }
      }
    );

    socket.on("message deleted", ({ messageUUID }: { messageUUID: string }) => {
      dispatch(removeMessage(messageUUID));
    });

    socket.on(
      "message updated",
      ({
        message,
        updatedMessage,
        senderUUID,
      }: {
        message: string;
        updatedMessage: Message;
        senderUUID: string;
      }) => {
        const { ...rest } = updatedMessage;

        const newMessage = {
          ...rest,
          status: authUser?.uuid === senderUUID ? "sent" : "received",
        };
        //console.log("editmessage");
        dispatch(editMessage({ messageUUID: message, newMessage }));
      }
    );
  }, []);

  useEffect(() => {
    if (messageContainer.current && !isEditing) {
      messageContainer.current.scrollTop =
        messageContainer.current.scrollHeight;
    }
  }, [messages, isEditing]);

  const ShowMessages = (): JSX.Element => {
    return !loading && messages.length > 0 ? (
      <div
        ref={messageContainer}
        className="messages-container flex  grow-1 md:grow-0 flex-col p-4 xl:p-20 pb-4 h-[400px]  md:h-[calc(90vh-60px)] md:min-h-[680px] border-b border-ms-dark overflow-y-scroll overflow-x-hidden "
      >
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
      <div className="h-[400px] grow-1 md:grow-0 md:h-[calc(90vh-60px)] md:min-h-[680px]">
        Loading...
      </div>
    ) : (
      <div className=" h-[400px] grow-1 md:grow-0 md:h-[calc(90vh-60px)] md:min-h-[680px] grid place-items-center text-ms-almost-white">
        <img className="no-messages" src={noMessagesImg} alt="" />
      </div>
    );
  };

  return <ShowMessages />;
};

export default Messages;
