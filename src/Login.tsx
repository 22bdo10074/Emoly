import { useState } from "react";

export default function Login({ setUser, setAuthPage, setUserData }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
  const res = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ 
      email: email.trim(), 
      password 
    })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    setUser(true);
    setUserData(data);
  } else {
    alert(data.message);
  }
};

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-br from-[#667eea] to-[#764ba2]">

      <div className="bg-white/20 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl w-80 border border-white/30">

        <h2 className="text-center text-white text-2xl font-bold mb-6">
          Login
        </h2>

        <input
          placeholder="Email"
          className="w-full mb-4 p-3 rounded-xl bg-white/80 outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded-xl bg-white/80 outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="bg-blue-500 hover:bg-blue-600 transition text-white w-full p-3 rounded-xl font-semibold shadow-lg"
        >
          Login
        </button>

        <p
          onClick={()=>setAuthPage("signup")}
          className="text-white text-center mt-4 cursor-pointer hover:underline"
        >
          Create Account
        </p>

      </div>
    </div>
  );
}