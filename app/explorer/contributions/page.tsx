 "use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Heart,
  Image as ImageIcon,
  MapPin,
  Video,
  CalendarDays,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { mederPlaces } from "@/Lib/meder/places";

interface MediaItem {
  type: "image" | "video";
  name: string;
  preview: string;
}

interface Experience {
  id: string;
  placeId: string;
  tags: string[];
  details: string;
  media?: MediaItem[];
  createdAt: string;
}

export default function ContributionsPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    const storedExperiences = JSON.parse(
      localStorage.getItem("meder-experiences") || "[]",
    );

    setExperiences(storedExperiences);
  }, []);

  const sortedExperiences = useMemo(() => {
    return [...experiences].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();

      return bTime - aTime;
    });
  }, [experiences]);

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/explorer"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Explorer
        </Link>

        {/* Header */}
        <section className="mt-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
            Explorer activity
          </p>

          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-serif text-3xl text-white sm:text-5xl">
                Your contributions
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/45 sm:text-base">
                Experiences you have shared with the MEDER community.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2 text-sm text-[#D4AF37]">
              <Heart className="h-4 w-4" />
              {experiences.length}{" "}
              {experiences.length === 1
                ? "contribution"
                : "contributions"}
            </div>
          </div>
        </section>

        {/* Contributions */}
        {sortedExperiences.length > 0 ? (
          <section className="mt-8 space-y-5">
            {sortedExperiences.map((experience) => {
              const place = mederPlaces.find(
                (item) => item.id === experience.placeId,
              );

              const imageCount =
                experience.media?.filter(
                  (item) => item.type === "image",
                ).length || 0;

              const videoCount =
                experience.media?.filter(
                  (item) => item.type === "video",
                ).length || 0;

              return (
                <article
                  key={experience.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Place image */}
                    <div className="relative h-48 w-full shrink-0 md:h-auto md:w-56">
                      <img
                        src={place?.image}
                        alt={place?.name || "Place"}
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
 <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-white">
                        <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />
                        {place?.area || "Unknown area"}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 sm:p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#D4AF37]">
                            Experience shared
                          </p>

                          <h2 className="mt-2 font-serif text-2xl text-white">
                            {place?.name || "Unknown place"}
                          </h2>

                          <div className="mt-3 flex items-center gap-2 text-xs text-white/40">
                            <CalendarDays className="h-3.5 w-3.5" />

                            {experience.createdAt
                              ? new Date(
                                  experience.createdAt,
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "Recently"}
                          </div>
                        </div>

                        {place && (
                          <Link
                            href={`/places/${place.id}`}
                            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                          >
                            View place
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </div>

                      {/* Tags */}
                      {experience.tags?.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {experience.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-3 py-1.5 text-xs text-[#D4AF37]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Details */}
                      {experience.details && (
                        <div className="mt-5 flex gap-3">
                          <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" />

                          <p className="text-sm leading-6 text-white/55">
                            {experience.details}
                          </p>
                        </div>
                      )}

                      {/* Media counts */}
                      {(imageCount > 0 || videoCount > 0) && (
                        <div className="mt-5 flex flex-wrap gap-3 border-t border-white/10 pt-5">
                          {imageCount > 0 && (
                            <span className="inline-flex items-center gap-2 text-xs text-white/45">
                              <ImageIcon className="h-4 w-4 text-[#D4AF37]" />
                              {imageCount}{" "}
                              {imageCount === 1
                                ? "photo"
                                : "photos"}
                            </span>
                          )}
 {videoCount > 0 && (
                            <span className="inline-flex items-center gap-2 text-xs text-white/45">
                              <Video className="h-4 w-4 text-[#D4AF37]" />
                              {videoCount}{" "}
                              {videoCount === 1
                                ? "video"
                                : "videos"}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/10">
              <Heart className="h-7 w-7 text-[#D4AF37]" />
            </div>

            <h2 className="mt-6 font-serif text-2xl text-white">
              No contributions yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/45">
              Visit a place and share your experience to start
              contributing to the MEDER community.
            </p>

            <Link
              href="/discover"
              className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
            >
              Explore places
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}