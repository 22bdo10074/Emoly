import logo from "./assets/logo.png";

export default function Landing({ setAuthPage }: any) {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600">

      {/* Glass Card */}
      <div className="bg-white/20 backdrop-blur-xl p-8 rounded-3xl shadow-2xl text-center w-[90%] max-w-sm border border-white/30">

        {/* Logo */}
        <img
          src={logo}
          className="w-20 mx-auto mb-4 drop-shadow-lg"
        />

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2">
          Emoly 💬
        </h1>

        <p className="text-white/80 text-sm mb-6">
          Talk freely. Feel better. Connect instantly.
        </p>

        {/* Buttons */}
        <button
          onClick={() => setAuthPage("login")}
          className="bg-white text-black w-full p-3 rounded-xl mb-3 hover:scale-105 transition"
        >
          Login
        </button>

        <button
          onClick={() => setAuthPage("signup")}
          className="bg-black/70 text-white w-full p-3 rounded-xl hover:scale-105 transition"
        >
          Signup
        </button>

      </div>
    </div>
  );
}