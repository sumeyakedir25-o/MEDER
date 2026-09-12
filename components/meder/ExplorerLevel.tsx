"use client";

import {
  Award,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

interface ExplorerLevelProps {
  contributions: number;
  experiencedPlaces: number;
  savedPlaces: number;
  reputation: number;
}

interface ExplorerLevel {
  name: string;
  minPoints: number;
  icon: React.ReactNode;
  description: string;
}

export default function ExplorerLevel({
  contributions,
  experiencedPlaces,
  savedPlaces,
  reputation,
}: ExplorerLevelProps) {
  const explorerPoints =
    contributions * 5 +
    experiencedPlaces * 8 +
    savedPlaces * 1 +
    reputation;

  const levels: ExplorerLevel[] = [
    {
      name: "New Explorer",
      minPoints: 0,
      icon: <Sparkles className="h-5 w-5" />,
      description: "Your MEDER exploration has begun.",
    },
    {
      name: "Curious Explorer",
      minPoints: 50,
      icon: <TrendingUp className="h-5 w-5" />,
      description: "You are starting to discover and contribute.",
    },
    {
      name: "Active Explorer",
      minPoints: 150,
      icon: <Award className="h-5 w-5" />,
      description: "Your activity is helping the MEDER community.",
    },
    {
      name: "Trusted Explorer",
      minPoints: 350,
      icon: <ShieldCheck className="h-5 w-5" />,
      description: "You consistently share useful experiences.",
    },
  ];

  const currentLevel =
    [...levels]
      .reverse()
      .find((level) => explorerPoints >= level.minPoints) ||
    levels[0];

  const currentIndex = levels.findIndex(
    (level) => level.name === currentLevel.name,
  );

  const nextLevel = levels[currentIndex + 1];

  const progress = nextLevel
    ? Math.min(
        ((explorerPoints - currentLevel.minPoints) /
          (nextLevel.minPoints - currentLevel.minPoints)) *
          100,
        100,
      )
    : 100;

  return (
    <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37]">
            {currentLevel.icon}
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
              Explorer level
            </p>

            <h2 className="mt-2 font-serif text-2xl text-white">
              {currentLevel.name}
            </h2>

            <p className="mt-2 text-sm text-white/45">
              {currentLevel.description}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-5 py-4">
          <p className="text-xs uppercase tracking-wider text-white/40">
            Explorer score
          </p>

          <p className="mt-1 text-2xl font-semibold text-[#D4AF37]">
            {explorerPoints}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs text-white/40">
            Contributions
          </p>

          <p className="mt-2 text-xl font-semibold text-white">
            {contributions}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs text-white/40">
            Places explored
          </p>

          <p className="mt-2 text-xl font-semibold text-white">
            {experiencedPlaces}
          </p>
        </div>

        <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4">
          <p className="text-xs text-white/40">
            Reputation
          </p>

          <p className="mt-2 text-xl font-semibold text-[#D4AF37]">
            {reputation}
          </p>
        </div>
      </div>
      {nextLevel && (
        <div className="mt-8">
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="text-white/45">
              {currentLevel.name}
            </span>

            <span className="text-[#D4AF37]">
              {nextLevel.minPoints - explorerPoints} points to{" "}
              {nextLevel.name}
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#D4AF37] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {!nextLevel && (
        <div className="mt-8 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4 text-center">
          <p className="text-sm font-medium text-[#D4AF37]">
            You have reached the highest Explorer level.
          </p>
        </div>
      )}
    </section>
  );
}