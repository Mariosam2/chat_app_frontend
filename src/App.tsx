import { Route, Routes } from "react-router";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Error from "./components/Error";
import Dashboard from "./components/Dashboard";
import { useLocation } from "react-router";
import { useEffect, useLayoutEffect } from "react";
import { chatApi, type AuthUser } from "./helpers/axiosInterceptor";
import { useDispatch } from "react-redux";
import {
  authenticate,
  finishedLoading,
  isLoading,
  saveAuthUser,
} from "./slices/authSlice";
import RequireAuth from "./components/RequireAuth";
import RequireNoAuth from "./components/RequireNoAuth";
import { useSelector } from "react-redux";
import type { RootState } from ".";

interface AuthUserResponse {
  success: boolean;
  authUser: AuthUser;
}

function App() {
  const routePathname = useLocation().pathname;

  const { loading } = useSelector((state: RootState) => state.authState);
  const dispatch = useDispatch();
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
          dispatch(finishedLoading());
        }
      })
      .catch((err) => {
        if (err.response) {
          dispatch(authenticate(false));
          dispatch(finishedLoading());
        }
      });
  };

  //set loading everytime before the page is printed
  useLayoutEffect(() => {
    dispatch(isLoading());
  }, []);

  //when components mount make the call to check authentication
  useEffect(() => {
    //console.log("app level", routePathname);
    if (routePathname !== "/") {
      getAuthUser();
    } else {
      dispatch(finishedLoading());
    }
  }, [routePathname]);

  const RenderApp = () => {
    return loading ? (
      <div>Loading...</div>
    ) : (
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

          <Route path="/error/:statuscode/:message" element={<Error />} />
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
