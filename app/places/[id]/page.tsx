 "use client";

import ExperienceTagSummary from "@/components/meder/ExperienceTagSummary";
import ExperienceCards from "@/components/meder/ExperienceCards";
import ExperienceSubmission from "@/components/meder/ExperienceSubmission";
import MederMap from "@/components/meder/MederMap";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  MapPin,
  Phone,
  MessageCircle,
  Play,
  Star,
  ShieldCheck,
  Flag,
  X,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/Lib/supabase/client";

type PlaceMedia = {
  id: string;
  media_type: "image" | "video";
  title: string | null;
  url: string;
  thumbnail_url: string | null;
  alt_text: string | null;
  sort_order: number;
  is_cover: boolean;
  is_featured: boolean;
};

type PlaceMenuItem = {
  name: string;
  category?: string;
  price?: number | string;
  description?: string;
  available?: boolean;
};

type PlacePhoto = {
  url: string;
  alt?: string;
};

type PlaceVideo = {
  title?: string;
  url: string;
  thumbnail_url?: string;
};

type OpeningHour = {
  day: string;
  open?: string;
  close?: string;
  closed?: boolean;
};

type RelatedPlace = {
  id: string;
  name: string;
  type: string;
  area: string;
  image: string;
  rating: number;
  reviews: number;
  cuisine: string[];
  experiences: string[];
  vibe: string[];
  budget: string[];
};

function normalizeValue(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function hasOverlap(
  first: string[],
  second: string[]
) {
  const normalizedFirst = first.map(normalizeValue);
  const normalizedSecond = second.map(normalizeValue);

  return normalizedFirst.some((value) =>
    normalizedSecond.includes(value)
  );
}

function calculateRelatedScore(
  current: RelatedPlace,
  candidate: RelatedPlace
) {
  let score = 0;

  if (
    current.area &&
    candidate.area &&
    normalizeValue(current.area) ===
      normalizeValue(candidate.area)
  ) {
    score += 30;
  }

  if (
    current.type &&
    candidate.type &&
    normalizeValue(current.type) ===
      normalizeValue(candidate.type)
  ) {
    score += 25;
  }

  if (
    current.cuisine.length > 0 &&
    candidate.cuisine.length > 0 &&
    hasOverlap(current.cuisine, candidate.cuisine)
  ) {
    score += 15;
  }

  if (
    current.experiences.length > 0 &&
    candidate.experiences.length > 0 &&
    hasOverlap(current.experiences, candidate.experiences)
  ) {
    score += 15;
  }

  if (
    current.vibe.length > 0 &&
    candidate.vibe.length > 0 &&
    hasOverlap(current.vibe, candidate.vibe)
  ) {
    score += 10;
  }

  if (
    current.budget.length > 0 &&
    candidate.budget.length > 0 &&
    hasOverlap(current.budget, candidate.budget)
  ) {
    score += 5;
  }

  return score;
}

function getRelatedPlaceData(data: any): RelatedPlace {
  const practical = data.practical_data || {};
  const experiences = Array.isArray(data.experiences)
    ? data.experiences
    : [];

  const experienceTags = experiences
    .filter((item: string) =>
      item.startsWith("Experience:")
    )
    .map((item: string) =>
      item.replace("Experience:", "").trim()
    );

  const purposeTags = experiences
    .filter((item: string) =>
      item.startsWith("Purpose:")
    )
    .map((item: string) =>
      item.replace("Purpose:", "").trim()
    );

  const vibeTags = experiences
    .filter((item: string) =>
      item.startsWith("Vibe:")
    )
    .map((item: string) =>
      item.replace("Vibe:", "").trim()
    );

  const budget: string[] = [];

  const spendMin = Number(practical.spend_min || 0);
  const spendMax = Number(practical.spend_max || 0);
  const priceLevel = Number(data.price_level || 0);

  if (spendMin || spendMax) {
    if (spendMin < 500 || (spendMax > 0 && spendMax <= 500)) {
      budget.push("Under 500 ETB");
    }

    if (
      (spendMin <= 1000 && spendMax >= 500) ||
      (spendMin >= 500 && spendMin <= 1000)
    ) {
      budget.push("500–1,000 ETB");
    }

    if (
      (spendMin <= 2000 && spendMax >= 1000) ||
      (spendMin >= 1000 && spendMin <= 2000)
    ) {
      budget.push("1,000–2,000 ETB");
    }

    if (spendMax >= 2000 || spendMin >= 2000) {
      budget.push("2,000+ ETB");
    }
  } else {
    if (priceLevel === 1) {
      budget.push("Under 500 ETB");
    }

    if (priceLevel === 2) {
      budget.push("500–1,000 ETB");
    }

    if (priceLevel === 3) {
      budget.push("1,000–2,000 ETB");
    }

    if (priceLevel === 4) {
      budget.push("2,000+ ETB");
    }
  }

  return {
    id: data.id,
    name: data.name || "Unnamed place",
    type: data.type || "data.category",
    area: data.area || "",
    image:
      data.cover_image ||
      data.photos?.[0] ||
      "",
    rating: Number(data.rating || 0),
    reviews: Number(data.reviews || 0),
    cuisine: Array.isArray(data.cuisines)
      ? data.cuisines
      : [],
    experiences: [
      ...purposeTags,
      ...experienceTags,
    ],
    vibe: vibeTags,
    budget,
  };
}

export default function PlaceDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const supabase = createClient();

  const [place, setPlace] = useState<any>(null);
const [placeLoading, setPlaceLoading] = useState(true);

  const cuisine = place?.cuisine ?? [];
const menu = place?.menu ?? [];
const amenities = place?.amenities ?? [];
const payment = place?.payment ?? [];
const openingHours = place?.openingHours ?? [];

  const [experienceOpen, setExperienceOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [activePhoto, setActivePhoto] = useState(0);

  const [media, setMedia] = useState<PlaceMedia[]>([]);
  const [mediaLoading, setMediaLoading] = useState(true);
  const [relatedPlaces, setRelatedPlaces] = useState<
  RelatedPlace[]
>([]);
const [relatedLoading, setRelatedLoading] = useState(true);

  /*
   * Load MEDER media from Supabase.
   *
   * The old local place.photos array remains as a fallback.
   */
  useEffect(() => {
  async function loadPlace() {
    setPlaceLoading(true);

    const { data, error } = await supabase
      .from("places")
      .select("*")
      .eq("id", id)
      .eq("status", "published")
      .single();

    if (error || !data) {
  console.error("Failed to load place:", error);
  setPlace(null);
} else {
  const practical = data.practical_data || {};

  const experiences = data.experiences || [];

  const purposes = experiences
    .filter((item: string) => item.startsWith("Purpose:"))
    .map((item: string) => item.replace("Purpose:", "").trim());

  const audiences = experiences
    .filter((item: string) => item.startsWith("Audience:"))
    .map((item: string) => item.replace("Audience:", "").trim());

  const experienceTags = experiences
    .filter((item: string) => item.startsWith("Experience:"))
    .map((item: string) => item.replace("Experience:", "").trim());

  const vibes = experiences
    .filter((item: string) => item.startsWith("Vibe:"))
    .map((item: string) => item.replace("Vibe:", "").trim());

  setPlace({
    ...data,

    // MEDER discovery data
    cuisine: data.cuisines || [],
    what: purposes,
    who: audiences,
    vibe: vibes,

    // Practical information
    amenities: practical.amenities || [],
    payment: practical.payment_methods || [],

    // Budget
    budget:
      practical.spend_min || practical.spend_max
        ? [
            practical.spend_min
              ? `${practical.spend_min} ETB+`
              : "",
            practical.spend_max
              ? `${practical.spend_max} ETB max`
              : "",
          ].filter(Boolean)
        : [],

    // Contact
    phone: data.phone || "",
    whatsapp: data.whatsapp || "",

    // Media
    image: data.cover_image || "",
    photos: data.photos || [],

    // Trust
    verified:
      data.verification_status === "MEDER Verified" ||
      data.verification_status === "Business Verified",

    lastVerified: data.updated_at || null,

    // Keep existing UI compatible
    rating: data.rating || 0,
    reviews: data.reviews || 0,

    // Existing data if available
    menu: data.menu || [],
    openingHours: data.openingHours || [],
    communityVideos: data.communityVideos || [],
  });
}

    setPlaceLoading(false);
  }

  loadPlace();
}, [id]);
  useEffect(() => {
    async function loadMedia() {
      if (!place) {
        setMediaLoading(false);
        return;
      }

      setMediaLoading(true);

      const { data, error } = await supabase
        .from("place_media")
        .select(
          "id, media_type, title, url, thumbnail_url, alt_text, sort_order, is_cover, is_featured"
        )
        .eq("place_id", place.id)
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Failed to load place media:", error);
        setMedia([]);
        setMediaLoading(false);
        return;
      }

      setMedia((data || []) as PlaceMedia[]);
      setMediaLoading(false);
    }

    loadMedia();
  }, [place]);

  useEffect(() => {
  async function loadRelatedPlaces() {
    if (!place) {
      setRelatedPlaces([]);
      setRelatedLoading(false);
      return;
    }

    setRelatedLoading(true);

    const { data, error } = await supabase
      .from("places")
      .select(
        "id, name, type, category, area, cuisines, experiences, price_level, practical_data, cover_image, photos, rating, reviews"
      )
      .eq("status", "published")
      .neq("id", place.id);

    if (error) {
      console.error(
        "Failed to load related places:",
        error
      );
      setRelatedPlaces([]);
      setRelatedLoading(false);
      return;
    }

    const currentPlace = getRelatedPlaceData(place);

    const scoredPlaces = (data || [])
      .map((item: any) => {
        const candidate = getRelatedPlaceData(item);

        return {
          place: candidate,
          score: calculateRelatedScore(
            currentPlace,
            candidate
          ),
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        if (b.place.rating !== a.place.rating) {
          return b.place.rating - a.place.rating;
        }

        return b.place.name.localeCompare(
          a.place.name
        );
      })
      .slice(0, 3);

    setRelatedPlaces(
      scoredPlaces.map((item) => item.place)
    );

    setRelatedLoading(false);
  }

  loadRelatedPlaces();
}, [place]);

  /*
   * Current time
   */
  useEffect(() => {
    setCurrentTime(new Date());

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  /*
   * Load saved state
   */
  useEffect(() => {
    if (!place) return;

    try {
      const savedPlaces = JSON.parse(
        localStorage.getItem("meder-saved-places") || "[]"
      );

      setSaved(savedPlaces.includes(place.id));
    } catch {
      setSaved(false);
    }
  }, [place]);

  /*
   * Reset active photo whenever place changes
   */
  useEffect(() => {
    setActivePhoto(0);
  }, [id]);

  /*
   * If the current photo becomes unavailable,
   * reset to the first photo.
   */
  useEffect(() => {
    setActivePhoto(0);
  }, [media.length]);

  /*
   * Media from Supabase.
   */
  const supabaseImages = useMemo(() => {
    return media
      .filter((item) => item.media_type === "image")
      .sort((a, b) => {
        if (a.is_cover !== b.is_cover) {
          return a.is_cover ? -1 : 1;
        }

        return a.sort_order - b.sort_order;
      });
  }, [media]);

  /*
   * Use Supabase images first.
   * Fall back to the old local images.
   */
  const galleryImages = useMemo(() => {
    if (supabaseImages.length > 0) {
      return supabaseImages.map((item) => ({
        url: item.url,
        alt: item.alt_text || place?.name ||  "MEDER place photo",
        title: item.title || "",
      }));
    }

    if (place?.photos && place.photos.length > 0) {
      return place.photos.map((photo :string) => ({
        url: photo,
        alt: place.name,
        title: "",
      }));
    }
 if (place?.image) {
      return [
        {
          url: place.image,
          alt: place.name,
          title: "",
        },
      ];
    }

    return [];
  }, [supabaseImages, place]);

  /*
   * Cover image:
   * 1. Supabase cover
   * 2. First Supabase image
   * 3. Old place.cover_image if available
   * 4. Old place.photos[0]
   * 5. Old place.image
   */
  const coverImage = useMemo(() => {
    const supabaseCover =
      media.find(
        (item) =>
          item.media_type === "image" && item.is_cover
      )?.url;

    if (supabaseCover) {
      return supabaseCover;
    }

    if (supabaseImages[0]?.url) {
      return supabaseImages[0].url;
    }

    const oldPlace = place as typeof place & {
      cover_image?: string;
    };

    if (oldPlace?.cover_image) {
      return oldPlace.cover_image;
    }

    if (place?.photos?.[0]) {
      return place.photos[0];
    }

    return place?.image || "";
  }, [media, supabaseImages, place]);
  {/* Report this place */}
            <section className="mt-10 border-t border-white/10 pt-8">
              <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-white">
                    Something not right?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/40">
                    Help us keep MEDER accurate by reporting incorrect or
                    outdated information.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setReportOpen(true);
                    setReportSubmitted(false);
                  }}
                  className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-medium text-white/60 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                >
                  <Flag className="h-4 w-4" />
                  Report this place
                </button>
              </div>
            </section>

  

  /*
   * Place not found
   */
  if (placeLoading) {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-white/50">Loading place...</p>
    </main>
  );
}

if (!place) {
    return (
      <main className="min-h-screen bg-black px-5 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-3xl">
            Place not found
          </h1>

          <p className="mt-3 text-sm text-white/50">
            We couldn't find this place in MEDER.
          </p>

          <Link
            href="/discover"
            className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black"
          >
            Back to Discover
          </Link>
        </div>
      </main>
    );
  }

  /*
   * Opening hours
   */
  const dayFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "Africa/Addis_Ababa",
  });

  const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Addis_Ababa",
  });

  const todayName = currentTime
    ? dayFormatter.format(currentTime)
    : "";

  const currentTimeText = currentTime
    ? timeFormatter.format(currentTime)
    : "";

  const currentMinutes = currentTimeText
    ? Number(currentTimeText.split(":")[0]) * 60 +
      Number(currentTimeText.split(":")[1])
    : 0;

  const todayHours = place.openingHours?.find(
    (item :any) => item.day === todayName
  );

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);

    return hours * 60 + minutes;
  };

  let isOpen = false;

  if (todayHours && currentTime) {
    const openMinutes = timeToMinutes(todayHours.open);

    let closeMinutes = timeToMinutes(todayHours.close);

    if (closeMinutes === 0) {
      closeMinutes = 24 * 60;
    }

    isOpen =
      currentMinutes >= openMinutes &&
      currentMinutes < closeMinutes;
  }

  /*
   * Save place
   */
  const handleSave = () => {
    try {
      const savedPlaces = JSON.parse(
        localStorage.getItem("meder-saved-places") || "[]"
      );

      if (saved) {
        const updated = savedPlaces.filter(
          (savedId: string) => savedId !== place.id
        );

        localStorage.setItem(
          "meder-saved-places",
          JSON.stringify(updated)
        );

        setSaved(false);
      } else {
        if (!savedPlaces.includes(place.id)) {
          savedPlaces.push(place.id);
        }

        localStorage.setItem(
          "meder-saved-places",
          JSON.stringify(savedPlaces)
        );

        setSaved(true);
      }
    } catch {
      console.error("Could not update saved places.");
    }
  };
  const handleReportSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!reportReason || reportSubmitting) {
      return;
    }

    setReportSubmitting(true);

    const { error } = await supabase
      .from("place_reports")
      .insert({
        place_id: place.id,
        reason: reportReason,
        details: reportDetails.trim() || null,
      });

    if (error) {
      console.error("Report submission failed:", error);
      alert(`We couldn't submit your report: ${error.message}`);
      setReportSubmitting(false);
      return;
    }

    setReportSubmitting(false);
    setReportSubmitted(true);
  };
 /*
   * Current active image
   */
  const activeImage =
    galleryImages[activePhoto]?.url || coverImage;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Discover
        </Link>

        {/* Hero */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">

          {/* Photo Gallery */}
          <div className="p-3 sm:p-4">

            {/* Main photo */}
            <div className="relative h-[320px] overflow-hidden rounded-2xl sm:h-[450px]">

              {activeImage ? (
                <img
                  src={activeImage}
                  alt={
                    galleryImages[activePhoto]?.alt ||
                    place.name
                  }
                  className="h-full w-full object-cover transition duration-500"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/[0.03]">
                  <div className="text-center">
                    <p className="text-sm text-white/30">
                      No image available
                    </p>
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              {/* Place type */}
              <div className="absolute left-4 top-4">
                <span className="rounded-full bg-[#D4AF37] px-4 py-2 text-xs font-bold text-black">
                  {place.type}
                </span>
              </div>

              {/* Photo count */}
              {galleryImages.length > 0 && (
                <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-2 text-xs text-white backdrop-blur-md">
                  {activePhoto + 1} / {galleryImages.length}
                </div>
              )}

              {mediaLoading && (
                <div className="absolute bottom-4 left-4 rounded-full bg-black/70 px-3 py-2 text-xs text-white/50 backdrop-blur-md">
                  Loading gallery...
                </div>
              )}
            </div>

            {/* Photo thumbnails */}
            {galleryImages.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {galleryImages
                  .slice(0, 6)
                  .map((photo :PlacePhoto, index :number) => (
                    <button
                      key={`${photo.url}-${index}`}
                      type="button"
                      onClick={() =>
                        setActivePhoto(index)
                      }
                      className={`relative h-20 overflow-hidden rounded-xl border transition sm:h-24 ${
                        activePhoto === index
                          ? "border-[#D4AF37] ring-1 ring-[#D4AF37]"
                          : "border-white/10 hover:border-white/30"
                      }`}
                      aria-label={`View photo ${
                        index + 1
                      } of ${place.name}`}
                    >
                      <img
                        src={photo.url}
                        alt={
                          photo.alt ||
                          `${place.name} photo ${
                            index + 1
                          }`
                        }
                        className="h-full w-full object-cover"
                      />

                      {activePhoto === index && (
                        <div className="absolute inset-0 bg-[#D4AF37]/10" />
                      )}
                    </button>
                  ))}
              </div>
            )}
          </div>
{/* Main information */}
          <div className="p-5 sm:p-8">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

              <div>
                <h1 className="font-serif text-3xl text-white sm:text-5xl">
                  {place.name}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/60">

                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#D4AF37]" />
                    {place.area}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />

                    {place.rating}

                    <span className="text-white/35">
                      ({place.reviews} reviews)
                    </span>
                  </span>

                </div>
              </div>

              {/* Save button */}
              <button
                type="button"
                onClick={handleSave}
                aria-label={
                  saved
                    ? "Remove from saved places"
                    : "Save place"
                }
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-medium transition ${
                  saved
                    ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                    : "border-white/10 text-white/70 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                }`}
              >
                <Bookmark
                  className={`h-4 w-4 ${
                    saved ? "fill-current" : ""
                  }`}
                />

                {saved ? "Saved" : "Save Place"}
              </button>

            </div>

            {/* Quick facts */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3">

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Location
                </p>

                <p className="mt-2 text-sm text-white/80">
                  {place.area}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Budget
                </p>

                <p className="mt-2 text-sm text-white/80">
                  {place.budget.join(" · ")}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Best for
                </p>

                <p className="mt-2 text-sm text-white/80">
                  {place.who.join(" · ")}
                </p>
              </div>

            </div>

            {/* Freshness / verification */}
            {(place.verified || place.lastVerified) && (
              <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-start gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">

                      <h2 className="font-medium text-white">
                        Information freshness
                      </h2>

                      {place.verified && (
                        <span className="rounded-full bg-[#D4AF37]/10 px-2.5 py-1 text-xs font-medium text-[#D4AF37]">
                          Verified
                        </span>
                      )}

                    </div>
 <p className="mt-2 text-sm text-white/50">
                      {place.lastVerified
                        ? `Place information was last checked on ${new Date(
                            place.lastVerified
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}.`
                        : "Some information about this place has been checked by MEDER."}
                    </p>
                  </div>

                </div>
              </section>
            )}

            {/* Vibe */}
            <div className="mt-8">

              <h2 className="font-serif text-2xl text-white">
                The vibe
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {place.vibe.map((item :any) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-3.5 py-2 text-xs text-[#D4AF37]"
                  >
                    {item}
                  </span>
                ))}
              </div>

            </div>

            {/* What you can do */}
            <div className="mt-8">

              <h2 className="font-serif text-2xl text-white">
                What you can do
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {place.what.map((item :any) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white/65"
                  >
                    {item}
                  </span>
                ))}
              </div>

            </div>

            {/* About */}
            {place.description && (
              <section className="mt-10 border-t border-white/10 pt-8">

                <h2 className="font-serif text-2xl text-white">
                  About this place
                </h2>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-white/60 sm:text-base">
                  {place.description}
                </p>

              </section>
            )}

            {/* Place details */}
            {(place.cuisine?.length ||
              place.amenities?.length ||
              place.payment?.length) && (
              <section className="mt-8 grid gap-4 md:grid-cols-3">

                {/* Cuisine */}
                {cuisine.length > 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                    <h3 className="font-serif text-lg text-white">
                      Food & specialties
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {cuisine.map((item :any) => (
                        <span
                          key={item}
                          className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-3 py-1.5 text-xs text-[#D4AF37]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                  </div>
                )}

                {/* Menu */}
                {menu.length > 0 && (
                  <section className="mt-10 border-t border-white/10 pt-8 md:col-span-3">

                    <div className="flex flex-wrap items-end justify-between gap-4">

                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                          Food & drinks
                        </p>

                        <h2 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
                          Menu
                        </h2>
                      </div>

                      <span className="text-xs text-white/40">
                        Sample menu
                      </span>
 </div>

                    <div className="mt-6 space-y-6">
                      {menu.map((category :any) => (
                        <div
                          key={category.category}
                          className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                        >

                          <div className="border-b border-white/10 bg-black/20 px-5 py-4">
                            <h3 className="font-serif text-xl text-white">
                              {category.category}
                            </h3>
                          </div>

                          <div className="divide-y divide-white/10">
                            {category.items.map((item :any) => (
                              <div
                                key={item.name}
                                className="flex items-start justify-between gap-5 px-5 py-4"
                              >

                                <div>
                                  <h4 className="text-sm font-medium text-white">
                                    {item.name}
                                  </h4>

                                  {item.description && (
                                    <p className="mt-1 text-xs leading-5 text-white/45">
                                      {item.description}
                                    </p>
                                  )}
                                </div>

                                <span className="shrink-0 font-medium text-[#D4AF37]">
                                  {item.price} ETB
                                </span>

                              </div>
                            ))}
                          </div>

                        </div>
                      ))}
                    </div>

                    <p className="mt-4 text-xs text-white/35">
                      Menu items and prices may change. Please confirm with the business before visiting.
                    </p>

                  </section>
                )}

                {/* Amenities */}
                {amenities.length > 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                    <h3 className="font-serif text-lg text-white">
                      Amenities
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {amenities.map((item :any) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/65"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                  </div>
                )}

                {/* Payment */}
                {payment.length > 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                    <h3 className="font-serif text-lg text-white">
                      Payment
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {payment.map((item :any) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/65"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                  </div>
                )}

              </section>
            )}

            {/* Opening Hours */}
            {openingHours.length > 0 && (
              <section className="mt-10 border-t border-white/10 pt-8">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
 <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                      Plan your visit
                    </p>

                    <h2 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
                      Opening hours
                    </h2>
                  </div>

                  {currentTime && (
                    <div
                      className={`inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium ${
                        isOpen
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isOpen
                            ? "bg-green-400"
                            : "bg-red-400"
                        }`}
                      />

                      {isOpen ? "Open now" : "Closed now"}
                    </div>
                  )}

                </div>

                {/* Today's hours */}
                {todayHours && (
                  <div className="mt-6 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5">

                    <p className="text-xs uppercase tracking-wider text-white/40">
                      Today
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-4">

                      <span className="font-medium text-white">
                        {todayHours.day}
                      </span>

                      <span className="text-[#D4AF37]">
                        {todayHours.open} – {todayHours.close}
                      </span>

                    </div>
                  </div>
                )}

                {/* Weekly hours */}
                <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

                  {openingHours.map((item :any) => {
                    const isToday = item.day === todayName;

                    return (
                      <div
                        key={item.day}
                        className={`flex items-center justify-between border-b border-white/10 px-5 py-4 last:border-b-0 ${
                          isToday ? "bg-[#D4AF37]/5" : ""
                        }`}
                      >

                        <span
                          className={
                            isToday
                              ? "font-medium text-[#D4AF37]"
                              : "text-sm text-white/70"
                          }
                        >
                          {item.day}
                        </span>

                        <span
                          className={
                            isToday
                              ? "font-medium text-[#D4AF37]"
                              : "text-sm text-white/50"
                          }
                        >
                          {item.open} – {item.close}
                        </span>

                      </div>
                    );
                  })}

                </div>

                <p className="mt-4 text-xs text-white/35">
                  Opening hours may change. Please confirm with the business before visiting.
                </p>

              </section>
            )}

            {/* Location */}
            <section className="mt-10 border-t border-white/10 pt-8">

              <div className="mb-5">

                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                  Location
                </p>

                <h2 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
                  Find this place
                </h2>

                <p className="mt-2 text-sm text-white/45">
                  {place.area}
                </p>

              </div>
 <div className="overflow-hidden rounded-2xl border border-white/10">

                {place.latitude !== undefined &&
                  place.longitude !== undefined && (
                    <MederMap
                      latitude={place.latitude}
                      longitude={place.longitude}
                      placeName={place.name}
                    />
                  )}

              </div>

            </section>

            {/* Contact */}
            {(place.phone || place.whatsapp) && (
              <section className="mt-10 border-t border-white/10 pt-8">

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                    Contact
                  </p>

                  <h2 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
                    Get in touch
                  </h2>

                  <p className="mt-2 text-sm text-white/45">
                    Contact the place directly before your visit.
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                  {place.phone && (
                    <a
                      href={`tel:${place.phone}`}
                      className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 text-sm font-medium text-white transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                    >
                      <Phone className="h-4 w-4" />
                      Call
                    </a>
                  )}

                  {place.whatsapp && (
                    <a
                      href={`https://wa.me/${place.whatsapp.replace(
                        /\D/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </a>
                  )}

                </div>

              </section>
            )}

            {/* Community videos */}
            {place.communityVideos &&
              place.communityVideos.length > 0 && (
                <section className="mt-10 border-t border-white/10 pt-8">

                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                      Community videos
                    </p>

                    <h2 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
                      See the experience
                    </h2>

                    <p className="mt-2 text-sm text-white/45">
                      Watch videos shared by people who visited this place.
                    </p>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">

                    {place.communityVideos.map((video :any) => (
                      <a
                        key={video.url}
                        href={video.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex min-h-20 items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5"
                      >

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/10 text-[#D4AF37] transition group-hover:bg-[#D4AF37] group-hover:text-black">
                          <Play className="h-4 w-4 fill-current" />
                        </div>
<div className="min-w-0">
                          <p className="text-sm font-medium text-white">
                            {video.title}
                          </p>

                          <p className="mt-1 text-xs text-white/40">
                            Watch community video
                          </p>
                        </div>

                      </a>
                    ))}

                  </div>

                </section>
              )}

            {/* Share experience */}
            <button
              type="button"
              onClick={() => setExperienceOpen(true)}
              className="mt-10 w-full rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5 text-left transition hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10"
            >

              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                Visited this place?
              </p>

              <div className="mt-2 flex items-center justify-between gap-4">

                <div>
                  <h2 className="font-serif text-xl text-white">
                    Share your experience
                  </h2>

                  <p className="mt-1 text-sm text-white/45">
                    Help others know what this place is really like.
                  </p>
                </div>

                <span className="shrink-0 rounded-xl bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black">
                  Share
                </span>

              </div>

            </button>

            {/* Experiences */}
            <section className="mt-10 border-t border-white/10 pt-8">

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                  Community experience
                </p>

                <h2 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
                  What people loved
                </h2>

                <p className="mt-2 text-sm text-white/45">
                  Real experiences shared by people who visited this place.
                </p>
              </div>

              <ExperienceTagSummary placeId={place.id} />

              <ExperienceCards placeId={place.id} />

            </section>

            {/* Related places */}
            {relatedPlaces.length > 0 && (
              <section className="mt-12 border-t border-white/10 pt-10">

                <div className="flex items-end justify-between gap-4">

                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                      You might also like
                    </p>

                    <h2 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
                      More places to explore
                    </h2>

                    <p className="mt-2 text-sm text-white/45">
                      Similar places you might enjoy.
                    </p>
                  </div>

                  <Link
                    href="/discover"
                    className="hidden text-sm font-medium text-[#D4AF37] transition hover:text-[#E5C158] sm:block"
                  >
                    See all →
                  </Link>

                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                  {relatedPlaces.map((relatedPlace) => (
                    <Link
                      key={relatedPlace.id}
                      href={`/places/${relatedPlace.id}`}
                      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:bg-white/[0.05]"
                    >

                      <div className="relative aspect-[16/10] overflow-hidden">
 <img
                          src={relatedPlace.image}
                          alt={relatedPlace.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white backdrop-blur-md">

                          <Star className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />

                          {relatedPlace.rating}

                        </div>

                      </div>

                      <div className="p-4">

                        <h3 className="font-serif text-xl text-white">
                          {relatedPlace.name}
                        </h3>

                        <p className="mt-1 text-sm text-white/45">
                          {relatedPlace.type}
                        </p>

                        <div className="mt-3 flex items-center gap-1.5 text-sm text-white/55">

                          <MapPin className="h-4 w-4 text-[#D4AF37]" />

                          {relatedPlace.area}

                        </div>

                      </div>

                    </Link>
                  ))}

                </div>

                <Link
                  href="/discover"
                  className="mt-5 inline-flex text-sm font-medium text-[#D4AF37] sm:hidden"
                >
                  See all →
                </Link>

              </section>
            )}

          </div>
        </section>
      </div>

      {/* Experience modal */}
      {experienceOpen && (
        <ExperienceSubmission
          placeId={place.id}
          placeName={place.name}
          onClose={() => setExperienceOpen(false)}
        />
      )}
      {/* Report modal */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#080808] p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setReportOpen(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-white/40 transition hover:bg-white/5 hover:text-white"
              aria-label="Close report form"
            >
              <X className="h-5 w-5" />
            </button>

            {reportSubmitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37]/10">
                  <CheckCircle2 className="h-7 w-7 text-[#D4AF37]" />
                </div>

                <p className="mt-5 text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                  Report received
                </p>

                <h2 className="mt-2 font-serif text-2xl text-white">
                  Thank you for helping MEDER
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/45">
                  We'll review the information and make corrections when
                  needed.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setReportOpen(false);
                    setReportReason("");
                    setReportDetails("");
                    setReportSubmitted(false);
                  }}
                  className="mt-6 min-h-11 rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="pr-8">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                    Help keep MEDER accurate
                  </p>

                  <h2 className="mt-2 font-serif text-2xl text-white">
                    Report this place
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-white/45">
                    What information about {place.name} needs attention?
                  </p>
                </div>

                <form
                  onSubmit={handleReportSubmit}
                  className="mt-7"
                >
                  <label
                    htmlFor="report-reason"
                    className="text-sm font-medium text-white/80"
                  >
                    What’s wrong?
                  </label>

                  <select
                    id="report-reason"
                    value={reportReason}
                    onChange={(event) =>
                      setReportReason(event.target.value)
                    }
                    required
                    className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black px-4 text-sm text-white outline-none focus:border-[#D4AF37]/50"
                  >
                    <option value="" disabled>
                      Select a reason
                    </option>

                    <option value="Incorrect information">
                      Incorrect information
                    </option>

                    <option value="Place is closed">
                      Place is closed
                    </option>

                    <option value="Wrong location">
                      Wrong location
                    </option>

                    <option value="Wrong contact information">
                      Wrong contact information
                    </option>

                    <option value="Outdated menu or prices">
                      Outdated menu or prices
                    </option>
                    <option value="Inappropriate content">
                      Inappropriate content
                    </option>

                    <option value="Duplicate place">
                      Duplicate place
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>

                  <label
                    htmlFor="report-details"
                    className="mt-5 block text-sm font-medium text-white/80"
                  >
                    Tell us more
                    <span className="ml-1 text-white/30">
                      (optional)
                    </span>
                  </label>

                  <textarea
                    id="report-details"
                    value={reportDetails}
                    onChange={(event) =>
                      setReportDetails(event.target.value)
                    }
                    rows={4}
                    placeholder="Tell us what needs to be corrected..."
                    className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37]/50"
                  />

                  <button
                    type="submit"
                    disabled={reportSubmitting}
                    className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#E5C158] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Flag className="h-4 w-4" />
                    {reportSubmitting
                      ? "Submitting..."
                      : "Submit report"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}