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
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

function formatDistance(distanceKm: number) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }

  return `${distanceKm.toFixed(1)} km`;
}

export default function NearYou() {
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNearbyPlaces() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("places")
        .select(
          "id, name, type, area, latitude, longitude, cover_image, photos, practical_data, created_at",
        )
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error loading nearby places:", error);
        setLoading(false);
        return;
      }

      const rawPlaces = data ?? [];

      const mappedPlaces: NearbyPlace[] = rawPlaces.map((place: any) => ({
        id: place.id,
        name: place.name,
        type: place.type || "Place",
        distance: "Nearby",
        status: "Published",
        rating: getRating(place),
        image: getPlaceImage(place),
        latitude:
          typeof place.latitude === "number"
            ? place.latitude
            : Number.isFinite(Number(place.latitude))
              ? Number(place.latitude)
              : null,
        longitude:
          typeof place.longitude === "number"
            ? place.longitude
            : Number.isFinite(Number(place.longitude))
              ? Number(place.longitude)
              : null,
      }));

      if (!navigator.geolocation) {
        setPlaces(mappedPlaces.slice(0, 3));
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatitude = position.coords.latitude;
          const userLongitude = position.coords.longitude;

          const sortedPlaces = mappedPlaces
            .map((place) => {
              if (
                place.latitude === null ||
                place.longitude === null
              ) {
                return {
                  ...place,
                  distance: "Nearby",
                };
              }

              const distance = calculateDistance(
                userLatitude,
                userLongitude,
                place.latitude,
                place.longitude,
              );
 return {
                ...place,
                distance: formatDistance(distance),
              };
            })
            .sort((a, b) => {
              const distanceA = a.distance.endsWith("m")
                ? Number.parseFloat(a.distance)
                : Number.parseFloat(a.distance) * 1000;

              const distanceB = b.distance.endsWith("m")
                ? Number.parseFloat(b.distance)
                : Number.parseFloat(b.distance) * 1000;

              if (
                Number.isNaN(distanceA) ||
                Number.isNaN(distanceB)
              ) {
                return 0;
              }

              return distanceA - distanceB;
            })
            .slice(0, 3);

          setPlaces(sortedPlaces);
          setLoading(false);
        },
        () => {
          setPlaces(mappedPlaces.slice(0, 3));
          setLoading(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 300000,
        },
      );
    }

    loadNearbyPlaces();
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
                No published places yet.
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

                  <div className="mt-1 flex items-center gap-2 text-[10px]">
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