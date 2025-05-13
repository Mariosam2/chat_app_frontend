export type Message = {
  uuid: string;
  content: string;
  created_at: string;
  status: string;
};

export type MessageSearchResult = {
  uuid: string;
  content: string;
  chat: {
    uuid: string;
  };
  user: {
    uuid: string;
    username: string;
    profile_picture: string;
  } | null;
};

export type User = {
  uuid: string;
  username: string;
  profile_picture: string;
};

export type ChatType = {
  uuid: string;
  lastMessage: Message;
  receiver: User;
};
