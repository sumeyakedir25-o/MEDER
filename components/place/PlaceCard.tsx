import Link from "next/link";
import { Bookmark, MapPin, Star } from "lucide-react";

import type { MederPlace } from "@/Lib/meder/matching";

interface PlaceCardProps {
  place: MederPlace;
}

export default function PlaceCard({
  place,
}: PlaceCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:bg-white/[0.05]">

      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">

        <img
          src={place.image}
          alt={place.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Save */}
        <button
          type="button"
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white/80 backdrop-blur-md transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
          aria-label={`Save ${place.name}`}
        >
          <Bookmark className="h-4 w-4" />
        </button>

        {/* Type */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded-full border border-white/15 bg-black/70 px-3 py-1.5 text-xs font-medium text-white/85 backdrop-blur-md">
            {place.type}
          </span>
        </div>

      </div>

      {/* Details */}
      <div className="p-5">

        <h2 className="font-serif text-xl text-white sm:text-2xl">
          {place.name}
        </h2>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/60">

          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-[#D4AF37]" />
            {place.area}
          </span>

          <span className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />

            {place.rating}

            <span className="text-white/35">
              ({place.reviews})
            </span>
          </span>

        </div>

        {/* Vibes */}
        <div className="mt-4 flex flex-wrap gap-2">

          {place.vibe.slice(0, 2).map((vibe) => (
            <span
              key={vibe}
              className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/55"
            >
              {vibe}
            </span>
          ))}

        </div>

        <Link
          href={`/places/${place.id}`}
          className="mt-5 inline-flex min-h-10 w-full items-center justify-center rounded-xl border border-[#D4AF37]/40 px-5 text-sm font-medium text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
        >
          View Details
        </Link>

      </div>

    </article>
  );
}