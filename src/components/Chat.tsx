import { useSelector } from "react-redux";
import { chatApi } from "../helpers/axiosInterceptor";
import { type ChatType } from "../types";
import type { RootState } from "../index";
const Chat = ({
  chat,
  messageCreatedAt,
}: {
  chat: ChatType;
  messageCreatedAt: string;
}) => {
  const { authUser } = useSelector((state: RootState) => state.authState);
  const showMessages = (chatUUID: string, userUUID: string) => {
    chatApi
      .get(`/api/messages/${userUUID}/${chatUUID}`)
      .then((res) => {
        console.log(res);
        //dispatch setMessages
      })
      .catch();
  };

  return (
    <div
      onClick={() => showMessages(authUser!.uuid, chat.uuid)}
      className="chat bg-ms-darker row-span-1 flex items-center px-4 cursor-pointer"
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
      <div className="content px-2 grow">
        <h5 className="text-xl text-ms-almost-white">
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
