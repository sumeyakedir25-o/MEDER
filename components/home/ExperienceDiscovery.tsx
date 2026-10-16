 "use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/Lib/supabase/client";

type Vibe = {
  name: string;
  slug: string;
  description: string;
  image: string;
};

type PlaceImage = {
  id: string;
  type: string | null;
  experiences: string[] | null;
  cover_image: string | null;
  photos: string[] | null;
};

function getPlaceImage(place: PlaceImage): string {
  if (place.cover_image) return place.cover_image;
  if (place.photos?.[0]) return place.photos[0];
  return "/placeholder-place.jpg";
}

function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^(vibe|experience|purpose|audience):\s*/, "")
    .trim();
}

function placeMatchesCategory(place: PlaceImage, categoryName: string) {
  const target = normalize(categoryName);

  const matchesExperience = (place.experiences ?? []).some(
    (experience) =>
      typeof experience === "string" &&
      normalize(experience) === target,
  );

  const matchesType =
    typeof place.type === "string" &&
    normalize(place.type) === target;

  return matchesExperience || matchesType;
}

const CATEGORY_RENAMES: Record<string, string> = {
  quiet: "Fast Food",
  traditional: "Fun",
};

export default function ExperienceDiscovery() {
  const [vibes, setVibes] = useState<Vibe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadVibes() {
      const supabase = createClient();

      const [
        { data: categories, error: categoryError },
        { data: places, error: placesError },
      ] = await Promise.all([
        supabase
          .from("categories")
          .select("name, slug, description, sort_order")
          .eq("category_group", "mood")
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),

        supabase
          .from("places")
          .select("id, type, experiences, cover_image, photos")
          .eq("status", "published"),
      ]);

      if (cancelled) return;

      if (categoryError || placesError) {
        console.error("Error loading vibe discovery:", {
          categoryError,
          placesError,
        });
        setVibes([]);
        setLoading(false);
        return;
      }

      const publishedPlaces = (places ?? []) as PlaceImage[];
      const usedPlaceIds = new Set<string>();

      // Shuffle places on every homepage load.
      for (let i = publishedPlaces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [publishedPlaces[i], publishedPlaces[j]] = [
          publishedPlaces[j],
          publishedPlaces[i],
        ];
      }

      const mappedVibes: Vibe[] = (categories ?? [])
        .slice(0, 6)
        .map((category) => {
          const originalName = category.name.trim();

          const displayName =
            CATEGORY_RENAMES[originalName.toLowerCase()] ?? originalName;

          // Only use a place that belongs to this specific category.
          const matchingPlace = publishedPlaces.find(
            (place) =>
              !usedPlaceIds.has(place.id) &&
              Boolean(place.cover_image || place.photos?.[0]) &&
              placeMatchesCategory(place, displayName),
          );

          if (matchingPlace) {
            usedPlaceIds.add(matchingPlace.id);
          }

          return {
            name: displayName,
            slug: category.slug,
            description:
              displayName !== originalName
                ? `Discover ${displayName.toLowerCase()} places.`
                : category.description ||
                  `Find places for a ${displayName.toLowerCase()} experience.`,
            image: matchingPlace
              ? getPlaceImage(matchingPlace)
              : "/placeholder-place.jpg",
          };
        });

      if (!cancelled) {
        setVibes(mappedVibes);
        setLoading(false);
      }
    }

    loadVibes();
 return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="w-full px-4 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
            Discover
          </p>

          <h2 className="font-serif text-3xl text-white md:text-4xl">
            Find Your Vibe
          </h2>

          <p className="mt-2 max-w-xl text-sm text-white/55 md:text-base">
            Find somewhere that matches your mood.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
              />
            ))
          ) : vibes.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
              <p className="text-sm text-white/50">
                No active vibe categories are available yet.
              </p>
            </div>
          ) : (
            vibes.map((vibe) => (
              <Link
                key={vibe.slug}
                href={`/search?q=${encodeURIComponent(vibe.name)}`}
                className="group relative block h-64 overflow-hidden rounded-2xl border border-white/10 text-left"
              >
                <Image
                  src={vibe.image}
                  alt={vibe.name}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-serif text-xl text-white">
                    {vibe.name}
                  </h3>

                  <p className="mt-1 text-sm text-white/65">
                    {vibe.description}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}