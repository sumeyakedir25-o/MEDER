"use client";

import { useState } from "react";
import PlaceCard from "@/components/place/PlaceCard";
import MederMap from "@/components/map/meder-map";
import { mederPlaces } from "@/Lib/meder/places";

export default function DiscoverPage() {
  const [view, setView] = useState<"list" | "map">("list");
    
  return (
    <main className="min-h-screen bg-black px-4 pb-16 pt-24 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <section className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
            Discover
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-serif text-3xl text-white sm:text-4xl">
                Find your next spot.
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
                Explore places worth knowing about and find somewhere you'll love.
              </p>
            </div>

            <p className="text-sm text-white/40">
              {mederPlaces.length} places
            </p>
          </div>
        </section>

        {/* View Toggle — UI only for now */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-sm text-white/50">
            Explore places
          </p>

          <div className="flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
  <button
    type="button"
    onClick={() => setView("list")}
    className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
      view === "list"
        ? "bg-[#D4AF37] text-black"
        : "text-white/50 hover:text-white"
    }`}
  >
    List
  </button>

  <button
    type="button"
    onClick={() => setView("map")}
    className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
      view === "map"
        ? "bg-[#D4AF37] text-black"
        : "text-white/50 hover:text-white"
    }`}
  >
    Map
  </button>
</div>
        </div>

        {/* Places */}
        {view === "map" ? (
  <MederMap places={mederPlaces} />
) : mederPlaces.length > 0 ? (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {mederPlaces.map((place) => (
      <PlaceCard
        key={place.id}
        place={place}
      />
    ))}
  </div>
) : (
  <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
    <h2 className="font-serif text-2xl text-white">
      No places yet.
    </h2>

    <p className="mt-2 text-sm text-white/45">
      MEDER will show places here when they are available.
    </p>
  </section>
)}
      </div>
    </main>
  );
}