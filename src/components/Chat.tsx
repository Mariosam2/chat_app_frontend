import { useSelector } from "react-redux";
import { chatApi } from "../helpers/axiosInterceptor";
import { type ChatType } from "../types";
import type { RootState } from "../index";
import { useDispatch } from "react-redux";
import {
  chatLoading,
  finishedChatLoading,
  setActiveChat,
  setMessages,
  type ChatState,
} from "../slices/chatSlice";
import { useNavigate } from "react-router";

import "./Chat.css";

interface MessagesResponse extends ChatState {
  success: boolean;
}

const Chat = ({
  chat,
  messageCreatedAt,
}: {
  chat: ChatType;
  messageCreatedAt: string;
}) => {
  const navigate = useNavigate();
  const { authUser } = useSelector((state: RootState) => state.authState);
  const { activeChat } = useSelector((state: RootState) => state.chatState);
  const dispatch = useDispatch();
  const getMessages = (userUUID: string, chatUUID: string) => {
    dispatch(setActiveChat(chat.uuid));
    if (activeChat !== chat.uuid) {
      dispatch(chatLoading());
      chatApi
        .get<MessagesResponse>(`/api/messages/${userUUID}/${chatUUID}`)
        .then((res) => {
          if (res.data.success) {
            //dispatch setMessages
            console.log(res.data);
            dispatch(setMessages(res.data.messages));
            dispatch(finishedChatLoading());
          }
        })
        .catch((err) => {
          finishedChatLoading();
          navigate(
            `/error/${err.response.status}/${err.response.data.message}`
          );
        });
    }
  };

  return (
    <div
      onClick={() => getMessages(authUser!.uuid, chat.uuid)}
      className={`chat bg-ms-darker row-span-1 flex items-center px-4 cursor-pointer ${
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
    </div>
  );
};

export default Chat;
