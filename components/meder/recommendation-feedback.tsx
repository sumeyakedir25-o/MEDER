"use client";

import { useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";

interface RecommendationFeedbackProps {
  placeId: string;
}

const reasons = [
  "Too far",
  "Too expensive",
  "Wrong vibe",
  "Not what I wanted",
  "Wrong time",
];

export default function RecommendationFeedback({
  placeId,
}: RecommendationFeedbackProps) {
  const [feedback, setFeedback] = useState<"yes" | "no" | null>(null);
  const [reason, setReason] = useState<string | null>(null);

  const handleFeedback = (value: "yes" | "no") => {
    setFeedback(value);
    setReason(null);

    // Temporary local storage.
    // Later we'll send this to MEDER's database.
    const savedFeedback = JSON.parse(
      localStorage.getItem("meder-feedback") || "[]",
    );

    savedFeedback.push({
      placeId,
      feedback: value,
      createdAt: new Date().toISOString(),
    });

    localStorage.setItem(
      "meder-feedback",
      JSON.stringify(savedFeedback),
    );
  };

  const handleReason = (value: string) => {
    setReason(value);

    const savedFeedback = JSON.parse(
      localStorage.getItem("meder-feedback") || "[]",
    );

    savedFeedback.push({
      placeId,
      feedback: "no",
      reason: value,
      createdAt: new Date().toISOString(),
    });

    localStorage.setItem(
      "meder-feedback",
      JSON.stringify(savedFeedback),
    );
  };

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
          Help MEDER improve
        </p>

        <h3 className="mt-2 font-serif text-xl text-white">
          Was this recommendation useful?
        </h3>

        {!feedback && (
          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => handleFeedback("yes")}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 px-5 text-sm font-medium text-white/75 transition hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
            >
              <ThumbsUp className="h-4 w-4" />
              Yes, helpful
            </button>

            <button
              type="button"
              onClick={() => handleFeedback("no")}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 px-5 text-sm font-medium text-white/75 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
            >
              <ThumbsDown className="h-4 w-4" />
              Not really
            </button>
          </div>
        )}

        {feedback === "yes" && (
          <div className="mt-5 rounded-xl bg-[#D4AF37]/10 px-4 py-3 text-sm text-[#D4AF37]">
            Thank you. That helps MEDER get better. ✨
          </div>
        )}

        {feedback === "no" && (
          <div className="mt-5">
            <p className="text-sm text-white/50">
              What didn't match?
            </p>

            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {reasons.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleReason(item)}
                  className={`rounded-full border px-3.5 py-2 text-xs transition ${
                    reason === item
                      ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                      : "border-white/10 text-white/55 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {reason && (
              <p className="mt-4 text-sm text-white/40">
                Got it. We'll use this to improve MEDER.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}