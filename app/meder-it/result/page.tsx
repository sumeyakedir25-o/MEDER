 "use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Clock3,
  MapPin,
  Sparkles,
  Star,
} from "lucide-react";

import RecommendationFeedback from "@/components/meder-it/desionform";
import { createClient } from "@/Lib/supabase/client";
import {
  getRecommendations,
  MederPlace,
  MederSelections,
  MatchResult,
} from "@/Lib/meder/matching";

type SupabasePlace = {
  id: string;
  name: string;
  slug?: string | null;
  type?: string | null;
  category?: string | null;
  area?: string | null;
  address?: string | null;
  description?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  website?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  price_level?: number | null;
  status?: string | null;
  cuisines?: string[] | null;
  experiences?: string[] | null;
  cover_image?: string | null;
  photos?: string[] | null;
  tiktok_url?: string | null;
  featured_video_url?: string | null;
  verification_status?: string | null;
  practical_data?: Record<string, unknown> | null;
  rating?: number | null;
  reviews?: number | null;
  updated_at?: string | null;
};

type UserLocation = {
  latitude: number;
  longitude: number;
};

function cleanArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function mapWhatValue(value: string): string | null {
  const v = normalize(value);

  if (
    v.includes("eat") ||
    v.includes("restaurant") ||
    v.includes("dining") ||
    v.includes("food")
  ) {
    return "Eat";
  }

  if (v.includes("coffee") || v.includes("cafe") || v.includes("café")) {
    return "Coffee";
  }

  if (
    v.includes("drink") ||
    v.includes("bar") ||
    v.includes("cocktail")
  ) {
    return "Drinks";
  }

  if (
    v.includes("dessert") ||
    v.includes("sweet") ||
    v.includes("bakery")
  ) {
    return "Dessert";
  }

  if (
    v.includes("game") ||
    v.includes("billiard") ||
    v.includes("bowling")
  ) {
    return "Game Zone";
  }

  if (v.includes("movie") || v.includes("cinema")) {
    return "Movies";
  }

  if (v.includes("entertainment")) {
    return "Entertainment";
  }

  if (
    v.includes("experience") ||
    v.includes("activity") ||
    v.includes("adventure")
  ) {
    return "Experience";
  }

  return null;
}

function mapWhoValue(value: string): string | null {
  const v = normalize(value);

  if (v.includes("solo") || v.includes("alone")) {
    return "Solo";
  }

  if (v.includes("friend") || v.includes("group")) {
    return "Friends";
  }

  if (
    v.includes("date") ||
    v.includes("couple") ||
    v.includes("romantic")
  ) {
    return "Date";
  }

  if (v.includes("family")) {
    return "Family";
  }

  if (
    v.includes("colleague") ||
    v.includes("business") ||
    v.includes("work")
  ) {
    return "Colleagues";
  }

  return null;
}

function mapVibeValue(value: string): string | null {
  const v = normalize(value);

  if (
    v.includes("chill") ||
    v.includes("relaxed") ||
    v.includes("relaxing")
  ) {
    return "Chill";
  }

  if (v.includes("romantic") || v.includes("romance")) {
    return "Romantic";
  }

  if (v.includes("fun") || v.includes("playful")) {
    return "Fun";
  }

  if (
    v.includes("luxury") ||
    v.includes("elegant") ||
    v.includes("upscale") ||
    v.includes("premium")
  ) {
    return "Luxury";
  }

  if (
    v.includes("quiet") ||
    v.includes("peaceful") ||
    v.includes("calm")
  ) {
    return "Quiet";
  }

  if (
    v.includes("lively") ||
    v.includes("energetic") ||
    v.includes("busy")
  ) {
    return "Lively";
  }

  return null;
}
 function getBudgetLabels(
  min: number | null,
  max: number | null,
  priceLevel: number | null
): string[] {
  if (
    typeof min === "number" &&
    typeof max === "number" &&
    Number.isFinite(min) &&
    Number.isFinite(max)
  ) {
    const labels: string[] = [];

    if (max >= 0 && min <= 500) {
      labels.push("Under 500 ETB");
    }

    if (max >= 500 && min <= 1000) {
      labels.push("500–1,000 ETB");
    }

    if (max >= 1000 && min <= 2000) {
      labels.push("1,000–2,000 ETB");
    }

    if (max >= 2000) {
      labels.push("2,000+ ETB");
    }

    return unique(labels);
  }

  if (priceLevel === 1) {
    return ["Under 500 ETB"];
  }

  if (priceLevel === 2) {
    return ["500–1,000 ETB"];
  }

  if (priceLevel === 3) {
    return ["1,000–2,000 ETB"];
  }

  if (priceLevel === 4) {
    return ["2,000+ ETB"];
  }

  return [];
}

function parseExperiences(values: string[]) {
  const what: string[] = [];
  const who: string[] = [];
  const vibe: string[] = [];

  for (const rawValue of values) {
    const value = rawValue.trim();

    if (!value) {
      continue;
    }

    const separatorIndex = value.indexOf(":");

    if (separatorIndex === -1) {
      const whatValue = mapWhatValue(value);
      const whoValue = mapWhoValue(value);
      const vibeValue = mapVibeValue(value);

      if (whatValue) {
        what.push(whatValue);
      }

      if (whoValue) {
        who.push(whoValue);
      }

      if (vibeValue) {
        vibe.push(vibeValue);
      }

      continue;
    }

    const prefix = normalize(value.slice(0, separatorIndex));
    const content = value.slice(separatorIndex + 1).trim();

    if (!content) {
      continue;
    }

    if (prefix === "purpose" || prefix === "experience") {
      const mapped = mapWhatValue(content);

      if (mapped) {
        what.push(mapped);
      }
    }

    if (prefix === "audience") {
      const mapped = mapWhoValue(content);

      if (mapped) {
        who.push(mapped);
      }
    }

    if (prefix === "vibe") {
      const mapped = mapVibeValue(content);

      if (mapped) {
        vibe.push(mapped);
      }
    }
  }

  return {
    what: unique(what),
    who: unique(who),
    vibe: unique(vibe),
  };
}

function inferWhatFromPlace(
  type: string,
  category: string,
  cuisines: string[]
): string[] {
  const values = [type, category, ...cuisines];
  const result: string[] = [];

  for (const value of values) {
    const mapped = mapWhatValue(value);

    if (mapped) {
      result.push(mapped);
    }
  }

  return unique(result);
}

function inferVibeFromPracticalData(
  practicalData: Record<string, unknown>
): string[] {
  const values: string[] = [];

  const noiseLevel =
    typeof practicalData.noise_level === "string"
      ? practicalData.noise_level
      : "";

  const mapped = mapVibeValue(noiseLevel);

  if (mapped) {
    values.push(mapped);
  }

  return unique(values);
}

function getOpeningHours(
  practicalData: Record<string, unknown>
): unknown {
  return (
    practicalData.opening_hours ??
    practicalData.openingHours ??
    practicalData.hours ??
    null
  );
}

function getTimeLabels(
  practicalData: Record<string, unknown>
): string[] {
  const hours = getOpeningHours(practicalData);

  if (!hours) {
    return [];
  }

  if (!Array.isArray(hours)) {
    return [];
  }

  const labels: string[] = [];

  for (const item of hours) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const record = item as Record<string, unknown>;

    const day =
      typeof record.day === "string"
        ? normalize(record.day)
        : "";

    const open =
      typeof record.open === "string"
        ? record.open
        : "";

    const close =
      typeof record.close === "string"
        ? record.close
        : "";

    if (!open || !close) {
      continue;
    }

    labels.push("Today");

    const closeHour = Number(close.split(":")[0]);
    const openHour = Number(open.split(":")[0]);
 if (
      Number.isFinite(openHour) &&
      Number.isFinite(closeHour) &&
      (closeHour >= 17 || openHour >= 17)
    ) {
      labels.push("Tonight");
    }

    if (
      day.includes("saturday") ||
      day.includes("sunday")
    ) {
      labels.push("This Weekend");
    }
  }

  return unique(labels);
}

function calculateDistanceKm(
  first: UserLocation,
  second: {
    latitude: number;
    longitude: number;
  }
): number {
  const earthRadius = 6371;

  const latitudeDifference =
    ((second.latitude - first.latitude) * Math.PI) / 180;

  const longitudeDifference =
    ((second.longitude - first.longitude) * Math.PI) / 180;

  const latitude1 =
    (first.latitude * Math.PI) / 180;

  const latitude2 =
    (second.latitude * Math.PI) / 180;

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(latitude1) *
      Math.cos(latitude2) *
      Math.sin(longitudeDifference / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
}

function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return String(Math.round(distanceKm * 1000)) + " m";
  }

  return distanceKm.toFixed(1) + " km";
}

function formatApproxTravelTime(
  distanceKm: number
): string {
  const minutes = Math.max(
    3,
    Math.round(distanceKm * 4)
  );

  return "~" + String(minutes) + " min";
}

function convertSupabasePlace(
  row: SupabasePlace
): MederPlace {
  const practicalData =
    row.practical_data &&
    typeof row.practical_data === "object"
      ? row.practical_data
      : {};

  const experiences = cleanArray(row.experiences);
  const cuisines = cleanArray(row.cuisines);

  const parsed = parseExperiences(experiences);

  const type =
    row.type?.trim() ||
    row.category?.trim() ||
    "Place";

  const area =
    row.area?.trim() ||
    (typeof practicalData.city === "string"
      ? practicalData.city
      : "") ||
    "Addis Ababa";

  const inferredWhat =
    inferWhatFromPlace(
      type,
      row.category ?? "",
      cuisines
    );

  const inferredVibe =
    inferVibeFromPracticalData(
      practicalData
    );

  const spendMin =
    typeof practicalData.spend_min === "number"
      ? practicalData.spend_min
      : null;

  const spendMax =
    typeof practicalData.spend_max === "number"
      ? practicalData.spend_max
      : null;

  const budget = getBudgetLabels(
    spendMin,
    spendMax,
    typeof row.price_level === "number"
      ? row.price_level
      : null
  );

  const city =
    typeof practicalData.city === "string"
      ? practicalData.city.trim()
      : "";

  const location = unique([
    area,
    city,
  ]);

  const image =
    row.cover_image?.trim() ||
    row.photos?.find(
      (photo) => photo?.trim()
    ) ||
    "";

  const verified =
    row.verification_status ===
      "MEDER Verified" ||
    row.verification_status ===
      "Business Verified";

  const instagram =
    typeof practicalData.instagram === "string"
      ? practicalData.instagram
      : undefined;

  const facebook =
    typeof practicalData.facebook === "string"
      ? practicalData.facebook
      : undefined;

  const rating =
    typeof row.rating === "number"
      ? row.rating
      : 0;

  const reviews =
    typeof row.reviews === "number"
      ? row.reviews
      : 0;

  return {
    id: row.id,
    name: row.name,
    type,
    area,
    description:
      row.description ?? undefined,
    latitude:
      typeof row.latitude === "number"
        ? row.latitude
        : 0,
    longitude:
      typeof row.longitude === "number"
        ? row.longitude
        : 0,
    address:
      row.address ?? undefined,
    rating,
    reviews,
    image,
    photos: cleanArray(row.photos),
    cuisine: cuisines,
 who: unique(parsed.who),
    what: unique([
      ...parsed.what,
      ...inferredWhat,
    ]),
    vibe: unique([
      ...parsed.vibe,
      ...inferredVibe,
    ]),
    budget,
    location,
    time: getTimeLabels(
      practicalData
    ),
    priceRange:
      typeof practicalData.price_range === "string"
        ? practicalData.price_range
        : undefined,
    tags: experiences,
    phone:
      row.phone ?? undefined,
    whatsapp:
      row.whatsapp ?? undefined,
    website:
      row.website ?? undefined,
    socialLinks: {
      instagram,
      facebook,
      tiktok:
        row.tiktok_url ?? undefined,
    },
    verified,
    lastUpdated:
      row.updated_at ?? undefined,
    communityVideos:
      row.featured_video_url
        ? [
            {
              title:
                row.name + " video",
              url:
                row.featured_video_url,
            },
          ]
        : [],
  };
}

function shufflePlaces(
  places: MederPlace[]
): MederPlace[] {
  return [...places].sort(
    () => Math.random() - 0.5
  );
}

export default function MederItResultPage() {
  const [selections, setSelections] =
    useState<MederSelections>({});

  const [places, setPlaces] =
    useState<MederPlace[]>([]);

  const [userLocation, setUserLocation] =
    useState<UserLocation | null>(null);

  const [savedPlaces, setSavedPlaces] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [surpriseMode, setSurpriseMode] =
    useState(false);

  useEffect(() => {
    const savedDecision =
      sessionStorage.getItem(
        "meder-decision"
      );

    const surprise =
      sessionStorage.getItem(
        "meder-surprise"
      ) === "true";

    setSurpriseMode(surprise);

    if (savedDecision) {
      try {
        const parsed =
          JSON.parse(
            savedDecision
          ) as MederSelections;

        setSelections(parsed);
      } catch {
        setSelections({});
      }
    }

    const saved =
      localStorage.getItem(
        "meder-saved-places"
      );

    if (saved) {
      try {
        setSavedPlaces(
          JSON.parse(saved) as string[]
        );
      } catch {
        setSavedPlaces([]);
      }
    }

    const storedLocation =
      sessionStorage.getItem(
        "meder-user-location"
      );

    if (storedLocation) {
      try {
        const parsed =
          JSON.parse(
            storedLocation
          ) as UserLocation;

        if (
          typeof parsed.latitude === "number" &&
          typeof parsed.longitude === "number"
        ) {
          setUserLocation(parsed);
        }
      } catch {
        setUserLocation(null);
      }
    }

    async function loadPlaces() {
      try {
        setLoading(true);
        setError(null);

        const supabase =
          createClient();

        const {
          data,
          error: supabaseError,
        } = await supabase
          .from("places")
          .select("*")
          .eq("status", "published")
          .order("updated_at", {
            ascending: false,
          });

        if (supabaseError) {
          throw supabaseError;
        }

        const converted =
          ((data ?? []) as SupabasePlace[])
            .map(convertSupabasePlace);

        setPlaces(converted);
      } catch (loadError) {
        console.error(
          "Failed to load MEDER places:",
          loadError
        );

        setError(
          "We couldn't load places right now. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPlaces();
  }, []);

  const preparedPlaces = useMemo(() => {
    if (!userLocation) {
      return places;
    }

    return places.map((place) => {
      if (
        !place.latitude ||
        !place.longitude
      ) {
        return place;
      }
 const distanceKm =
        calculateDistanceKm(
          userLocation,
          {
            latitude:
              place.latitude,
            longitude:
              place.longitude,
          }
        );

      return {
        ...place,
        distance:
          formatDistance(distanceKm),
        travelTime:
          formatApproxTravelTime(
            distanceKm
          ),
        location:
          distanceKm <= 5
            ? unique([
                ...place.location,
                "Near Me",
              ])
            : place.location,
      };
    });
  }, [places, userLocation]);

  const results = useMemo(() => {
    if (
      loading ||
      preparedPlaces.length === 0
    ) {
      return [];
    }

    const effectiveSelections: MederSelections =
      {
        ...selections,
        location:
          selections.location?.filter(
            (value) =>
              value !== "Choose Area" &&
              (
                value !== "Near Me" ||
                Boolean(userLocation)
              )
          ),
      };

    const hasSelections =
      Object.values(
        effectiveSelections
      ).some(
        (value) =>
          Array.isArray(value) &&
          value.length > 0
      );

    if (
      !hasSelections ||
      surpriseMode
    ) {
      return shufflePlaces(
        preparedPlaces
      )
        .slice(0, 3)
        .map((place, index) => ({
          place,
          score:
            index === 0
              ? 100
              : Math.max(
                  80 - index * 8,
                  60
                ),
          reasons: [
            "A real place currently published on MEDER",
            place.verified
              ? "Verified information"
              : "Available on MEDER",
          ],
        }));
    }

    return getRecommendations(
      effectiveSelections,
      preparedPlaces
    ).slice(0, 10);
  }, [
    loading,
    preparedPlaces,
    selections,
    surpriseMode,
    userLocation,
  ]);

  const bestMatch = results[0];
  const alternative = results[1];

  const budgetOption = useMemo(() => {
    const selectedBudget =
      selections.budget ?? [];

    if (
      selectedBudget.length === 0
    ) {
      return results[2];
    }

    return (
      results.find(
        (result, index) =>
          index > 0 &&
          result.place.budget.some(
            (budget) =>
              selectedBudget.includes(
                budget
              )
          )
      ) ?? results[2]
    );
  }, [
    results,
    selections.budget,
  ]);

  const whyReasons = useMemo(() => {
    if (!bestMatch) {
      return [];
    }

    const reasons = [
      ...bestMatch.reasons,
    ];

    if (
      selections.location?.includes(
        "Near Me"
      ) &&
      bestMatch.place.distance
    ) {
      reasons.push(
        "About " +
          bestMatch.place.distance +
          " from you"
      );
    }

    if (
      selections.what &&
      selections.what.length > 0
    ) {
      reasons.push(
        "Matches what you want to do"
      );
    }

    if (
      selections.vibe &&
      selections.vibe.length > 0
    ) {
      reasons.push(
        "Matches your preferred vibe"
      );
    }

    if (
      selections.budget &&
      selections.budget.length > 0
    ) {
      reasons.push(
        "Fits your selected budget"
      );
    }

    if (
      selections.who &&
      selections.who.length > 0
    ) {
      reasons.push(
        "Fits your group"
      );
    }

    return Array.from(
      new Set(reasons)
    ).slice(0, 4);
  }, [
    bestMatch,
    selections,
  ]);

  function toggleSaved(
    placeId: string
  ) {
    setSavedPlaces((current) => {
      const exists =
        current.includes(placeId);

      const updated = exists
        ? current.filter(
            (id) => id !== placeId
          )
        : [...current, placeId];

      localStorage.setItem(
        "meder-saved-places",
        JSON.stringify(updated)
      );

      return updated;
    });
  }
 function clearDecision() {
    sessionStorage.removeItem(
      "meder-decision"
    );

    sessionStorage.removeItem(
      "meder-surprise"
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[#D4AF37]" />

            <p className="text-sm text-white/60">
              MEDER is finding your place...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6">
          <div className="max-w-md text-center">
            <h1 className="mb-3 text-2xl font-semibold">
              Something went wrong
            </h1>

            <p className="mb-6 text-sm text-white/60">
              {error}
            </p>

            <Link
              href="/meder-it"
              className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#e2c15a]"
            >
              <ArrowLeft size={16} />
              Back to MEDER IT
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (places.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6">
          <div className="max-w-md text-center">
            <Sparkles
              className="mx-auto mb-5 text-[#D4AF37]"
              size={34}
            />

            <h1 className="mb-3 text-2xl font-semibold">
              MEDER is getting ready
            </h1>

            <p className="mb-6 text-sm leading-6 text-white/60">
              There are no published places yet.
              Once places are published from the
              MEDER CMS, MEDER IT will use them here.
            </p>

            <Link
              href="/meder-it"
              className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#e2c15a]"
            >
              <ArrowLeft size={16} />
              Back to MEDER IT
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!bestMatch) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6">
          <div className="max-w-md text-center">
            <Sparkles
              className="mx-auto mb-5 text-[#D4AF37]"
              size={34}
            />

            <h1 className="mb-3 text-2xl font-semibold">
              No strong match yet
            </h1>

            <p className="mb-6 text-sm leading-6 text-white/60">
              Try changing one or two of your
              preferences and let MEDER find another
              match.
            </p>

            <Link
              href="/meder-it"
              className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#e2c15a]"
            >
              <ArrowLeft size={16} />
              Try Again
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/meder-it"
            onClick={clearDecision}
            className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to MEDER IT
          </Link>
[17/09/2026 17:14] Meder.code: {surpriseMode && (
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2 text-xs text-[#D4AF37]">
              <Sparkles size={14} />
              Surprise Me
            </div>
          )}
        </div>

        <div className="mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
            MEDER IT
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Here&apos;s your match.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
            Based on the places currently published
            on MEDER and the preferences you gave us.
          </p>
        </div>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
          <div className="grid lg:grid-cols-[1.15fr_1fr]">
            <div className="relative min-h-[320px] bg-white/5">
              {bestMatch.place.image ? (
                <img
                  src={bestMatch.place.image}
                  alt={bestMatch.place.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin
                    size={42}
                    className="text-white/20"
                  />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-5 left-5">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-xs backdrop-blur">
                  <Sparkles
                    size={13}
                    className="text-[#D4AF37]"
                  />
                  Best Match
                </div>

                <h2 className="text-2xl font-semibold sm:text-3xl">
                  {bestMatch.place.name}
                </h2>
              </div>
            </div>

            <div className="flex flex-col justify-between p-6 sm:p-8">
              <div>
                <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-white/60">
                  <span>
                    {bestMatch.place.type}
                  </span>

                  <span className="text-white/20">
                    •
                  </span>

                  <span className="inline-flex items-center gap-1">
                    <MapPin size={14} />
                    {bestMatch.place.area}
                  </span>

                  {bestMatch.place.distance && (
                    <>
                      <span className="text-white/20">
                        •
                      </span>

                      <span>
                        {bestMatch.place.distance}
                      </span>
                    </>
                  )}

                  {bestMatch.place.travelTime && (
                    <>
                      <span className="text-white/20">
                        •
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Clock3 size={14} />
                        {bestMatch.place.travelTime}
                      </span>
                    </>
                  )}
                </div>

                {bestMatch.place.verified && (
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-3 py-1.5 text-xs text-[#D4AF37]">
                    <CheckCircle2 size={14} />
                    MEDER Verified
                  </div>
                )}

                <div className="mb-6 flex items-center gap-2">
                  <Star
                    size={17}
                    className="fill-[#D4AF37] text-[#D4AF37]"
                  />
 <span className="font-medium">
                    {bestMatch.place.rating > 0
                      ? bestMatch.place.rating.toFixed(1)
                      : "New"}
                  </span>

                  {bestMatch.place.reviews > 0 && (
                    <span className="text-sm text-white/45">
                      ({bestMatch.place.reviews} reviews)
                    </span>
                  )}
                </div>

                <div className="mb-7 rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/5 p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Sparkles
                      size={16}
                      className="text-[#D4AF37]"
                    />

                    <h3 className="text-sm font-semibold text-[#D4AF37]">
                      Why MEDER recommends this
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {whyReasons.map(
                      (reason, index) => (
                        <div
                          key={
                            reason +
                            "-" +
                            String(index)
                          }
                          className="flex items-start gap-3 text-sm text-white/70"
                        >
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                          <span>{reason}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="mb-7">
                  <div className="mb-2 text-xs uppercase tracking-[0.15em] text-white/35">
                    MEDER Match
                  </div>

                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-semibold text-[#D4AF37]">
                      {bestMatch.score}%
                    </span>

                    <span className="pb-1 text-sm text-white/45">
                      match
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={
                    "/places/" +
                    bestMatch.place.id
                  }
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#e2c15a]"
                >
                  View Details
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    toggleSaved(
                      bestMatch.place.id
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
                >
                  <Bookmark
                    size={16}
                    className={
                      savedPlaces.includes(
                        bestMatch.place.id
                      )
                        ? "fill-[#D4AF37] text-[#D4AF37]"
                        : ""
                    }
                  />

                  {savedPlaces.includes(
                    bestMatch.place.id
                  )
                    ? "Saved"
                    : "Save"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-4">
          <RecommendationFeedback />
        </div>

        <section className="mt-12">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
              More options
            </p>
 <h2 className="mt-2 text-2xl font-semibold">
              Just in case
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {alternative &&
              alternative.place.id !==
                bestMatch.place.id && (
                <RecommendationCard
                  result={alternative}
                  label="Alternative"
                  savedPlaces={savedPlaces}
                  onToggleSaved={
                    toggleSaved
                  }
                />
              )}

            {budgetOption &&
              budgetOption.place.id !==
                bestMatch.place.id &&
              budgetOption.place.id !==
                alternative?.place.id && (
                <RecommendationCard
                  result={budgetOption}
                  label="Budget Option"
                  savedPlaces={savedPlaces}
                  onToggleSaved={
                    toggleSaved
                  }
                />
              )}
          </div>
        </section>
      </div>
    </main>
  );
}

function RecommendationCard({
  result,
  label,
  savedPlaces,
  onToggleSaved,
}: {
  result: MatchResult;
  label: string;
  savedPlaces: string[];
  onToggleSaved: (
    placeId: string
  ) => void;
}) {
  const isSaved =
    savedPlaces.includes(
      result.place.id
    );

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
      <div className="relative h-52 bg-white/5">
        {result.place.image ? (
          <img
            src={result.place.image}
            alt={result.place.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <MapPin
              size={36}
              className="text-white/20"
            />
          </div>
        )}

        <div className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium backdrop-blur">
          {label}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">
            {result.place.name}
          </h3>

          <span className="shrink-0 text-sm font-semibold text-[#D4AF37]">
            {result.score}%
          </span>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-white/50">
          <span>
            {result.place.type}
          </span>

          <span>•</span>

          <span className="inline-flex items-center gap-1">
            <MapPin size={12} />
            {result.place.area}
          </span>

          {result.place.rating > 0 && (
            <>
              <span>•</span>

              <span className="inline-flex items-center gap-1">
                <Star
                  size={12}
                  className="fill-[#D4AF37] text-[#D4AF37]"
                />
                {result.place.rating.toFixed(1)}
              </span>
            </>
          )}
        </div>

        <div className="mb-5 space-y-2">
          {result.reasons
            .slice(0, 2)
            .map(
              (reason, index) => (
                <div
                  key={
                    reason +
                    "-" +
                    String(index)
                  }
                  className="flex items-start gap-2 text-xs text-white/55"
                >
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#D4AF37]" />
                  <span>
                    {reason}
                  </span>
                </div>
              )
            )}
        </div>

        <div className="flex gap-2">
 <Link
            href={
              "/places/" +
              result.place.id
            }
            className="flex-1 rounded-full border border-white/15 px-4 py-2.5 text-center text-xs font-medium transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
          >
            View Details
          </Link>

          <button
            type="button"
            onClick={() =>
              onToggleSaved(
                result.place.id
              )
            }
            className="rounded-full border border-white/15 px-4 py-2.5 transition hover:border-[#D4AF37]/50"
            aria-label={
              isSaved
                ? "Remove from saved"
                : "Save place"
            }
          >
            <Bookmark
              size={15}
              className={
                isSaved
                  ? "fill-[#D4AF37] text-[#D4AF37]"
                  : "text-white/60"
              }
            />
          </button>
        </div>
      </div>
    </article>
  );
}