import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  Chrome,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Decorarive from "../../ui/Decorarive";
import { login_user } from "../../Api/auth";
import { getApiErrorMessage } from "../../Api/errorHandler";

export default function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setIsLoading(true);

      const data = await login_user({
        email,
        password,
      });

      const accessToken = data?.access_token;
      const role = data?.role || data?.user?.role;

      if (!accessToken) {
        throw new Error("Access token not found");
      }

      localStorage.setItem("access_token", accessToken);

      if (role) {
        localStorage.setItem("role", role);
      }

      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      const normalizedRole = role?.toUpperCase();

      if (normalizedRole === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(getApiErrorMessage(err) || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 px-4 relative overflow-hidden">
      <Decorarive />

      <div className="relative w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl border border-amber-200 p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-amber-100 rounded-full">
              <BookOpen className="w-8 h-8 text-amber-800" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-amber-900">
            Welcome Back
          </h1>

          <p className="text-amber-700 text-sm">
            Sign in to your account to continue
          </p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Email
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-amber-600" />

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-amber-50 border border-amber-200 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-amber-600" />

              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full pl-10 pr-12 py-3 rounded-lg bg-amber-50 border border-amber-200 focus:ring-2 focus:ring-amber-500 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3.5 text-amber-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-3 rounded-lg hover:scale-105 transition disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 h-px bg-amber-300" />
          <span className="px-3 text-sm text-amber-700">
            Or continue with
          </span>
          <div className="flex-1 h-px bg-amber-300" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleSocialLogin("Google")}
            className="flex items-center justify-center gap-2 bg-amber-100 border border-amber-300 py-3 rounded-lg"
          >
            <Chrome className="w-5 h-5" /> Google
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin("WhatsApp")}
            className="flex items-center justify-center gap-2 bg-amber-100 border border-amber-300 py-3 rounded-lg"
          >
            <MessageCircle className="w-5 h-5" /> WhatsApp
          </button>
        </div>

        <p className="text-center text-sm text-amber-700 mt-6">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-amber-600 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}