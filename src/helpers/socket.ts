import io from "socket.io-client";
import { chatApi } from "./axiosInterceptor";

export const socket = io(import.meta.env.VITE_BASE_URL, {
  secure: false,
  reconnection: false,
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
  socket.disconnect();

  console.log("Provo a riconnettermi...");
  const { token } = await getToken();

  socket.io.opts.query = { token };
  socket.connect();
};
