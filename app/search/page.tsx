 "use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Star,
  SlidersHorizontal,
} from "lucide-react";

import SearchInput from "@/components/ui/SearchInput";
import { mederPlaces } from "@/Lib/meder/places";

export default function SearchPage() {
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") ?? "";
  const urlArea = searchParams.get("area") ?? "All areas";
  const urlType = searchParams.get("type") || "All places";
  const urlCuisine = searchParams.get("cuisine") || "All food";
  const urlExperience =
  searchParams.get("experience") || "All experiences";
  const urlLat = searchParams.get("lat");
const urlLng = searchParams.get("lng");

  const [query, setQuery] = useState(urlQuery);
  const [selectedArea, setSelectedArea] = useState(urlArea);
  const [selectedType, setSelectedType] = useState("All places");
  const [selectedCuisine, setSelectedCuisine] = useState("All food");
  const [selectedExperience, setSelectedExperience] =
    useState("All experiences");
  const [selectedBudget, setSelectedBudget] =
    useState("All budgets");
  const [selectedMood, setSelectedMood] =
    useState("All moods");
  const [filtersOpen, setFiltersOpen] =
    useState(false);
    const [userLocation, setUserLocation] = useState<{
  latitude: number;
  longitude: number;
} | null>(null);

  useEffect(() => {
  setQuery(urlQuery);
  setSelectedArea(urlArea);
  setSelectedType(urlType);
  setSelectedCuisine(urlCuisine);
  setSelectedExperience(urlExperience);
  if (urlLat && urlLng) {
  setUserLocation({
    latitude: Number(urlLat),
    longitude: Number(urlLng),
  });
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

  const areas = [
    "All areas",
    ...Array.from(
      new Set(mederPlaces.map((place) => place.area)),
    ),
  ];

  const placeTypes = [
    "All places",
    ...Array.from(
      new Set(mederPlaces.map((place) => place.type)),
    ),
  ];

  const foodCategories = [
    "All food",
    ...Array.from(
      new Set(
        mederPlaces.flatMap(
          (place) => place.cuisine || [],
        ),
      ),
    ),
  ];

  const experienceCategories = [
    "All experiences",
    ...Array.from(
      new Set(
        mederPlaces.flatMap(
          (place) => place.what || [],
        ),
      ),
    ),
  ];

  const budgetCategories = [
    "All budgets",
    ...Array.from(
      new Set(
        mederPlaces.flatMap(
          (place) => place.budget || [],
        ),
      ),
    ),
  ];

  const moodCategories = [
    "All moods",
    ...Array.from(
      new Set(
        mederPlaces.flatMap(
          (place) => place.vibe || [],
        ),
      ),
    ),
  ];

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

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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

    return mederPlaces.filter((place) => {
      const searchableText = [
        place.name,
        place.type,
        place.area,
        place.description,
        ...place.who,
        ...place.what,
        ...place.vibe,
        ...place.budget,
        ...place.location,
        ...place.time,
        ...(place.cuisine || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !search || searchableText.includes(search);

      const matchesArea =
        area === "all areas" ||
        place.area.toLowerCase().includes(area);

      const matchesType =
        type === "all places" ||
        place.type.toLowerCase() === type;

      const matchesCuisine =
        cuisine === "all food" ||
        (place.cuisine || []).some(
          (item) =>
            item.toLowerCase() === cuisine,
        );
 const matchesExperience =
  experience === "all experiences" ||
  (place.what || []).some(
    (item) =>
      item.toLowerCase().includes(experience) ||
      experience.includes(item.toLowerCase()),
  );
      const matchesBudget =
        budget === "all budgets" ||
        (place.budget || []).some(
          (item) =>
            item.toLowerCase() === budget,
        );

      const matchesMood =
        mood === "all moods" ||
        (place.vibe || []).some(
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
    }).sort((a, b) => {
      if (!userLocation) return 0;

      const distanceA = getDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        a.latitude,
        a.longitude,
      );

      const distanceB = getDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        b.latitude,
        b.longitude,
      );

      return distanceA - distanceB;
    });
  }, [
    query,
    selectedArea,
    selectedType,
    selectedCuisine,
    selectedExperience,
    selectedBudget,
    selectedMood,
  ]);

  const hasActiveSearch =
    query.trim() ||
    selectedArea !== "All areas" ||
    selectedType !== "All places" ||
    selectedCuisine !== "All food" ||
    selectedExperience !== "All experiences" ||
    selectedBudget !== "All budgets" ||
    selectedMood !== "All moods";

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

          {/* Search and filter button */}
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

          {/* Filter panel */}
          {filtersOpen && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              {/* Area */}
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

              {/* Place categories */}
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

              {/* Food categories */}
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

              {/* Experience categories */}
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

              {/* Budget categories */}
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

              {/* Mood categories */}
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

              {/* Filter actions */}
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

          {/* Active filters */}
          {(query.trim() ||
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

        {/* Search results */}
        {hasActiveSearch && (
          <section className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-white">
                Search results
              </h2>

              <span className="text-sm text-white/40">
                {results.length}{" "}
                {results.length === 1
                  ? "place"
                  : "places"}
              </span>
            </div>

            {results.length > 0 ? (
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