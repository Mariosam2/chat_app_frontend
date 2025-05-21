import { PaperAirplaneIcon, FaceSmileIcon } from "@heroicons/react/24/solid";
import type { RootState } from "../index";
import { useSelector } from "react-redux";
import { useState } from "react";
import { socket } from "../helpers/socket";
import { useDispatch } from "react-redux";
import { editingMessage } from "../slices/messageSlice";

const SendMessage = () => {
  const dispatch = useDispatch();
  const { activeChat } = useSelector((state: RootState) => state.chatState);
  const [message, setMessage] = useState<string | null>(null);
  const { isEditing, messageToEdit } = useSelector(
    (state: RootState) => state.messageState
  );

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const changedMessage = e.target.value;
    if (!new RegExp("^\\s+$").test(changedMessage)) {
      setMessage(changedMessage);
    }
  };

  const sendMessage = () => {
    if (message) {
      //emit send message socket event
      socket.emit("send message", {
        chatUUID: activeChat?.uuid,
        receiverUUID: activeChat?.receiver.uuid,
        content: message,
      });
      setMessage(null);
    }
  };

  const handleEnterKey = (e: React.KeyboardEvent) => {
    if (e.code === "Enter") {
      if (!isEditing) {
        sendMessage();
      } else {
        editMessage();
      }
    }
  };

  const editMessage = () => {
    socket.emit("edit message", {
      room: activeChat?.uuid,
      message: messageToEdit?.uuid,
      newMessage: message ? message : messageToEdit?.content,
      status: messageToEdit?.status,
    });
    dispatch(editingMessage({ isEditing: false, messageToEdit: null }));
    setMessage(null);
  };

  const ShowSendOrEdit = () => {
    if (!isEditing) {
      return (
        <PaperAirplaneIcon
          onClick={sendMessage}
          className="size-6 cursor-pointer top-1/2 translate-y-[-50%] bg-ms-secondary text-ms-almost-white p-1.5 rounded-full absolute right-[12px]"
        />
      );
    }

    return (
      <div className="flex items-center text-ms-almost-white  font-light">
        <div
          onClick={editMessage}
          className="edit-message cursor-pointer px-2 py-0.5 m-0.5 mx-3 h-full rounded-xl bg-ms-secondary"
        >
          Edit
        </div>
      </div>
    );
  };

  return (
    <div
      className={`send-message ${
        activeChat ? "block" : "hidden"
      }  relative bg-ms-dark  max-w-full flex justify-end items-center pe-2 my-2 mx-2 sm:mx-16`}
    >
      <div className="w-12 p-1 cursor-pointer">
        <FaceSmileIcon className="size-8 mx-auto text-ms-muted" />
      </div>
      <input
        onKeyDown={handleEnterKey}
        onChange={handleMessageChange}
        placeholder="Write message..."
        className="bg-ms-darker focus:outline-none text-ms-almost-white h-[30px] my-2 w-full p-2  ms-auto"
        type="text"
        name="message"
        id="message"
        value={message ? message : messageToEdit ? messageToEdit.content : ""}
      />
      <ShowSendOrEdit />
    </div>
  );
};

export default SendMessage;
