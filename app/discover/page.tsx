 "use client";

import { useEffect, useState } from "react";
import PlaceCard from "@/components/place/PlaceCard";
import MederMap from "@/components/map/meder-map";
import type { MederPlace } from "@/Lib/meder/matching";
import { createClient } from "@/Lib/supabase/client";

type SupabasePlace = {
  id: string;
  name: string;
  slug: string | null;
  type: string | null;
  area: string | null;
  address: string | null;
  description: string | null;
  phone: string | null;
  whatsapp: string | null;
  website: string | null;
  latitude: number | null;
  longitude: number | null;
  price_level: number | null;
  status: "draft" | "published" | "archived";
  cuisines: string[] | null;
  experiences: string[] | null;
  cover_image: string | null;
  photos: string[] | null;
  tiktok_url: string | null;
  featured_video_url: string | null;
  practical_data: Record<string, unknown> | null;
  verification_status:
    | "Unverified"
    | "MEDER Verified"
    | "Business Verified"
    | null;
};

function getPriceLabel(priceLevel: number | null) {
  if (!priceLevel) {
    return [];
  }

  return ["$", "$$", "$$$", "$$$$"].slice(0, priceLevel);
}

function getPracticalNumber(
  practicalData: Record<string, unknown> | null,
  key: string,
  fallback: number,
) {
  const value = practicalData?.[key];

  return typeof value === "number" ? value : fallback;
}

function getMederPlace(place: SupabasePlace): MederPlace {
  const experiences = place.experiences ?? [];

  const who = experiences
    .filter((item) => item.startsWith("Audience:"))
    .map((item) => item.replace("Audience:", "").trim());

  const what = experiences
    .filter((item) => item.startsWith("Purpose:"))
    .map((item) => item.replace("Purpose:", "").trim());

  const experienceTags = experiences
    .filter((item) => item.startsWith("Experience:"))
    .map((item) => item.replace("Experience:", "").trim());

  const vibe = experiences
    .filter((item) => item.startsWith("Vibe:"))
    .map((item) => item.replace("Vibe:", "").trim());

  const image =
    place.cover_image ||
    place.photos?.[0] ||
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80";

  const rating = getPracticalNumber(place.practical_data, "rating", 0);

  const reviews = getPracticalNumber(
    place.practical_data,
    "reviews",
    0,
  );

  const priceRange = getPracticalNumber(
    place.practical_data,
    "price_level",
    place.price_level ?? 0,
  );

  return {
    id: place.id,
    name: place.name,
    type: place.type || "Place",
    area: place.area || "Addis Ababa",
    description: place.description || "",
    latitude: place.latitude ?? 9.03,
    longitude: place.longitude ?? 38.78,
    address: place.address || "",
    rating,
    reviews,
    image,
    photos: place.photos ?? [],
    cuisine: place.cuisines ?? [],
    amenities: [],
    payment: [],
    who,
    what: [...what, ...experienceTags],
    vibe,
    budget: getPriceLabel(
      priceRange > 0 ? priceRange : place.price_level,
    ),
    location: [
      place.area || "",
      place.address || "",
    ].filter(Boolean),
    time: [],
    priceRange:
      place.price_level
        ? "$".repeat(place.price_level)
        : undefined,
    tags: [
      ...experienceTags,
      ...vibe,
    ],
    phone: place.phone || undefined,
    whatsapp: place.whatsapp || undefined,
    website: place.website || undefined,
    verified:
      place.verification_status === "MEDER Verified" ||
      place.verification_status === "Business Verified",
    lastUpdated: undefined,
    experiences: experienceTags.map((label) => ({
      label,
      count: 0,
    })),
    videos: place.featured_video_url
      ? [
          {
            url: place.featured_video_url,
          },
        ]
      : [],
    communityVideos: place.tiktok_url
      ? [
          {
            title: "TikTok",
            url: place.tiktok_url,
          },
        ]
      : [],
  };
}
 export default function DiscoverPage() {
  const [view, setView] = useState<"list" | "map">("list");
  const [places, setPlaces] = useState<MederPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPlaces() {
      const supabase = createClient();

      const { data, error: fetchError } = await supabase
        .from("places")
        .select(
          `
            id,
            name,
            slug,
            type,
            area,
            address,
            description,
            phone,
            whatsapp,
            website,
            latitude,
            longitude,
            price_level,
            status,
            cuisines,
            experiences,
            cover_image,
            photos,
            tiktok_url,
            featured_video_url,
            practical_data,
            verification_status
        `,
        )
        .eq("status", "published")
        .order("created_at", {
          ascending: false,
        });

      if (fetchError) {
        console.error(
          "Failed to load Discover places:",
          fetchError,
        );
        setError(
          "We couldn't load places right now. Please try again.",
        );
        setLoading(false);
        return;
      }

      const mappedPlaces = (data ?? []).map(
        (place) =>
          getMederPlace(place as SupabasePlace),
      );

      setPlaces(mappedPlaces);
      setLoading(false);
    }

    loadPlaces();
  }, []);

  const mapPlaces = places.filter(
    (place) =>
      Number.isFinite(place.latitude) &&
      Number.isFinite(place.longitude) &&
      place.latitude !== 0 &&
      place.longitude !== 0,
  );

  return (
    <main className="min-h-screen bg-black px-4 pb-16 pt-24 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
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
                Explore places worth knowing about and find somewhere
                you'll love.
              </p>
            </div>

            <p className="text-sm text-white/40">
              {loading ? "Loading..." : `${places.length} places`}
            </p>
          </div>
        </section>

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

        {loading ? (
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
 <p className="text-sm text-white/45">
              Loading places...
            </p>
          </section>
        ) : error ? (
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <h2 className="font-serif text-2xl text-white">
              Something went wrong.
            </h2>

            <p className="mt-2 text-sm text-white/45">
              {error}
            </p>
          </section>
        ) : view === "map" ? (
          mapPlaces.length > 0 ? (
            <MederMap places={mapPlaces} />
          ) : (
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
              <h2 className="font-serif text-2xl text-white">
                No mapped places yet.
              </h2>

              <p className="mt-2 text-sm text-white/45">
                Published places with map coordinates will appear here.
              </p>
            </section>
          )
        ) : places.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {places.map((place) => (
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