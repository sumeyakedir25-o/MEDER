"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  MapPin,
  Star,
} from "lucide-react";

import { mederPlaces } from "@/Lib/meder/places";

export default function SavedPlacesPage() {
  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>([]);

  useEffect(() => {
    const storedSavedPlaces = localStorage.getItem(
      "meder-saved-places",
    );

    if (storedSavedPlaces) {
      try {
        setSavedPlaceIds(JSON.parse(storedSavedPlaces));
      } catch {
        setSavedPlaceIds([]);
      }
    }
  }, []);

  const savedPlaces = mederPlaces.filter((place) =>
    savedPlaceIds.includes(place.id),
  );

  const removeSavedPlace = (placeId: string) => {
    const updated = savedPlaceIds.filter(
      (id) => id !== placeId,
    );

    setSavedPlaceIds(updated);

    localStorage.setItem(
      "meder-saved-places",
      JSON.stringify(updated),
    );
  };

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to explore
        </Link>

        {/* Header */}
<section className="rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/5 px-5 py-4 sm:px-6 sm:py-5">
  <div className="flex items-center justify-between gap-4">
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <Bookmark className="h-4 w-4 shrink-0 text-[#D4AF37]" />

        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#D4AF37]">
          Your collection
        </p>
      </div>

      <h1 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
        Places I Want to Try
      </h1>

      <p className="mt-1 text-sm text-white/45">
        Places you saved for later.
      </p>
    </div>

    <div className="shrink-0 text-right">
      <p className="font-serif text-2xl text-[#D4AF37]">
        {savedPlaces.length}
      </p>

      <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-white/40">
        Saved
      </p>
    </div>
  </div>
</section>
        {/* Saved places */}
        {savedPlaces.length > 0 ? (
          <section className="mt-10">

            <div className="mb-5">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                Your saved spots
              </p>

              <h2 className="mt-1 font-serif text-2xl text-white sm:text-3xl">
                Ready whenever you are
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {savedPlaces.map((place) => (
                <article
                  key={place.id}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:bg-white/[0.05]"
                >

                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">

                    <img
                      src={place.image}
                      alt={place.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Saved button */}
                    <button
                      type="button"
                      onClick={() => removeSavedPlace(place.id)}
                      className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-black/70 text-[#D4AF37] backdrop-blur-md transition hover:scale-105 hover:bg-[#D4AF37] hover:text-black"
                      aria-label={`Remove ${place.name} from saved places`}
                    >
                      <Bookmark
                        className="h-4 w-4"
                        fill="currentColor"
                      />
                    </button>

                  </div>

                  {/* Details */}
                  <div className="p-5">

                    <h3 className="font-serif text-xl text-white sm:text-2xl">
                      {place.name}
                    </h3>

                    <p className="mt-1 text-sm text-white/45">
                      {place.type}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/60">

                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-[#D4AF37]" />
                        {place.area}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />

                        {place.rating}

                        <span className="text-white/35">
                          ({place.reviews})
                        </span>
                      </span>

                    </div>

                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap gap-2">

                      {place.vibe.slice(0, 2).map((vibe) => (
                        <span
                          key={vibe}
                          className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/55"
                        >
                          {vibe}
                        </span>
                      ))}

                    </div>

                    <button
                      type="button"
                      className="mt-5 inline-flex min-h-10 w-full items-center justify-center rounded-xl border border-[#D4AF37]/40 px-5 text-sm font-medium text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
                    >
                      View Details
                    </button>

                  </div>

                </article>
              ))}

            </div>

          </section>
        ) : (
          /* Empty state */
          <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center sm:px-10">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/10">
              <Bookmark className="h-7 w-7 text-[#D4AF37]" />
            </div>

            <h2 className="mt-6 font-serif text-2xl text-white">
              Your collection is waiting
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/50">
              When you find a place you love, bookmark it and
              it will appear here.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
            >
              Explore places
            </Link>

          </section>
        )}

      </div>
    </main>
  );
}