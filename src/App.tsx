import { useState, useEffect, useRef } from "react";
import Landing from "./Landing";
import Login from "./Login";
import Signup from "./Signup";
import logo from "./assets/logo.png";
import avatar from "./assets/avatar.png";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [user, setUser] = useState(false);
  const [authPage, setAuthPage] = useState("login");
  const [userData, setUserData] = useState<any>(null);

  const [mode, setMode] = useState<"you" | "hu" | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(true);
      setShowLanding(false);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const msg = input;
    setMessages((prev) => [...prev, "You: " + msg]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: msg }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        "Emoly 🤖: " + data.reply,
      ]);
    } catch {
      setMessages((prev) => [...prev, "Error"]);
    }

    setTyping(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(false);
    setMode(null);
    setMessages([]);
    setShowLanding(true);
  };

  // LANDING
  if (showLanding) {
    return (
      <Landing
        setAuthPage={(page: string) => {
          setAuthPage(page);
          setShowLanding(false);
        }}
      />
    );
  }

  // AUTH
  if (!user) {
    return authPage === "login" ? (
      <Login setUser={setUser} setAuthPage={setAuthPage} setUserData={setUserData} />
    ) : (
      <Signup setAuthPage={setAuthPage} />
    );
  }

  // MODE SELECT (UPDATED)
  if (!mode) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2]">

        <div className="bg-white/20 backdrop-blur-xl p-8 rounded-3xl text-center w-[90%] max-w-sm">

          <img src={logo} className="w-16 mx-auto mb-4" />

          <h2 className="text-white text-xl font-bold mb-4">
            Choose Mode
          </h2>

          {/* E'm You */}
          <button
            onClick={() => setMode("you")}
            className="bg-white text-black p-3 w-full mb-3 rounded-xl font-semibold"
          >
            👤 E’m You (Human Chat)
          </button>

          {/* E'm Hu */}
          <button
            onClick={() => setMode("hu")}
            className="bg-black text-white p-3 w-full rounded-xl font-semibold"
          >
            🤖 E’m Hu (AI Companion)
          </button>

          <button
            onClick={handleLogout}
            className="text-red-400 mt-4"
          >
            Logout
          </button>

        </div>
      </div>
    );
  }

  // CHAT UI (FIXED FULL SCREEN)
  return (
    <div className="h-screen flex flex-col bg-[#0f172a] text-white">

      {/* NAVBAR */}
      <div className="p-4 flex justify-between items-center border-b border-white/10">

        {/* BACK BUTTON */}
        <button
          onClick={() => {
            setMode(null);
            setMessages([]);
          }}
          className="text-white text-lg"
        >
          ⬅
        </button>

        <span className="font-bold">
          {mode === "you" ? "E’m You 👤" : "E’m Hu 🤖"}
        </span>

        <img
          src={avatar}
          className="w-8 h-8 rounded-full"
        />
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {messages.map((msg, i) => {
          const isUser = msg.startsWith("You");

          return (
            <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>

              <div className={`px-4 py-2 rounded-2xl max-w-[75%] ${
                isUser
                  ? "bg-blue-500"
                  : "bg-gray-700"
              }`}>
                {msg.replace(/^You: |Emoly 🤖: /, "")}
              </div>

            </div>
          );
        })}

        {typing && <div className="text-gray-400">Typing...</div>}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT BAR */}
      <div className="p-3 flex gap-2 bg-white/5">

        <button
          onClick={() => SpeechRecognition.startListening()}
          className="bg-gray-600 px-3 py-2 rounded-full"
        >
          🎙
        </button>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded-full bg-gray-200 text-black px-4"
          placeholder={listening ? "Listening..." : "Type message..."}
        />

        <button
          onClick={() => {
            setInput(transcript);
            resetTranscript();
          }}
          className="bg-green-500 px-3 py-2 rounded-full"
        >
          ✔
        </button>

        <button
          onClick={sendMessage}
          className="bg-blue-500 px-4 rounded-full"
        >
          ➤
        </button>

      </div>
    </div>
  );
}

export default App;