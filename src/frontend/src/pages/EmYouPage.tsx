import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Send,
  ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { ChatMessage } from "../hooks/useQueries";
import {
  useGetMessages,
  usePostMessage,
  useReplyToMessage,
} from "../hooks/useQueries";

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

function timeAgo(ts: bigint): string {
  const now = Date.now();
  const msAgo = now - Number(ts / BigInt(1_000_000));
  const secsAgo = Math.floor(msAgo / 1000);
  if (secsAgo < 60) return "just now";
  const minsAgo = Math.floor(secsAgo / 60);
  if (minsAgo < 60) return `${minsAgo}m ago`;
  const hoursAgo = Math.floor(minsAgo / 60);
  if (hoursAgo < 24) return `${hoursAgo}h ago`;
  return `${Math.floor(hoursAgo / 24)}d ago`;
}

interface LocalMessage extends ChatMessage {
  isOptimistic?: boolean;
}

interface MessageCardProps {
  msg: LocalMessage;
  allMessages: LocalMessage[];
  replyingTo: bigint | null;
  onReplyToggle: (id: bigint) => void;
  hugCounts: Record<string, number>;
  onHug: (id: string) => void;
  alias: string;
  onReplySubmit: (text: string, replyToId: bigint) => void;
  isReplying: boolean;
}

function MessageCard({
  msg,
  replyingTo,
  onReplyToggle,
  hugCounts,
  onHug,
  alias,
  onReplySubmit,
  isReplying,
}: MessageCardProps) {
  const [replyText, setReplyText] = useState("");
  const idKey = String(msg.id);
  const isMe = msg.alias === alias;
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
      className="glass-card rounded-2xl p-5 shadow-card"
      style={{
        opacity: msg.isOptimistic ? 0.75 : 1,
        border: isMe ? "1px solid rgba(183,124,115,0.35)" : undefined,
      }}
      data-ocid="message.card"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{
              background: isMe
                ? "linear-gradient(135deg,#e48a73,#d97761)"
                : "linear-gradient(135deg,#b9b6e8,#a7a3da)",
              color: isMe ? "#fff" : "#2a1f22",
            }}
          >
            {msg.alias.charAt(0)}
          </div>
          <div>
            <span
              className="text-xs font-semibold"
              style={{ color: isMe ? "#B77C73" : "#5C5053" }}
            >
              {msg.alias}
              {isMe ? " (you)" : ""}
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

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs rounded-full px-3 py-1.5 transition-all hover:scale-105 active:scale-95"
          style={{
            background: hugCounts[idKey]
              ? "rgba(183,124,115,0.15)"
              : "rgba(0,0,0,0.04)",
            color: hugCounts[idKey] ? "#B77C73" : "#9E8C8E",
            border: `1px solid ${hugCounts[idKey] ? "rgba(183,124,115,0.3)" : "rgba(0,0,0,0.06)"}`,
          }}
          onClick={() => onHug(idKey)}
          data-ocid="message.toggle"
        >
          <Heart size={12} fill={hugCounts[idKey] ? "#B77C73" : "none"} />
          {hugCounts[idKey] ? hugCounts[idKey] : "Hug"}
        </button>

        <button
          type="button"
          className="flex items-center gap-1.5 text-xs rounded-full px-3 py-1.5 transition-all hover:scale-105"
          style={{
            background: isReplyingToThis
              ? "rgba(183,124,115,0.1)"
              : "rgba(0,0,0,0.04)",
            color: isReplyingToThis ? "#B77C73" : "#9E8C8E",
            border: `1px solid ${isReplyingToThis ? "rgba(183,124,115,0.3)" : "rgba(0,0,0,0.06)"}`,
          }}
          onClick={() => onReplyToggle(msg.id)}
          data-ocid="message.button"
        >
          <MessageCircle size={12} />
          Reply
        </button>
      </div>

      {/* Inline reply input */}
      <AnimatePresence>
        {isReplyingToThis && (
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
                data-ocid="reply.textarea"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                  style={{ color: "#9E8C8E" }}
                  onClick={() => onReplyToggle(msg.id)}
                  data-ocid="reply.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-coral text-xs px-4 py-1.5 rounded-lg font-medium flex items-center gap-1.5"
                  onClick={handleReplySubmit}
                  disabled={!replyText.trim() || isReplying}
                  data-ocid="reply.submit_button"
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
  const queryClient = useQueryClient();
  const [alias] = useState(generateAlias);
  const [composerText, setComposerText] = useState("");
  const [replyingTo, setReplyingTo] = useState<bigint | null>(null);
  const [hugCounts, setHugCounts] = useState<Record<string, number>>({});
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
  const feedRef = useRef<HTMLDivElement>(null);

  const { data: remoteMessages } = useGetMessages();
  const postMessage = usePostMessage();
  const replyToMessage = useReplyToMessage();

  // Merge remote + local optimistic messages
  const allMessages = useMemo(() => {
    const remote = remoteMessages ?? [];
    const remoteIds = new Set(remote.map((m) => String(m.id)));
    const optimistic = localMessages.filter(
      (m) => m.isOptimistic && !remoteIds.has(String(m.id)),
    );
    return [...remote, ...optimistic].sort(
      (a, b) => Number(a.timestamp) - Number(b.timestamp),
    );
  }, [remoteMessages, localMessages]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new message
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [allMessages.length]);

  function handleReplyToggle(id: bigint) {
    setReplyingTo((prev) => (prev === id ? null : id));
  }

  function handleHug(idKey: string) {
    setHugCounts((prev) => ({
      ...prev,
      [idKey]: (prev[idKey] ?? 0) + 1,
    }));
  }

  async function handleSend() {
    if (!composerText.trim()) return;
    const text = composerText.trim();
    setComposerText("");

    const optimistic: LocalMessage = {
      id: BigInt(Date.now()),
      text,
      alias,
      timestamp: BigInt(Date.now() * 1_000_000),
      replyTo: [],
      isOptimistic: true,
    };
    setLocalMessages((prev) => [...prev, optimistic]);

    try {
      await postMessage.mutateAsync({ text, alias });
      await queryClient.invalidateQueries({ queryKey: ["messages"] });
      setLocalMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    } catch {
      toast.error("Couldn't send your message. Please try again.");
      setLocalMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    }
  }

  async function handleReplySubmit(text: string, replyToId: bigint) {
    const optimistic: LocalMessage = {
      id: BigInt(Date.now()),
      text,
      alias,
      timestamp: BigInt(Date.now() * 1_000_000),
      replyTo: [replyToId],
      isOptimistic: true,
    };
    setLocalMessages((prev) => [...prev, optimistic]);
    setReplyingTo(null);

    try {
      await replyToMessage.mutateAsync({ text, alias, replyToId });
      await queryClient.invalidateQueries({ queryKey: ["messages"] });
      setLocalMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    } catch {
      toast.error("Couldn't send your reply. Please try again.");
      setLocalMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    }
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
            data-ocid="emyou.link"
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
          data-ocid="emyou.panel"
        >
          {allMessages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
              data-ocid="emyou.empty_state"
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
            {allMessages.map((msg, idx) => (
              <MessageCard
                key={String(msg.id)}
                msg={msg}
                allMessages={allMessages}
                replyingTo={replyingTo}
                onReplyToggle={handleReplyToggle}
                hugCounts={hugCounts}
                onHug={handleHug}
                alias={alias}
                onReplySubmit={handleReplySubmit}
                isReplying={replyToMessage.isPending}
                data-ocid={`emyou.item.${idx + 1}`}
              />
            ))}
          </AnimatePresence>
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
              disabled={!composerText.trim() || postMessage.isPending}
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
