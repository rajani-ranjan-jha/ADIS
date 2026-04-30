import {
  Bot,
  Mic,
  Volume2,
  Sparkles,
  MessageSquare,
  Cpu,
  Terminal,
  Zap,
  Sliders,
  BrainCircuit,
  Type,
} from "lucide-react";
import { useState } from "react";
import { SendNotification } from "../SendNotification";

export default function AssistantSettings() {
  // State for AI Personality
  const [assistantName, setAssistantName] = useState("Aura");
  const [toneStyle, setToneStyle] = useState("Professional & Helpful");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful AI assistant that provides accurate information...",
  );

  // State for Model Configuration
  const [llmProvider, setLlmProvider] = useState("Google (Gemini)");
  const [modelSelection, setModelSelection] = useState("Gemini 1.5 Pro");
  const [creativity, setCreativity] = useState(50);
  const [maxTokens, setMaxTokens] = useState(2048);

  // State for Chat Behavior
  const [autoScroll, setAutoScroll] = useState(true);
  const [enterToSend, setEnterToSend] = useState(true);
  const [markdownRendering, setMarkdownRendering] = useState(true);
  const [codeHighlighting, setCodeHighlighting] = useState(true);

  // State for Voice Settings
  const [alwaysListening, setAlwaysListening] = useState(true);
  const [spokenResponses, setSpokenResponses] = useState(false);

  const handleUpdateSettings = () => {
    // Validation
    if (!assistantName.trim()) {
      SendNotification("Assistant name cannot be empty", "error");
      return;
    }

    // In a real app, we would save to API/LocalStorage here
    SendNotification("Assistant settings updated successfully!", "success");
  };

  const handleTestVoice = () => {
    SendNotification("Voice testing started...", "default");
    // Voice testing logic would go here
  };

  const handleUpdatePersonality = () => {
    SendNotification("Personality updated successfully!", "success");
  }

  const handleUpdateConfiguration = () => {
    SendNotification("Configuration updated successfully!", "success");
  }

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      <div className="border-b border-border-divider pb-6">
        <h2 className="text-3xl font-bold tracking-tight text-primary">
          Assistant Settings
        </h2>
        <p className="text-secondary mt-2 text-sm">
          Fine-tune your AI's personality, intelligence, and behavior.
        </p>
      </div>
      <div className="space-y-6">
        {/* Personality & Prompt Section */}
        <section className="bg-card border border-border-card rounded-2xl p-6 shadow-card hover:border-border-card-hover transition-colors">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-indigo-500/10 text-accent-primary rounded-xl border border-indigo-500/20">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary">
                AI Personality
              </h3>
              <p className="text-text-muted text-sm">
                Define how the assistant communicates
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                  <Bot size={16} /> Assistant Name
                </label>
                <input
                  type="text"
                  value={assistantName}
                  onChange={(e) => setAssistantName(e.target.value)}
                  className="w-full bg-input border border-border-input rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-border-input-focus transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                  <Type size={16} /> Tone Style
                </label>
                <select
                  value={toneStyle}
                  onChange={(e) => setToneStyle(e.target.value)}
                  className="w-full bg-input border border-border-input rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-border-input-focus transition-all appearance-none cursor-pointer"
                >
                  <option className="bg-app text-primary">
                    Professional & Helpful
                  </option>
                  <option className="bg-app text-primary">
                    Friendly & Casual
                  </option>
                  <option className="bg-app text-primary">
                    Concise & Direct
                  </option>
                  <option className="bg-app text-primary">
                    Creative & Playful
                  </option>
                  <option className="bg-app text-primary">
                    Sarcastic & Humorous
                  </option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                <Terminal size={16} /> Custom Instructions
              </label>
              <textarea
                rows={4}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="You are a helpful AI assistant that provides accurate information..."
                className="w-full bg-input border border-border-input rounded-lg px-4 py-3 text-primary placeholder-placeholder focus:outline-none focus:border-border-input-focus transition-all resize-none font-mono text-sm"
              />
              <p className="text-[10px] text-text-muted">
                This prompt defines the base behavior and rules for your AI.
              </p>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={handleUpdatePersonality}
              className="px-5 py-2.5 bg-accent-primary hover:bg-accent-secondary text-white font-medium rounded-lg transition-colors shadow-glow active:scale-95"
            >
              Update Personality
            </button>
          </div>
        </section>

        {/* Model Configuration Section */}
        <section className="bg-card border border-border-card rounded-2xl p-6 shadow-card hover:border-border-card-hover transition-colors">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Cpu size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary">
                Model Configuration
              </h3>
              <p className="text-text-muted text-sm">
                Select the brain of your assistant
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-text-secondary">
                  LLM Provider
                </label>
                <select
                  value={llmProvider}
                  onChange={(e) => setLlmProvider(e.target.value)}
                  className="w-full bg-input border border-border-input rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-border-input-focus transition-all cursor-pointer"
                >
                  <option className="bg-app text-primary">OpenAI (GPT)</option>
                  <option className="bg-app text-primary">
                    Anthropic (Claude)
                  </option>
                  <option className="bg-app text-primary">
                    Google (Gemini)
                  </option>
                  <option className="bg-app text-primary">Meta (Llama)</option>
                  <option className="bg-app text-primary">Mistral AI</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-text-secondary">
                  Model Selection
                </label>
                <select
                  value={modelSelection}
                  onChange={(e) => setModelSelection(e.target.value)}
                  className="w-full bg-input border border-border-input rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-border-input-focus transition-all cursor-pointer"
                >
                  <option className="bg-app text-primary">
                    GPT-4o (Recommended)
                  </option>
                  <option className="bg-app text-primary">GPT-4 Turbo</option>
                  <option className="bg-app text-primary">GPT-3.5 Turbo</option>
                  <option className="bg-app text-primary">
                    Claude 3.5 Sonnet
                  </option>
                  <option className="bg-app text-primary">
                    Gemini 1.5 Pro
                  </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                    <BrainCircuit size={16} /> Creativity (Temp)
                  </label>
                  <span className="text-xs bg-sidebar-item-active px-2 py-1 rounded text-accent font-medium border border-border-divider">
                    {creativity / 100}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={creativity}
                  onChange={(e) => setCreativity(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-input rounded-lg appearance-none cursor-pointer accent-accent-primary outline-none transition-all"
                />
                <div className="flex justify-between text-[10px] text-text-muted font-medium">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                    <Zap size={16} /> Max Tokens
                  </label>
                  <span className="text-xs bg-sidebar-item-active px-2 py-1 rounded text-accent font-medium border border-border-divider">
                    {maxTokens}
                  </span>
                </div>
                <input
                  type="range"
                  min="256"
                  max="4096"
                  step="256"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-input rounded-lg appearance-none cursor-pointer accent-accent-primary outline-none transition-all"
                />
                <div className="flex justify-between text-[10px] text-text-muted font-medium">
                  <span>Short</span>
                  <span>Long</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={handleUpdateConfiguration}
              className="px-5 py-2.5 bg-accent-primary hover:bg-accent-secondary text-white font-medium rounded-lg transition-colors shadow-glow active:scale-95"
            >
              Update Configuration
            </button>
          </div>
        </section>

        {/* Chat Behavior Section: HIDDEN */}
        <section className="hidden bg-card border border-border-card rounded-2xl p-6 shadow-card hover:border-border-card-hover transition-colors">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
              <Sliders size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary">
                Chat Behavior
              </h3>
              <p className="text-text-muted text-sm">
                Customize interaction patterns
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-input border border-border-input transition-all">
              <div>
                <h4 className="text-sm font-medium text-primary">
                  Auto-scroll
                </h4>
                <p className="text-xs text-text-muted">
                  Scroll to bottom on new message
                </p>
              </div>
              <div
                onClick={() => setAutoScroll(!autoScroll)}
                className={`relative inline-block w-12 h-6 rounded-full transition-colors cursor-pointer ${autoScroll ? "bg-accent-primary shadow-glow" : "bg-[#454853]"}`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${autoScroll ? "left-[26px]" : "left-1"}`}
                ></span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-input border border-border-input transition-all">
              <div>
                <h4 className="text-sm font-medium text-primary">
                  Enter to Send
                </h4>
                <p className="text-xs text-text-muted">
                  Press Enter to send message
                </p>
              </div>
              <div
                onClick={() => setEnterToSend(!enterToSend)}
                className={`relative inline-block w-12 h-6 rounded-full transition-colors cursor-pointer ${enterToSend ? "bg-accent-primary shadow-glow" : "bg-[#454853]"}`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${enterToSend ? "left-[26px]" : "left-1"}`}
                ></span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-input border border-border-input transition-all">
              <div>
                <h4 className="text-sm font-medium text-primary">
                  Markdown Rendering
                </h4>
                <p className="text-xs text-text-muted">
                  Format AI responses with MD
                </p>
              </div>
              <div
                onClick={() => setMarkdownRendering(!markdownRendering)}
                className={`relative inline-block w-12 h-6 rounded-full transition-colors cursor-pointer ${markdownRendering ? "bg-accent-primary shadow-glow" : "bg-[#454853]"}`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${markdownRendering ? "left-[26px]" : "left-1"}`}
                ></span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-input border border-border-input transition-all">
              <div>
                <h4 className="text-sm font-medium text-primary">
                  Code Highlighting
                </h4>
                <p className="text-xs text-text-muted">
                  Syntax highlighting for code
                </p>
              </div>
              <div
                onClick={() => setCodeHighlighting(!codeHighlighting)}
                className={`relative inline-block w-12 h-6 rounded-full transition-colors cursor-pointer ${codeHighlighting ? "bg-accent-primary shadow-glow" : "bg-[#454853]"}`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${codeHighlighting ? "left-[26px]" : "left-1"}`}
                ></span>
              </div>
            </div>
          </div>
        </section>

        {/* Voice Section: HIDDEN */}
        <section className="hidden bg-card border border-border-card rounded-2xl p-6 shadow-card hover:border-border-card-hover transition-colors">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Volume2 size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary">
                Voice Settings
              </h3>
              <p className="text-text-muted text-sm">
                Configure speech and listening
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setAlwaysListening(!alwaysListening)}
              className="flex items-center p-4 rounded-xl bg-input border border-border-input hover:border-border-input-focus transition-all cursor-pointer"
            >
              <div className="mr-4 p-2.5 bg-mic rounded-lg text-white shadow-mic border border-[#ffffff1a]">
                <Mic size={18} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-primary">
                  Always Listening
                </h4>
                <p className="text-xs text-text-muted mt-0.5">
                  Wake word detection
                </p>
              </div>
              <div
                className={`ml-auto w-4 h-4 rounded border ${alwaysListening ? "border-border-input-focus bg-accent-primary shadow-glow" : "border-border-divider bg-transparent"} flex items-center justify-center transition-all`}
              >
                {alwaysListening && (
                  <div className="w-2 h-2 bg-white rounded-sm"></div>
                )}
              </div>
            </div>

            <div
              onClick={() => setSpokenResponses(!spokenResponses)}
              className="flex items-center p-4 rounded-xl bg-input border border-border-input hover:border-border-input-focus transition-all cursor-pointer"
            >
              <div className="mr-4 p-2.5 bg-[#ffffff0a] rounded-lg text-secondary border border-border-divider">
                <MessageSquare size={18} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-primary">
                  Spoken Responses
                </h4>
                <p className="text-xs text-text-muted mt-0.5">
                  Read messages aloud
                </p>
              </div>
              <div
                className={`ml-auto w-4 h-4 rounded border ${spokenResponses ? "border-border-input-focus bg-accent-primary shadow-glow" : "border-border-divider bg-transparent"} flex items-center justify-center transition-all`}
              >
                {spokenResponses && (
                  <div className="w-2 h-2 bg-white rounded-sm"></div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={handleTestVoice}
              className="px-5 py-2.5 bg-sidebar-item-active border border-border-card hover:bg-sidebar-item-hover text-primary font-medium rounded-lg transition-colors hover:border-border-card-hover"
            >
              Test Voice
            </button>
            <button
              onClick={handleUpdateSettings}
              className="px-5 py-2.5 bg-accent-primary hover:bg-accent-secondary text-white font-medium rounded-lg transition-colors shadow-glow active:scale-95"
            >
              Update Settings
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
