import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Send,
  ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const ADJECTIVES = [
  "Quiet",
  "Gentle",
  "Brave",
  "Soft",
  "Warm",
  "Calm",
  "Kind",
  "Still",
  "Tender",
  "Bright",
  "Loyal",
  "Honest",
  "Clear",
  "Deep",
  "Free",
  "Bold",
  "Wise",
  "True",
  "Pure",
  "Safe",
];
const NOUNS = [
  "Fox",
  "Star",
  "Moon",
  "River",
  "Cloud",
  "Pine",
  "Wave",
  "Dawn",
  "Cedar",
  "Lark",
  "Stone",
  "Fern",
  "Rain",
  "Ash",
  "Wren",
  "Reed",
  "Brook",
  "Sage",
  "Tide",
  "Grove",
];

function generateAlias() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj} ${noun}`;
}

function timeAgo(ts: number): string {
  const secsAgo = Math.floor((Date.now() - ts) / 1000);
  if (secsAgo < 60) return "just now";
  const minsAgo = Math.floor(secsAgo / 60);
  if (minsAgo < 60) return `${minsAgo}m ago`;
  const hoursAgo = Math.floor(minsAgo / 60);
  if (hoursAgo < 24) return `${hoursAgo}h ago`;
  return `${Math.floor(hoursAgo / 24)}d ago`;
}

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getAutoReply(text: string): string {
  const lower = text.toLowerCase();

  if (/^(hi|hello|hey|hlo|hii|heya|sup|yo|hiya|howdy)\b/.test(lower.trim())) {
    return pick([
      "Hey, glad you're here. What's on your mind today?",
      "Hi there 👋 This is a safe space — feel free to share whatever you need.",
      "Hello! How are you actually feeling right now?",
      "Hey. It takes courage to show up here. I'm listening.",
      "Hi 💛 Take your time — no rush, no judgment.",
    ]);
  }

  if (
    /\b(sad|cry|crying|cried|tears|depressed|depression|hopeless|empty|numb|feel nothing)\b/.test(
      lower,
    )
  ) {
    return pick([
      "I'm really sorry you're feeling this way. Sadness can feel so heavy, and it's okay to not be okay right now. 🫂",
      "Crying is not weakness — it's your heart releasing what it can't hold anymore. You're allowed to feel this.",
      "That sounds really painful. What happened, if you want to share?",
      "Hey. I see you. This heaviness won't last forever, even when it feels like it will.",
      "You don't have to put on a brave face here. Let it out — that's exactly what this space is for. 💙",
      "Being sad is exhausting. You're doing more than you realize just by being here.",
    ]);
  }

  if (
    /\b(anxious|anxiety|worry|worried|scared|panic|panicking|nervous|fear|afraid|overthinking|spiral)\b/.test(
      lower,
    )
  ) {
    return pick([
      "That sounds really overwhelming. Take a slow breath with me — in for 4, hold for 4, out for 4. You're safe right now.",
      "Anxiety can make everything feel urgent and scary all at once. What's the biggest thing weighing on you?",
      "You're not broken for feeling this way. Your nervous system is just trying to protect you. 💛",
      "One moment at a time. You don't have to solve everything today — just this breath, right now.",
      "Panic lies — it says everything is falling apart, but you're still here, and that matters.",
      "It's okay to be scared. Want to talk through what's triggering it? Sometimes saying it out loud helps.",
    ]);
  }

  if (
    /\b(lonely|alone|isolated|no one|nobody|invisible|forgotten|left out|abandoned)\b/.test(
      lower,
    )
  ) {
    return pick([
      "Loneliness is one of the hardest feelings. You're not invisible here — someone is always listening. 💛",
      "I hear you. Feeling alone doesn't mean you are alone — this space holds you right now.",
      "It takes guts to admit you're lonely. That's real honesty, and it deserves to be met with care.",
      "You reached out, which means a part of you is still looking for connection. That part is right to look. 🌿",
      "Even in a crowded room, loneliness can sit right next to you. It's real and it's valid. What's been going on?",
    ]);
  }

  if (
    /\b(angry|anger|mad|furious|frustrated|pissed|rage|hate|annoyed|irritated)\b/.test(
      lower,
    )
  ) {
    return pick([
      "That anger is telling you something — something wasn't right, and you felt it. That's valid.",
      "Vent all you need. I'm not going anywhere. What happened?",
      "Frustration like that builds up when things keep piling on. How long has this been going on?",
      "Anger is often hurt that couldn't find another way out. Whatever you're feeling, it makes sense.",
      "You have every right to be angry. Want to talk about what set it off?",
    ]);
  }

  if (
    /\b(tired|exhausted|burnout|drained|overwhelmed|no energy|can't anymore|done|worn out|burnt out)\b/.test(
      lower,
    )
  ) {
    return pick([
      "Rest isn't a reward — it's a need. You've clearly been carrying a lot. 🌙",
      "Being this tired goes beyond just sleep, doesn't it? What's been draining you most?",
      "You don't have to be strong every minute. It's okay to say 'I can't today.'",
      "Burnout is your mind and body waving a flag. Please don't ignore it — you matter too much.",
      "Overwhelm is real and it's heavy. Can you take even five minutes just for yourself right now?",
    ]);
  }

  if (
    /\b(heartbreak|heartbroken|breakup|broke up|miss them|miss him|miss her|lost them|grief|grieving|lost someone|they left|she left|he left)\b/.test(
      lower,
    )
  ) {
    return pick([
      "Heartbreak is one of the most disorienting kinds of pain. I'm so sorry you're going through this. 💔",
      "Missing someone who's no longer in your life in the same way is really hard. How long has it been?",
      "Grief after love is just love that has nowhere to go right now. It's proof the connection was real.",
      "You don't have to move on before you're ready. There's no timeline for healing a broken heart.",
      "Losing someone changes everything, even the small daily things. How are you holding up?",
    ]);
  }

  if (
    /\b(stress|stressed|pressure|too much|can't cope|falling apart|overwhelmed|breaking down|struggling)\b/.test(
      lower,
    )
  ) {
    return pick([
      "That sounds like a lot to carry. What's putting the most pressure on you right now?",
      "Struggling doesn't mean failing — it means you're human and things got heavy. You're not alone in this.",
      "When everything piles up at once, it can feel impossible to know where to start. Want to just talk it through?",
      "You don't have to have it all figured out. Sometimes just saying it out loud is enough for now. 🌿",
    ]);
  }

  if (
    /\b(happy|excited|great|good|amazing|wonderful|grateful|blessed|love|joy|thrilled|proud)\b/.test(
      lower,
    )
  ) {
    return pick([
      "That genuinely made me smile reading that! What happened? Tell me more 🌻",
      "It's so good to hear something positive. Hold onto that feeling — you deserve it.",
      "Yes! A good moment is worth celebrating, even the small ones. 🎉",
      "Love hearing this. What made today feel different for you?",
    ]);
  }

  if (lower.length < 30) {
    return pick([
      "Tell me more — I'm listening, and there's no rush.",
      "I'm here. What's going on?",
      "This space is yours. Take your time and share what you need to. 💛",
      "I hear you. Want to talk about it more?",
      "No judgment here — whatever it is, you can say it.",
    ]);
  }

  return pick([
    "Thank you for trusting this space with that. What you're feeling is completely valid. 🌱",
    "That sounds really difficult. You don't have to go through it alone.",
    "I'm glad you shared this. How long have you been feeling this way?",
    "It takes strength to put feelings into words. I'm here and I'm listening.",
    "What you're carrying sounds heavy. Is there someone in your life who knows you're feeling this?",
    "You showed up and shared — that matters more than you know. 💙",
    "Whatever you're going through, you're not invisible here. We see you.",
    "Sometimes there are no perfect words, just presence. I'm here with you right now.",
  ]);
}

interface LocalMessage {
  id: string;
  text: string;
  alias: string;
  timestamp: number;
  replyTo: string | null;
  isCompanion?: boolean;
  hugCount: number;
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 rounded-2xl px-5 py-4"
      style={{
        background: "rgba(247,228,211,0.75)",
        border: "1px solid rgba(183,124,115,0.3)",
        maxWidth: "160px",
      }}
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
        style={{
          background: "linear-gradient(135deg,#e48a73,#c96b58)",
          color: "#fff",
        }}
      >
        E
      </div>
      <div className="flex items-center gap-1">
        {[0, 0.18, 0.36].map((delay, i) => (
          <motion.span
            // biome-ignore lint/suspicious/noArrayIndexKey: static dots
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ background: "#B77C73" }}
            animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 0.7,
              repeat: Number.POSITIVE_INFINITY,
              delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

interface MessageCardProps {
  msg: LocalMessage;
  replyingTo: string | null;
  onReplyToggle: (id: string) => void;
  onHug: (id: string) => void;
  alias: string;
  onReplySubmit: (text: string, replyToId: string) => void;
}

function MessageCard({
  msg,
  replyingTo,
  onReplyToggle,
  onHug,
  alias,
  onReplySubmit,
}: MessageCardProps) {
  const [replyText, setReplyText] = useState("");
  const isMe = msg.alias === alias;
  const isCompanion = msg.isCompanion === true;
  const isReplyingToThis = replyingTo === msg.id;

  function handleReplySubmit() {
    if (!replyText.trim()) return;
    onReplySubmit(replyText, msg.id);
    setReplyText("");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl p-5 shadow-card"
      style={{
        background: isCompanion
          ? "rgba(247,228,211,0.75)"
          : "var(--glass-bg, rgba(255,255,255,0.6))",
        border: isCompanion
          ? "1px solid rgba(183,124,115,0.3)"
          : isMe
            ? "1px solid rgba(183,124,115,0.35)"
            : "1px solid rgba(255,255,255,0.5)",
        backdropFilter: isCompanion ? "none" : "blur(12px)",
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{
              background: isCompanion
                ? "linear-gradient(135deg,#e48a73,#c96b58)"
                : isMe
                  ? "linear-gradient(135deg,#e48a73,#d97761)"
                  : "linear-gradient(135deg,#b9b6e8,#a7a3da)",
              color: "#fff",
            }}
          >
            {msg.alias.charAt(0)}
          </div>
          <div>
            <span
              className="text-xs font-semibold"
              style={{
                color: isCompanion ? "#B77C73" : isMe ? "#B77C73" : "#5C5053",
              }}
            >
              {msg.alias}
              {isMe && !isCompanion ? " (you)" : ""}
            </span>
            <span className="text-xs ml-2" style={{ color: "#9E8C8E" }}>
              {timeAgo(msg.timestamp)}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm leading-relaxed mb-4" style={{ color: "#2A1F22" }}>
        {msg.text}
      </p>

      {!isCompanion && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs rounded-full px-3 py-1.5 transition-all hover:scale-105 active:scale-95"
            style={{
              background:
                msg.hugCount > 0
                  ? "rgba(183,124,115,0.15)"
                  : "rgba(0,0,0,0.04)",
              color: msg.hugCount > 0 ? "#B77C73" : "#9E8C8E",
              border: `1px solid ${
                msg.hugCount > 0 ? "rgba(183,124,115,0.3)" : "rgba(0,0,0,0.06)"
              }`,
            }}
            onClick={() => onHug(msg.id)}
          >
            <Heart size={12} fill={msg.hugCount > 0 ? "#B77C73" : "none"} />
            {msg.hugCount > 0 ? msg.hugCount : "Hug"}
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 text-xs rounded-full px-3 py-1.5 transition-all hover:scale-105"
            style={{
              background: isReplyingToThis
                ? "rgba(183,124,115,0.1)"
                : "rgba(0,0,0,0.04)",
              color: isReplyingToThis ? "#B77C73" : "#9E8C8E",
              border: `1px solid ${
                isReplyingToThis ? "rgba(183,124,115,0.3)" : "rgba(0,0,0,0.06)"
              }`,
            }}
            onClick={() => onReplyToggle(msg.id)}
          >
            <MessageCircle size={12} />
            Reply
          </button>
        </div>
      )}

      <AnimatePresence>
        {isReplyingToThis && !isCompanion && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-4 overflow-hidden"
          >
            <div
              className="rounded-xl p-3"
              style={{ background: "rgba(183,124,115,0.07)" }}
            >
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a kind reply..."
                className="min-h-[80px] text-sm resize-none rounded-lg border-0 focus-visible:ring-1 bg-white/70"
                style={{ color: "#2A1F22" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey))
                    handleReplySubmit();
                }}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                  style={{ color: "#9E8C8E" }}
                  onClick={() => onReplyToggle(msg.id)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-coral text-xs px-4 py-1.5 rounded-lg font-medium flex items-center gap-1.5"
                  onClick={handleReplySubmit}
                  disabled={!replyText.trim()}
                >
                  <Send size={11} />
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function EmYouPage() {
  const navigate = useNavigate();
  const [alias] = useState(generateAlias);
  const [composerText, setComposerText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new message
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages.length, isTyping]);

  function triggerAutoReply(userText: string) {
    setIsTyping(true);
    const delay = 1200 + Math.random() * 1600;
    setTimeout(() => {
      setIsTyping(false);
      const reply: LocalMessage = {
        id: `companion-${Date.now()}`,
        text: getAutoReply(userText),
        alias: "Emoly ✦",
        timestamp: Date.now(),
        replyTo: null,
        isCompanion: true,
        hugCount: 0,
      };
      setMessages((prev) => [...prev, reply]);
    }, delay);
  }

  function handleSend() {
    const text = composerText.trim();
    if (!text) return;
    setComposerText("");

    const newMsg: LocalMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      text,
      alias,
      timestamp: Date.now(),
      replyTo: null,
      hugCount: 0,
    };
    setMessages((prev) => [...prev, newMsg]);
    triggerAutoReply(text);
  }

  function handleReplySubmit(text: string, replyToId: string) {
    const newMsg: LocalMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      text,
      alias,
      timestamp: Date.now(),
      replyTo: replyToId,
      hugCount: 0,
    };
    setMessages((prev) => [...prev, newMsg]);
    setReplyingTo(null);
    triggerAutoReply(text);
  }

  function handleHug(id: string) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, hugCount: m.hugCount + 1 } : m)),
    );
  }

  function handleReplyToggle(id: string) {
    setReplyingTo((prev) => (prev === id ? null : id));
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 py-4 px-4">
        <div className="glass-nav max-w-2xl mx-auto rounded-full px-6 py-3 flex items-center justify-between shadow-card">
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70"
            style={{ color: "#5C5053" }}
            onClick={() => navigate({ to: "/" })}
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Home</span>
          </button>
          <span
            className="font-serif text-xl font-bold"
            style={{ color: "#B77C73" }}
          >
            E'm You
          </span>
          <div
            className="text-xs font-medium px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(183,124,115,0.12)",
              color: "#B77C73",
              border: "1px solid rgba(183,124,115,0.2)",
            }}
          >
            {alias}
          </div>
        </div>
      </header>

      {/* Message Feed */}
      <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 pb-36 pt-4 overflow-hidden">
        <div
          ref={feedRef}
          className="flex-1 overflow-y-auto space-y-4 pb-4"
          style={{ maxHeight: "calc(100vh - 220px)" }}
        >
          {messages.length === 0 && !isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-4xl mb-4">🌱</div>
              <p
                className="font-serif text-xl mb-2"
                style={{ color: "#2A1F22" }}
              >
                Be the first to share.
              </p>
              <p className="text-sm" style={{ color: "#9E8C8E" }}>
                This is a safe space. Nothing here is linked to your identity.
              </p>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((msg) => (
              <MessageCard
                key={msg.id}
                msg={msg}
                replyingTo={replyingTo}
                onReplyToggle={handleReplyToggle}
                onHug={handleHug}
                alias={alias}
                onReplySubmit={handleReplySubmit}
              />
            ))}
          </AnimatePresence>

          <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>
        </div>
      </main>

      {/* Sticky Composer */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 px-4 py-4"
        style={{
          background:
            "linear-gradient(to top, rgba(217,215,245,0.98) 70%, transparent)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div
            className="glass-card rounded-2xl p-3 shadow-card-lg flex gap-3 items-end"
            style={{ border: "1px solid rgba(255,255,255,0.8)" }}
          >
            <Textarea
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
              placeholder="Share what's on your mind..."
              className="flex-1 min-h-[52px] max-h-36 text-sm resize-none rounded-xl border-0 focus-visible:ring-0 bg-transparent"
              style={{ color: "#2A1F22" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSend();
              }}
              data-ocid="emyou.textarea"
            />
            <Button
              type="button"
              className="btn-coral shrink-0 w-10 h-10 rounded-xl p-0 flex items-center justify-center"
              onClick={handleSend}
              disabled={!composerText.trim()}
              data-ocid="emyou.submit_button"
            >
              <Send size={16} />
            </Button>
          </div>
          <p className="text-center text-xs mt-2" style={{ color: "#9E8C8E" }}>
            <ShieldCheck
              size={11}
              style={{ display: "inline", marginRight: 4, color: "#B77C73" }}
            />
            All messages are anonymous. Nothing is linked to your identity.
          </p>
        </div>
      </div>
    </div>
  );
}
