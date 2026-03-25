import MessageField from "./MessageField";
import InputField from "./InputField";

const MessageContainer = () => {
  const randomMessage = [
    "Hello, how are you?",
    "I'm fine, thank you!",
    "What are you doing?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi alias fugit eveniet quam aliquid, nulla similique fugiat sit. Non, fuga!",
    "I'm working on a project.",
    "That's great!",
    "That's great!",
    "Hello, how are you?",
    "I'm fine, thank you!",
    "What are you doing?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi alias fugit eveniet quam aliquid, nulla similique fugiat sit. Non, fuga!",
    "I'm working on a project.",
    "That's great!",
    "That's great!",
    "Hello, how are you?",
    "I'm fine, thank you!",
    "What are you doing?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi alias fugit eveniet quam aliquid, nulla similique fugiat sit. Non, fuga!",
    "I'm working on a project.",
    "That's great!",
    "That's great!",
    
  ];
  return (
    <div className="relative max-h-screen px-5 py-10 flex-1 flex flex-col-reverse items-center border-0 border-red-500 overflow-y-auto">
      <div className="flex flex-col mb-20 border-b-0 ">
        {randomMessage.map((message, index) => (
          <div key={index}>
            <MessageField
              message={message}
              sender={index % 2 === 0 ? "user" : "assistant"}
            />
          </div>
        ))}
      </div>

      <InputField />
    </div>
  );
};

export default MessageContainer;
