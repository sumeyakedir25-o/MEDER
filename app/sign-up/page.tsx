 "use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Eye, EyeOff, UserRound, Mail, Lock, ArrowLeft } from "lucide-react";
import { createClient } from "@/Lib/supabase/client";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please complete all fields.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Your password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.session) {
        window.location.href = "/explorer";
        return;
      }

      setSuccess(
        "Account created! Check your email for a confirmation link before signing in."
      );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37]/10">
                <UserRound className="h-6 w-6 text-[#D4AF37]" />
              </div>

              <p className="mt-5 text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                Your next discovery starts here
              </p>

              <h1 className="mt-2 font-serif text-3xl text-white sm:text-4xl">
                Join MEDER
              </h1>

              <p className="mt-3 text-sm leading-6 text-white/45">
                Create an account to save places and build your own collection
                of discoveries.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-white/75">
                  Full name
                </label>
                <div className="relative mt-2">
                  <UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    required
                    className="min-h-12 w-full rounded-xl border border-white/10 bg-black/40 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF37]/60"
                  />
                </div>
              </div>
 <div>
                <label htmlFor="email" className="text-sm font-medium text-white/75">
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
                    required
                    className="min-h-12 w-full rounded-xl border border-white/10 bg-black/40 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF37]/60"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium text-white/75">
                  Password
                </label>
                <div className="relative mt-2">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    minLength={6}
                    required
                    className="min-h-12 w-full rounded-xl border border-white/10 bg-black/40 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF37]/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
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

              {error && (
                <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {success && (
                <div role="status" className="rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3 text-sm text-green-300">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="min-h-12 w-full rounded-xl bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#E5C158] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-7 text-center text-sm text-white/45">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-extrabold !text-[#D4AF37] transition hover:!text-[#F5D778]"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}