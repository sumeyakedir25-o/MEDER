"use client";

import {
  Award,
  BadgeCheck,
  Bookmark,
  Compass,
  Heart,
  MapPin,
  Sparkles,
} from "lucide-react";

interface ExplorerBadgesProps {
  contributions: number;
  experiencedPlaces: number;
  savedPlaces: number;
  spotlists: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

export default function ExplorerBadges({
  contributions,
  experiencedPlaces,
  savedPlaces,
  spotlists,
}: ExplorerBadgesProps) {
  const badges: Badge[] = [
    {
      id: "first-steps",
      name: "First Steps",
      description: "Shared your first experience",
      icon: <Sparkles className="h-5 w-5" />,
      unlocked: contributions >= 1,
    },
    {
      id: "community-voice",
      name: "Community Voice",
      description: "Shared 5 experiences",
      icon: <Heart className="h-5 w-5" />,
      unlocked: contributions >= 5,
    },
    {
      id: "place-finder",
      name: "Place Finder",
      description: "Experienced 5 different places",
      icon: <MapPin className="h-5 w-5" />,
      unlocked: experiencedPlaces >= 5,
    },
    {
      id: "curator",
      name: "Curator",
      description: "Created your first Spotlist",
      icon: <Bookmark className="h-5 w-5" />,
      unlocked: spotlists >= 1,
    },
    {
      id: "explorer",
      name: "True Explorer",
      description: "Experienced 10 different places",
      icon: <Compass className="h-5 w-5" />,
      unlocked: experiencedPlaces >= 10,
    },
    {
      id: "trusted",
      name: "Trusted Explorer",
      description: "Shared 20 helpful experiences",
      icon: <BadgeCheck className="h-5 w-5" />,
      unlocked: contributions >= 20,
    },
    {
      id: "collector",
      name: "Place Collector",
      description: "Saved 10 places",
      icon: <Award className="h-5 w-5" />,
      unlocked: savedPlaces >= 10,
    },
  ];

  const unlockedBadges = badges.filter((badge) => badge.unlocked);

  return (
    <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
            Explorer achievements
          </p>

          <h2 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
            Your badges
          </h2>

          <p className="mt-2 text-sm text-white/45">
            Earn badges by exploring places and making useful contributions.
          </p>
        </div>

        <div className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2 text-sm text-[#D4AF37]">
          {unlockedBadges.length} / {badges.length} unlocked
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`rounded-2xl border p-5 transition ${
              badge.unlocked
                ? "border-[#D4AF37]/30 bg-[#D4AF37]/5"
                : "border-white/5 bg-black/20 opacity-50"
            }`}
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                badge.unlocked
                  ? "bg-[#D4AF37]/15 text-[#D4AF37]"
                  : "bg-white/5 text-white/30"
              }`}
            >
              {badge.icon}
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between gap-3">
                <h3
                  className={`text-sm font-semibold ${
                    badge.unlocked ? "text-white" : "text-white/50"
                  }`}
                >
                  {badge.name}
                </h3>

                {badge.unlocked && (
                  <span className="rounded-full bg-[#D4AF37]/10 px-2 py-1 text-[10px] font-medium text-[#D4AF37]">
                    Earned
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs leading-5 text-white/40">
                {badge.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {unlockedBadges.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-5 text-center">
          <p className="text-sm text-white/45">
            Start exploring and sharing experiences to unlock your first badge.
          </p>
        </div>
      )}
    </section>
  );
}