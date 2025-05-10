export type Message = {
  uuid: string;
  content: string;
  created_at: string;
  status: string;
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
