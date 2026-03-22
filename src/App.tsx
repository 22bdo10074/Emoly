import { useState, useEffect, useRef } from "react";
import Landing from "./Landing";
import Login from "./Login";
import Signup from "./Signup";
import logo from "./assets/logo.png";
import avatar from "./assets/avatar.png"; // 🔥 YOUR AVATAR
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

function App() {
  // STATES
  const [showLanding, setShowLanding] = useState(true);
  const [user, setUser] = useState(false);
  const [authPage, setAuthPage] = useState("login");
  const [userData, setUserData] = useState<any>(null);

  const [mode, setMode] = useState<"ai" | "human" | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [dark, setDark] = useState(true);
  const [typing, setTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const bottomRef = useRef<HTMLDivElement>(null);

  // AUTO LOGIN
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(true);
      setShowLanding(false);
    }
  }, []);

  // AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // SEND MESSAGE
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
      setMessages((prev) => [...prev, "Error: Server issue"]);
    }

    setTyping(false);
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(false);
    setUserData(null);
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
      <Login
        setUser={setUser}
        setAuthPage={setAuthPage}
        setUserData={setUserData}
      />
    ) : (
      <Signup setAuthPage={setAuthPage} />
    );
  }

  // MODE SELECT
  if (!mode) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-300 to-indigo-400">
        <div className="bg-white/20 backdrop-blur p-6 rounded-xl text-center w-[90%] max-w-sm">

          <img src={logo} className="w-14 mx-auto mb-2" />
          <h2 className="mb-4 font-bold">Emoly 💬</h2>

          <button
            onClick={() => setMode("ai")}
            className="bg-blue-500 text-white p-2 w-full mb-2 rounded"
          >
            🤖 AI Chat
          </button>

          <button
            onClick={() => setMode("human")}
            className="bg-gray-300 p-2 w-full rounded"
          >
            👤 Stranger Chat
          </button>

          <button
            onClick={handleLogout}
            className="text-red-500 mt-3"
          >
            Logout
          </button>

        </div>
      </div>
    );
  }

  // CHAT UI
  return (
    <div className={`${dark ? "bg-black text-white" : "bg-gray-100"} h-screen flex justify-center`}>
      <div className="w-full max-w-md flex flex-col h-full">

        {/* NAVBAR */}
        <div className="p-3 flex justify-between items-center border-b relative">

          <span className="font-bold">Emoly 💬</span>

          {/* PROFILE */}
          <div className="relative">

            <img
              src={
                userData?.avatar
                  ? `http://localhost:5000/uploads/${userData.avatar}`
                  : avatar // 🔥 CUSTOM DEFAULT AVATAR
              }
              className="w-9 h-9 rounded-full object-cover border-2 border-white shadow cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            />

            {/* DROPDOWN */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow w-40 p-2 space-y-2">

                <button
                  onClick={() => setDark(!dark)}
                  className="block w-full text-left hover:bg-gray-200 p-2 rounded"
                >
                  {dark ? "🌙 Dark" : "☀️ Light"}
                </button>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-500 hover:bg-gray-200 p-2 rounded"
                >
                  Logout
                </button>

              </div>
            )}

          </div>
        </div>

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {messages.map((msg, i) => {
            const isUser = msg.startsWith("You");

            return (
              <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`px-3 py-2 rounded-lg max-w-[75%] ${
                  isUser
                    ? "bg-blue-500 text-white"
                    : dark
                    ? "bg-gray-700"
                    : "bg-gray-200 text-black"
                }`}>
                  {msg.replace(/^You: |Emoly 🤖: /, "")}
                </div>
              </div>
            );
          })}

          {typing && <div className="text-gray-400">typing...</div>}

          <div ref={bottomRef}></div>
        </div>

        {/* INPUT */}
        <div className="p-3 flex gap-2">

          <button
            onClick={() => SpeechRecognition.startListening()}
            className="bg-gray-500 px-3 py-2 rounded-full text-white"
          >
            🎙
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 rounded bg-gray-200 text-black"
            placeholder={listening ? "Listening..." : "Type..."}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={() => {
              setInput(transcript);
              resetTranscript();
            }}
            className="bg-green-500 px-3 py-2 rounded-full text-white"
          >
            ✔
          </button>

          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 rounded"
          >
            ➤
          </button>

        </div>
      </div>
    </div>
  );
}

export default App;