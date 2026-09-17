 "use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/Lib/supabase/client";

type Vibe = {
  name: string;
  description: string;
  image: string;
};

function getPlaceImage(place: any) {
  if (place.cover_image) {
    return place.cover_image;
  }

  if (
    Array.isArray(place.photos) &&
    place.photos.length > 0 &&
    place.photos[0]
  ) {
    return place.photos[0];
  }

  return "/placeholder-place.jpg";
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function placeHasVibe(place: any, vibeName: string) {
  const target = normalize(vibeName);

  if (!Array.isArray(place.experiences)) {
    return false;
  }

  return place.experiences.some((experience: string) => {
    if (typeof experience !== "string") {
      return false;
    }

    const value = experience.replace(/^vibe:\s*/i, "").trim();

    return normalize(value) === target;
  });
}

export default function ExperienceDiscovery() {
  const [vibes, setVibes] = useState<Vibe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVibes() {
      const supabase = createClient();

      const [{ data: categories, error: categoryError }, { data: places }] =
        await Promise.all([
          supabase
            .from("categories")
            .select("name, slug, description, icon, sort_order")
            .eq("group", "mood")
            .order("sort_order", { ascending: true }),

          supabase
            .from("places")
            .select("name, experiences, cover_image, photos")
            .eq("status", "published"),
        ]);

      if (categoryError) {
        console.error("Error loading mood categories:", categoryError);
        setLoading(false);
        return;
      }

      const publishedPlaces = places ?? [];

      const mappedVibes: Vibe[] = (categories ?? [])
        .map((category: any) => {
          const matchingPlace = publishedPlaces.find((place: any) =>
            placeHasVibe(place, category.name),
          );

          return {
            name: category.name,
            description:
              category.description ||
              `Places with a ${category.name.toLowerCase()} vibe`,
            image: matchingPlace
              ? getPlaceImage(matchingPlace)
              : "/placeholder-place.jpg",
          };
        })
        .slice(0, 6);

      setVibes(mappedVibes);
      setLoading(false);
    }

    loadVibes();
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
            Find something that fits the moment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
              />
            ))
          ) : vibes.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
              <p className="text-sm text-white/50">
                Vibes will appear here once they are added to the CMS.
              </p>
            </div>
          ) : (
            vibes.map((vibe) => (
 <Link
                key={vibe.name}
                href={`/search?q=${encodeURIComponent(vibe.name)}`}
                className="group relative block h-64 overflow-hidden rounded-2xl border border-white/10 text-left"
              >
                <Image
                  src={vibe.image}
                  alt={vibe.name}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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