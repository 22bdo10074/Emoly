import { useState } from "react";

export default function Signup({ setAuthPage }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [file, setFile] = useState<any>(null);

  const signup = async () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("username", username);
    if (file) formData.append("avatar", file);

    await fetch("http://localhost:5000/signup", {
      method: "POST",
      body: formData,
    });

    alert("Signup success");
    setAuthPage("login");
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow w-80">

        <h2 className="text-center font-bold mb-3">Signup</h2>

        <input placeholder="Username" className="w-full mb-2 p-2 border"
          onChange={(e)=>setUsername(e.target.value)} />

        <input placeholder="Email" className="w-full mb-2 p-2 border"
          onChange={(e)=>setEmail(e.target.value)} />

        <input type="password" placeholder="Password"
          className="w-full mb-2 p-2 border"
          onChange={(e)=>setPassword(e.target.value)} />

        <input type="file" className="mb-3"
          onChange={(e)=>setFile(e.target.files?.[0])} />

        <button className="bg-green-500 text-white w-full p-2"
          onClick={signup}>
          Signup
        </button>

        <p onClick={()=>setAuthPage("login")} className="text-blue-500 text-center mt-2 cursor-pointer">
          Login
        </p>

      </div>
    </div>
  );
}