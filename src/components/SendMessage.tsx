import { PaperAirplaneIcon, FaceSmileIcon } from "@heroicons/react/24/solid";

const SendMessage = () => {
  return (
    <div className="send-message relative bg-ms-dark  max-w-full h-[50px] flex justify-end items-center pe-2 my-auto mx-16">
      <div className="w-12 p-1 cursor-pointer">
        <FaceSmileIcon className="size-8 mx-auto text-ms-muted" />
      </div>
      <input
        placeholder="Write message..."
        className="bg-ms-darker focus:outline-none text-ms-almost-white h-[70%] w-full p-2  ms-auto"
        type="text"
        name=""
        id=""
      />

      <PaperAirplaneIcon className="size-6 cursor-pointer top-1/2 translate-y-[-50%] bg-ms-secondary text-ms-almost-white p-1.5 rounded-full absolute right-[12px]" />
    </div>
  );
};

export default SendMessage;
