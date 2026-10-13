"use client";

import { useEffect } from "react";
import DecisionForm from "@/components/meder-it/desionform";
import { trackEvent } from "@/Lib/analytics";

export default function MederItPage() {
  useEffect(() => {
    void trackEvent({
      eventName: "meder_it_started",
    });
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-10 sm:px-6 sm:pt-12 sm:pb-14 lg:px-8">
        <div className="rounded-3xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.035] p-3 shadow-[0_0_80px_rgba(212,175,55,0.04)] sm:p-5 lg:p-7">
          <DecisionForm />
        </div>
      </section>
    </main>
  );
}