import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-5 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
        Study Buddy AI
      </h1>

      <div className="flex gap-8 text-gray-300">
        <Link to="/" className="hover:text-white">Home</Link>
        <Link to="/login" className="hover:text-white">Login</Link>
      </div>
    </nav>
  );
}