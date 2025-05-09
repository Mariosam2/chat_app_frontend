import { Route, Routes, useNavigate } from "react-router";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Chat from "./components/Chat";
import Profile from "./components/Profile";
import Error from "./components/Error";
import Dashboard from "./components/Dashboard";
import { useLocation } from "react-router";
import { useEffect } from "react";
import { chatApi, type AuthUser } from "./helpers/axiosInterceptor";
import { useDispatch } from "react-redux";
import { authenticate, saveAuthUser } from "./slices/authSlice";
import RequireAuth from "./components/RequireAuth";
import RequireNoAuth from "./components/RequireNoAuth";
import { useSelector } from "react-redux";
import type { RootState } from ".";

import store from "./store";

interface AuthUserResponse {
  success: boolean;
  authUser: AuthUser;
}

function App() {
  const routePathname = useLocation().pathname;
  const { authUser, authenticated } = useSelector(
    (state: RootState) => state.authState
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getAuthUser = () => {
    chatApi
      .get<AuthUserResponse>("/api/users/auth/logged-in")
      .then((res) => {
        console.log(res.data);
        console.log("dispatch");
        if (res.data.success) {
          //console.log("response");
          //save the logged in user in redux
          dispatch(authenticate());
          dispatch(saveAuthUser(res.data.authUser));
        }
      })
      .catch((err) => {
        if (err.response) {
          navigate(
            `/error/${err.response.status}/${err.response.data.message}`
          );
        }
      });
  };

  useEffect(() => {
    console.log(authUser, authenticated);
  }, [authUser, authenticated]);

  useEffect(() => {
    getAuthUser();
  }, [routePathname]);
  return (
    <>
      <div className="">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <RequireNoAuth>
                <Login />
              </RequireNoAuth>
            }
          />
          <Route
            path="/register"
            element={
              <RequireNoAuth>
                <Register />
              </RequireNoAuth>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route path="/chat" element={<Chat />} />
          <Route path="/error/:statuscode/:message" element={<Error />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
