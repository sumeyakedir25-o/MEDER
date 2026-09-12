 "use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  MapPin,
  SlidersHorizontal,
  Wallet,
} from "lucide-react";

interface Preferences {
  budget: string;
  areas: string[];
  placeTypes: string[];
  experiences: string[];
}

const defaultPreferences: Preferences = {
  budget: "",
  areas: [],
  placeTypes: [],
  experiences: [],
};

const budgetOptions = [
  "Budget friendly",
  "Moderate",
  "Premium",
  "Luxury",
];

const areaOptions = [
  "Bole",
  "Kazanchis",
  "Piassa",
  "Mexico",
  "CMC",
  "Sarbet",
  "4 Kilo",
];

const placeTypeOptions = [
  "Restaurant",
  "Cafe",
  "Juice",
  "Bakery",
  "Lounge",
  "Fast Food",
];

const experienceOptions = [
  "Quiet & relaxing",
  "Good for dates",
  "Good for friends",
  "Beautiful place",
  "Great food",
  "Good service",
  "Good value",
];

export default function PreferencesPage() {
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("meder-preferences");

    if (stored) {
      try {
        setPreferences(JSON.parse(stored));
      } catch {
        setPreferences(defaultPreferences);
      }
    }
  }, []);

  const toggleArrayValue = (
    field: "areas" | "placeTypes" | "experiences",
    value: string,
  ) => {
    setPreferences((current) => {
      const currentValues = current[field];

      return {
        ...current,
        [field]: currentValues.includes(value)
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    });

    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(
      "meder-preferences",
      JSON.stringify(preferences),
    );

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Back */}
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Link>

        {/* Header */}
        <section className="mt-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/10">
              <SlidersHorizontal className="h-5 w-5 text-[#D4AF37]" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                Personalize MEDER
              </p>

              <h1 className="mt-1 font-serif text-3xl text-white sm:text-4xl">
                Preferences
              </h1>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-white/45">
            Tell MEDER what you usually enjoy. Your preferences can help
            make future recommendations more relevant.
          </p>
        </section>

        {/* Budget */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5 text-[#D4AF37]" />

            <div>
              <h2 className="font-serif text-xl text-white">
                Typical budget
              </h2>

              <p className="mt-1 text-xs text-white/40">
                What price range usually feels comfortable?
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {budgetOptions.map((option) => {
              const selected = preferences.budget === option;
 return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setPreferences((current) => ({
                      ...current,
                      budget: option,
                    }));
                    setSaved(false);
                  }}
                  className={`rounded-xl border px-3 py-3 text-sm transition ${
                    selected
                      ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                      : "border-white/10 bg-white/[0.03] text-white/60 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </section>

        {/* Areas */}
        <section className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-[#D4AF37]" />

            <div>
              <h2 className="font-serif text-xl text-white">
                Preferred areas
              </h2>

              <p className="mt-1 text-xs text-white/40">
                Select the areas you visit most often.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {areaOptions.map((area) => {
              const selected = preferences.areas.includes(area);

              return (
                <button
                  key={area}
                  type="button"
                  onClick={() =>
                    toggleArrayValue("areas", area)
                  }
                  className={`rounded-full border px-4 py-2.5 text-sm transition ${
                    selected
                      ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                      : "border-white/10 bg-white/[0.03] text-white/60 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                  }`}
                >
                  {area}
                </button>
              );
            })}
          </div>
        </section>

        {/* Place types */}
        <section className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div>
            <h2 className="font-serif text-xl text-white">
              Favorite place types
            </h2>

            <p className="mt-1 text-xs text-white/40">
              What kinds of places do you usually look for?
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {placeTypeOptions.map((type) => {
              const selected =
                preferences.placeTypes.includes(type);

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    toggleArrayValue("placeTypes", type)
                  }
                  className={`rounded-full border px-4 py-2.5 text-sm transition ${
                    selected
                      ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                      : "border-white/10 bg-white/[0.03] text-white/60 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </section>

        {/* Experiences */}
        <section className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div>
            <h2 className="font-serif text-xl text-white">
              Experiences you enjoy
            </h2>

            <p className="mt-1 text-xs text-white/40">
              Choose the experiences that matter most to you.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {experienceOptions.map((experience) => {
              const selected =
                preferences.experiences.includes(experience);
 return (
                <button
                  key={experience}
                  type="button"
                  onClick={() =>
                    toggleArrayValue(
                      "experiences",
                      experience,
                    )
                  }
                  className={`rounded-full border px-4 py-2.5 text-sm transition ${
                    selected
                      ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                      : "border-white/10 bg-white/[0.03] text-white/60 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                  }`}
                >
                  {experience}
                </button>
              );
            })}
          </div>
        </section>

        {/* Save */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          {saved && (
            <div className="flex items-center justify-center gap-2 text-sm text-green-400">
              <Check className="h-4 w-4" />
              Preferences saved
            </div>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="min-h-12 rounded-xl bg-[#D4AF37] px-7 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
          >
            Save Preferences
          </button>
        </div>

      </div>
    </main>
  );
}