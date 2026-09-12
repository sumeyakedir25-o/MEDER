 "use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Bell,
  Clock3,
  LogOut,
  Settings,
  SlidersHorizontal,
  Trash2,
  User,
} from "lucide-react";

export default function AccountSettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("meder-user");
    localStorage.removeItem("meder-authenticated");

    window.location.href = "/";
  };

  const handleDeleteLocalData = () => {
    localStorage.removeItem("meder-user");
    localStorage.removeItem("meder-authenticated");
    localStorage.removeItem("meder-saved-places");
    localStorage.removeItem("meder-experiences");
    localStorage.removeItem("meder-preferences");
    localStorage.removeItem("meder-recommendation-history");

    window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Back */}
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Link>

        {/* Header */}
        <section className="mt-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/10">
              <Settings className="h-5 w-5 text-[#D4AF37]" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                Your account
              </p>

              <h1 className="mt-1 font-serif text-3xl text-white sm:text-4xl">
                Account Settings
              </h1>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-white/45">
            Manage your MEDER account and personal preferences.
          </p>
        </section>

        {/* Account */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="font-serif text-xl text-white">
              Account
            </h2>
          </div>

          <div className="divide-y divide-white/10">

            <div className="flex items-center gap-4 px-6 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                <User className="h-5 w-5 text-white/50" />
              </div>

              <div>
                <p className="text-sm font-medium text-white">
                  Profile
                </p>

                <p className="mt-1 text-xs text-white/40">
                  Manage your public explorer profile.
                </p>
              </div>
            </div>

            <Link
              href="/profile/preferences"
              className="flex items-center justify-between gap-4 px-6 py-5 transition hover:bg-white/[0.03]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                  <SlidersHorizontal className="h-5 w-5 text-white/50" />
                </div>

                <div>
                  <p className="text-sm font-medium text-white">
                    Preferences
                  </p>

                  <p className="mt-1 text-xs text-white/40">
                    Control what MEDER recommends to you.
                  </p>
                </div>
              </div>

              <span className="text-white/30">→</span>
            </Link>
 <Link
              href="/profile/history"
              className="flex items-center justify-between gap-4 px-6 py-5 transition hover:bg-white/[0.03]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                  <Clock3 className="h-5 w-5 text-white/50" />
                </div>

                <div>
                  <p className="text-sm font-medium text-white">
                    Recommendation History
                  </p>

                  <p className="mt-1 text-xs text-white/40">
                    See places MEDER IT recommended before.
                  </p>
                </div>
              </div>

              <span className="text-white/30">→</span>
            </Link>

          </div>
        </section>

        {/* Notifications */}
        <section className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="font-serif text-xl text-white">
              Notifications
            </h2>
          </div>

          <div className="flex items-center justify-between gap-5 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                <Bell className="h-5 w-5 text-white/50" />
              </div>

              <div>
                <p className="text-sm font-medium text-white">
                  MEDER notifications
                </p>

                <p className="mt-1 text-xs text-white/40">
                  Receive useful updates and recommendations.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setNotifications((current) => !current)
              }
              aria-label="Toggle notifications"
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                notifications
                  ? "bg-[#D4AF37]"
                  : "bg-white/15"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  notifications
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>
          </div>
        </section>

        {/* Sign out */}
        <section className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-5 text-sm font-medium text-white/70 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </section>

        {/* Delete */}
        <section className="mt-5 rounded-3xl border border-red-400/10 bg-red-400/[0.03] p-6">
          <div className="flex items-start gap-4">
            <Trash2 className="mt-1 h-5 w-5 shrink-0 text-red-300" />

            <div>
              <h2 className="font-serif text-xl text-white">
                Delete account data
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/40">
                This prototype stores account-related data on this
                device. Deleting it will remove your local MEDER
                data.
              </p>
            </div>
          </div>

          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
 className="mt-5 min-h-11 rounded-xl border border-red-400/20 px-5 text-sm font-medium text-red-300 transition hover:bg-red-400/10"
            >
              Delete local data
            </button>
          ) : (
            <div className="mt-5 rounded-2xl border border-red-400/20 bg-black/30 p-4">
              <p className="text-sm text-white/70">
                Are you sure? This will remove your saved places,
                experiences, preferences, recommendation history,
                and prototype account data from this device.
              </p>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleDeleteLocalData}
                  className="min-h-11 rounded-xl bg-red-500 px-5 text-sm font-semibold text-white transition hover:bg-red-400"
                >
                  Yes, delete my data
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="min-h-11 rounded-xl border border-white/10 px-5 text-sm font-medium text-white/60 transition hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}