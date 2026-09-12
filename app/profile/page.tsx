 "use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  Compass,
  Clock3,
  LogOut,
  Mail,
  Settings,
  User,
} from "lucide-react";

interface CurrentUser {
  name?: string;
  email?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [savedCount, setSavedCount] = useState(0);
  const [experienceCount, setExperienceCount] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("meder-current-user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }

    const savedPlaces = JSON.parse(
      localStorage.getItem("meder-saved-places") || "[]",
    );

    const experiences = JSON.parse(
      localStorage.getItem("meder-experiences") || "[]",
    );

    setSavedCount(savedPlaces.length);
    setExperienceCount(experiences.length);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("meder-current-user");
    window.location.href = "/";
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-black px-4 py-16 text-white sm:px-6">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/10">
            <User className="h-7 w-7 text-[#D4AF37]" />
          </div>

          <h1 className="mt-6 font-serif text-3xl text-white">
            Sign in to view your profile
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/45">
            Create your MEDER account to manage your profile, saved places,
            and Explorer activity.
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <Link
              href="/sign-in"
              className="flex min-h-12 items-center justify-center rounded-xl bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="flex min-h-12 items-center justify-center rounded-xl border border-white/10 px-5 text-sm font-medium text-white/70 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
            >
              Create Account
            </Link>

            <Link
              href="/"
              className="mt-2 inline-flex items-center justify-center gap-2 text-sm text-white/40 transition hover:text-white/70"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to MEDER
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const displayName = user.name?.trim() || "MEDER Explorer";
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to MEDER
        </Link>

        {/* Profile */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <div className="p-6 sm:p-8">

            {/* Profile header */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              
              {/* Avatar */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 font-serif text-4xl text-[#D4AF37]">
                {firstLetter}
              </div>

              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                  MEDER Profile
                </p>
 <h1 className="mt-2 font-serif text-3xl text-white sm:text-4xl">
                  {displayName}
                </h1>

                <div className="mt-3 flex items-center gap-2 text-sm text-white/45">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
              </div>
            </div>

            {/* Explorer level */}
            <div className="mt-8 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/10">
                  <Compass className="h-5 w-5 text-[#D4AF37]" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-white/35">
                    Explorer
                  </p>

                  <p className="mt-1 font-serif text-xl text-[#D4AF37]">
                    Level 1
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="flex items-center gap-3">
                  <Bookmark className="h-5 w-5 text-[#D4AF37]" />

                  <div>
                    <p className="text-2xl font-semibold text-white">
                      {savedCount}
                    </p>

                    <p className="text-xs text-white/40">
                      Saved places
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="flex items-center gap-3">
                  <Compass className="h-5 w-5 text-[#D4AF37]" />

                  <div>
                    <p className="text-2xl font-semibold text-white">
                      {experienceCount}
                    </p>

                    <p className="text-xs text-white/40">
                      Experiences shared
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">

              <Link
                href="/explorer"
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
              >
                <Compass className="h-4 w-4" />
                My Explorer
              </Link>

              <Link
                href="/saved"
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 px-5 text-sm font-medium text-white/70 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
              >
                <Bookmark className="h-4 w-4" />
                Saved Places
              </Link>
              <Link
  href="/profile/settings"
  className="..."
>
  Account Settings
</Link>

              <Link
  href="/profile/preferences"
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 px-5 text-sm font-medium text-white/70 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
              >
                <Settings className="h-4 w-4" />
                Account Settings
              </Link>
              <Link
  href="/profile/history"
  className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 px-5 text-sm font-medium text-white/70 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
>
  <Clock3 className="h-4 w-4" />
  Recommendation History
</Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 px-5 text-sm font-medium text-white/50 transition hover:border-red-400/30 hover:bg-red-400/5 hover:text-red-300"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>

            </div>

          </div>
        </section>

      </div>
    </main>
  );
}