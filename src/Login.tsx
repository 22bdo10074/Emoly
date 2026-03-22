import { useState } from "react";

export default function Login({ setUser, setAuthPage, setUserData }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email, password })
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
    <div className="h-screen flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow w-80">

        <h2 className="text-center font-bold mb-3">Login</h2>

        <input placeholder="Email" className="w-full mb-2 p-2 border"
          onChange={(e)=>setEmail(e.target.value)} />

        <input type="password" placeholder="Password"
          className="w-full mb-2 p-2 border"
          onChange={(e)=>setPassword(e.target.value)} />

        <button onClick={login} className="bg-blue-500 text-white w-full p-2">
          Login
        </button>

        <p onClick={()=>setAuthPage("signup")} className="text-blue-500 text-center mt-2 cursor-pointer">
          Signup
        </p>

      </div>
    </div>
  );
}