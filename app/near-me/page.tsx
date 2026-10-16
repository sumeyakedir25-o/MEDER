 "use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  LocateFixed,
  MapPin,
  Navigation,
  RefreshCw,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/Lib/supabase/client";

type Place = {
  id: string;
  name: string;
  type: string;
  area: string;
  description: string;
  image: string;
  rating: number;
  latitude: number | null;
  longitude: number | null;
  distanceKm: number | null;
};

type RawPlace = {
  id: string;
  name: string | null;
  type: string | null;
  area: string | null;
  description: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  cover_image: string | null;
  photos: string[] | null;
  practical_data: unknown;
};

type LocationMode = "loading" | "nearby" | "random" | "empty" | "error";

function coordinate(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function distanceBetween(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = radians(lat2 - lat1);
  const dLon = radians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(radians(lat1)) *
      Math.cos(radians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(km: number | null) {
  if (km === null) return "Explore this place";
  if (km < 1) return `${Math.round(km * 1000)} m away`;
  return `${km.toFixed(1)} km away`;
}

function shuffle<T,>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function getImage(place: RawPlace) {
  if (place.cover_image) return place.cover_image;
  if (Array.isArray(place.photos) && place.photos[0]) {
    return place.photos[0];
  }
  return "/placeholder-place.jpg";
}

function getRating(value: unknown) {
  if (!value || typeof value !== "object") return 0;

  const data = value as Record<string, unknown>;
  const rating = Number(
    data.rating ?? data.average_rating ?? data.averageRating ?? 0,
  );

  return Number.isFinite(rating) && rating > 0 ? rating : 0;
}

function mapPlace(place: RawPlace): Place {
  return {
    id: place.id,
    name: place.name || "Untitled place",
    type: place.type || "Place",
    area: place.area || "Location not listed",
    description: place.description || "",
    image: getImage(place),
    rating: getRating(place.practical_data),
    latitude: coordinate(place.latitude),
    longitude: coordinate(place.longitude),
    distanceKm: null,
  };
}

export default function NearMePage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [mode, setMode] = useState<LocationMode>("loading");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [locationRequested, setLocationRequested] = useState(false);

  const loadPlaces = useCallback(async () => {
    setMode("loading");
    setMessage("");

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("places")
        .select(
          "id, name, type, area, description, latitude, longitude, cover_image, photos, practical_data",
        )
        .eq("status", "published");

      if (error) throw error;

      const allPlaces = ((data ?? []) as RawPlace[]).map(mapPlace);

      if (allPlaces.length === 0) {
        setPlaces([]);
        setMode("empty");
        return;
      }
 const showRandom = (notice?: string) => {
        setPlaces(
          shuffle(allPlaces).map((place) => ({
            ...place,
            distanceKm: null,
          })),
        );
        setMode("random");
        setMessage(
          notice ||
            "Discover somewhere new. Showing a fresh selection of published places.",
        );
      };

      if (!navigator.geolocation) {
        showRandom("Location isn't available in this browser, so explore a random selection.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;

          const withCoordinates = allPlaces
            .filter(
              (place) =>
                place.latitude !== null && place.longitude !== null,
            )
            .map((place) => ({
              ...place,
              distanceKm: distanceBetween(
                userLat,
                userLon,
                place.latitude!,
                place.longitude!,
              ),
            }))
            .sort(
              (a, b) =>
                (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity),
            );

          const withoutCoordinates = shuffle(
            allPlaces.filter(
              (place) =>
                place.latitude === null || place.longitude === null,
            ),
          ).map((place) => ({ ...place, distanceKm: null }));

          const sorted = [...withCoordinates, ...withoutCoordinates];

          setPlaces(sorted);
          setMode(withCoordinates.length > 0 ? "nearby" : "random");

          setMessage(
            withCoordinates.length > 0
              ? "Sorted by distance from your current location."
              : "These places don't have map coordinates yet, so here's a random selection.",
          );
        },
        () => {
          showRandom(
            "Location permission wasn't available. You can still explore places around the city.",
          );
        },
        {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 300000,
        },
      );
    } catch (error) {
      console.error("Near Me page error:", error);
      setPlaces([]);
      setMode("error");
      setMessage("We couldn't load places right now. Please try again.");
    }
  }, []);

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces, refreshKey]);

  const filteredPlaces = places.filter((place) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return [
      place.name,
      place.type,
      place.area,
      place.description,
    ].some((value) => value.toLowerCase().includes(query));
  });

  function requestLocationAgain() {
    setLocationRequested(true);
    setRefreshKey((current) => current + 1);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#0B0B0B] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-[#D4AF37]/[0.07] blur-[120px]" />
        <div className="absolute -left-40 top-[45rem] h-[25rem] w-[25rem] rounded-full bg-[#D4AF37]/[0.04] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <section className="relative mt-6 overflow-hidden rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-r from-[#211C10] to-[#0D0D0D] px-6 py-7 sm:px-9 sm:py-9">
  <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full border border-[#D4AF37]/15" />

  <div className="relative">
    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
      DISCOVER NEARBY
    </p>

    <h1 className="font-serif text-4xl tracking-tight text-white sm:text-5xl">
      Near <span className="italic text-[#D4AF37]">Me.</span>
    </h1>

    <p className="mt-3 text-sm text-white/55">
      Find your next favorite place.
    </p>

    <div className="mt-6 flex flex-wrap gap-3">
      <button
        onClick={requestLocationAgain}
        disabled={mode === "loading"}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#E7C75E] disabled:opacity-60"
      >
        <LocateFixed className="h-4 w-4" />
        Find Near Me
      </button>

      <button
        onClick={() => setRefreshKey((current) => current + 1)}
        disabled={mode === "loading"}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 px-5 text-sm text-white/80 transition hover:border-[#D4AF37]/40 disabled:opacity-60"
      >
        <RefreshCw className="h-4 w-4" />
        Discover
      </button>
    </div>
  </div>
</section>

        <section className="mt-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
                The discovery list
              </p>

              <h2 className="font-serif text-3xl sm:text-4xl">
                Places around you
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
                {mode === "nearby"
                  ? "The closest places appear first."
                  : "A little inspiration for wherever the day takes you."}
              </p>
            </div>

            <div className="flex w-full items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-4 py-3 sm:max-w-xs">
              <Search className="h-4 w-4 shrink-0 text-[#D4AF37]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search places or areas..."
                aria-label="Search places or areas"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
              />
            </div>
          </div>

          {message && mode !== "loading" && (
            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:flex-row sm:items-center sm:justify-between">
 <div className="flex items-start gap-3">
                <Compass className="mt-0.5 h-5 w-5 shrink-0 text-[#D4AF37]" />
                <div>
                  <p className="text-sm font-medium text-white/85">
                    {mode === "nearby"
                      ? "Location discovery is on"
                      : mode === "random"
                        ? "Your next discovery awaits"
                        : mode === "error"
                          ? "Something went wrong"
                          : "No places yet"}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-white/45">
                    {message}
                  </p>
                </div>
              </div>

              {mode === "random" && (
                <button
                  onClick={requestLocationAgain}
                  className="inline-flex shrink-0 items-center gap-2 text-xs font-medium text-[#D4AF37] hover:text-[#E7C75E]"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  Try location
                </button>
              )}
            </div>
          )}

          {mode === "loading" ? (
            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[330px] animate-pulse rounded-3xl border border-white/10 bg-white/[0.035]"
                />
              ))}
            </div>
          ) : mode === "error" ? (
            <div className="mt-7 rounded-3xl border border-white/10 bg-white/[0.025] px-6 py-14 text-center">
              <Compass className="mx-auto h-8 w-8 text-[#D4AF37]" />
              <h3 className="mt-4 font-serif text-2xl">
                Let's try that again
              </h3>
              <p className="mt-2 text-sm text-white/45">
                Places couldn't be loaded. Please try again shortly.
              </p>
              <button
                onClick={() => setRefreshKey((current) => current + 1)}
                className="mt-6 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black hover:bg-[#E7C75E]"
              >
                Try again
              </button>
            </div>
          ) : mode === "empty" ? (
            <div className="mt-7 rounded-3xl border border-white/10 bg-white/[0.025] px-6 py-14 text-center">
              <MapPin className="mx-auto h-8 w-8 text-[#D4AF37]" />
              <h3 className="mt-4 font-serif text-2xl">
                Your next favorite place is on its way
              </h3>
              <p className="mt-2 text-sm text-white/45">
                Published places will appear here when they're available.
              </p>
            </div>
          ) : filteredPlaces.length === 0 ? (
            <div className="mt-7 rounded-3xl border border-white/10 bg-white/[0.025] px-6 py-14 text-center">
              <Search className="mx-auto h-8 w-8 text-[#D4AF37]" />
              <h3 className="mt-4 font-serif text-2xl">
                No matches found
              </h3>
              <p className="mt-2 text-sm text-white/45">
                Try another place name, category, or area.
              </p>
              <button
                onClick={() => setSearch("")}
                className="mt-5 text-sm text-[#D4AF37] hover:text-[#E7C75E]"
              >
                Clear search
              </button>
            </div>
          ) : (
            <>
              <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPlaces.map((place, index) => (
                  <Link
                    href={`/places/${place.id}`}
                    key={place.id}
 className="group overflow-hidden rounded-3xl border border-white/10 bg-[#121212] transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/35 hover:bg-[#161512]"
                  >
                    <div className="relative h-60 overflow-hidden sm:h-64">
                      <Image
                        src={place.image}
                        alt={place.name}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/10" />

                      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-white/90 backdrop-blur-md">
                        {mode === "nearby" && place.distanceKm !== null ? (
                          <MapPin className="h-3 w-3 text-[#D4AF37]" />
                        ) : (
                          <Sparkles className="h-3 w-3 text-[#D4AF37]" />
                        )}

                        {mode === "nearby" && place.distanceKm !== null
                          ? formatDistance(place.distanceKm)
                          : "Worth discovering"}
                      </div>

                      {place.rating > 0 && (
                        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-3 py-2 text-xs text-white backdrop-blur-md">
                          <Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" />
                          {place.rating.toFixed(1)}
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E1C46C]">
                          {place.type}
                        </p>
                        <h3 className="font-serif text-2xl leading-tight text-white">
                          {place.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 p-5">
                      <div className="flex min-w-0 items-center gap-2 text-xs text-white/45">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" />
                        <span className="truncate">{place.area}</span>
                      </div>

                      <span className="inline-flex shrink-0 items-center gap-2 text-xs font-medium text-[#D4AF37] transition group-hover:gap-3">
                        Explore
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <p className="mt-6 text-center text-xs text-white/30">
                Showing {filteredPlaces.length}{" "}
                {filteredPlaces.length === 1 ? "place" : "places"}
                {mode === "nearby"
                  ? " · Sorted by distance where coordinates are available"
                  : " · Explore a random selection"}
              </p>
            </>
          )}
        </section>

        <footer className="mt-16 border-t border-white/10 pt-6 text-center">
          <p className="font-serif text-lg text-white/70">
            MEDER <span className="text-[#D4AF37]">.</span>
          </p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/30">
            Spot on. Find your place.
          </p>
        </footer>
      </div>
    </main>
  );
}