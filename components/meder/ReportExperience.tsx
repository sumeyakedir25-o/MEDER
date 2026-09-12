"use client";

import { useState } from "react";
import { Flag, X } from "lucide-react";

interface ReportExperienceProps {
  experienceId: string;
}

const reasons = [
  "Spam",
  "Fake experience",
  "Offensive content",
  "Wrong information",
  "Other",
];

export default function ReportExperience({
  experienceId,
}: ReportExperienceProps) {
  const [open, setOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [reported, setReported] = useState(false);

  const handleSubmit = () => {
    if (!selectedReason) return;

    const existingReports = JSON.parse(
      localStorage.getItem("meder-experience-reports") || "[]",
    );

    const alreadyReported = existingReports.some(
      (report: { experienceId: string }) =>
        report.experienceId === experienceId,
    );

    if (!alreadyReported) {
      existingReports.push({
        id: Date.now().toString(),
        experienceId,
        reason: selectedReason,
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem(
        "meder-experience-reports",
        JSON.stringify(existingReports),
      );
    }

    setReported(true);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs text-white/35 transition hover:text-red-400"
      >
        <Flag className="h-3.5 w-3.5" />
        Report
      </button>

      {reported && (
        <span className="text-xs text-[#D4AF37]">
          Reported
        </span>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111] p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                  <Flag className="h-5 w-5" />
                </div>

                <h2 className="mt-4 font-serif text-2xl text-white">
                  Report experience
                </h2>

                <p className="mt-2 text-sm text-white/45">
                  Tell us why this experience should be reviewed.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-white/40 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-2">
              {reasons.map((reason) => {
                const selected =
                  selectedReason === reason;

                return (
                  <button
                    key={reason}
                    type="button"
                    onClick={() =>
                      setSelectedReason(reason)
                    }
                    className={`flex w-full items-center rounded-xl border px-4 py-3 text-left text-sm transition ${
                      selected
                        ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                        : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25"
                    }`}
                  >
                    {reason}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedReason}
              className="mt-6 min-h-12 w-full rounded-xl bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#E5C158] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Submit report
            </button>
          </div>
        </div>
      )}
    </>
  );
}