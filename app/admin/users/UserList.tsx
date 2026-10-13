 "use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Ban,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

type UserProfile = {
  id: string;
  display_name: string | null;
  status: "active" | "suspended" | "banned";
  moderation_note: string | null;
  created_at: string;
  updated_at: string;
};

type ModerationAction =
  | "suspend"
  | "ban"
  | "restore";

export default function UserList({
  initialUsers,
}: {
  initialUsers: UserProfile[];
}) {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] =
    useState<UserProfile | null>(null);
  const [selectedAction, setSelectedAction] =
    useState<ModerationAction | null>(null);
  const [moderationNote, setModerationNote] =
    useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(
    null
  );

  const activeCount = users.filter(
    (user) => user.status === "active"
  ).length;

  const suspendedCount = users.filter(
    (user) => user.status === "suspended"
  ).length;

  const bannedCount = users.filter(
    (user) => user.status === "banned"
  ).length;

  function openModeration(
    user: UserProfile,
    action: ModerationAction
  ) {
    setSelectedUser(user);
    setSelectedAction(action);
    setModerationNote(user.moderation_note ?? "");
    setMessage(null);
  }

  function closeModeration() {
    if (loading) return;

    setSelectedUser(null);
    setSelectedAction(null);
    setModerationNote("");
    setMessage(null);
  }

  async function submitModeration() {
    if (!selectedUser || !selectedAction) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        "/api/admin/users/moderate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: selectedUser.id,
            action: selectedAction,
            moderationNote,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage(
          result?.error ||
            "Moderation action could not be completed."
        );

        return;
      }

      const nextStatus =
        selectedAction === "suspend"
          ? "suspended"
          : selectedAction === "ban"
            ? "banned"
            : "active";

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                status: nextStatus,
                moderation_note:
                  moderationNote || null,
              }
            : user
        )
      );

      closeModeration();
    } catch {
      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/admin/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10">
              <Users
                size={21}
                className="text-[#D4AF37]"
              />
            </div>

            <div>
              <span className="text-xs font-medium uppercase tracking-[0.22em] text-[#D4AF37]">
                User Moderation
              </span>

              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                Users
              </h1>
            </div>
          </div>
 <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
            View MEDER accounts and manage moderation
            status.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <StatCard
            label="Active"
            value={activeCount}
            icon={<CheckCircle2 size={17} />}
          />

          <StatCard
            label="Suspended"
            value={suspendedCount}
            icon={<ShieldAlert size={17} />}
          />

          <StatCard
            label="Banned"
            value={bannedCount}
            icon={<Ban size={17} />}
          />
        </div>

        {/* Users */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-lg font-semibold">
              MEDER Accounts
            </h2>

            <p className="mt-1 text-sm text-white/45">
              {users.length} profile
              {users.length === 1 ? "" : "s"} found
            </p>
          </div>

          {users.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Users
                size={30}
                className="mx-auto text-white/25"
              />

              <h3 className="mt-4 text-lg font-medium">
                No user profiles yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/45">
                User profiles will appear here once MEDER
                users have profile records.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onModerate={openModeration}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Moderation modal */}
      {selectedUser && selectedAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl">
            <h2 className="text-xl font-semibold">
              {selectedAction === "suspend"
                ? "Suspend User"
                : selectedAction === "ban"
                  ? "Ban User"
                  : "Restore User"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/50">
              {selectedUser.display_name ||
                "Unnamed User"}
            </p>

            <div className="mt-6">
              <label className="text-xs font-medium uppercase tracking-[0.14em] text-white/45">
                Moderation Note
              </label>

              <textarea
                value={moderationNote}
                onChange={(event) =>
                  setModerationNote(event.target.value)
                }
                rows={5}
                placeholder="Add a private moderation note..."
                className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37]/50"
              />
            </div>

            {message && (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                {message}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModeration}
                disabled={loading}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/65 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
              >
                Cancel
              </button>
 <button
                type="button"
                onClick={submitModeration}
                disabled={loading}
                className="rounded-xl bg-[#D4AF37] px-5 py-2.5 text-sm font-medium text-black transition hover:bg-[#e1c45a] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading
                  ? "Processing..."
                  : selectedAction === "suspend"
                    ? "Suspend"
                    : selectedAction === "ban"
                      ? "Ban"
                      : "Restore"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function UserRow({
  user,
  onModerate,
}: {
  user: UserProfile;
  onModerate: (
    user: UserProfile,
    action: ModerationAction
  ) => void;
}) {
  return (
    <div className="flex flex-col gap-5 px-6 py-6 transition hover:bg-white/[0.025] lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
          <UserRound
            size={18}
            className="text-white/60"
          />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {user.display_name || "Unnamed User"}
          </p>

          <p className="mt-1 truncate text-xs text-white/30">
            {user.id}
          </p>

          <p className="mt-2 text-xs text-white/40">
            Joined{" "}
            {new Date(
              user.created_at
            ).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={user.status} />

        {user.status === "active" && (
          <>
            <button
              type="button"
              onClick={() =>
                onModerate(user, "suspend")
              }
              className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white/65 transition hover:border-yellow-500/30 hover:bg-yellow-500/5 hover:text-yellow-300"
            >
              Suspend
            </button>

            <button
              type="button"
              onClick={() =>
                onModerate(user, "ban")
              }
              className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white/65 transition hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-300"
            >
              Ban
            </button>
          </>
        )}

        {user.status === "suspended" && (
          <>
            <button
              type="button"
              onClick={() =>
                onModerate(user, "restore")
              }
              className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white/65 transition hover:border-green-500/30 hover:bg-green-500/5 hover:text-green-300"
            >
              Restore
            </button>

            <button
              type="button"
              onClick={() =>
                onModerate(user, "ban")
              }
              className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white/65 transition hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-300"
            >
              Ban
            </button>
          </>
        )}

        {user.status === "banned" && (
          <button
            type="button"
            onClick={() =>
              onModerate(user, "restore")
            }
            className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white/65 transition hover:border-green-500/30 hover:bg-green-500/5 hover:text-green-300"
          >
            Restore
          </button>
        )}
      </div>
    </div>
  );
}
 function StatusBadge({
  status,
}: {
  status: UserProfile["status"];
}) {
  const config = {
    active: {
      label: "Active",
      className:
        "border-green-500/20 bg-green-500/5 text-green-300",
    },
    suspended: {
      label: "Suspended",
      className:
        "border-yellow-500/20 bg-yellow-500/5 text-yellow-300",
    },
    banned: {
      label: "Banned",
      className:
        "border-red-500/20 bg-red-500/5 text-red-300",
    },
  };

  const current = config[status];

  return (
    <span
      className={`rounded-full border px-3 py-1.5 text-xs font-medium ${current.className}`}
    >
      {current.label}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-3 flex items-center gap-2 text-white/50">
        {icon}

        <span className="text-xs uppercase tracking-[0.16em]">
          {label}
        </span>
      </div>

      <p className="text-3xl font-semibold">
        {value}
      </p>
    </div>
  );
}