 "use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Star,
  SlidersHorizontal,
} from "lucide-react";

import SearchInput from "@/components/ui/SearchInput";
import { createClient } from "@/Lib/supabase/client";
import type { MederPlace } from "@/Lib/meder/matching";

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
  status: string;
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

function getPriceLabel(priceLevel: number | null | undefined): string[] {
  switch (priceLevel) {
    case 1:
      return ["Budget"];
    case 2:
      return ["Moderate"];
    case 3:
      return ["Premium"];
    case 4:
      return ["Luxury"];
    default:
      return [];
  }
}

function getPracticalNumber(
  data: Record<string, unknown> | null | undefined,
  key: string,
  fallback = 0,
): number {
  const value = data?.[key];

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function convertSupabasePlace(
  place: SupabasePlace,
): MederPlace {
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

  const vibes = experiences
    .filter((item) => item.startsWith("Vibe:"))
    .map((item) => item.replace("Vibe:", "").trim());

  const image =
    place.cover_image ||
    place.photos?.[0] ||
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80";

  const priceLevel = getPracticalNumber(
    place.practical_data,
    "price_level",
    place.price_level ?? 0,
  );

  const rating = getPracticalNumber(
    place.practical_data,
    "rating",
    0,
  );

  const reviews = getPracticalNumber(
    place.practical_data,
    "reviews",
    0,
  );

  return {
    id: place.id,
    name: place.name,
    type: place.type || "Place",
    area: place.area || "Addis Ababa",
    address: place.address || undefined,
    description: place.description || undefined,

    latitude:
      typeof place.latitude === "number"
        ? place.latitude
        : 9.03,

    longitude:
      typeof place.longitude === "number"
        ? place.longitude
        : 38.78,

    rating,
    reviews,

    image,

    photos:
      place.photos && place.photos.length > 0
        ? place.photos
        : [image],

    cuisine: place.cuisines ?? [],

    who,
    what: [...what, ...experienceTags],
    vibe: vibes,

    budget: getPriceLabel(priceLevel),

    location: [
      place.area || "",
      place.address || "",
    ].filter(Boolean),

    time: [],

    phone: place.phone || undefined,
    whatsapp: place.whatsapp || undefined,
    website: place.website || undefined,

    verified:
      place.verification_status === "MEDER Verified" ||
      place.verification_status === "Business Verified",
 videos: place.featured_video_url
      ? [
          {
            title: `${place.name} featured video`,
            url: place.featured_video_url,
          },
        ]
      : [],

    communityVideos: place.tiktok_url
      ? [
          {
            title: `${place.name} TikTok`,
            url: place.tiktok_url,
          },
        ]
      : [],
  };
}

function SearchPage() {
  const searchParams = useSearchParams();
  const supabase = createClient();

  const urlQuery = searchParams.get("q") ?? "";
  const urlArea = searchParams.get("area") ?? "All areas";
  const urlType =
    searchParams.get("type") ?? "All places";
  const urlCuisine =
    searchParams.get("cuisine") ?? "All food";
  const urlExperience =
    searchParams.get("experience") ??
    "All experiences";

  const urlLat = searchParams.get("lat");
  const urlLng = searchParams.get("lng");

  const [places, setPlaces] = useState<MederPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [query, setQuery] = useState(urlQuery);
  const [selectedArea, setSelectedArea] =
    useState(urlArea);
  const [selectedType, setSelectedType] =
    useState(urlType);
  const [selectedCuisine, setSelectedCuisine] =
    useState(urlCuisine);
  const [selectedExperience, setSelectedExperience] =
    useState(urlExperience);
  const [selectedBudget, setSelectedBudget] =
    useState("All budgets");
  const [selectedMood, setSelectedMood] =
    useState("All moods");

  const [filtersOpen, setFiltersOpen] =
    useState(false);

  const [userLocation, setUserLocation] =
    useState<{
      latitude: number;
      longitude: number;
    } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPlaces() {
      setLoading(true);
      setLoadError("");

      const { data, error } = await supabase
        .from("places")
        .select(
        `id,
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

      if (cancelled) {
        return;
      }

      if (error) {
        console.error(
          "Error loading search places:",
          error,
        );

        setLoadError(
          "We couldn't load places right now.",
        );
        setPlaces([]);
        setLoading(false);
        return;
      }

      const converted = (
        (data ?? []) as SupabasePlace[]
      ).map(convertSupabasePlace);

      setPlaces(converted);
      setLoading(false);
    }

    loadPlaces();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  useEffect(() => {
    setQuery(urlQuery);
    setSelectedArea(urlArea);
    setSelectedType(urlType);
    setSelectedCuisine(urlCuisine);
    setSelectedExperience(urlExperience);

    if (urlLat && urlLng) {
      const latitude = Number(urlLat);
      const longitude = Number(urlLng);

      if (
        Number.isFinite(latitude) &&
        Number.isFinite(longitude)
      ) {
        setUserLocation({
          latitude,
          longitude,
        });
      }
    } else {
      setUserLocation(null);
    }
  }, [
    urlQuery,
    urlArea,
    urlType,
    urlCuisine,
    urlExperience,
    urlLat,
    urlLng,
  ]);

  const areas = useMemo(() => {
    return [
      "All areas",
      ...Array.from(
        new Set(
          places
            .map((place) => place.area)
            .filter(Boolean),
        ),
      ).sort(),
    ];
  }, [places]);
 const placeTypes = useMemo(() => {
    return [
      "All places",
      ...Array.from(
        new Set(
          places
            .map((place) => place.type)
            .filter(Boolean),
        ),
      ).sort(),
    ];
  }, [places]);

  const foodCategories = useMemo(() => {
    return [
      "All food",
      ...Array.from(
        new Set(
          places.flatMap(
            (place) => place.cuisine ?? [],
          ),
        ),
      ).sort(),
    ];
  }, [places]);

  const experienceCategories = useMemo(() => {
    return [
      "All experiences",
      ...Array.from(
        new Set(
          places.flatMap(
            (place) => place.what ?? [],
          ),
        ),
      ).sort(),
    ];
  }, [places]);

  const budgetCategories = useMemo(() => {
    return [
      "All budgets",
      ...Array.from(
        new Set(
          places.flatMap(
            (place) => place.budget ?? [],
          ),
        ),
      ).sort(),
    ];
  }, [places]);

  const moodCategories = useMemo(() => {
    return [
      "All moods",
      ...Array.from(
        new Set(
          places.flatMap(
            (place) => place.vibe ?? [],
          ),
        ),
      ).sort(),
    ];
  }, [places]);

  const clearAllFilters = () => {
    setQuery("");
    setSelectedArea("All areas");
    setSelectedType("All places");
    setSelectedCuisine("All food");
    setSelectedExperience("All experiences");
    setSelectedBudget("All budgets");
    setSelectedMood("All moods");
  };

  const activeFilterCount = [
    selectedArea !== "All areas",
    selectedType !== "All places",
    selectedCuisine !== "All food",
    selectedExperience !== "All experiences",
    selectedBudget !== "All budgets",
    selectedMood !== "All moods",
  ].filter(Boolean).length;

  const getDistanceKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371;

    const dLat =
      ((lat2 - lat1) * Math.PI) / 180;

    const dLon =
      ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return (
      R *
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a),
      )
    );
  };

  const results = useMemo(() => {
    const search = query.trim().toLowerCase();
    const area = selectedArea.trim().toLowerCase();
    const type = selectedType.trim().toLowerCase();
    const cuisine =
      selectedCuisine.trim().toLowerCase();
    const experience =
      selectedExperience.trim().toLowerCase();
    const budget =
      selectedBudget.trim().toLowerCase();
    const mood =
      selectedMood.trim().toLowerCase();

    return places
      .filter((place) => {
        const searchableText = [
          place.name,
          place.type,
          place.area,
          place.description,
          ...(place.who ?? []),
          ...(place.what ?? []),
          ...(place.vibe ?? []),
          ...(place.budget ?? []),
          ...(place.location ?? []),
          ...(place.time ?? []),
          ...(place.cuisine ?? []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          !search ||
          searchableText.includes(search);

        const matchesArea =
          area === "all areas" ||
          place.area
            .toLowerCase()
            .includes(area);

        const matchesType =
          type === "all places" ||
          place.type
            .toLowerCase() === type;

        const matchesCuisine =
          cuisine === "all food" ||
          (place.cuisine ?? []).some(
            (item) =>
              item.toLowerCase() === cuisine,
          );

        const matchesExperience =
          experience === "all experiences" ||
          (place.what ?? []).some(
            (item) => {
              const itemLower =
                item.toLowerCase();
 return (
                itemLower.includes(experience) ||
                experience.includes(itemLower)
              );
            },
          );

        const matchesBudget =
          budget === "all budgets" ||
          (place.budget ?? []).some(
            (item) =>
              item.toLowerCase() === budget,
          );

        const matchesMood =
          mood === "all moods" ||
          (place.vibe ?? []).some(
            (item) =>
              item.toLowerCase() === mood,
          );

        return (
          matchesSearch &&
          matchesArea &&
          matchesType &&
          matchesCuisine &&
          matchesExperience &&
          matchesBudget &&
          matchesMood
        );
      })
      .sort((a, b) => {
        if (!userLocation) {
          return 0;
        }

        const distanceA =
          getDistanceKm(
            userLocation.latitude,
            userLocation.longitude,
            a.latitude,
            a.longitude,
          );

        const distanceB =
          getDistanceKm(
            userLocation.latitude,
            userLocation.longitude,
            b.latitude,
            b.longitude,
          );

        return distanceA - distanceB;
      });
  }, [
    places,
    query,
    selectedArea,
    selectedType,
    selectedCuisine,
    selectedExperience,
    selectedBudget,
    selectedMood,
    userLocation,
  ]);

  const hasActiveSearch =
    query.trim() !== "" ||
    activeFilterCount > 0;

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <section className="mt-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
            Explore MEDER
          </p>

          <h1 className="mt-3 font-serif text-3xl text-white sm:text-5xl">
            What are you looking for?
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/50 sm:text-base">
            Search for places, food, experiences, or areas.
          </p>

          <div className="mt-8 flex w-full max-w-3xl gap-2">
            <div className="min-w-0 flex-1">
              <SearchInput
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                onClear={() => setQuery("")}
                placeholder="Search places, food, areas..."
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setFiltersOpen(!filtersOpen)
              }
              className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition ${
                filtersOpen || activeFilterCount > 0
                  ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                  : "border-white/10 bg-white/[0.03] text-white/70 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filter

              {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] text-[#D4AF37]">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {filtersOpen && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-white/35">
                  Area
                </p>

                <div className="flex flex-wrap gap-2">
                  {areas.map((area) => {
                    const isActive =
                      selectedArea === area;
 return (
                      <button
                        key={area}
                        type="button"
                        onClick={() =>
                          setSelectedArea(area)
                        }
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          isActive
                            ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                            : "border-white/10 bg-white/[0.03] text-white/60 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                        }`}
                      >
                        {area}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-white/35">
                  Place type
                </p>

                <div className="flex flex-wrap gap-2">
                  {placeTypes.map((type) => {
                    const isActive =
                      selectedType === type;

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setSelectedType(type)
                        }
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          isActive
                            ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                            : "border-white/10 bg-white/[0.03] text-white/60 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-white/35">
                  Food
                </p>

                <div className="flex flex-wrap gap-2">
                  {foodCategories.map((food) => {
                    const isActive =
                      selectedCuisine === food;

                    return (
                      <button
                        key={food}
                        type="button"
                        onClick={() =>
                          setSelectedCuisine(food)
                        }
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          isActive
                            ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                            : "border-white/10 bg-white/[0.03] text-white/60 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                        }`}
                      >
                        {food}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-white/35">
                  Experience
                </p>

                <div className="flex flex-wrap gap-2">
                  {experienceCategories.map(
                    (experience) => {
                      const isActive =
                        selectedExperience ===
                        experience;

                      return (
                        <button
                          key={experience}
                          type="button"
                          onClick={() =>
                            setSelectedExperience(
                              experience,
                            )
 }
                          className={`rounded-full border px-4 py-2 text-sm transition ${
                            isActive
                              ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                              : "border-white/10 bg-white/[0.03] text-white/60 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                          }`}
                        >
                          {experience}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-white/35">
                  Budget
                </p>

                <div className="flex flex-wrap gap-2">
                  {budgetCategories.map(
                    (budget) => {
                      const isActive =
                        selectedBudget === budget;

                      return (
                        <button
                          key={budget}
                          type="button"
                          onClick={() =>
                            setSelectedBudget(
                              budget,
                            )
                          }
                          className={`rounded-full border px-4 py-2 text-sm transition ${
                            isActive
                              ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                              : "border-white/10 bg-white/[0.03] text-white/60 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                          }`}
                        >
                          {budget}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-white/35">
                  Mood
                </p>

                <div className="flex flex-wrap gap-2">
                  {moodCategories.map((mood) => {
                    const isActive =
                      selectedMood === mood;

                    return (
                      <button
                        key={mood}
                        type="button"
                        onClick={() =>
                          setSelectedMood(mood)
                        }
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          isActive
                            ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                            : "border-white/10 bg-white/[0.03] text-white/60 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                        }`}
                      >
                        {mood}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-sm font-medium text-[#D4AF37] transition hover:text-[#E5C158]"
                >
                  Clear all filters
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFiltersOpen(false)
                  }
                  className="min-h-11 rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
                >
                  Show results
                </button>
              </div>
            </div>
          )}
{(query.trim() !== "" ||
            activeFilterCount > 0) && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div>
                <p className="text-sm font-medium text-white">
                  {activeFilterCount > 0
                    ? `${activeFilterCount} filter${
                        activeFilterCount === 1
                          ? ""
                          : "s"
                      } active`
                    : "Search active"}
                </p>

                <p className="mt-1 text-xs text-white/40">
                  Your results are being narrowed
                  based on your selections.
                </p>
              </div>

              <button
                type="button"
                onClick={clearAllFilters}
                className="rounded-xl border border-[#D4AF37]/30 px-4 py-2 text-sm font-medium text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
              >
                Clear all
              </button>
            </div>
          )}
        </section>

        {hasActiveSearch && (
          <section className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-white">
                Search results
              </h2>

              {!loading && (
                <span className="text-sm text-white/40">
                  {results.length}{" "}
                  {results.length === 1
                    ? "place"
                    : "places"}
                </span>
              )}
            </div>

            {loading ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
                <p className="text-sm text-white/40">
                  Loading places...
                </p>
              </div>
            ) : loadError ? (
              <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/5 px-6 py-12 text-center">
                <p className="font-serif text-xl text-white">
                  Unable to load places
                </p>

                <p className="mt-2 text-sm text-white/40">
                  {loadError}
                </p>
              </div>
            ) : results.length > 0 ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((place) => (
                  <Link
                    key={place.id}
                    href={`/places/${place.id}`}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-[#D4AF37]/40"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={place.image}
                        alt={place.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white backdrop-blur-md">
                        <Star className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                        {place.rating}
                      </div>
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
                        {place.area}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
                <p className="font-serif text-xl text-white">
                  No places found
                </p>

                <p className="mt-2 text-sm text-white/40">
                  Try searching for another place,
                  area, food, or experience.
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export default function SearchPageWrapper() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black px-5 py-16 text-white">
          <div className="mx-auto max-w-6xl text-center text-sm text-white/40">
            Loading search...
          </div>
        </main>
      }
    >
      <SearchPage />
    </Suspense>
  );
}