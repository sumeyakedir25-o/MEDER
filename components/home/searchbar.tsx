"use client";

import { Search, MapPin } from "lucide-react";

export default function SearchBar() {
  return (
    <section className="w-full min-w-0 px-4 py-4 md:px-8">
      <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-2 rounded-2xl border border-white/10 bg-black/70 p-2 backdrop-blur-md md:flex-row md:items-center">
        <div className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
          <Search className="h-4 w-4 shrink-0 text-[#D4AF37]" />

          <input
            type="text"
            placeholder="Search for places, food, experiences..."
            className="min-w-0 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/45"
          />
        </div>

        <button
          type="button"
          className="flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37] md:w-auto"
        >
          <MapPin className="h-4 w-4 text-[#D4AF37]" />
          <span>Current Location</span>
        </button>

        <button
          type="button"
          className="min-h-11 w-full shrink-0 rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black transition hover:bg-[#E5C158] md:w-auto"
        >
          Search
        </button>
      </div>
    </section>
  );
}