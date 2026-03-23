import { useState } from "react";

export default function Signup({ setAuthPage }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const signup = async () => {
    if (!email || !password || !username) {
      alert("All fields required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          username: username.trim()
        })
      });

      const data = await res.json();
      alert(data.message);

      if (data.message === "Signup success") {
        setAuthPage("login");
      }

    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-br from-[#667eea] to-[#764ba2]">

      <div className="bg-white/20 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl w-80 border border-white/30">

        <h2 className="text-center text-white text-2xl font-bold mb-6">
          Signup
        </h2>

        {/* Username */}
        <input
          placeholder="Username"
          className="w-full mb-4 p-3 rounded-xl bg-white/80 outline-none focus:ring-2 focus:ring-blue-400"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />

        {/* Email */}
        <input
          placeholder="Email"
          className="w-full mb-4 p-3 rounded-xl bg-white/80 outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded-xl bg-white/80 outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={signup}
          className="bg-green-500 hover:bg-green-600 transition text-white w-full p-3 rounded-xl font-semibold shadow-lg"
        >
          Signup
        </button>

        {/* Switch */}
        <p
          onClick={()=>setAuthPage("login")}
          className="text-white text-center mt-4 cursor-pointer hover:underline"
        >
          Already have account?
        </p>

      </div>
    </div>
  );
}