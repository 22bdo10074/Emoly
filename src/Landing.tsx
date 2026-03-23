import logo from "./assets/logo.png";

export default function Landing({ setAuthPage }: any) {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2]">

      {/* Glass Card */}
      <div className="bg-white/20 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl text-center w-[90%] max-w-sm border border-white/30">

        {/* Logo */}
        <img
          src={logo}
          className="w-20 mx-auto mb-4 drop-shadow-xl"
        />

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-wide">
          Emoly 💬
        </h1>

        {/* Subtitle */}
        <p className="text-white/80 text-sm mb-6">
          Talk freely. Feel better. Connect instantly.
        </p>

        {/* Login Button */}
        <button
          onClick={() => setAuthPage("login")}
          className="bg-white text-black w-full p-3 rounded-xl mb-3 font-semibold shadow-lg hover:scale-105 transition"
        >
          Login
        </button>

        {/* Signup Button */}
        <button
          onClick={() => setAuthPage("signup")}
          className="bg-black/70 text-white w-full p-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
        >
          Signup
        </button>

      </div>
    </div>
  );
}