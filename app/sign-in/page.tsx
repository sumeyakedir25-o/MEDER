 "use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from "lucide-react";
import { createClient } from "@/Lib/supabase/client";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

 const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  setError("");
  setSuccess("");

  if (!email.trim() || !password) {
    setError("Please enter your email and password.");
    return;
  }

  if (!email.includes("@")) {
    setError("Please enter a valid email address.");
    return;
  }

  try {
    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "Incorrect email or password."
          : signInError.message
      );
      return;
    }

    setSuccess("Welcome back to MEDER!");

    window.location.href = "/explorer";
  } catch {
    setError("Something went wrong. Please try again.");
  }
};

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white sm:px-6">
      <div className="mx-auto flex min-h-[85vh] max-w-md items-center justify-center">
        <div className="w-full">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to MEDER
          </Link>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl sm:p-8">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37]/10">
                <Lock className="h-6 w-6 text-[#D4AF37]" />
              </div>

              <p className="mt-5 text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                Welcome back
              </p>

              <h1 className="mt-2 font-serif text-3xl text-white sm:text-4xl">
                Sign in to MEDER
              </h1>

              <p className="mt-3 text-sm leading-6 text-white/45">
                Sign in to save places, manage your profile, and keep track of
                your exploration.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-white/75"
                >
                  Email
                </label>

                <div className="relative mt-2">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="min-h-12 w-full rounded-xl border border-white/10 bg-black/40 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF37]/60"
                  />
                </div>
              </div>
 {/* Password */}
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-white/75"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs text-[#D4AF37] transition hover:text-[#E5C158]"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative mt-2">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="min-h-12 w-full rounded-xl border border-white/10 bg-black/40 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF37]/60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-white/35 transition hover:bg-white/5 hover:text-[#D4AF37]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3 text-sm text-green-300">
                  {success}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="min-h-12 w-full rounded-xl bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
              >
                Sign In
              </button>
            </form>

            {/* Sign up */}
            <div className="mt-7 text-center text-sm text-white/45">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="font-extrabold !text-[#D4AF37] transition hover:!text-[#F5D778]"
              >
                Create one
              </Link>
            </div>

            {/* Browse without account */}
            <div className="mt-5 border-t border-white/10 pt-5 text-center">
              <Link
                href="/discover"
                className="text-xs text-white/35 transition hover:text-white/60"
              >
                Continue browsing without signing in →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}