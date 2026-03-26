import {
  Sparkles,
} from "lucide-react";
import InputField from "./InputField";


const AssistantName = import.meta.env.VITE_ASSISTANT_NAME;
const UserName = import.meta.env.VITE_USER_NAME;


const HeroSection = ({setOpened}: {setOpened: (opened: boolean) => void}) => {
  return (
    <main className="h-full flex-1 flex flex-col items-center justify-between overflow-hidden p-8 border-0">
      {/* Hero Section */}
      <section className="w-full border-0 flex flex-col items-center text-center relative z-1 gap-4">
        {/* Animated Orb */}
        <div className="relative w-[120px] h-[120px] mb-6 animate-fade-in-up">
          {/* Glow */}
          <div
            className="absolute -inset-[30%] rounded-full blur-[20px] animate-orb-pulse"
            style={{ background: "var(--color-bg-orb)" }}
          />
          {/* Inner circle with sparkle */}
          <div
            className="relative w-full h-full flex items-center justify-center rounded-full"
            style={{
              background: "var(--color-bg-orb-inner)",
              border: "1px solid var(--color-border-orb)",
            }}
          >
            <Sparkles
              className="w-12 h-12 animate-sparkle-rotate"
              strokeWidth={1.5}
              style={{ color: "var(--color-accent-primary)" }}
            />
          </div>
        </div>

        {/* Hero Text */}
        <h1
          className="text-[2.75rem] font-extrabold leading-tight tracking-tight animate-fade-in-up-delay-1"
          style={{ color: "var(--color-text-primary)" }}
        >
          Hey {UserName}, I'm{" "}
          <span className="text-gradient-accent capitalize">
            {AssistantName}
          </span>
          .
        </h1>

        <p
          className="text-base font-normal max-w-[380px] leading-relaxed animate-fade-in-up-delay-2"
          style={{ color: "var(--color-text-secondary)" }}
        >
          How can I help you today? I'm ready to listen, plan, or just chat.
        </p>
      </section>

      <InputField setOpened={setOpened} />
    </main>
  );
};

export default HeroSection;
