"use client";

import { useEffect, useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import ReportExperience from "@/components/meder/ReportExperience";

interface Experience {
  id: string;
  placeId: string;
  tags: string[];
  details: string;
  createdAt: string;
}

interface ExperienceCardsProps {
  placeId: string;
}

export default function ExperienceCards({
  placeId,
}: ExperienceCardsProps) {
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("meder-experiences") || "[]",
    );

    const placeExperiences = saved.filter(
      (experience: Experience) =>
        experience.placeId === placeId,
    );

    setExperiences(placeExperiences);
  }, [placeId]);

  if (experiences.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
        <Heart className="mx-auto h-6 w-6 text-[#D4AF37]" />

        <p className="mt-3 font-medium text-white">
          No experiences shared yet
        </p>

        <p className="mt-1 text-sm text-white/40">
          Be the first person to share what this place is really like.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {experiences.map((experience) => (
        <article
          key={experience.id}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#D4AF37]/30"
        >
          {experience.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {experience.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-3 py-1.5 text-xs font-medium text-[#D4AF37]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {experience.details && (
            <p className="mt-4 text-sm leading-6 text-white/65">
              “{experience.details}”
            </p>
          )}

          <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-white/35">
            <MessageCircle className="h-3.5 w-3.5" />
            Community experience
          </div>
          <div className="mt-4 flex justify-end">
  <ReportExperience experienceId={experience.id} />
</div>
        </article>
      ))}
    </div>
  );
}