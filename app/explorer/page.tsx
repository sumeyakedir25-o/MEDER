 "use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ExperiencedPlaces from "@/components/meder/ExperiencedPlaces";
import SavedPlaces from "@/components/meder/SavedPlaces";
import ExplorerLevel from "@/components/meder/ExplorerLevel";
import ExplorerBadges from "@/components/meder/ExplorerBadges";
import LogoutButton from "@/components/meder/LogoutButton";
import {
  ArrowLeft,
  Compass,
  MapPin,
  Heart,
  Bookmark,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/Lib/supabase/client";

interface Experience {
  id: string;
  placeId: string;
  tags?: string[];
  details?: string;
  createdAt?: string;
  reputationPoints?: number;
}

interface Place {
  id: string;
  name: string;
  type: string;
  area: string;
  image: string;
}

export default function ExplorerPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<string[]>([]);
  const [spotlists, setSpotlists] = useState<unknown[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    try {
      const storedExperiences = JSON.parse(
        localStorage.getItem("meder-experiences") || "[]",
      );

      const storedSavedPlaces = JSON.parse(
        localStorage.getItem("meder-saved-places") || "[]",
      );

      const storedSpotlists = JSON.parse(
        localStorage.getItem("meder-spotlists") || "[]",
      );

      setExperiences(
        Array.isArray(storedExperiences)
          ? storedExperiences
          : [],
      );

      setSavedPlaces(
        Array.isArray(storedSavedPlaces)
          ? storedSavedPlaces
          : [],
      );

      setSpotlists(
        Array.isArray(storedSpotlists)
          ? storedSpotlists
          : [],
      );
    } catch {
      setExperiences([]);
      setSavedPlaces([]);
      setSpotlists([]);
    }
  }, []);

  useEffect(() => {
    async function loadPlaces() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("places")
        .select("id, name, type, area, cover_image, photos")
        .eq("status", "published");

      if (error) {
        console.error("Failed to load Explorer places:", error);
        setPlaces([]);
        return;
      }

      setPlaces(
        (data ?? []).map((place) => ({
          id: place.id,
          name: place.name,
          type: place.type || "Place",
          area: place.area || "Unknown area",
          image:
            place.cover_image ||
            (Array.isArray(place.photos) && place.photos.length > 0
              ? place.photos[0]
              : ""),
        })),
      );
    }

    loadPlaces();
  }, []);

  const experiencedPlaceIds = new Set(
    experiences.map((experience) => experience.placeId),
  );

  const experiencedPlaces = places.filter((place) =>
    experiencedPlaceIds.has(place.id),
  );

  const totalReputation = experiences.reduce(
    (total, experience) =>
      total + (experience.reputationPoints || 0),
    0,
  );

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to MEDER
        </Link>

        {/* Profile header */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10">
                <Compass className="h-10 w-10 text-[#D4AF37]" />
              </div>
 <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                  MEDER Explorer
                </p>

                <h1 className="mt-2 font-serif text-3xl text-white sm:text-4xl">
                  Explorer
                </h1>

                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-3 py-1.5 text-xs text-[#D4AF37]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Explorer
                  </span>

                  <span className="inline-flex items-center gap-2 text-xs text-white/40">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Exploring MEDER
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-[#D4AF37]" />

                  <div>
                    <p className="text-2xl font-semibold text-white">
                      {experiences.length}
                    </p>

                    <p className="text-xs text-white/40">
                      Contributions
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#D4AF37]" />

                  <div>
                    <p className="text-2xl font-semibold text-white">
                      {experiencedPlaces.length}
                    </p>

                    <p className="text-xs text-white/40">
                      Places experienced
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="flex items-center gap-3">
                  <Bookmark className="h-5 w-5 text-[#D4AF37]" />

                  <div>
                    <p className="text-2xl font-semibold text-white">
                      {savedPlaces.length}
                    </p>

                    <p className="text-xs text-white/40">
                      Saved places
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ExperiencedPlaces />

        <SavedPlaces />

        <ExplorerLevel
          contributions={experiences.length}
          experiencedPlaces={experiencedPlaces.length}
          savedPlaces={savedPlaces.length}
          reputation={totalReputation}
        />

        <ExplorerBadges
          contributions={experiences.length}
          experiencedPlaces={experiencedPlaces.length}
          savedPlaces={savedPlaces.length}
          spotlists={spotlists.length}
        />

        <LogoutButton />

        {/* Explorer sections */}
        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <Link
            href="/explorer/contributions"
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5"
          >
            <Heart className="h-6 w-6 text-[#D4AF37]" />

            <h2 className="mt-5 font-serif text-2xl text-white">
              Contributions
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/45">
              See the experiences and information you have shared
              with the MEDER community.
            </p>

            <p className="mt-5 text-sm font-medium text-[#D4AF37]">
              View contributions →
            </p>
          </Link>
 <Link
            href="/explorer/places"
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5"
          >
            <MapPin className="h-6 w-6 text-[#D4AF37]" />

            <h2 className="mt-5 font-serif text-2xl text-white">
              Places experienced
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/45">
              Explore all the places where you have shared
              your experience.
            </p>

            <p className="mt-5 text-sm font-medium text-[#D4AF37]">
              View places →
            </p>
          </Link>

          <Link
            href="/explorer/saved"
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5"
          >
            <Bookmark className="h-6 w-6 text-[#D4AF37]" />

            <h2 className="mt-5 font-serif text-2xl text-white">
              Saved places
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/45">
              Your personal collection of places you want to
              remember or visit.
            </p>

            <p className="mt-5 text-sm font-medium text-[#D4AF37]">
              View saved places →
            </p>
          </Link>

          <Link
            href="/explorer/spotlists"
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5"
          >
            <Compass className="h-6 w-6 text-[#D4AF37]" />

            <h2 className="mt-5 font-serif text-2xl text-white">
              Spotlists
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/45">
              Create your own collections of places for
              different moods, plans, and occasions.
            </p>

            <p className="mt-5 text-sm font-medium text-[#D4AF37]">
              View spotlists →
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}