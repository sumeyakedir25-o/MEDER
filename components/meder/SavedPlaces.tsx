"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bookmark, MapPin, Star } from "lucide-react";
import { mederPlaces } from "@/Lib/meder/places";

export default function SavedPlaces() {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("meder-saved-places") || "[]",
    );

    setSavedIds(saved);
  }, []);

  const savedPlaces = mederPlaces.filter((place) =>
    savedIds.includes(place.id),
  );

  return (
    <section className="mt-10 border-t border-white/10 pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
            Your collection
          </p>

          <h2 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
            Saved places
          </h2>

          <p className="mt-2 text-sm text-white/45">
            Places you want to remember, revisit, or try later.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-3 py-2 text-xs text-[#D4AF37]">
          <Bookmark className="h-3.5 w-3.5" />
          {savedPlaces.length} saved
        </div>
      </div>

      {savedPlaces.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/10">
            <Bookmark className="h-5 w-5 text-[#D4AF37]" />
          </div>

          <h3 className="mt-4 font-serif text-xl text-white">
            Your collection is empty
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/40">
            Save places you discover so you can easily find them again.
          </p>

          <Link
            href="/discover"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
          >
            Explore places
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {savedPlaces.map((place) => (
            <Link
              key={place.id}
              href={`/places/${place.id}`}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:bg-white/[0.05]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={place.image}
                  alt={place.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-[#D4AF37] backdrop-blur-md">
                  <Bookmark className="h-4 w-4 fill-current" />
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white backdrop-blur-md">
                  <Star className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                  {place.rating}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-serif text-xl text-white">
                  {place.name}
                </h3>

                <p className="mt-1 text-sm text-white/45">
                  {place.type}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-sm text-white/55">
                  <MapPin className="h-4 w-4 text-[#D4AF37]" />
                  {place.area}
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {place.vibe.slice(0, 3).map((vibe) => (
                    <span
                      key={vibe}
                      className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] text-white/50"
                    >
                      {vibe}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}