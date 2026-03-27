import { useNavigate } from "@tanstack/react-router";
import { BookOpen, Heart, Lock, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCheckInMood } from "../hooks/useQueries";

const MOODS = [
  { emoji: "😊", label: "happy", color: "#FEF9C3" },
  { emoji: "😔", label: "sad", color: "#DBEAFE" },
  { emoji: "😰", label: "anxious", color: "#EDE9FE" },
  { emoji: "😤", label: "angry", color: "#FEE2E2" },
  { emoji: "😶", label: "lonely", color: "#E0F2FE" },
  { emoji: "😑", label: "numb", color: "#F3F4F6" },
  { emoji: "😵‍💫", label: "overwhelmed", color: "#FCE7F3" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [affirmation, setAffirmation] = useState<string | null>(null);
  const checkInMood = useCheckInMood();

  async function handleMoodSelect(mood: string) {
    setSelectedMood(mood);
    try {
      const result = await checkInMood.mutateAsync(mood);
      setAffirmation(result);
    } catch {
      const fallbacks: Record<string, string> = {
        happy: "Hold onto that feeling — you deserve every bit of it.",
        sad: "Sadness is just love that has nowhere to go right now. It's okay to feel it fully.",
        anxious:
          "Your worries are real, but so is your resilience. Take one breath.",
        angry: "Anger is often hurt in disguise. Your feelings are valid.",
        lonely: "You are not as alone as you feel right now.",
        numb: "Numbness is your mind's way of protecting you. There's no rush.",
        overwhelmed:
          "You don't have to solve everything today. One breath at a time.",
      };
      setAffirmation(fallbacks[mood] ?? "Whatever you're feeling, it's valid.");
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Nav */}
      <header className="sticky top-0 z-50 py-4 px-4">
        <nav
          className="glass-nav max-w-4xl mx-auto rounded-full px-6 py-3 flex items-center justify-between shadow-card"
          data-ocid="nav.panel"
        >
          <div className="flex items-center gap-6">
            <a
              href="#about"
              className="text-sm text-[#5C5053] hover:text-[#2A1F22] transition-colors hidden sm:block"
              data-ocid="nav.link"
            >
              About
            </a>
            <a
              href="#how"
              className="text-sm text-[#5C5053] hover:text-[#2A1F22] transition-colors hidden sm:block"
              data-ocid="nav.link"
            >
              How It Works
            </a>
          </div>

          <a
            href="/"
            className="font-serif text-2xl font-bold tracking-wide absolute left-1/2 -translate-x-1/2"
            style={{ color: "#B77C73" }}
            data-ocid="nav.link"
          >
            Emoly
          </a>

          <div className="flex items-center gap-6">
            <a
              href="#stories"
              className="text-sm text-[#5C5053] hover:text-[#2A1F22] transition-colors hidden sm:block"
              data-ocid="nav.link"
            >
              Stories
            </a>
            <a
              href="#community"
              className="text-sm text-[#5C5053] hover:text-[#2A1F22] transition-colors hidden sm:block"
              data-ocid="nav.link"
            >
              Community
            </a>
            <button
              type="button"
              className="btn-brand text-sm font-medium px-5 py-2 rounded-full shadow-xs"
              onClick={() => navigate({ to: "/em-you" })}
              data-ocid="nav.primary_button"
            >
              Get Started
            </button>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="text-center px-4 pt-16 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1
              className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold mb-4 tracking-tight"
              style={{ color: "#2A1F22" }}
            >
              Welcome to Emoly.
            </h1>
            <p
              className="text-lg sm:text-xl max-w-xl mx-auto mb-2"
              style={{ color: "#5C5053" }}
            >
              A safe space to feel, share, and heal —{" "}
              <span className="font-medium" style={{ color: "#B77C73" }}>
                anonymously.
              </span>
            </p>
            <p
              className="text-base max-w-md mx-auto mb-10"
              style={{ color: "#7a6770" }}
            >
              No judgement. No sign-ups required. Just you, your feelings, and a
              compassionate ear.
            </p>
          </motion.div>

          {/* Mood Picker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mb-4"
          >
            <p
              className="text-sm font-medium mb-4 tracking-wide uppercase"
              style={{ color: "#5C5053" }}
            >
              How are you feeling right now?
            </p>
            <div
              className="flex flex-wrap justify-center gap-3"
              data-ocid="mood.panel"
            >
              {MOODS.map((m) => (
                <button
                  type="button"
                  key={m.label}
                  className={`mood-pill flex flex-col items-center gap-1 px-4 py-3 rounded-full glass-card shadow-xs cursor-pointer ${
                    selectedMood === m.label ? "selected" : ""
                  }`}
                  onClick={() => handleMoodSelect(m.label)}
                  aria-label={m.label}
                  data-ocid="mood.toggle"
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span
                    className="text-xs capitalize"
                    style={{ color: "#5C5053" }}
                  >
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Affirmation card */}
          <AnimatePresence>
            {affirmation && (
              <motion.div
                key="affirmation"
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.4 }}
                className="max-w-md mx-auto mt-4"
                data-ocid="mood.success_state"
              >
                <div className="glass-card rounded-2xl px-6 py-4 shadow-card">
                  <p
                    className="font-serif text-lg italic"
                    style={{ color: "#2A1F22" }}
                  >
                    "{affirmation}"
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Mode Cards */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* E'm You Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl p-8 shadow-card-lg flex flex-col"
              style={{
                background: "rgba(220, 233, 249, 0.72)",
                backdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.6)",
              }}
              data-ocid="emyou.card"
            >
              <div className="text-5xl mb-4">💬</div>
              <h2
                className="font-serif text-3xl font-bold mb-2"
                style={{ color: "#2A1F22" }}
              >
                E'm You
              </h2>
              <p className="font-medium mb-2" style={{ color: "#B77C73" }}>
                Anonymous Emotional Chat
              </p>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "#5C5053" }}
              >
                Pour your heart out in complete anonymity. Say what you've been
                holding back. Receive a warm, thoughtful response — no accounts,
                no history, no judgement.
              </p>
              <div className="mt-auto">
                <button
                  type="button"
                  className="btn-lavender w-full py-3 px-6 rounded-2xl font-semibold text-base shadow-xs"
                  onClick={() => navigate({ to: "/em-you" })}
                  data-ocid="emyou.primary_button"
                >
                  Start Anonymously
                </button>
              </div>
            </motion.div>

            {/* E'm Hu Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="rounded-3xl p-8 shadow-card-lg flex flex-col"
              style={{
                background: "rgba(247, 228, 211, 0.72)",
                backdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.6)",
              }}
              data-ocid="emhu.card"
            >
              <div className="text-5xl mb-4">📖</div>
              <h2
                className="font-serif text-3xl font-bold mb-2"
                style={{ color: "#2A1F22" }}
              >
                E'm Hu
              </h2>
              <p className="font-medium mb-2" style={{ color: "#B77C73" }}>
                Your Story Companion
              </p>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "#5C5053" }}
              >
                Find yourself in a story that mirrors your experience. Read,
                connect, and discover that you've never truly been alone in how
                you feel.
              </p>
              <div className="mt-auto">
                <button
                  type="button"
                  className="btn-coral w-full py-3 px-6 rounded-2xl font-semibold text-base shadow-xs"
                  onClick={() => navigate({ to: "/em-hu" })}
                  data-ocid="emhu.primary_button"
                >
                  Begin Your Journey
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Emoly Section */}
        <section id="about" className="px-4 pb-20">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-serif text-4xl font-bold text-center mb-12"
              style={{ color: "#2A1F22" }}
            >
              Why Emoly?
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Lock size={28} />,
                  title: "Completely Anonymous",
                  body: "No accounts, no tracking, no data retention. Your thoughts stay yours. We built privacy into the foundation.",
                  delay: 0,
                },
                {
                  icon: <MessageCircle size={28} />,
                  title: "Non-Judgmental Space",
                  body: "Every message is met with compassion. There's no wrong way to feel here. Say what you need to say.",
                  delay: 0.1,
                },
                {
                  icon: <BookOpen size={28} />,
                  title: "Relatable Stories",
                  body: "Browse real-feeling stories that echo your experience. Find comfort in knowing others have walked the same path.",
                  delay: 0.2,
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: item.delay }}
                  className="glass-card rounded-2xl p-6 shadow-card text-center"
                  data-ocid="whyemoly.card"
                >
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                    style={{
                      background: "rgba(183, 124, 115, 0.15)",
                      color: "#B77C73",
                    }}
                  >
                    {item.icon}
                  </div>
                  <h3
                    className="font-serif text-xl font-semibold mb-2"
                    style={{ color: "#2A1F22" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#5C5053" }}
                  >
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how" className="px-4 pb-20">
          <div className="max-w-3xl mx-auto glass-card rounded-3xl p-10 shadow-card">
            <h2
              className="font-serif text-3xl font-bold text-center mb-8"
              style={{ color: "#2A1F22" }}
            >
              How It Works
            </h2>
            <div className="flex flex-col gap-6">
              {[
                {
                  num: "01",
                  title: "Choose your mode",
                  body: "Pick E'm You for anonymous venting or E'm Hu to explore stories that feel like yours.",
                },
                {
                  num: "02",
                  title: "Share what you feel",
                  body: "Write freely or browse stories. No sign-up, no personal details — just your words.",
                },
                {
                  num: "03",
                  title: "Receive compassion",
                  body: "Get a thoughtful comfort message and a gentle reflection prompt to guide you forward.",
                },
              ].map((step) => (
                <div key={step.num} className="flex gap-4 items-start">
                  <span
                    className="font-serif text-3xl font-bold shrink-0 leading-none"
                    style={{ color: "rgba(183, 124, 115, 0.4)" }}
                  >
                    {step.num}
                  </span>
                  <div>
                    <h4
                      className="font-serif text-lg font-semibold mb-1"
                      style={{ color: "#2A1F22" }}
                    >
                      {step.title}
                    </h4>
                    <p className="text-sm" style={{ color: "#5C5053" }}>
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="px-6 py-10"
        style={{
          background: "linear-gradient(135deg, #3C2B2D 0%, #2F2022 100%)",
        }}
        id="community"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-serif text-2xl" style={{ color: "#B77C73" }}>
              Emoly
            </span>
            <p
              className="text-sm text-center"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              © {new Date().getFullYear()}. Built with{" "}
              <Heart
                size={13}
                className="inline mx-0.5"
                style={{ color: "#E48A73" }}
              />{" "}
              using{" "}
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
            <div className="flex gap-4">
              <a
                href="#about"
                className="text-sm hover:text-white transition-colors"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Privacy
              </a>
              <a
                href="#how"
                className="text-sm hover:text-white transition-colors"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Terms
              </a>
              <a
                href="#community"
                className="text-sm hover:text-white transition-colors"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Community
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
