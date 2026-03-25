import { Copy, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import  { useState } from "react";

interface MessageFieldProps {
  message: string;
  sender: "user" | "assistant";
}

const MessageField = ({ message, sender }: MessageFieldProps) => {
  const [hover, setHover] = useState(false);
  return (
    <>
      <div className={`border-0 relative py-0 animate-fade-in-up-delay-4 w-fit max-w-1/2 flex flex-col ${
    sender === "user" ? "ml-auto" : "mr-auto"
  }`}  onMouseLeave={() => setHover(false)}>
        <div
          className={`p-2.5 rounded-2xl hover:cursor-default ${sender === "user" ? "bg-message-user" : "bg-message-assistant"}`}
          onMouseEnter={() => setHover(true)}
        >
          {message}
        </div>
        <div
          className={
            hover
              ? "absolute -bottom-8 left-0 w-full flex justify-start items-center"
              : "hidden"
          }
        >
          <button className="p-1 hover:bg-white/20 hover:scale-105 w-8 h-8 flex items-center justify-center rounded-full shrink-0 transition-colors duration-200 cursor-pointer">
            <Copy size={15} strokeWidth={1.5} />
          </button>
          {sender === "assistant" && (
            <>
              <button className="p-1 hover:bg-white/20 hover:scale-105 w-8 h-8 flex items-center justify-center rounded-full shrink-0 transition-colors duration-200 cursor-pointer">
                <ThumbsUp size={15} strokeWidth={1.5} />
              </button>
              <button className="p-1 hover:bg-white/20 hover:scale-105 w-8 h-8 flex items-center justify-center rounded-full shrink-0 transition-colors duration-200 cursor-pointer">
                <ThumbsDown size={15} strokeWidth={1.5} />
              </button>
              <button className="p-1 hover:bg-white/20 hover:scale-105 w-8 h-8 flex items-center justify-center rounded-full shrink-0 transition-colors duration-200 cursor-pointer">
                <Share2 size={15} strokeWidth={1.5} />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MessageField;
