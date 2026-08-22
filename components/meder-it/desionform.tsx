 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Utensils,
  Sparkles,
  Wallet,
  MapPin,
  Clock3,
  Search,
} from "lucide-react";

const questions = [
  {
    key: "who",
    title: "Who are you with?",
    icon: Users,
    multiple: false,
    options: ["Solo", "Friends", "Date", "Family", "Colleagues"],
  },
  {
    key: "what",
    title: "What are you looking for?",
    icon: Utensils,
    multiple: true,
    options: [
      "Eat",
      "Coffee",
      "Drinks",
      "Dessert",
      "Game Zone",
      "Movies",
      "Entertainment",
      "Experience",
    ],
  },
  {
    key: "vibe",
    title: "What's the vibe?",
    icon: Sparkles,
    multiple: false,
    options: ["Chill", "Romantic", "Fun", "Luxury", "Quiet", "Lively"],
  },
  {
    key: "budget",
    title: "What's your budget?",
    icon: Wallet,
    multiple: false,
    options: [
      "Under 500 ETB",
      "500–1,000 ETB",
      "1,000–2,000 ETB",
      "2,000+ ETB",
    ],
  },
  {
    key: "location",
    title: "Where do you want to go?",
    icon: MapPin,
    multiple: false,
    options: [
      "Near Me",
      "Bole",
      "Kazanchis",
      "Piassa",
      "Megenagna",
      "Choose Area",
    ],
  },
  {
    key: "time",
    title: "When are you going?",
    icon: Clock3,
    multiple: false,
    options: ["Right Now", "Today", "Tonight", "This Weekend"],
  },
] as const;

type QuestionKey = (typeof questions)[number]["key"];

type Selections = Partial<Record<QuestionKey, string[]>>;

export default function DecisionForm() {
  const router = useRouter();
  const [selections, setSelections] = useState<Selections>({});
  

  function selectOption(
    key: QuestionKey,
    option: string,
    multiple: boolean,
  ) {
    setSelections((current) => {
      const currentValues = current[key] ?? [];

      // Multiple selection
      if (multiple) {
        const alreadySelected = currentValues.includes(option);

        return {
          ...current,
          [key]: alreadySelected
            ? currentValues.filter((value) => value !== option)
            : [...currentValues, option],
        };
      }

      // Single selection
      const alreadySelected = currentValues.includes(option);

      return {
        ...current,
        [key]: alreadySelected ? [] : [option],
      };
    });
  }

  function handleFindSpot() {
  const hasSelections = Object.values(selections).some(
    (values) => values && values.length > 0,
  );

  if (!hasSelections) {
    return;
  }

  sessionStorage.setItem("meder-decision", JSON.stringify(selections));

  router.push("/meder-it/result");
}

  function handleSurpriseMe() {
  const hasSelections = Object.values(selections).some(
    (values) => values && values.length > 0,
  );

  if (hasSelections) {
    sessionStorage.setItem(
      "meder-decision",
      JSON.stringify(selections),
    );
  } else {
    sessionStorage.removeItem("meder-decision");
  }

  sessionStorage.setItem("meder-surprise", "true");

  router.push("/meder-it/result");
}

  const selectedCount = Object.values(selections).reduce(
    (total, values) => total + (values?.length ?? 0),
    0,
  );

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-[#D4AF37]">
          MEDER IT
        </p>

        <h1 className="font-serif text-4xl tracking-tight text-white sm:text-5xl">
          Let MEDER choose your spot.
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
          Choose whatever you know. You don't have to answer everything.
        </p>

        {selectedCount > 0 && (
          <p className="mt-3 text-xs text-[#D4AF37]">
            {selectedCount}{" "}
            {selectedCount === 1 ? "choice" : "choices"} selected
          </p>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((question) => {
          const Icon = question.icon;
          const selectedValues = selections[question.key] ?? [];

          return (
            <section
              key={question.key}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"
            >
              {/* Question heading */}
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Icon className="h-4 w-4" />
                </div>
              <div>
                  <h2 className="font-serif text-lg text-white sm:text-xl">
                    {question.title}
                  </h2>

                  {question.multiple && (
                    <p className="mt-0.5 text-xs text-white/35">
                      You can choose more than one
                    </p>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="flex flex-wrap gap-2">
                {question.options.map((option) => {
                  const selected = selectedValues.includes(option);

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        selectOption(
                          question.key,
                          option,
                          question.multiple,
                        )
                      }
                      aria-pressed={selected}
                      className={`rounded-xl border px-4 py-2.5 text-sm transition ${
                        selected
                          ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                          : "border-white/10 bg-white/[0.03] text-white/70 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 hover:text-white"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleFindSpot}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
        >
          <Search className="h-4 w-4" />
          Find My Spot
        </button>

        <button
          type="button"
          onClick={handleSurpriseMe}
          className="min-h-12 rounded-xl border border-[#D4AF37]/40 px-6 text-sm font-medium text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
        >
          🎲 Surprise Me
        </button>
      </div>
    </div>
  );
}