 "use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  MapPin,
  Star,
  Trash2,
} from "lucide-react";
import { mederPlaces } from "@/Lib/meder/places";

export default function SavedPlacesPage() {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("meder-saved-places") || "[]",
    );

    setSavedIds(stored);
  }, []);

  const savedPlaces = mederPlaces.filter((place) =>
    savedIds.includes(place.id),
  );

  const removeSaved = (placeId: string) => {
    const updated = savedIds.filter((id) => id !== placeId);

    localStorage.setItem(
      "meder-saved-places",
      JSON.stringify(updated),
    );

    setSavedIds(updated);
  };

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to MEDER
        </Link>

        {/* Header */}
        <section className="mt-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/10">
              <Bookmark className="h-5 w-5 text-[#D4AF37]" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                Your collection
              </p>

              <h1 className="mt-1 font-serif text-3xl text-white sm:text-4xl">
                Saved Places
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/45">
            Places you saved while exploring MEDER. Keep them here so you
            can come back when you're ready.
          </p>
        </section>

        {/* Empty state */}
        {savedPlaces.length === 0 && (
          <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/10">
              <Bookmark className="h-7 w-7 text-[#D4AF37]" />
            </div>

            <h2 className="mt-5 font-serif text-2xl text-white">
              No saved places yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/45">
              When you find somewhere you want to remember, save it and
              it'll appear here.
            </p>

            <Link
              href="/discover"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
            >
              Explore Places
            </Link>
          </section>
        )}

        {/* Saved places */}
        {savedPlaces.length > 0 && (
          <section className="mt-10">

            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-white/40">
                {savedPlaces.length}{" "}
                {savedPlaces.length === 1 ? "place" : "places"} saved
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {savedPlaces.map((place) => (
                <article
                  key={place.id}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-[#D4AF37]/40"
                >
                  {/* Image */}
 <Link href={`/places/${place.id}`}>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={place.image}
                        alt={place.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white backdrop-blur-md">
                        <Star className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                        {place.rating}
                      </div>
                    </div>
                  </Link>

                  {/* Information */}
                  <div className="p-4">

                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/places/${place.id}`}
                        className="min-w-0"
                      >
                        <h2 className="font-serif text-xl text-white transition group-hover:text-[#D4AF37]">
                          {place.name}
                        </h2>

                        <p className="mt-1 text-sm text-white/40">
                          {place.type}
                        </p>
                      </Link>

                      <button
                        type="button"
                        onClick={() => removeSaved(place.id)}
                        aria-label={`Remove ${place.name} from saved places`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/35 transition hover:bg-red-400/10 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-1.5 text-sm text-white/50">
                      <MapPin className="h-4 w-4 text-[#D4AF37]" />
                      {place.area}
                    </div>

                    <div className="mt-4">
                      <Link
                        href={`/places/${place.id}`}
                        className="text-sm font-medium text-[#D4AF37] transition hover:text-[#E5C158]"
                      >
                        View place →
                      </Link>
                    </div>

                  </div>
                </article>
              ))}
            </div>

          </section>
        )}

      </div>
    </main>
  );
}