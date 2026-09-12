 "use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Clock3,
  Compass,
  MapPin,
  Sparkles,
  Star,
} from "lucide-react";
import { mederPlaces } from "@/Lib/meder/places";

interface RecommendationHistoryItem {
  id: string;
  createdAt: string;
  query?: string;
  placeIds?: string[];
}

export default function RecommendationHistoryPage() {
  const [history, setHistory] = useState<RecommendationHistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(
      "meder-recommendation-history",
    );

    if (!stored) {
      return;
    }

    try {
      setHistory(JSON.parse(stored));
    } catch {
      setHistory([]);
    }
  }, []);

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Link>

        {/* Header */}
        <section className="mt-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/10">
              <Clock3 className="h-5 w-5 text-[#D4AF37]" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                Your MEDER journey
              </p>

              <h1 className="mt-1 font-serif text-3xl text-white sm:text-4xl">
                Recommendation History
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/45">
            Revisit places MEDER IT recommended to you in the past.
          </p>
        </section>

        {/* Empty state */}
        {history.length === 0 && (
          <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/10">
              <Sparkles className="h-7 w-7 text-[#D4AF37]" />
            </div>

            <h2 className="mt-5 font-serif text-2xl text-white">
              No recommendations yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/45">
              When you use MEDER IT, your recommendation sessions can
              appear here.
            </p>

            <Link
              href="/meder-it"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
            >
              <Sparkles className="h-4 w-4" />
              Try MEDER IT
            </Link>
          </section>
        )}

        {/* History */}
        {history.length > 0 && (
          <section className="mt-10 space-y-5">
            {history.map((item) => {
              const recommendedPlaces = mederPlaces.filter((place) =>
                item.placeIds?.includes(place.id),
              );

              const formattedDate = new Date(
                item.createdAt,
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
                >
                  {/* Session header */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Compass className="h-4 w-4 text-[#D4AF37]" />
 <p className="text-sm font-medium text-white">
                          MEDER IT recommendation
                        </p>
                      </div>

                      {item.query && (
                        <p className="mt-2 text-sm text-white/50">
                          "{item.query}"
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-white/35">
                      {formattedDate}
                    </p>
                  </div>

                  {/* Recommended places */}
                  {recommendedPlaces.length > 0 && (
                    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {recommendedPlaces.map((place) => (
                        <Link
                          key={place.id}
                          href={`/places/${place.id}`}
                          className="group overflow-hidden rounded-2xl border border-white/10 bg-black/30 transition hover:-translate-y-1 hover:border-[#D4AF37]/40"
                        >
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

                          <div className="p-4">
                            <h3 className="font-serif text-xl text-white transition group-hover:text-[#D4AF37]">
                              {place.name}
                            </h3>

                            <p className="mt-1 text-sm text-white/40">
                              {place.type}
                            </p>

                            <div className="mt-3 flex items-center gap-1.5 text-sm text-white/50">
                              <MapPin className="h-4 w-4 text-[#D4AF37]" />
                              {place.area}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* No matching places */}
                  {recommendedPlaces.length === 0 && (
                    <p className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/40">
                      These recommendations are no longer available.
                    </p>
                  )}
                </article>
              );
            })}
          </section>
        )}

      </div>
    </main>
  );
}