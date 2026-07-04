import { useEffect, useState } from "react";
import supabase from "../services/supabase";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") !== "light"
  );

  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem("notifications") ?? "true")
  );

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user);
    };

    loadUser();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem(
      "notifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div
      className={`min-h-screen p-10 ${
        darkMode
          ? "hero-bg text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      <h1 className="text-4xl font-bold mb-8">
        ⚙ Settings
      </h1>

      <div className="glass rounded-2xl p-6 space-y-6">

        <div>
          <h2 className="font-bold">Email</h2>
          <p>{user?.email}</p>
        </div>

        <div className="flex justify-between">
          <span>Dark Mode</span>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-blue-600 px-4 py-2 rounded"
          >
            {darkMode ? "ON" : "OFF"}
          </button>
        </div>

        <div className="flex justify-between">
          <span>Notifications</span>

          <button
            onClick={() =>
              setNotifications(!notifications)
            }
            className="bg-green-600 px-4 py-2 rounded"
          >
            {notifications ? "ON" : "OFF"}
          </button>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 px-6 py-3 rounded-lg"
        >
          Logout
        </button>

      </div>
    </div>
  );
}