"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/Lib/supabase/client";
import { LockKeyhole, ShieldCheck, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleUpdatePassword(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage("Password updated successfully.");

    setTimeout(() => {
      router.push("/admin");
      router.refresh();
    }, 1200);
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

          <h1 className="mt-3 text-3xl font-semibold">
            Set New Password
          </h1>

          <p className="mt-3 text-sm text-white/50">
            Create a new password for your admin account.
          </p>
        </div>

        <form
          onSubmit={handleUpdatePassword}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-white/70">
                New password
              </label>

              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black px-11 py-3.5 text-sm text-white outline-none focus:border-[#D4AF37]/60"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">
                Confirm password
              </label>

              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Enter password again"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black px-11 py-3.5 text-sm text-white outline-none focus:border-[#D4AF37]/60"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
          {message && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
              <CheckCircle className="h-4 w-4" />
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-[#D4AF37] px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-[#E5C45A] disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </main>
  );
}