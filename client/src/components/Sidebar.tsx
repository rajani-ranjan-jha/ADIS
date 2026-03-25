import { useEffect, useRef, useState } from "react";
import {
  MessageSquare,
  Plus,
  MoreVertical,
  AudioLines,
  SidebarClose,
  EditIcon,
  SidebarOpen,
} from "lucide-react";
import MoreOptions from "./MoreOptions";

interface ChatItem {
  id: string;
  title: string;
}

const AssistantName = import.meta.env.VITE_ASSISTANT_NAME;
const UserName = import.meta.env.VITE_USER_NAME;
const AssistantVersion = import.meta.env.VITE_ASSISTANT_VERSION;

const recentChats: ChatItem[] = [
  { id: "1", title: "Morning Routine" },
  { id: "2", title: "Project Aura Planning" },
  { id: "3", title: "Voice Memo 3/17" },
  { id: "4", title: "Travel Itinerary" },
  { id: "11", title: "Morning Routine" },
  { id: "12", title: "Project Aura Planning" },
  { id: "13", title: "Voice Memo 3/17" },
  { id: "14", title: "Travel Itinerary" },
];

const Sidebar = () => {
  const [activeChat, setActiveChat] = useState<string>("1");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isMoreOptionEnabled, setIsMoreOptionEnabled] =
    useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const childRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        childRef.current &&
        !childRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMoreOptionEnabled(false);
      }
    };
    if (isMoreOptionEnabled) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMoreOptionEnabled]);

  // TODO: small width
  if (!isSidebarOpen) {
    return (
      <aside className="min-w-8 max-h-screen flex flex-col px-2 py-5 relative z-100 border-r border-border-sidebar bg-sidebar">
        {/* Brand / Logo */}
        <div className="w-full flex justify-center items-center gap-3 mb-6 border-0">
          <div
            className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
            style={{ background: !isHovered ? `var(--color-accent-gradient)` : "" }}
            onClick={() => setIsSidebarOpen(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isHovered ? (
              <SidebarOpen size={22} strokeWidth={1.5} />
            ) : (
              <AudioLines
                className="w-5 h-5"
                style={{ color: "var(--color-text-primary)" }}
              />
            )}
          </div>
        </div>

        {/* New Chat Button */}
        <button
          id="new-chat-btn"
          className="w-9 h-9 p-2 text-sm rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer bg-new-chat text-primary mx-auto"
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              "var(--color-bg-new-chat-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--color-bg-new-chat)")
          }
        >
          <EditIcon className="w-4 h-4" />
        </button>
        {/* User Profile */}
          {isMoreOptionEnabled && <MoreOptions refMe={childRef} />}
        <div className="flex justify-center items-center gap-3 p-2 mt-auto hover:bg-white/20 rounded-full">

          <button
            ref={buttonRef}
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 bg-avatar text-primary"
            onClick={(e) => {
              e.stopPropagation();
              setIsMoreOptionEnabled((prev) => !prev);
            }}
          >
            {UserName.charAt(0).toUpperCase()}
          </button>
        </div>
      </aside>
    );
  }

  // full chat width
  return (
    <aside
      className="w-60 min-w-60 max-h-screen flex flex-col p-5 relative z-100"
      style={{
        backgroundColor: "var(--color-bg-sidebar)",
        borderRight: "1px solid var(--color-border-sidebar)",
      }}
    >
      {/* Brand / Logo */}
      <div className="flex justify-between items-center gap-3 mb-6 border-0">
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
          style={{ background: "var(--color-accent-gradient)" }}
        >
          <AudioLines
            className="w-5 h-5"
            style={{ color: "var(--color-text-primary)" }}
          />
        </div>
        <div className="flex flex-col ">
          <span
            className="capitalize text-md font-semibold leading-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            {AssistantName}
          </span>
          <span
            className="text-[11px] font-normal"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            {AssistantVersion}
          </span>
        </div>
        <div className="justify-self-end">
          <button
            className="p-2 hover:bg-white/20 rounded-md cursor-default"
            onClick={() => setIsSidebarOpen(false)}
          >
            <SidebarClose size={22} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <button
        id="new-chat-btn"
        className="w-full py-3 px-4 text-sm rounded-[10px] flex items-center justify-center gap-2 mb-8 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer bg"
        style={{
          backgroundColor: "var(--color-bg-new-chat)",
          color: "var(--color-text-primary)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor =
            "var(--color-bg-new-chat-hover)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--color-bg-new-chat)")
        }
      >
        <EditIcon size={18} />
        New Chat
      </button>

      {/* Recent Activity Label */}
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-3 pl-2"
        style={{ color: "var(--color-text-sidebar-label)" }}
      >
        Recent Activity
      </p>

      {/* Chat List */}
      <ul className="flex-1 overflow-y-auto flex flex-col gap-1">
        {recentChats.map((chat) => (
          <li
            key={chat.id}
            className="flex items-center gap-3 py-3 px-3 rounded-[10px] text-[13px] font-normal cursor-pointer transition-colors duration-150"
            style={{
              backgroundColor:
                activeChat === chat.id
                  ? "var(--color-bg-sidebar-item-active)"
                  : "var(--color-bg-sidebar-item)",
              color:
                activeChat === chat.id
                  ? "var(--color-text-primary)"
                  : "var(--color-text-secondary)",
            }}
            onClick={() => setActiveChat(chat.id)}
            onMouseEnter={(e) => {
              if (activeChat !== chat.id) {
                e.currentTarget.style.backgroundColor =
                  "var(--color-bg-sidebar-item-hover)";
                e.currentTarget.style.color = "var(--color-text-primary)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeChat !== chat.id) {
                e.currentTarget.style.backgroundColor =
                  "var(--color-bg-sidebar-item)";
                e.currentTarget.style.color = "var(--color-text-secondary)";
              }
            }}
          >
            <MessageSquare
              className="w-4 h-4 shrink-0"
              size={16}
              strokeWidth={1.5}
              style={{ color: "var(--color-text-tertiary)" }}
            />
            {chat.title}
          </li>
        ))}
      </ul>

      {/* User Profile */}
      <div
        className="relative flex items-center gap-3 pt-4 p-2 mt-auto hover:bg-white/20 rounded-xl"
        style={{ borderTop: "1px solid var(--color-border-divider)" }}
      >
        {isMoreOptionEnabled && <MoreOptions refMe={childRef} />}

        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0"
          style={{
            backgroundColor: "var(--color-bg-avatar)",
            color: "var(--color-text-primary)",
          }}
        >
          {UserName.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span
            className="text-[13px] font-semibold leading-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            {UserName}
          </span>
          <span
            className="text-[11px] font-normal"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Premium Member
          </span>
        </div>
        <button
          ref={buttonRef}
          className="p-1 rounded-md transition-colors duration-150 cursor-pointer"
          aria-label="User menu"
          style={{ color: "var(--color-text-tertiary)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-text-primary)";
            e.currentTarget.style.backgroundColor =
              "var(--color-bg-sidebar-item-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-text-tertiary)";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          onClick={(e) => {
            e.stopPropagation();
            setIsMoreOptionEnabled((prev) => !prev);
          }}
        >
          <MoreVertical size={18} strokeWidth={1.5} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
