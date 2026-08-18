import Image from "next/image";
import { ArrowRight, MapPin, Star } from "lucide-react";

const nearbyPlaces = [
  {
    name: "Buzz Coffee",
    type: "Coffee Shop",
    distance: "150 m",
    status: "Open now",
    rating: "4.5",
    image:
      "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Momona Lounge",
    type: "Lounge",
    distance: "300 m",
    status: "Open now",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Pasta House",
    type: "Italian Restaurant",
    distance: "500 m",
    status: "Open now",
    rating: "4.4",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=500&q=80",
  },
];

export default function NearYou() {
  return (
    <section className="w-full ">
      <div className="relative h-full overflow-hidden rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.04] p-4">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#D4AF37]/10 blur-3xl" />
        <div className="relative mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
              Around you
            </p>

            <h2 className="font-serif text-2xl text-white md:text-3xl">
              Near You
            </h2>
          </div>

          <button
            type="button"
            className="flex shrink-0 items-center gap-1 text-xs font-medium text-[#D4AF37] transition hover:text-[#E5C158]"
          >
            See all
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {nearbyPlaces.map((place) => (
            <article
              key={place.name}
              className="group flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-2 transition hover:border-[#D4AF37]/30 hover:bg-white/[0.05]"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={place.image}
                  alt={place.name}
                  fill
                  sizes="80px"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-serif text-sm text-white">
                  {place.name}
                </h3>

                <p className="mt-0.5 truncate text-[11px] text-white/45">
                  {place.type}
                </p>

                <div className="mt-1 flex items-center gap-2 text-[10px]">
                  <span className="flex items-center gap-1 text-white/55">
                    <MapPin className="h-3 w-3 text-[#D4AF37]" />
                    {place.distance}
                  </span>

                  <span className="text-emerald-400">
                    {place.status}
                  </span>

                  <span className="flex items-center gap-1 text-white/70">
                    <Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" />
                    {place.rating}
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