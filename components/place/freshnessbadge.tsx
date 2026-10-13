"use client";

import { getFreshnessStatus } from "@/Lib/meder/freshness";

type FreshnessBadgeProps = {
  lastVerifiedAt?: string | null;
  compact?: boolean;
};

export default function FreshnessBadge({
  lastVerifiedAt,
  compact = false,
}: FreshnessBadgeProps) {
  const freshness = getFreshnessStatus(lastVerifiedAt);

  const styles = {
    recent: {
      container:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      dot: "bg-emerald-400",
    },
    needs_verification: {
      container:
        "border-amber-400/20 bg-amber-400/10 text-amber-300",
      dot: "bg-amber-400",
    },
    outdated: {
      container:
        "border-red-400/20 bg-red-400/10 text-red-300",
      dot: "bg-red-400",
    },
  };

  const style = styles[freshness.status];

  return (
    <div
      title={freshness.description}
      className={`inline-flex items-center gap-2 rounded-full border ${
        compact
          ? "px-2.5 py-1 text-[10px]"
          : "px-3 py-1.5 text-xs"
      } ${style.container}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`}
      />

      <span className="font-medium">
        {freshness.label}
      </span>

      {!compact &&
        freshness.daysSinceVerification !== null && (
          <span className="opacity-60">
            {freshness.daysSinceVerification === 0
              ? "today"
              : `${freshness.daysSinceVerification}d ago`}
          </span>
        )}
    </div>
  );
}