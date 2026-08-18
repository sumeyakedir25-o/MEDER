import Image from "next/image";
import { ArrowRight } from "lucide-react";

const weekendIdeas = [
  {
    title: "Weekend Brunch",
    description: "Relaxed brunch spots and cafés",
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Live Music",
    description: "Music, entertainment and good vibes",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Something New",
    description: "Discover a place you haven't tried",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  },
];

export default function WeekendDiscovery() {
  return (
    <section className="w-full px-4 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
              Discover
            </p>

            <h2 className="font-serif text-3xl text-white md:text-4xl">
              This Weekend
            </h2>

            <p className="mt-2 text-sm text-white/55 md:text-base">
              Ideas for your next outing.
            </p>
          </div>

          <button
            type="button"
            className="flex shrink-0 items-center gap-1 text-sm font-medium text-[#D4AF37] transition hover:text-[#E5C158]"
          >
            Explore all
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {weekendIdeas.map((idea) => (
            <button
              key={idea.title}
              type="button"
              className="group relative h-64 overflow-hidden rounded-2xl border border-white/10 text-left"
            >
              <Image
                src={idea.image}
                alt={idea.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-serif text-2xl text-white">
                  {idea.title}
                </h3>

                <p className="mt-1 text-sm text-white/65">
                  {idea.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}