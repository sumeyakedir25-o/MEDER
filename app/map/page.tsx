 "use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Star,
} from "lucide-react";
import MederMap from "@/components/map/meder-map";
import { createClient } from "@/Lib/supabase/client";

export type MapPlace = {
  id: string;
  name: string;
  type: string;
  area: string;
  latitude: number;
  longitude: number;
  image: string;
  rating: number;
};

type LocationStatus =
  | "idle"
  | "loading"
  | "granted"
  | "denied"
  | "error";

function calculateDistance(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number,
) {
  const earthRadius = 6371;

  const latDifference =
    ((latitude2 - latitude1) * Math.PI) / 180;

  const lonDifference =
    ((longitude2 - longitude1) * Math.PI) / 180;

  const a =
    Math.sin(latDifference / 2) ** 2 +
    Math.cos((latitude1 * Math.PI) / 180) *
      Math.cos((latitude2 * Math.PI) / 180) *
      Math.sin(lonDifference / 2) ** 2;

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

export default function MapPage() {
  const supabase = createClient();

  const [places, setPlaces] = useState<MapPlace[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);

  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>("idle");

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPlaces() {
      setLoadingPlaces(true);

      const { data, error } = await supabase
        .from("places")
        .select(
          "id, name, type, area, latitude, longitude, cover_image, photos",
        )
        .eq("status", "published")
        .order("updated_at", { ascending: false });

      if (cancelled) {
        return;
      }

      if (error) {
        console.error("Failed to load map places:", error);
        setPlaces([]);
        setLoadingPlaces(false);
        return;
      }

      const mappedPlaces: MapPlace[] = (data ?? [])
        .map((place) => {
          const latitude = Number(place.latitude);
          const longitude = Number(place.longitude);

          const image =
            place.cover_image ||
            (Array.isArray(place.photos) && place.photos.length > 0
              ? place.photos[0]
              : "");

          return {
            id: place.id,
            name: place.name,
            type: place.type || "Place",
            area: place.area || "",
            latitude,
            longitude,
            image,
            rating: 0,
          };
        })
        .filter(
          (place) =>
            Number.isFinite(place.latitude) &&
            Number.isFinite(place.longitude),
        );

      setPlaces(mappedPlaces);
      setLoadingPlaces(false);
    }

    loadPlaces();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      return;
    }

    setLocationStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocationStatus("granted");
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus("denied");
        } else {
          setLocationStatus("error");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  const nearbyPlaces = useMemo(() => {
    if (!userLocation) {
      return [];
    }
 return places
      .map((place) => ({
        place,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          place.latitude,
          place.longitude,
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
  }, [userLocation, places]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="border-b border-white/10 bg-black/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#D4AF37]" />

            <span className="font-serif text-lg">
              MEDER Map
            </span>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
            Explore MEDER
          </p>

          <h1 className="mt-3 font-serif text-3xl sm:text-5xl">
            Explore the map
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50 sm:text-base">
            Discover restaurants, cafés, lounges, and experiences around Addis Ababa.
          </p>
        </div>

        <div className="relative h-[500px] overflow-hidden rounded-2xl border border-white/10">
          {loadingPlaces ? (
            <div className="flex h-full items-center justify-center bg-white/[0.02]">
              <p className="text-sm text-white/50">
                Loading MEDER places...
              </p>
            </div>
          ) : places.length === 0 ? (
            <div className="flex h-full items-center justify-center bg-white/[0.02] px-6 text-center">
              <div>
                <MapPin className="mx-auto h-8 w-8 text-[#D4AF37]" />

                <h2 className="mt-4 font-serif text-2xl">
                  No mapped places yet
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-white/45">
                  Published places will appear here automatically once latitude
                  and longitude are added in the Admin CMS.
                </p>
              </div>
            </div>
          ) : (
            <MederMap places={places} />
          )}

          <div className="absolute left-4 top-4 z-[1000] rounded-xl border border-white/10 bg-black/80 px-4 py-3 backdrop-blur-md">
            <p className="text-xs text-white/40">
              Places on MEDER
            </p>

            <p className="mt-1 text-lg font-semibold text-white">
              {places.length} places
            </p>
          </div>

          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={locationStatus === "loading"}
            className="absolute bottom-4 right-4 z-[1000] flex min-h-11 items-center gap-2 rounded-xl bg-[#D4AF37] px-4 text-sm font-semibold text-black transition hover:bg-[#E5C158] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Navigation className="h-4 w-4" />

            {locationStatus === "loading"
              ? "Getting location..."
              : locationStatus === "granted"
                ? "Location found"
                : "Use my location"}
          </button>

          {locationStatus === "granted" &&
            userLocation && (
              <div className="absolute bottom-4 left-4 z-[1000] max-w-xs rounded-xl border border-[#D4AF37]/20 bg-black/80 px-4 py-3 text-xs text-white/70 backdrop-blur-md">
                Location found
              </div>
            )}
[17/09/2026 17:52] Meder.code: {locationStatus === "denied" && (
            <div className="absolute bottom-4 left-4 z-[1000] max-w-xs rounded-xl border border-red-500/20 bg-black/80 px-4 py-3 text-xs text-white/70 backdrop-blur-md">
              Location permission was denied.
            </div>
          )}

          {locationStatus === "error" && (
            <div className="absolute bottom-4 left-4 z-[1000] max-w-xs rounded-xl border border-red-500/20 bg-black/80 px-4 py-3 text-xs text-white/70 backdrop-blur-md">
              We couldn't get your location. Please try again.
            </div>
          )}
        </div>

        {locationStatus === "granted" &&
          nearbyPlaces.length > 0 && (
            <section className="mt-10">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                    Near you
                  </p>

                  <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
                    Nearby places
                  </h2>
                </div>

                <span className="text-sm text-white/40">
                  {nearbyPlaces.length} places
                </span>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {nearbyPlaces.map(
                  ({ place, distance }) => (
                    <Link
                      key={place.id}
                      href={`/places/${place.id}`}
                      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-[#D4AF37]/40"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        {place.image ? (
                          <img
                            src={place.image}
                            alt={place.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full bg-white/[0.04]" />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        {place.rating > 0 && (
                          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white backdrop-blur-md">
                            <Star className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                            {place.rating}
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-serif text-xl text-white">
                          {place.name}
                        </h3>

                        <p className="mt-1 text-sm text-white/45">
                          {place.type}
                        </p>

                        <div className="mt-3 flex items-center gap-1.5 text-sm text-white/55">
                          <MapPin className="h-4 w-4 text-[#D4AF37]" />

                          {distance.toFixed(1)} km away
                        </div>
                      </div>
                    </Link>
                  ),
                )}
              </div>
            </section>
          )}
      </section>
    </main>
  );
}