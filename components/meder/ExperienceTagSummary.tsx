"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface Experience {
  id: string;
  placeId: string;
  tags: string[];
}

interface ExperienceTagSummaryProps {
  placeId: string;
}

export default function ExperienceTagSummary({
  placeId,
}: ExperienceTagSummaryProps) {
  const [tagCounts, setTagCounts] = useState<
    { tag: string; count: number }[]
  >([]);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("meder-experiences") || "[]",
    );

    const counts: Record<string, number> = {};

    saved
      .filter(
        (experience: Experience) =>
          experience.placeId === placeId,
      )
      .forEach((experience: Experience) => {
        experience.tags.forEach((tag) => {
          counts[tag] = (counts[tag] || 0) + 1;
        });
      });

    const sortedTags = Object.entries(counts)
      .map(([tag, count]) => ({
        tag,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    setTagCounts(sortedTags);
  }, [placeId]);

  if (tagCounts.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {tagCounts.map((item) => (
        <div
          key={item.tag}
          className="flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2.5"
        >
          <Heart className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />

          <span className="text-sm text-white">
            {item.tag}
          </span>

          <span className="text-xs text-white/40">
            · {item.count}
          </span>
        </div>
      ))}
    </div>
  );
}