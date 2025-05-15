import io from "socket.io-client";
import { chatApi } from "./axiosInterceptor";

export const socket = io(import.meta.env.VITE_BASE_URL, {
  secure: false,
  reconnection: false,
  autoConnect: false,
});

interface RefreshTokenResponse {
  success: boolean;
  token: string;
}
const getToken = async () => {
  const response = await chatApi.get<RefreshTokenResponse>(
    "/api/auth/refresh-token"
  );
  return response.data;
};

export const retrySocketConnection = async () => {
  //refreshing the token and reconnect the socket
  socket.disconnect();
  try {
    const { token } = await getToken();
    console.log(token);
    console.log("retrying connection");
    socket.io.opts.query = { token };
    socket.connect();
  } catch (err: unknown) {
    console.log(err);
    socket.io.opts.query = { token: "" };
    socket.connect();
  }
};
