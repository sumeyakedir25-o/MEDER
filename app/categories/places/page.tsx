"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Utensils,
  Coffee,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/Lib/supabase/client";

const typeIcons: Record<string, typeof Utensils> = {
  Restaurant: Utensils,
  "Traditional Restaurant": Utensils,
  "Ethiopian Restaurant": Utensils,
  "Coffee Shop": Coffee,
  "Rooftop Lounge": Sparkles,
};

type PlaceRow = {
  type: string;
};

export default function PlacesCategoryPage() {
  const [places, setPlaces] = useState<PlaceRow[]>([]);

  useEffect(() => {
    async function loadPlaces() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("places")
        .select("type")
        .eq("status", "published");

      if (error) {
        console.error("Failed to load place types:", error);
        return;
      }

      setPlaces(
        (data ?? [])
          .map((place) => ({
            type: place.type || "",
          }))
          .filter((place) => place.type.trim() !== ""),
      );
    }

    loadPlaces();
  }, []);

  const placeTypes = Array.from(
    new Set(places.map((place) => place.type)),
  ).sort();

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" />
          Categories
        </Link>

        <section className="mt-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
            MEDER Categories
          </p>

          <h1 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
            Places
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50 sm:text-base">
            What kind of place are you looking for?
          </p>
        </section>

        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {placeTypes.map((type) => {
            const Icon = typeIcons[type] ?? MapPin;

            const count = places.filter(
              (place) => place.type === type,
            ).length;

            return (
              <Link
                key={type}
                href={`/search?type=${encodeURIComponent(type)}`}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:bg-white/[0.05]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10">
                  <Icon className="h-5 w-5 text-[#D4AF37]" />
                </div>

                <h2 className="mt-5 font-serif text-2xl text-white">
                  {type}
                </h2>

                <p className="mt-2 text-sm text-white/40">
                  {count} {count === 1 ? "place" : "places"}
                </p>

                <p className="mt-5 text-sm font-medium text-[#D4AF37]">
                  Explore →
                </p>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}