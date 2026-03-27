import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Story } from "../hooks/useQueries";
import { useGetStoriesByTheme } from "../hooks/useQueries";

const THEMES = [
  { key: "all", label: "All" },
  { key: "loneliness", label: "Loneliness" },
  { key: "anxiety", label: "Anxiety" },
  { key: "heartbreak", label: "Heartbreak" },
  { key: "self-doubt", label: "Self-Doubt" },
  { key: "burnout", label: "Burnout" },
];

const THEME_COLORS: Record<string, string> = {
  loneliness: "#DBEAFE",
  anxiety: "#EDE9FE",
  heartbreak: "#FCE7F3",
  "self-doubt": "#FEF9C3",
  burnout: "#FEE2E2",
  all: "#F3F4F6",
};

const THEME_TEXT: Record<string, string> = {
  loneliness: "#1E40AF",
  anxiety: "#5B21B6",
  heartbreak: "#9D174D",
  "self-doubt": "#92400E",
  burnout: "#991B1B",
  all: "#374151",
};

const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c", "sk-d", "sk-e", "sk-f"];

type CompanionScript = {
  opening: string;
  turns: string[];
};

const COMPANION_SCRIPTS: Record<string, CompanionScript> = {
  loneliness: {
    opening:
      "I see you found this story. That kind of quiet can feel so heavy. I'm here with you — what's been going on for you lately?",
    turns: [
      "That sounds really isolating. When did you start feeling this way?",
      "It makes sense you'd feel that way. Sometimes the people around us just don't quite reach us. Is there anyone you feel even slightly understood by?",
      "You're not asking for too much by wanting to feel seen. What would feeling connected look like for you?",
      "You're doing something meaningful just by talking about this. What feels most important to you right now?",
    ],
  },
  anxiety: {
    opening:
      "It takes courage to acknowledge anxiety. Your mind has been working overtime, hasn't it? Tell me — what's been weighing on you?",
    turns: [
      "That kind of restlessness is exhausting to carry. How long has your mind been in this loop?",
      "Anxiety often tries to keep us safe, even when it gets it wrong. What does your inner voice say is at risk?",
      "You don't have to figure it all out at once. What's the one thing that feels most out of control right now?",
      "You're still here, still breathing, still moving through it. What's one small thing that has helped you feel calmer before?",
    ],
  },
  heartbreak: {
    opening:
      "Heartbreak is one of the most human experiences there is. I'm glad you're here. What's been sitting with you the most?",
    turns: [
      "Grief after love is just love with nowhere to go. How long have you been carrying this?",
      "It's okay to miss someone even when you know it wasn't right. What do you miss the most?",
      "Healing isn't linear — some days it rushes back like it just happened. What does today feel like for you?",
      "You're still whole, even if it doesn't feel that way yet. What part of yourself do you want to reclaim?",
    ],
  },
  "self-doubt": {
    opening:
      "So many people carry this silently. You don't have to here. What's been making you doubt yourself lately?",
    turns: [
      "Self-doubt often visits the most thoughtful, caring people. Where does this voice come from, do you think?",
      "If your best friend felt exactly the way you're describing, what would you tell them?",
      "You've gotten through hard things before — even when you didn't believe you could. Can you remember one of those moments?",
      "You deserve the same compassion you'd offer someone else. What would it feel like to trust yourself a little more?",
    ],
  },
  burnout: {
    opening:
      "You've been running on empty for a while, haven't you? You're allowed to rest here. What's been the heaviest part of it all?",
    turns: [
      "Burnout often builds so slowly that we don't notice until we're already depleted. How long have you been pushing through?",
      "There's a difference between being tired and being broken. You're not broken. What did you used to love that now feels like too much?",
      "Sometimes the most radical thing we can do is stop and breathe. What would rest actually look like for you right now?",
      "You matter beyond what you produce or accomplish. What would you do if rest was truly allowed?",
    ],
  },
};

const DEFAULT_SCRIPT: CompanionScript = {
  opening:
    "I'm glad you're here. You don't have to carry this alone. What's been on your mind?",
  turns: [
    "Thank you for sharing that with me. How long have you been feeling this way?",
    "That takes a lot of courage to put into words. What do you need most right now?",
    "You're doing something important just by being here. What feels heaviest for you today?",
    "You are worthy of care and kindness. What would feel most supportive right now?",
  ],
};

function getCompanionReply(theme: string, turn: number): string {
  const script = COMPANION_SCRIPTS[theme] ?? DEFAULT_SCRIPT;
  const turns = script.turns;
  return turns[Math.min(turn, turns.length - 1)];
}

interface ChatEntry {
  role: "companion" | "user";
  text: string;
  id: string;
}

interface CompanionChatModalProps {
  story: Story;
  onClose: () => void;
}

function CompanionChatModal({ story, onClose }: CompanionChatModalProps) {
  const script = COMPANION_SCRIPTS[story.theme] ?? DEFAULT_SCRIPT;
  const [messages, setMessages] = useState<ChatEntry[]>([
    { role: "companion", text: script.opening, id: "opening" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [turn, setTurn] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  async function handleSend() {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput("");
    const userMsgId = `user-${Date.now()}`;
    setMessages((prev) => [...prev, { role: "user", text, id: userMsgId }]);
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const reply = getCompanionReply(story.theme, turn);
    const compMsgId = `comp-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { role: "companion", text: reply, id: compMsgId },
    ]);
    setTurn((t) => t + 1);
    setIsTyping(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(42, 31, 34, 0.55)",
        backdropFilter: "blur(6px)",
      }}
      data-ocid="companionmodal.modal"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-lg flex flex-col rounded-3xl shadow-card-lg overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.7)",
          maxHeight: "88vh",
        }}
      >
        {/* Modal header */}
        <div
          className="flex items-center justify-between px-6 pt-5 pb-4 shrink-0"
          style={{ borderBottom: "1px solid rgba(42,31,34,0.07)" }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize"
                style={{
                  background: THEME_COLORS[story.theme] ?? "#F3F4F6",
                  color: THEME_TEXT[story.theme] ?? "#374151",
                }}
              >
                {story.theme}
              </span>
            </div>
            <h2
              className="font-serif text-base font-bold truncate"
              style={{ color: "#2A1F22" }}
            >
              {story.title}
            </h2>
            <p className="text-xs truncate mt-0.5" style={{ color: "#9E8C8E" }}>
              {story.excerpt}
            </p>
          </div>
          <button
            type="button"
            className="ml-4 shrink-0 rounded-full p-2 hover:bg-black/5 transition-colors"
            onClick={onClose}
            aria-label="Close"
            data-ocid="companionmodal.close_button"
          >
            <X size={18} style={{ color: "#5C5053" }} />
          </button>
        </div>

        {/* Chat bubbles */}
        <div
          className="flex-1 overflow-y-auto px-5 py-4 space-y-3"
          style={{ minHeight: 0 }}
          data-ocid="companionmodal.panel"
        >
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "companion" && (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-auto shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#e48a73,#b77c73)",
                    color: "#fff",
                  }}
                >
                  E
                </div>
              )}
              <div
                className="max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                style={{
                  background:
                    msg.role === "companion"
                      ? "rgba(247,228,211,0.75)"
                      : "rgba(183,124,115,0.18)",
                  color: "#2A1F22",
                  borderRadius:
                    msg.role === "companion"
                      ? "4px 18px 18px 18px"
                      : "18px 4px 18px 18px",
                }}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="flex items-end gap-2"
                data-ocid="companionmodal.loading_state"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#e48a73,#b77c73)",
                    color: "#fff",
                  }}
                >
                  E
                </div>
                <div
                  className="rounded-2xl px-4 py-3"
                  style={{
                    background: "rgba(247,228,211,0.75)",
                    borderRadius: "4px 18px 18px 18px",
                  }}
                >
                  <div className="flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#B77C73" }}
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                        transition={{
                          duration: 0.9,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.18,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={chatEndRef} />
        </div>

        {/* Input bar */}
        <div
          className="shrink-0 px-4 pb-4 pt-3"
          style={{ borderTop: "1px solid rgba(42,31,34,0.07)" }}
        >
          <div
            className="flex gap-2 items-end rounded-2xl p-2"
            style={{ background: "rgba(42,31,34,0.04)" }}
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 min-h-[44px] max-h-28 text-sm resize-none rounded-xl border-0 focus-visible:ring-0 bg-transparent"
              style={{ color: "#2A1F22" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              data-ocid="companionmodal.input"
            />
            <button
              type="button"
              className="btn-coral w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              data-ocid="companionmodal.submit_button"
            >
              <Send size={14} />
            </button>
          </div>
          <button
            type="button"
            className="w-full mt-3 text-xs flex items-center justify-center gap-1.5 py-2 rounded-xl transition-colors hover:bg-black/5"
            style={{ color: "#9E8C8E" }}
            onClick={onClose}
            data-ocid="companionmodal.cancel_button"
          >
            <ArrowLeft size={12} />
            Back to Stories
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function EmHuPage() {
  const navigate = useNavigate();
  const [activeTheme, setActiveTheme] = useState("all");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const { data: stories, isLoading } = useGetStoriesByTheme(activeTheme);

  function handleCloseModal() {
    setSelectedStory(null);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 py-4 px-4">
        <div className="glass-nav max-w-5xl mx-auto rounded-full px-6 py-3 flex items-center justify-between shadow-card">
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70"
            style={{ color: "#5C5053" }}
            onClick={() => navigate({ to: "/" })}
            data-ocid="emhu.link"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Home</span>
          </button>
          <span
            className="font-serif text-xl font-bold"
            style={{ color: "#B77C73" }}
          >
            E'm Hu
          </span>
          <div className="w-20" />
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1
              className="font-serif text-4xl sm:text-5xl font-bold mb-3"
              style={{ color: "#2A1F22" }}
            >
              Your Story Companion
            </h1>
            <p
              className="text-lg max-w-xl mx-auto"
              style={{ color: "#5C5053" }}
            >
              Find a story that mirrors your experience. You've never been alone
              in how you feel.
            </p>
          </div>

          {/* Theme Tabs */}
          <div
            className="flex flex-wrap gap-2 justify-center mb-8"
            data-ocid="emhu.panel"
          >
            {THEMES.map((t) => (
              <button
                type="button"
                key={t.key}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTheme === t.key
                    ? "shadow-card"
                    : "glass-card hover:shadow-xs"
                }`}
                style={{
                  background:
                    activeTheme === t.key
                      ? (THEME_COLORS[t.key] ?? "#F3F4F6")
                      : undefined,
                  color:
                    activeTheme === t.key
                      ? (THEME_TEXT[t.key] ?? "#374151")
                      : "#5C5053",
                  fontWeight: activeTheme === t.key ? 600 : 500,
                }}
                onClick={() => setActiveTheme(t.key)}
                data-ocid="emhu.tab"
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Story Grid */}
          {isLoading ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              data-ocid="emhu.loading_state"
            >
              {SKELETON_KEYS.map((k) => (
                <div key={k} className="glass-card rounded-2xl p-5 space-y-3">
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-9 w-full rounded-xl" />
                </div>
              ))}
            </div>
          ) : stories && stories.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            >
              {stories.map((story, idx) => (
                <motion.div
                  key={String(story.id)}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="glass-card rounded-2xl p-5 flex flex-col shadow-card hover:shadow-card-lg transition-shadow"
                  data-ocid={`emhu.item.${idx + 1}`}
                >
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full capitalize self-start mb-3"
                    style={{
                      background: THEME_COLORS[story.theme] ?? "#F3F4F6",
                      color: THEME_TEXT[story.theme] ?? "#374151",
                    }}
                  >
                    {story.theme}
                  </span>
                  <h3
                    className="font-serif text-lg font-bold mb-2"
                    style={{ color: "#2A1F22" }}
                  >
                    {story.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed flex-1 mb-4"
                    style={{ color: "#5C5053" }}
                  >
                    {story.excerpt}
                  </p>
                  <button
                    type="button"
                    className="btn-coral py-2.5 px-4 rounded-xl text-sm font-semibold"
                    onClick={() => setSelectedStory(story)}
                    data-ocid="emhu.button"
                  >
                    This is me
                  </button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div
              className="text-center glass-card rounded-2xl p-12"
              data-ocid="emhu.empty_state"
            >
              <p
                className="font-serif text-2xl mb-2"
                style={{ color: "#2A1F22" }}
              >
                No stories yet
              </p>
              <p className="text-sm" style={{ color: "#5C5053" }}>
                We're adding more stories. Check back soon.
              </p>
            </div>
          )}
        </motion.div>
      </main>

      {/* Companion Chat Modal */}
      <AnimatePresence>
        {selectedStory && (
          <CompanionChatModal
            story={selectedStory}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer
        className="px-6 py-8 mt-8"
        style={{
          background: "linear-gradient(135deg, #3C2B2D 0%, #2F2022 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-white transition-colors"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
