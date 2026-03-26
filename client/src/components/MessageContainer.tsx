import MessageField from "./MessageField";
import InputField from "./InputField";

const MessageContainer = () => {
  const randomMessage = [
    {message:"Hello, how are you?", sender:"user"},
    {message:"I'm fine, thanks for asking", sender:"assistant"},
    {message:"please open notepad and write a note about programming", sender:"user"},
    {message:"sure thing, i'll do that", sender:"assistant"},
    {message:"alright! it's done", sender:"assistant"},
    {message:"now open spotify", sender:"user"},
    {message:"and play some music", sender:"user"},
    {message:"doing...", sender:"assistant"},

  ];
  return (
    <div className="relative max-h-screen px-5 py-10 flex-1 flex flex-col-reverse border-0 border-red-500 overflow-y-auto scroll-smooth">
      <div className="w-full flex flex-col items-between mb-20 border-0 gap-8 ">
        {randomMessage.map((item, index) => (
          <div key={index}>
            <MessageField
              message={item.message}
              sender={item.sender as "user" | "assistant"}
            />
          </div>
        ))}
      </div>
      <div className="w-full flex justify-center">
        <InputField setOpened={() => {}} />
      </div>
    </div>
  );
};

export default MessageContainer;
