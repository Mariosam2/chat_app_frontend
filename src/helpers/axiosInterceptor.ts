import axios from "axios";

interface RefreshTokenResponse {
  success: boolean;
  token: string;
}

export const chatApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

chatApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    //console.log(err.config);
    if (
      err.response.status === 401 &&
      err.config.url !== "/api/auth/refresh-token"
    ) {
      //try to refresh the token and set it as authorization header
      return chatApi
        .get<RefreshTokenResponse>("/api/auth/refresh-token")
        .then((res) => {
          //console.log(res);
          if (res.data.success) {
            //set the new token in an authorization header
            //console.log(res.data);
            const newAccessToken = res.data.token;
            chatApi.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;

            return chatApi.request(err.config);
          }
        })
        .catch((err) => {
          //console.log(err);
          //if the error was caused by the refresh token route, logout the user
          return Promise.reject(err);
        });
    }
    return Promise.reject(err);
  }
);
