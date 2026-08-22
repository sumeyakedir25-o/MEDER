import Image from "next/image";
import { Bookmark, Star } from "lucide-react";

const featuredPlaces = [
  {
    name: "La Gare",
    type: "French Restaurant",
    area: "Bole",
    rating: "4.7",
    reviews: "250",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Tomoca Coffee",
    type: "Coffee Shop",
    area: "Kazanchis",
    rating: "4.6",
    reviews: "180",
    image:
      "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Yod Abyssinia",
    type: "Traditional Restaurant",
    area: "Bole",
    rating: "4.8",
    reviews: "320",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Kategna",
    type: "Ethiopian Restaurant",
    area: "Megenagna",
    rating: "4.6",
    reviews: "215",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
  },
];

export default function FeaturedPlaces() {
  return (
    <section className="w-full ">
      <div className="relative h-full overflow-hidden rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.04] p-4">
      <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-[#D4AF37]/10 blur-3xl" />
        <div className="relative mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
              Explore
            </p>

            <h2 className="font-serif text-2xl text-white md:text-3xl">
              Featured Places
            </h2>
          </div>

          <button
            type="button"
            className="shrink-0 text-sm font-medium text-[#D4AF37] transition hover:text-[#E5C158]"
          >
            View all
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featuredPlaces.map((place) => (
            <article
              key={place.name}
              className="group w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-[#D4AF37]/30"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={place.image}
                  alt={place.name}
                  fill
                  sizes="(max-width: 768px) 280px, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />

                <button
                  type="button"
                  aria-label={`Save ${place.name}`}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                >
                  <Bookmark className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="p-3">
                <h3 className="font-serif text-lg text-white">
                  {place.name}
                </h3>

                <p className="mt-1 text-sm text-white/55">
                  {place.type} · {place.area}
                </p>

                <div className="mt-2 flex items-center gap-1.5 text-xs">
                  <Star className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />

                  <span className="font-medium text-white">
                    {place.rating}
                  </span>

                  <span className="text-white/40">
                    ({place.reviews})
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}