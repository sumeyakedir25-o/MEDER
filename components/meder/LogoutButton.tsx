"use client";

import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({
  className = "",
}: LogoutButtonProps) {
  const handleLogout = () => {
    localStorage.removeItem("meder-current-user");

    window.location.href = "/";
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-5 text-sm font-medium text-white/70 transition hover:border-red-400/30 hover:bg-red-400/5 hover:text-red-300 ${className}`}
    >
      <LogOut className="h-4 w-4" />
      Log out
    </button>
  );
}