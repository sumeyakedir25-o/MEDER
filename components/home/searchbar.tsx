"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "granted" | "denied" | "error"
  >("idle");

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const router = useRouter();

 const handleUseMyLocation = () => {
  if (!navigator.geolocation) {
    alert("Location is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const params = new URLSearchParams();

      if (query.trim()) {
        params.set("q", query.trim());
      }

      params.set("lat", String(position.coords.latitude));
      params.set("lng", String(position.coords.longitude));

      router.push(`/search?${params.toString()}`);
    },
    () => {
      alert("Please allow location access to use this feature.");
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    },
  );
};

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("q", query.trim());
    }

    if (userLocation) {
      params.set("lat", userLocation.latitude.toString());
      params.set("lng", userLocation.longitude.toString());
    }

    const queryString = params.toString();

    router.push(
      queryString ? `/search?${queryString}` : "/search",
    );
  };

  return (
    <section className="w-full min-w-0 px-4 py-4 md:px-8">
      <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-2 rounded-2xl border border-white/10 bg-black/70 p-2 backdrop-blur-md md:flex-row md:items-center">
        {/* Search */}
        <div className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
          <Search className="h-4 w-4 shrink-0 text-[#D4AF37]" />

          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search for places, food, experiences..."
            className="min-w-0 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/45"
          />
        </div>

        {/* Location */}
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={locationStatus === "loading"}
          className={`flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition md:w-auto ${
            locationStatus === "granted"
              ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
              : "border-white/10 bg-white/5 text-white hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          <MapPin className="h-4 w-4" />

          {locationStatus === "loading"
            ? "Getting location..."
            : locationStatus === "granted"
              ? "Location enabled"
              : "Use my location"}
        </button>

        {/* Search button */}
        <button
          type="button"
          onClick={handleSearch}
          className="min-h-11 w-full shrink-0 rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black transition hover:bg-[#E5C158] md:w-auto"
        >
          Search
        </button>
      </div>

      {/* Location messages */}
      {locationStatus === "denied" && (
        <p className="mx-auto mt-2 max-w-7xl px-1 text-xs text-white/40">
          Location permission was denied. You can still search normally.
        </p>
      )}
      {locationStatus === "error" && (
        <p className="mx-auto mt-2 max-w-7xl px-1 text-xs text-white/40">
          We couldn't get your location. You can still search normally.
        </p>
      )}
    </section>
  );
}