import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabase";

export default function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const navigate = useNavigate();

  const signup = async () => {

    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if(error){
      alert(error.message);
      return;
    }

    alert("Account Created!");
  };

  const login = async () => {

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if(error){
      alert(error.message);
      return;
    }

    navigate("/dashboard");
  };

  return (

    <div className="min-h-screen hero-bg flex items-center justify-center">

      <div className="glass p-8 w-[400px]">

        <h1 className="text-3xl font-bold mb-6">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-black/40"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-black/40"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="gradient w-full p-3 rounded mb-3"
        >
          Login
        </button>

        <button
          onClick={signup}
          className="w-full p-3 rounded border"
        >
          Sign Up
        </button>

      </div>

    </div>
  );
}