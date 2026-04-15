import React, { useState, useMemo } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  Chrome,
  MessageCircle,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import generateBooks from "../../utils/genrate_color";
import Decorarive from "../../ui/Decorarive";
import { register_user } from "../../Api/auth";


export default function SignupPage() {
  const navigate = useNavigate();

  // ---------------- STATE ----------------
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------------- SIGNUP HANDLER ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        name,
        email,
        password,
      };

      const res = await register_user(payload)

      console.log("Signup Success:", res);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.detail || "Signup failed. Try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- SOCIAL LOGIN ----------------
  const handleSocialLogin = (provider) => {
    alert(`${provider} login coming soon 🚀`);
  };

  // ---------------- NAVIGATION ----------------
  const handleLogin = () => {
    navigate("/login");
  };

  // ---------------- BACKGROUND BOOKS ----------------
  const _books = useMemo(() => generateBooks(), []);

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 px-4 relative overflow-hidden">
      <Decorarive />

      <div className="relative w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl border border-amber-200 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-amber-100 rounded-full">
              <BookOpen className="w-8 h-8 text-amber-800" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-amber-900">
            Create Account
          </h1>
          <p className="text-amber-700 text-sm">
            Join Yadav Library Today
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-amber-600" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-amber-50 border border-amber-200 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-amber-600" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-amber-50 border border-amber-200 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-amber-600" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 rounded-lg bg-amber-50 border border-amber-200 focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-amber-600"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-3 rounded-lg hover:scale-105 transition disabled:opacity-60"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Social */}
        <div className="my-6 grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSocialLogin("Google")}
            className="flex items-center justify-center gap-2 bg-amber-100 border border-amber-300 py-3 rounded-lg"
          >
            <Chrome /> Google
          </button>
          <button
            onClick={() => handleSocialLogin("WhatsApp")}
            className="flex items-center justify-center gap-2 bg-amber-100 border border-amber-300 py-3 rounded-lg"
          >
            <MessageCircle /> WhatsApp
          </button>
        </div>

        {/* Login */}
        <p className="text-center text-sm text-amber-700 mt-6">
          Already have an account?{" "}
          <button
            onClick={handleLogin}
            className="text-amber-600 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
