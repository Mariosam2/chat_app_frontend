import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

const SendMessage = () => {
  return (
    <div className="send-message relative bg-ms-dark max-w-full h-[50px] flex justify-end items-center pe-2 my-auto mx-8">
      <input
        placeholder="Write message..."
        className="bg-ms-darker focus:outline-none text-ms-almost-white h-[70%] p-2 w-[95%] ms-auto"
        type="text"
        name=""
        id=""
      />

      <PaperAirplaneIcon className="size-6 cursor-pointer top-1/2 translate-y-[-50%] text-ms-muted absolute right-[12px]" />
    </div>
  );
};

export default SendMessage;
