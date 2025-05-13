import React, { useEffect, useState } from "react";
import { chatApi, type AuthUser } from "../helpers/axiosInterceptor";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import type { RootState } from "../index";
import { useDispatch } from "react-redux";
import {
  isEditing,
  setConfirmPasswordHidden,
  setPasswordHidden,
  userEdited,
} from "../slices/profileSlice";
import "./EditProfile.css";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import userEditedLottie from "../assets/user_edited.lottie";
import { saveAuthUser } from "../slices/authSlice";

interface EditProfileProps {
  authUser: AuthUser | null;
}

const EditProfile = ({ authUser }: EditProfileProps) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState(authUser?.username);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState({
    field: null,
    message: null,
  });
  const { passwordHidden, confirmPasswordHidden, editing, userHasBeenEdited } =
    useSelector((state: RootState) => state.profileState);
  const [passwordOrTextType, setPasswordOrTextType] = useState("text");
  const [confirmPasswordOrTextType, setConfrimPasswordOrTextType] =
    useState("text");

  useEffect(() => {
    setPasswordOrTextType(passwordHidden ? "password" : "text");
  }, [passwordHidden]);

  useEffect(() => {
    setConfrimPasswordOrTextType(confirmPasswordHidden ? "password" : "text");
  }, [confirmPasswordHidden]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const changedUsername = e.target.value;
    setUsername(changedUsername);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const changedPassword = e.target.value;
    setPassword(changedPassword);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const changedConfirmPassword = e.target.value;
    setConfirmPassword(changedConfirmPassword);
  };

  const togglePasswordEye = () => {
    dispatch(setPasswordHidden(!passwordHidden));
  };

  const toggleConfirmPasswordEye = () => {
    dispatch(setConfirmPasswordHidden(!confirmPasswordHidden));
  };

  const closePanel = () => {
    dispatch(isEditing(false));
    setTimeout(() => {
      dispatch(userEdited(false));
    }, 250);
  };

  interface UpdateResponse {
    success: boolean;
    message: string;
    user: AuthUser;
  }

  const updateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError({ field: null, message: null });

    const formData = new FormData();

    if (selectedImage) {
      formData.append("profile_picture", selectedImage);
    }

    if (authUser && username) {
      formData.append(
        "username",
        username === authUser.username ? "" : username
      );
    }
    console.log(selectedImage);
    formData.append("path", selectedImage ? selectedImage.name : "");

    formData.append("password", password);
    formData.append("confirm_password", confirmPassword);

    chatApi
      .put<UpdateResponse>(`/api/users/${authUser?.uuid}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      .then((res) => {
        if (res.data.success) {
          console.log("edited");
          //show something to the user as a feedback
          dispatch(saveAuthUser(res.data.user));
          dispatch(userEdited(true));
        }
      })
      .catch((err) => {
        //check for validation errors
        //otherwise redirect to error component
        if (err.response?.data?.invalidField) {
          setValidationError({
            field: err.response.data?.invalidField,
            message: err.response.data?.message,
          });
        } else {
          //redirect to error component
        }
      });
  };

  const ShowPasswordEye = () => {
    if (!passwordHidden) {
      return (
        <EyeIcon
          onClick={togglePasswordEye}
          className="size-5 cursor-pointer text-ms-dark absolute right-0 me-2 bottom-[17.5px] translate-y-[50%]"
        />
      );
    } else {
      return (
        <EyeSlashIcon
          onClick={togglePasswordEye}
          className="size-5 cursor-pointer text-ms-dark absolute right-0 me-2 bottom-[17.5px] translate-y-[50%]"
        />
      );
    }
  };

  const ShowConfirmPasswordEye = () => {
    if (!confirmPasswordHidden) {
      return (
        <EyeIcon
          onClick={toggleConfirmPasswordEye}
          className="size-5 cursor-pointer text-ms-dark absolute right-0 me-2 bottom-[17.5px] translate-y-[50%]"
        />
      );
    } else {
      return (
        <EyeSlashIcon
          onClick={toggleConfirmPasswordEye}
          className="size-5 cursor-pointer text-ms-dark absolute right-0 me-2 bottom-[17.5px] translate-y-[50%]"
        />
      );
    }
  };

  return (
    <>
      <div
        className={`edit-panel w-md relative bg-ms-dark text-ms-almost-white p-8 rounded-xl z-2 ${
          editing ? "show" : ""
        }`}
      >
        <XMarkIcon
          onClick={closePanel}
          className="size-6 cursor-pointer absolute top-[12px] right-[12px]"
        />
        <form
          className={`${userHasBeenEdited ? "hidden" : "block"}`}
          action="/"
          encType="multipart/form-data"
        >
          <div className="profile-picture">
            <img
              className="w-[250px] aspect-square object-cover  rounded-full mx-auto"
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : import.meta.env.VITE_BASE_URL + authUser?.profile_picture
              }
              alt="selected-picture"
            />
            <div className="select-picture relative w-fit mx-auto mt-6 mb-8">
              <input
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/webp"
                className="absolute opacity-0 w-[250px] right-0  top-1/2 z-2 translate-y-[-50%]  py-2 px-4 cursor-pointer"
                name="profile-picture"
                // Event handler to capture file selection and update the state
                onChange={(event) => {
                  if (event.target.files) {
                    setSelectedImage(event.target.files[0]); // Update the state with the selected file
                  }
                }}
              />
              <span className="text-red-500 block text-sm h-[20px] my-2 text-center capitalize">
                {validationError.field === "profile_picture"
                  ? validationError.message
                  : ""}
              </span>
              <div className="change-picture bg-ms-secondary relative z-1 px-4 py-2 rounded-2xl">
                Change picture
              </div>
            </div>
          </div>

          <div className="flex flex-col mb-3">
            <label htmlFor="username" className="pb-3 font-light text-sm">
              Username
            </label>
            <input
              className={`bg-ms-almost-white  h-[35px] focus:outline-none rounded-xl text-ms-dark  p-1.5 ${
                validationError.field === "username" ||
                validationError.field === "all"
                  ? "border border-red-500"
                  : ""
              }`}
              onChange={handleUsernameChange}
              type="text"
              name="username"
              id="username"
              value={username}
            />
            <span className="text-red-500 text-sm h-[20px]">
              {validationError.field === "username"
                ? validationError.message
                : ""}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-2">
            <div className="password-input  relative mb-3">
              <label htmlFor="password" className=" font-light text-sm">
                Password
              </label>
              <input
                onChange={handlePasswordChange}
                value={password}
                className={`w-full mt-2 h-[35px] ${
                  passwordOrTextType === "password" ? "font-extrabold" : ""
                } ${
                  validationError.field === "password" ||
                  validationError.field === "all"
                    ? "border border-red-500"
                    : ""
                } bg-ms-almost-white p-1.5 focus:outline-none rounded-xl text-ms-dark`}
                type={passwordOrTextType}
                name="password"
                id="password"
              />

              <ShowPasswordEye />
            </div>

            <div className="confirm-password  relative mb-3">
              <label htmlFor="confirm-password" className=" font-light text-sm">
                Confirm Password
              </label>
              <input
                onChange={handleConfirmPasswordChange}
                value={confirmPassword}
                className={`w-full mt-2  h-[35px] ${
                  confirmPasswordOrTextType === "password"
                    ? "font-extrabold"
                    : ""
                } ${
                  validationError.field === "password" ||
                  validationError.field === "all"
                    ? "border border-red-500"
                    : ""
                } bg-ms-almost-white p-1.5 focus:outline-none rounded-xl text-ms-dark`}
                type={confirmPasswordOrTextType}
                name="confirm-password"
                id="confirm-password"
              />

              <ShowConfirmPasswordEye />
            </div>
            <span className="text-red-500  col-span-2  text-sm min-h-[20px]">
              {validationError.field === "password" ||
              validationError.field === "all"
                ? validationError.message
                : ""}
            </span>
          </div>
          <div
            onClick={updateUser}
            className="save bg-ms-secondary px-4 py-2 rounded-2xl cursor-pointer mt-6 w-fit"
          >
            Save
          </div>
        </form>
        <div
          className={`user-edited w-sm  z-2 ${
            userHasBeenEdited ? "block" : "hidden"
          }`}
        >
          <DotLottieReact src={userEditedLottie} autoplay speed={0.75} />
          <div className="text-ms-almost-white text-lg font-semibold text-center my-3">
            User edited successfully
          </div>
        </div>
      </div>
      <div
        className={`layover fixed w-full h-full left-0 bottom-0 z-1 bg-ms-layover ${
          editing ? "block" : "hidden"
        }`}
      ></div>
    </>
  );
};

export default EditProfile;
