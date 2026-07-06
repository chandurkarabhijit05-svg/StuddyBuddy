import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Bell,
  BellOff,
  Mail,
  LogOut,
  User,
  Shield,
  Palette,
  Volume2,
  VolumeX,
  ChevronRight,
  Check,
  AlertTriangle,
  Sparkles,
  Save,
  RotateCcw,
  Trash2,
  Lock,
  Globe,
  Eye,
  EyeOff,
} from "lucide-react";
import supabase from "../services/supabase";

// ─── Toggle Switch Component ───────────────────────────
function ToggleSwitch({ enabled, onToggle, activeColor = "violet" }) {
  const colors = {
    violet: "bg-violet-600",
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    amber: "bg-amber-500",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
        enabled ? colors[activeColor] : "bg-slate-700"
      }`}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
      />
    </motion.button>
  );
}

// ─── Settings Card ───────────────────────────────────────
function SettingsCard({ icon: Icon, title, description, children, danger }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-slate-800/40 border rounded-2xl p-6 backdrop-blur-sm transition-all ${
        danger ? "border-rose-500/20 hover:border-rose-500/30" : "border-slate-700/30 hover:border-slate-600/40"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${danger ? "bg-rose-500/15" : "bg-slate-700/30"}`}>
            <Icon className={`w-5 h-5 ${danger ? "text-rose-400" : "text-slate-400"}`} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">{title}</h3>
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">{children}</div>
      </div>
    </motion.div>
  );
}

// ─── Danger Zone Card ────────────────────────────────────
function DangerZoneCard({ onLogout, onDeleteAccount }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-rose-500/15 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-rose-300">Danger Zone</h3>
          <p className="text-sm text-rose-400/60">Irreversible actions</p>
        </div>
      </div>

      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={onLogout}
          className="w-full flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/30 rounded-xl text-left hover:border-rose-500/30 transition-all"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 text-rose-400" />
            <div>
              <p className="text-sm font-medium text-white">Sign Out</p>
              <p className="text-xs text-slate-500">Log out from all devices</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </motion.button>

        <AnimatePresence>
          {!showConfirm ? (
            <motion.button
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowConfirm(true)}
              className="w-full flex items-center justify-between p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-left hover:bg-rose-500/15 transition-all"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-rose-400" />
                <div>
                  <p className="text-sm font-medium text-rose-300">Delete Account</p>
                  <p className="text-xs text-rose-400/60">Permanently remove all data</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-400/60" />
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl"
            >
              <p className="text-sm text-rose-300 mb-4">
                Are you sure? This will permanently delete your account and all associated data.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onDeleteAccount}
                  className="flex-1 py-2.5 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Sidebar Item ────────────────────────────────────────
function SidebarItem({ icon: Icon, label, active, onClick }) {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        active
          ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
          : "text-slate-400 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? "text-violet-400" : "text-slate-500"}`} />
      <span>{label}</span>
      {active && <ChevronRight className="w-4 h-4 ml-auto text-violet-400" />}
    </motion.button>
  );
}

// ─── Main Settings Component ─────────────────────────────
export default function Settings() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") !== "light");
  const [notifications, setNotifications] = useState(JSON.parse(localStorage.getItem("notifications") ?? "true"));
  const [soundEnabled, setSoundEnabled] = useState(JSON.parse(localStorage.getItem("sound") ?? "true"));
  const [autoSave, setAutoSave] = useState(JSON.parse(localStorage.getItem("autosave") ?? "true"));
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user);
    };
    loadUser();
  }, []);

  // Save all settings
  const saveSettings = () => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    localStorage.setItem("notifications", JSON.stringify(notifications));
    localStorage.setItem("sound", JSON.stringify(soundEnabled));
    localStorage.setItem("autosave", JSON.stringify(autoSave));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetSettings = () => {
    setDarkMode(true);
    setNotifications(true);
    setSoundEnabled(true);
    setAutoSave(true);
    saveSettings();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const deleteAccount = async () => {
    // Placeholder - would need backend implementation
    alert("Account deletion would be implemented here");
  };

  const tabs = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900/50 border-r border-slate-800/50 backdrop-blur-xl p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
            <SettingsIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>

        <nav className="space-y-1 flex-1">
          {tabs.map((tab) => (
            <SidebarItem
              key={tab.id}
              icon={tab.icon}
              label={tab.label}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-800/50">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-500 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            Back to Dashboard
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white capitalize">{activeTab}</h2>
            <p className="text-sm text-slate-500 mt-1">Manage your preferences</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetSettings}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 border border-slate-700/30 rounded-xl text-sm text-slate-400 hover:text-white transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={saveSettings}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-violet-500/20"
            >
              <Save className="w-4 h-4" />
              {saved ? "Saved!" : "Save Changes"}
            </motion.button>
          </div>
        </div>

        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-2xl p-6 mb-6 flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
            {user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{user?.email?.split("@")[0] || "User"}</h3>
            <p className="text-sm text-slate-400">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/20">
                Active
              </span>
              <span className="text-xs text-slate-500">Free Plan</span>
            </div>
          </div>
        </motion.div>

        {/* Settings Content */}
        <div className="space-y-4">
          {activeTab === "general" && (
            <>
              <SettingsCard
                icon={Mail}
                title="Email Address"
                description="Your account email for notifications"
              >
                <span className="text-sm text-slate-400">{user?.email}</span>
              </SettingsCard>

              <SettingsCard
                icon={autoSave ? Save : RotateCcw}
                title="Auto-Save"
                description="Automatically save your progress"
              >
                <ToggleSwitch enabled={autoSave} onToggle={() => setAutoSave(!autoSave)} activeColor="emerald" />
              </SettingsCard>

              <SettingsCard
                icon={soundEnabled ? Volume2 : VolumeX}
                title="Sound Effects"
                description="Play sounds for actions and notifications"
              >
                <ToggleSwitch enabled={soundEnabled} onToggle={() => setSoundEnabled(!soundEnabled)} activeColor="blue" />
              </SettingsCard>
            </>
          )}

          {activeTab === "appearance" && (
            <>
              <SettingsCard
                icon={darkMode ? Moon : Sun}
                title="Dark Mode"
                description="Toggle between dark and light themes"
              >
                <ToggleSwitch enabled={darkMode} onToggle={() => setDarkMode(!darkMode)} activeColor="violet" />
              </SettingsCard>

              <SettingsCard
                icon={Palette}
                title="Accent Color"
                description="Choose your preferred theme color"
              >
                <div className="flex items-center gap-2">
                  {["violet", "blue", "emerald", "amber", "rose"].map((color) => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded-full bg-${color}-500 ${color === "violet" ? "ring-2 ring-white" : ""}`}
                    />
                  ))}
                </div>
              </SettingsCard>
            </>
          )}

          {activeTab === "notifications" && (
            <>
              <SettingsCard
                icon={notifications ? Bell : BellOff}
                title="Push Notifications"
                description="Receive updates about your study progress"
              >
                <ToggleSwitch enabled={notifications} onToggle={() => setNotifications(!notifications)} activeColor="amber" />
              </SettingsCard>

              <SettingsCard
                icon={Mail}
                title="Email Digest"
                description="Weekly summary of your learning activity"
              >
                <ToggleSwitch enabled={notifications} onToggle={() => {}} activeColor="emerald" />
              </SettingsCard>
            </>
          )}

          {activeTab === "privacy" && (
            <>
              <SettingsCard
                icon={Lock}
                title="Two-Factor Authentication"
                description="Add an extra layer of security"
              >
                <span className="text-xs text-slate-500 px-3 py-1.5 bg-slate-800 rounded-lg">Coming Soon</span>
              </SettingsCard>

              <SettingsCard
                icon={Eye}
                title="Profile Visibility"
                description="Make your profile visible to other students"
              >
                <ToggleSwitch enabled={false} onToggle={() => {}} activeColor="blue" />
              </SettingsCard>

              <DangerZoneCard onLogout={logout} onDeleteAccount={deleteAccount} />
            </>
          )}
        </div>

        {/* Save Confirmation */}
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-8 right-8 flex items-center gap-3 px-5 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl backdrop-blur-sm"
            >
              <Check className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">Settings saved successfully</span>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}