 "use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/Lib/supabase/client";

type Place = {
  id: string;
  name: string;
  type: string | null;
  area: string | null;
  rating: number;
  reviews: number;
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

function getRating(place: any) {
  const practicalData =
    place.practical_data &&
    typeof place.practical_data === "object"
      ? place.practical_data
      : {};

  const rating = Number(
    practicalData.rating ??
      practicalData.average_rating ??
      practicalData.averageRating ??
      0,
  );

  return Number.isFinite(rating) ? rating : 0;
}

function getReviews(place: any) {
  const practicalData =
    place.practical_data &&
    typeof place.practical_data === "object"
      ? place.practical_data
      : {};

  const reviews = Number(
    practicalData.reviews ??
      practicalData.review_count ??
      practicalData.reviewCount ??
      0,
  );

  return Number.isFinite(reviews) ? reviews : 0;
}

export default function FeaturedPlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlaces() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("places")
        .select(
          "id, name, type, area, cover_image, photos, practical_data, created_at",
        )
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) {
        console.error("Error loading On MEDER places:", error);
        setLoading(false);
        return;
      }

      const mappedPlaces: Place[] = (data ?? []).map((place: any) => ({
        id: place.id,
        name: place.name,
        type: place.type || "Place",
        area: place.area || "Addis Ababa",
        rating: getRating(place),
        reviews: getReviews(place),
        image: getPlaceImage(place),
      }));

      setPlaces(mappedPlaces);
      setLoading(false);
    }

    loadPlaces();
  }, []);

  return (
    <section className="w-full">
      <div className="relative h-full overflow-hidden rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.04] p-4">
        <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
              Explore
            </p>

            <h2 className="font-serif text-2xl text-white md:text-3xl">
              On MEDER
            </h2>
          </div>

          <Link
            href="/discover"
            className="shrink-0 text-sm font-medium text-[#D4AF37] transition hover:text-[#E5C158]"
          >
            View all
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-56 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]"
              />
            ))
          ) : places.length === 0 ? (
            <div className="col-span-full rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center">
              <p className="text-sm text-white/50">
 Places will appear here once they are published.
              </p>
            </div>
          ) : (
            places.map((place) => (
              <Link
                key={place.id}
                href={`/places/${place.id}`}
                className="group block w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-[#D4AF37]/30"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 280px, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <button
                    type="button"
                    aria-label={`Save ${place.name}`}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="p-3">
                  <h3 className="font-serif text-lg text-white">
                    {place.name}
                  </h3>

                  <p className="mt-1 text-sm text-white/55">
                    {place.type} · {place.area}
                  </p>

                  <div className="mt-2 flex items-center gap-1.5 text-xs">
                    <Star className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />

                    <span className="font-medium text-white">
                      {place.rating > 0 ? place.rating.toFixed(1) : "—"}
                    </span>

                    <span className="text-white/40">
                      ({place.reviews})
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}