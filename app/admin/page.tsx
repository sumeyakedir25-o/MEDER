"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/Lib/supabase/client";
import { LockKeyhole, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10">
            <ShieldCheck className="h-7 w-7 text-[#D4AF37]" />
          </div>

          <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
            MEDER
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Admin Portal
          </h1>

          <p className="mt-3 text-sm text-white/50">
            Secure access to the MEDER CMS.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl"
        >
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-white/70">
                Admin email
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@meder.com"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black px-11 py-3.5 text-sm text-white outline-none transition focus:border-[#D4AF37]/60"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">
                Password
              </label>

              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black px-11 py-3.5 text-sm text-white outline-none transition focus:border-[#D4AF37]/60"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-[#E5C45A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Enter Admin Portal"}

            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-white/30">
          Authorized MEDER administrators only.
        </p>
      </div>
    </main>
  );
}