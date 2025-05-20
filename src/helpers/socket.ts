import io from "socket.io-client";

export const socket = io(import.meta.env.VITE_BASE_URL, {
  port: "3000",
  secure: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 500,
  reconnectionDelayMax: 1000,
  transportOptions: {
    polling: {
      withCredentials: true,
    },
    websocket: {
      withCredentials: true,
    },
  },
});
