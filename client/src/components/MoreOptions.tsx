import { LogOut, Settings, SlidersHorizontal, UserCircle2 } from "lucide-react";

const MoreOptions = ({ refMe }: { refMe: React.Ref<HTMLDivElement> }) => {
  const Options = [
    { icon: UserCircle2, name: "Profile", href: "#profile", isDanger: false },
    { icon: SlidersHorizontal, name: "Personalization", href: "#personalization", isDanger: false },
    { icon: Settings, name: "Settings", href: "#settings", isDanger: false },
    { icon: LogOut, name: "Log out", href: "#logout", isDanger: true },
  ];

  return (
    <div
      ref={refMe}
      className="absolute bottom-[calc(100%+8px)] left-0 w-full rounded-xl p-2 z-50 shadow-lg border"
      style={{
        backgroundColor: "var(--color-bg-sidebar)",
        borderColor: "var(--color-border-divider, var(--color-border-sidebar))",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-1">
        {Options.map((item, id) => (
          <a
            key={id}
            href={item.href}
            className={`w-full p-2 rounded-lg flex items-center gap-3 transition-colors duration-150 ${
              item.isDanger ? "text-red-500 hover:bg-red-500/10" : ""
            }`}
            style={!item.isDanger ? { color: "var(--color-text-primary)" } : {}}
            onMouseEnter={(e) => {
              if (!item.isDanger) {
                e.currentTarget.style.backgroundColor = "var(--color-bg-sidebar-item-hover)";
              }
            }}
            onMouseLeave={(e) => {
              if (!item.isDanger) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <item.icon size={18} strokeWidth={1.5} />
            <span className="text-[14px] font-medium">{item.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default MoreOptions;
