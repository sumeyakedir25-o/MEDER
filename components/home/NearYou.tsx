 "use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/Lib/supabase/client";

type NearbyPlace = {
  id: string;
  name: string;
  type: string;
  distance: string;
  status: string;
  rating: number;
  image: string;
  latitude: number | null;
  longitude: number | null;
};

function getPlaceImage(place: {
  cover_image?: string | null;
  photos?: string[] | null;
}) {
  if (place.cover_image) return place.cover_image;

  if (Array.isArray(place.photos) && place.photos[0]) {
    return place.photos[0];
  }

  return "/placeholder-place.jpg";
}

function getRating(place: { practical_data?: unknown }) {
  const data = place.practical_data;

  const practicalData =
    data && typeof data === "object"
      ? (data as Record<string, unknown>)
      : {};

  const rating = Number(
    practicalData.rating ??
      practicalData.average_rating ??
      practicalData.averageRating ??
      0,
  );

  return Number.isFinite(rating) && rating >= 0 ? rating : 0;
}

function getCoordinate(value: unknown): number | null {
  if (value === null|| value === undefined||value === "") {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) return null;

  return number;
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const earthRadius = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

function formatDistance(distanceKm: number) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }

  return `${distanceKm.toFixed(1)} km`;
}

function shufflePlaces(places: NearbyPlace[]) {
  const shuffled = [...places];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export default function NearYou() {
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadNearbyPlaces() {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("places")
          .select(
            "id, name, type, latitude, longitude, cover_image, photos, practical_data, created_at",
          )
          .eq("status", "published");

        if (cancelled) return;

        if (error) {
          console.error("Error loading nearby places:", error);
          setPlaces([]);
          setLoading(false);
          return;
        }

        const mappedPlaces: NearbyPlace[] = (data ?? []).map(
          (place: any) => ({
            id: place.id,
            name: place.name,
            type: place.type || "Place",
            distance: "Distance unavailable",
            status: "Published",
            rating: getRating(place),
            image: getPlaceImage(place),
            latitude: getCoordinate(place.latitude),
            longitude: getCoordinate(place.longitude),
          }),
        );

        // No published places are available.
        if (mappedPlaces.length === 0) {
          setPlaces([]);
          setLoading(false);
          return;
        }

        // Random fallback when geolocation is unavailable.
        const showRandomPlaces = () => {
          if (cancelled) return;

          setPlaces(shufflePlaces(mappedPlaces).slice(0, 3));
          setLoading(false);
        };

        if (!navigator.geolocation) {
          showRandomPlaces();
          return;
        }
 navigator.geolocation.getCurrentPosition(
          (position) => {
            if (cancelled) return;

            const userLatitude = position.coords.latitude;
            const userLongitude = position.coords.longitude;

            const withCoordinates = mappedPlaces
              .filter(
                (place) =>
                  place.latitude !== null &&
                  place.longitude !== null,
              )
              .map((place) => {
                const distanceKm = calculateDistance(
                  userLatitude,
                  userLongitude,
                  place.latitude!,
                  place.longitude!,
                );

                return {
                  ...place,
                  distanceKm,
                  distance: formatDistance(distanceKm),
                };
              })
              .sort((a, b) => a.distanceKm - b.distanceKm);

            const withoutCoordinates = shufflePlaces(
              mappedPlaces.filter(
                (place) =>
                  place.latitude === null ||
                  place.longitude === null,
              ),
            );

            // Show the closest places first.
            // If fewer than three have coordinates, fill the
            // remaining spots with random places.
            const nearestPlaces = withCoordinates.slice(0, 3);
            const remainingSlots = 3 - nearestPlaces.length;

            const fallbackPlaces = withoutCoordinates
              .slice(0, remainingSlots)
              .map((place) => ({
                ...place,
                distance: "Distance unavailable",
              }));

            setPlaces([...nearestPlaces, ...fallbackPlaces]);
            setLoading(false);
          },
          () => {
            // Permission denied, timeout, or location unavailable.
            showRandomPlaces();
          },
          {
            enableHighAccuracy: false,
            timeout: 8000,
            maximumAge: 300000,
          },
        );
      } catch (error) {
        if (cancelled) return;

        console.error("Unable to load places:", error);
        setPlaces([]);
        setLoading(false);
      }
    }

    loadNearbyPlaces();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="w-full">
      <div className="relative h-full overflow-hidden rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.04] p-4">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
              Around you
            </p>

            <h2 className="font-serif text-2xl text-white md:text-3xl">
              Near You
            </h2>
          </div>

          <Link
            href="/discover"
            className="flex shrink-0 items-center gap-1 text-xs font-medium text-[#D4AF37] transition hover:text-[#E5C158]"
          >
            See all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-[68px] animate-pulse rounded-xl border border-white/10 bg-black/20"
              />
            ))
          ) : places.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-black/20 p-5 text-center">
              <p className="text-xs text-white/50">
                No published places available right now.
              </p>
            </div>
 ) : (
            places.map((place) => (
              <Link
                key={place.id}
                href={`/places/${place.id}`}
                className="group flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-2 transition hover:border-[#D4AF37]/30 hover:bg-white/[0.05]"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    unoptimized
                    sizes="80px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-serif text-sm text-white">
                    {place.name}
                  </h3>

                  <p className="mt-0.5 truncate text-[11px] text-white/45">
                    {place.type}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px]">
                    <span className="flex items-center gap-1 text-white/55">
                      <MapPin className="h-3 w-3 text-[#D4AF37]" />
                      {place.distance}
                    </span>

                    <span className="text-emerald-400">
                      {place.status}
                    </span>

                    <span className="flex items-center gap-1 text-white/70">
                      <Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" />
                      {place.rating > 0
                        ? place.rating.toFixed(1)
                        : "—"}
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