import { Mic, Paperclip, ArrowUp } from "lucide-react";
import { useRef, useState, useCallback } from "react";

const InputField = ({setOpened}: {setOpened: (opened: boolean) => void}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const AssistantName = import.meta.env.VITE_ASSISTANT_NAME;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);

      // Auto-resize: reset to auto first so it can shrink, then set to scrollHeight
      const el = e.target;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`; // cap at ~8 lines
    },
    [],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter, new line on Shift+Enter
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!value.trim()) return;
    // TODO: wire up to your send handler
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const hasText = value.trim().length > 0;

  return (
    <div className="z-100 fixed bottom-4 mx-auto justify-self-center min-w-3/5 flex flex-col items-center gap-3 animate-fade-in-up-delay-4">
      <div
        className="backdrop-blur-lg w-full flex items-end rounded-2xl py-2 px-3 gap-2 transition-all duration-200"
        id="chat-input-bar"
        style={{
          border: "1px solid var(--color-border-input)",
        }}
        onFocusCapture={(e) => {
          const bar = e.currentTarget;
          bar.style.borderColor = "var(--color-border-input-focus)";
          bar.style.backgroundColor = "var(--color-bg-input-focus)";
          bar.style.boxShadow = `0 0 20px var(--color-focus-glow)`;
        }}
        onBlurCapture={(e) => {
          // Only reset if focus left the entire bar
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            const bar = e.currentTarget;
            bar.style.borderColor = "var(--color-border-input)";
            bar.style.backgroundColor = "var(--color-bg-input)";
            bar.style.boxShadow = "none";
          }
        }}
      >
        {/* Attach button */}
        <button
          className="p-2 mb-1 hover:bg-white/20 hover:scale-105 w-10 h-10 flex items-center justify-center rounded-full shrink-0 transition-all duration-200 cursor-pointer"
          aria-label="Attach file"
          id="attach-btn"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          <Paperclip size={18} strokeWidth={1.5} />
        </button>

        {/* Textarea — auto-resizes, no fixed height */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="flex-1 min-h-[40px] max-h-[200px] py-2 px-1 text-sm font-normal bg-transparent focus:outline-none resize-none overflow-y-auto leading-relaxed "
          placeholder={`Message ${AssistantName}...`}
          id="chat-input"
          autoComplete="off"
          style={{ color: "var(--color-text-primary)" }}
        />

        {/* Send button (visible when text present) or Mic button */}
        {hasText ? (
          <button
            onClick={handleSubmit}
            className="w-10 h-10 mb-1 flex items-center justify-center rounded-full shrink-0 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Send message"
            id="send-btn"
            style={{
              backgroundColor: "var(--color-bg-mic)",
              color: "var(--color-text-primary)",
              boxShadow: `0 4px 20px var(--color-shadow-mic)`,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--color-bg-mic-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-bg-mic)")
            }
          >
            <ArrowUp size={18} strokeWidth={2.5} />
          </button>
        ) : (
          <button
            className="w-10 h-10 mb-1 flex items-center justify-center rounded-full shrink-0 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Voice input"
            id="mic-btn"
            style={{
              backgroundColor: "var(--color-bg-mic)",
              color: "var(--color-text-primary)",
              boxShadow: `0 4px 20px var(--color-shadow-mic)`,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--color-bg-mic-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-bg-mic)")
            }
          >
            <Mic onClick={() => setOpened(true)} size={20} strokeWidth={2} />
          </button>
        )}
      </div>

      <p
        className="text-[11px] uppercase tracking-[0.2em] font-medium"
        style={{ color: "var(--color-text-footer)" }}
      >
        {AssistantName} uses secure voice recognition technology
      </p>
    </div>
  );
};

export default InputField;
