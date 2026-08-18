"use client";

import { Search, MapPin } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="flex w-full flex-col gap-3 rounded-2xl border border-white/10 bg-black/70 p-3 backdrop-blur-md md:flex-row md:items-center">
      
      <div className="flex min-h-12 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4">
        <Search className="h-5 w-5 shrink-0 text-[#D4AF37]" />

        <input
          type="text"
          placeholder="Search for places, food, experiences..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/45"
        />
      </div>

      <button
        type="button"
        className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-white transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
      >
        <MapPin className="h-5 w-5 text-[#D4AF37]" />
        <span>Current Location</span>
      </button>

      <button
        type="button"
        className="min-h-12 rounded-xl bg-[#D4AF37] px-7 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
      >
        Search
      </button>
    </div>
  );
}