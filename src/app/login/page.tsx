"use client";

import { useState } from "react";
import { Mail, Lock, LogIn, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login process delay
    setTimeout(() => {
      setLoading(false);
      window.location.href = "/";
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="mb-6 flex items-center justify-center transition-transform hover:scale-105">
            <div className="animate-glow rounded-full bg-blue-500/10 p-4 ring-1 ring-blue-500/20">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome <span className="text-primary">Back</span>
          </h1>
          <p className="mt-2 text-zinc-400">
            Sign in to continue to AI Code Reviewer.
          </p>
        </div>

        <div className="glass rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-300">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-zinc-800 bg-black/50 p-3 pl-10 text-zinc-100 outline-none ring-primary/20 transition-all focus:border-primary focus:ring-4"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-300">Password</label>
                <Link href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-zinc-800 bg-black/50 p-3 pl-10 text-zinc-100 outline-none ring-primary/20 transition-all focus:border-primary focus:ring-4"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-bold text-white transition-all hover:scale-[1.02] hover:bg-blue-600 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  Signing in...
                </div>
              ) : (
                <>
                  Sign In <LogIn className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
