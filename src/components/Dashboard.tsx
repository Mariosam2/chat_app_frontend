import {
  useEffect,
  useState,
  type Dispatch,
  type JSX,
  type SetStateAction,
} from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../index";
import { chatApi } from "../helpers/axiosInterceptor";
import { useNavigate } from "react-router";
import "./Dashboard.css";
import Chat from "./Chat";
import { type ChatType } from "../types";

interface ChatsResponse {
  success: true;
  chats: ChatType[];
}

const Dashboard = () => {
  const { authUser } = useSelector((state: RootState) => state.authState);
  const navigate = useNavigate();
  const [chats, setChats]: [ChatType[], Dispatch<SetStateAction<ChatType[]>>] =
    useState<ChatType[]>([]);
  const getChats = () => {
    chatApi
      .get<ChatsResponse>(`/api/chats/${authUser?.uuid}`)
      .then((res) => {
        setChats(res.data.chats);
      })
      .catch((err) => {
        navigate(`/error/${err.response.status}/${err.response.data.message}`);
      });
  };

  const ShowChats = (): JSX.Element => {
    return chats.length > 0 ? (
      <>
        {chats.map((chat, index) => {
          const options: Intl.DateTimeFormatOptions = {
            hour: "2-digit",
            minute: "2-digit",
          };
          const messageDate = new Date(
            chat.lastMessage?.created_at
          ).toLocaleDateString("it-IT", options);

          const messageCreatedAt = messageDate.split(",")[1];
          return (
            <Chat key={index} chat={chat} messageCreatedAt={messageCreatedAt} />
          );
        })}
      </>
    ) : (
      <div>No chats yet</div>
    );
  };

  useEffect(() => {
    if (authUser !== null) {
      getChats();
    }
  }, [authUser]);
  return (
    <section className="dashboard h-screen grid grid-cols-10 grid-row-6">
      <div className="top-panel col-span-10 row-span-1 bg-ms-dark"></div>
      <div className="chats-panel col-span-2 row-span-5 row-start-2 bg-ms-dark grid grid-rows-6">
        <ShowChats />
      </div>
      <div className="chat-panel col-span-7 row-span-5 row-start-2 bg-ms-darker"></div>
      <div className="side-panel col-span-1 row-span-5 row-start-2"></div>
    </section>
  );
};

export default Dashboard;
