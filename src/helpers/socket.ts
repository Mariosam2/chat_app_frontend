import io from "socket.io-client";

export const socket = io(
  "wss://chatappbackend-production-3fab.up.railway.app/",
  {
    secure: true,
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 500,
    reconnectionDelayMax: 1000,
    transports: ["websocket"],
    transportOptions: {
      polling: {
        withCredentials: true,
      },
      websocket: {
        withCredentials: true,
      },
    },
  }
);
