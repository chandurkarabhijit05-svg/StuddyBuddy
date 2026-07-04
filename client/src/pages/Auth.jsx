import { useState } from "react";
import supabase from "../services/supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Account created! Check your email if email confirmation is enabled.");
    }
  };

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Login successful!");
      window.location.reload();
    }
  };

  return (
    <div className="hero-bg min-h-screen flex items-center justify-center">
      <div className="glass p-8 w-[400px] rounded-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Study Buddy AI
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded text-black mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded text-black mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={signIn}
          className="gradient w-full py-3 rounded mb-4"
        >
          Login
        </button>

        <button
          onClick={signUp}
          className="gradient w-full py-3 rounded"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}