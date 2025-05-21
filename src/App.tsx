import { Route, Routes } from "react-router";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Error from "./components/Error";
import Dashboard from "./components/Dashboard";
import { useLocation } from "react-router";
import { useEffect, useLayoutEffect } from "react";
import { chatApi } from "./helpers/axiosInterceptor";
import { useDispatch } from "react-redux";
import {
  authenticate,
  finishedAuthLoading,
  authLoading,
  saveAuthUser,
} from "./slices/authSlice";
import RequireAuth from "./components/RequireAuth";
import RequireNoAuth from "./components/RequireNoAuth";
import { useSelector } from "react-redux";
import type { RootState } from ".";
import type { User } from "./types";

interface AuthUserResponse {
  success: boolean;
  authUser: User;
}

function App() {
  const routePathname = useLocation().pathname;
  const { loading, authenticated } = useSelector(
    (state: RootState) => state.authState
  );
  const dispatch = useDispatch();

  //set loading everytime before the page is printed
  useLayoutEffect(() => {
    dispatch(authLoading());
  }, []);

  //when components mount make the call to check authentication
  useEffect(() => {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
    //console.log("app level", routePathname);
    if (routePathname !== "/" && !authenticated) {
      getAuthUser();
    } else {
      dispatch(finishedAuthLoading());
    }
  }, [routePathname]);

  const getAuthUser = () => {
    chatApi
      .get<AuthUserResponse>("/api/users/auth/logged-in")
      .then((res) => {
        //console.log(res.data);
        //console.log("dispatch");
        if (res.data.success) {
          //console.log("response");
          //save the logged in user in redux

          dispatch(authenticate(true));
          dispatch(saveAuthUser(res.data.authUser));
          dispatch(finishedAuthLoading());
        }
      })
      .catch((err) => {
        if (err) {
          dispatch(authenticate(false));
          dispatch(finishedAuthLoading());
        }
      });
  };

  const RenderApp = () => {
    return loading ? (
      <div>Loading...</div>
    ) : (
      <div className="app">
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
          <Route path="/error/:statuscode?/:message" element={<Error />} />
        </Routes>
      </div>
    );
  };
  return (
    <>
      <RenderApp />
    </>
  );
}

export default App;
