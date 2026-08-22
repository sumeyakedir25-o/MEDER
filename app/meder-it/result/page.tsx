 "use client";

import RecommendationFeedback from "@/components/meder/recommendation-feedback";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  Bookmark,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import {
  getRecommendations,
  type MederSelections,
} from "@/Lib/meder/matching";

import { mederPlaces } from "@/Lib/meder/places";

export default function MederResultsPage() {
  const [selections, setSelections] =
    useState<MederSelections | null>(null);
    const [savedPlaces, setSavedPlaces] = useState<string[]>([]);

  useEffect(() => {
    const saved = sessionStorage.getItem("meder-decision");
    const surprise = sessionStorage.getItem("meder-surprise");
    const storedSavedPlaces = localStorage.getItem("meder-saved-places");

    if (surprise === "true") {
      sessionStorage.removeItem("meder-surprise");
    }

    if (saved) {
      try {
        setSelections(JSON.parse(saved));
      } catch {
        setSelections({});
      }
    } else if (surprise === "true") {
      setSelections({});
    }
    if (storedSavedPlaces) {
  try {
    setSavedPlaces(JSON.parse(storedSavedPlaces));
  } catch {
    setSavedPlaces([]);
  }
}
  }, []);
  const toggleSavePlace = (placeId: string) => {
  setSavedPlaces((current) => {
    const updated = current.includes(placeId)
      ? current.filter((id) => id !== placeId)
      : [...current, placeId];

    localStorage.setItem(
      "meder-saved-places",
      JSON.stringify(updated),
    );

    return updated;
  });
};

  if (selections === null) {
    return (
      <main className="min-h-screen bg-black px-5 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
            MEDER IT
          </p>

          <h1 className="mt-4 font-serif text-3xl">
            Tell us what you're looking for.
          </h1>

          <p className="mt-3 text-sm text-white/50">
            Choose at least one preference or let MEDER surprise you.
          </p>

          <Link
            href="/meder-it"
            className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
          >
            Start MEDER IT
          </Link>
        </div>
      </main>
    );
  }

  const hasSelections = Object.values(selections).some(
    (values) => values && values.length > 0,
  );

  const results = hasSelections
    ? getRecommendations(selections, mederPlaces)
    : mederPlaces.map((place) => ({
        place,
        score: Math.round(place.rating * 20),
        reasons: [],
      }));

  const bestMatch = results[0];

  const alternative = results[1];

  const budgetOption = selections.budget?.length
    ? results.find(
        (result) =>
          result.place.budget.some((budget) =>
            selections.budget?.includes(budget),
          ) &&
          result.place.id !== bestMatch?.place.id &&
          result.place.id !== alternative?.place.id,
      )
    : undefined;

  const selected = Object.values(selections).flat();

  const whyReasons: string[] = [];

if (bestMatch) {
  if (selections.who?.length) {
    whyReasons.push(
      `Great for ${selections.who[0].toLowerCase()}`,
    );
  }

  if (selections.what?.length) {
    whyReasons.push(
      `Matches what you want: ${selections.what[0].toLowerCase()}`,
    );
  }

  if (selections.vibe?.length) {
    whyReasons.push(
      `Matches your ${selections.vibe[0].toLowerCase()} vibe`,
    );
  }

  if (selections.location?.length) {
    whyReasons.push(
      `Located in ${selections.location[0]}`,
    );
  }

  if (selections.budget?.length) {
    whyReasons.push(
      `Fits your ${selections.budget[0].toLowerCase()} budget`,
    );
  }

  if (selections.time?.length) {
    whyReasons.push(
      `Works for ${selections.time[0].toLowerCase()}`,
    );
  }
}

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <Link
          href="/meder-it"
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to MEDER IT
        </Link>

        {/* Surprise message */}
        {!hasSelections && bestMatch && (
          <section className="mb-6 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/10">
                <Sparkles className="h-5 w-5 text-[#D4AF37]" />
              </div>
 <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                  Surprise Me
                </p>

                <p className="mt-1 text-sm text-white/60">
                  You left it to MEDER. We picked a spot for you.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Decision summary */}
        {hasSelections && (
          <section className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                  MEDER understood
                </p>

                <h1 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
                  Your preferences
                </h1>
              </div>

              <Link
                href="/meder-it"
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/40 px-4 text-sm font-medium text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Edit choices
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {selected.map((value, index) => (
                <span
                  key={`${value}-${index}`}
                  className="rounded-full border border-white/10 bg-black/30 px-3.5 py-2 text-sm text-white/80"
                >
                  {value}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Results */}
        {bestMatch ? (
          <>
            {/* BEST MATCH */}
            <section className="mt-8">
              <div className="mb-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                  Your best match
                </p>

                <h2 className="mt-1 font-serif text-2xl text-white sm:text-3xl">
                  {hasSelections
                    ? "We found your spot."
                    : "Here's your surprise."}
                </h2>
              </div>

              <article className="overflow-hidden rounded-3xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/10 via-white/[0.04] to-black">
                <div className="grid lg:grid-cols-[1.1fr_1fr]">

                  {/* Image */}
                  <div className="relative min-h-[280px] overflow-hidden sm:min-h-[340px] lg:min-h-[430px]">
                    <img
                      src={bestMatch.place.image}
                      alt={bestMatch.place.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                    <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-4 py-2 text-xs font-bold text-black">
                      <span>🥇</span>
                      <span>Best Match</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10">
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#D4AF37]">
                      Recommended for you
                    </p>

                    <h3 className="mt-3 font-serif text-3xl text-white sm:text-4xl">
                      {bestMatch.place.name}
                    </h3>

                    <p className="mt-2 text-sm text-white/50">
                      {bestMatch.place.type}
                    </p>
 <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
                      <span className="flex items-center gap-2 text-white/70">
                        <MapPin className="h-4 w-4 text-[#D4AF37]" />
                        {bestMatch.place.area}
                      </span>

{/* ADD THESE */}
<span className="flex items-center gap-1.5 text-white/70">
  <span className="text-[#D4AF37]">↗</span>
  {bestMatch.place.distance}
</span>

<span className="flex items-center gap-1.5 text-white/70">
  <Clock className="h-4 w-4 text-[#D4AF37]" />
  {bestMatch.place.travelTime}
</span>

                      <span className="flex items-center gap-2 text-white/70">
                        <Star className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
                        {bestMatch.place.rating}

                        <span className="text-white/35">
                          ({bestMatch.place.reviews})
                        </span>
                      </span>
                    </div>

                    <div className="mt-7 flex items-end gap-3">
                      <span className="font-serif text-5xl leading-none text-[#D4AF37] sm:text-6xl">
                        {bestMatch.score}%
                      </span>

                      <span className="pb-1 text-sm text-white/45">
                        Match
                      </span>
                    </div>

                    {whyReasons.length > 0 && (
                      <div className="mt-6 rounded-2xl border border-[#D4AF37]/15 bg-black/20 p-4">
                        <h4 className="text-sm font-semibold text-white">
                          Why MEDER recommends this
                        </h4>

                        <div className="mt-3 space-y-2">
                          {whyReasons.slice(0, 5).map((reason) => (
                            <div
                              key={reason}
                              className="flex items-start gap-2 text-sm text-white/65"
                            >
                              <span className="text-[#D4AF37]">
                                ✓
                              </span>

                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!hasSelections && (
                      <p className="mt-4 text-sm leading-6 text-white/50">
                        MEDER picked this from the available places.
                        Try adding preferences if you want a more
                        personalized match.
                      </p>
                    )}

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
    <Link
  href={`/places/${bestMatch.place.id}`}
  className="mt-8 inline-flex min-h-12 w-fit items-center justify-center rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
>
  View Details
</Link>
  <button
    type="button"
    onClick={() => toggleSavePlace(bestMatch.place.id)}
    className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border px-6 text-sm font-semibold transition sm:w-fit ${
      savedPlaces.includes(bestMatch.place.id)
        ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
        : "border-white/15 text-white/70 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
    }`}
  >
    <Bookmark
      className="h-4 w-4"
      fill={
        savedPlaces.includes(bestMatch.place.id)
          ? "currentColor"
          : "none"
      }
    />

    {savedPlaces.includes(bestMatch.place.id) ? "Saved" : "Save"}
  </button>
</div>
</div>
                </div>
              </article>
            </section>

            <RecommendationFeedback
  placeId={bestMatch.place.id}
/>

            {/* OTHER OPTIONS */}
            {(alternative || budgetOption) && (
              <section className="mt-12">
                <div className="mb-5">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                    Your options
                  </p>

                  <h2 className="mt-1 font-serif text-2xl text-white sm:text-3xl">
                    Other spots you might love
                  </h2>

                  <p className="mt-2 text-sm text-white/45">
                    Great alternatives based on what you told MEDER.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">

                  {/* ALTERNATIVE */}
                  {alternative && (
                    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/35 hover:bg-white/[0.05]">
 <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={alternative.place.image}
                          alt={alternative.place.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        <div className="absolute left-3 top-3">
                          <span className="inline-flex rounded-full border border-white/15 bg-black/65 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                            🥈 Alternative
                          </span>
                        </div>

                        <div className="absolute bottom-3 right-3 rounded-full bg-[#D4AF37] px-3 py-1.5 text-sm font-bold text-black">
                          {alternative.score}% Match
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="font-serif text-xl text-white sm:text-2xl">
                          {alternative.place.name}
                        </h3>

                        <p className="mt-1 text-sm text-white/45">
                          {alternative.place.type}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/60">
                        <span className="flex items-center gap-1.5">
  <span className="text-[#D4AF37]">↗</span>
  {alternative.place.distance}
</span>

<span className="flex items-center gap-1.5">
  <Clock className="h-4 w-4 text-[#D4AF37]" />
  {alternative.place.travelTime}
</span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-[#D4AF37]" />
                            {alternative.place.area}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Star className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
                            {alternative.place.rating}

                            <span className="text-white/35">
                              ({alternative.place.reviews})
                            </span>
                          </span>
                        </div>

                        {alternative.reasons.length > 0 && (
                          <div className="mt-4 border-t border-white/10 pt-4">
                            <p className="text-xs text-white/40">
                              Why it matches
                            </p>

                            <p className="mt-1 text-sm text-white/65">
                              {alternative.reasons
                                .slice(0, 2)
                                .join(" · ")}
                            </p>
                          </div>
                        )}

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
  
    <Link
  href={`/places/${alternative.place.id}`}
 className="mt-8 inline-flex min-h-10 w-fit items-center justify-center rounded-xl border border-[#D4AF37]/40 px-5 text-sm font-medium text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
>
  View Details
</Link>

  <button
    type="button"
    onClick={() => toggleSavePlace(alternative.place.id)}
    className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-medium transition ${
      savedPlaces.includes(alternative.place.id)
        ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
        : "border-white/15 text-white/70 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
    }`}
  >
    <Bookmark
      className="h-4 w-4"
      fill={
        savedPlaces.includes(alternative.place.id)
          ? "currentColor"
          : "none"
      }
    />

    {savedPlaces.includes(alternative.place.id) ? "Saved" : "Save"}
  </button>
</div>
                      </div>
                    </article>
                  )}

                  {/* BUDGET OPTION */}
                  {budgetOption && (
                    <article className="group overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.04] transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/50">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={budgetOption.place.image}
                          alt={budgetOption.place.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
 <div className="absolute left-3 top-3">
                          <span className="inline-flex rounded-full bg-[#D4AF37] px-3 py-1.5 text-xs font-semibold text-black">
                            💰 Budget Option
                          </span>
                        </div>

                        <div className="absolute bottom-3 right-3 rounded-full border border-white/15 bg-black/70 px-3 py-1.5 text-sm font-bold text-[#D4AF37] backdrop-blur-md">
                          {budgetOption.score}% Match
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="font-serif text-xl text-white sm:text-2xl">
                          {budgetOption.place.name}
                        </h3>

                        <p className="mt-1 text-sm text-white/45">
                          {budgetOption.place.type}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/60">
                        <span className="flex items-center gap-1.5">
  <span className="text-[#D4AF37]">↗</span>
  {budgetOption.place.distance}
</span>

<span className="flex items-center gap-1.5">
  <Clock className="h-4 w-4 text-[#D4AF37]" />
  {budgetOption.place.travelTime}
</span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-[#D4AF37]" />
                            {budgetOption.place.area}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Star className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
                            {budgetOption.place.rating}

                            <span className="text-white/35">
                              ({budgetOption.place.reviews})
                            </span>
                          </span>
                        </div>

                        {budgetOption.reasons.length > 0 && (
                          <div className="mt-4 border-t border-white/10 pt-4">
                            <p className="text-xs text-white/40">
                              Why it matches
                            </p>

                            <p className="mt-1 text-sm text-white/65">
                              {budgetOption.reasons
                                .slice(0, 2)
                                .join(" · ")}
                            </p>
                          </div>
                        )}

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
  
    <Link
  href={`/places/${budgetOption.place.id}`}
  className="mt-5 inline-flex min-h-10 w-fit items-center justify-center rounded-xl border border-[#D4AF37]/40 px-5 text-sm font-medium text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
>
  View Details
</Link>
  

  <button
    type="button"
    onClick={() => toggleSavePlace(budgetOption.place.id)}
    className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-medium transition ${
      savedPlaces.includes(budgetOption.place.id)
        ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
        : "border-white/15 text-white/70 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
    }`}
  >
    <Bookmark
      className="h-4 w-4"
      fill={
        savedPlaces.includes(budgetOption.place.id)
          ? "currentColor"
          : "none"
      }
    />

    {savedPlaces.includes(budgetOption.place.id)
      ? "Saved"
      : "Save"}
  </button>
</div>
                      </div>
                    </article>
                  )}
                </div>
              </section>
            )}
          </>
        ) : (
          <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <h2 className="font-serif text-2xl text-white">
              We couldn't find a match yet.
            </h2>

            <p className="mt-2 text-sm text-white/50">
              Try changing one of your choices.
            </p>

            <Link
              href="/meder-it"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black"
            >
              Edit choices
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}