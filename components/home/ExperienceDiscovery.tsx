"use client";

import Image from "next/image";

const experiences = [
  {
    title: "Date Night",
    description: "Romantic places & experiences",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "With Friends",
    description: "Fun spots to enjoy together",
    image:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Coffee & Chill",
    description: "Relaxed cafés & quiet places",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Night Out",
    description: "Lounges, nightlife & entertainment",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80",
  },
];

export default function ExperienceDiscovery() {
  return (
    <section className="w-full px-4 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
            Discover
          </p>

          <h2 className="font-serif text-3xl text-white md:text-4xl">
            Discover by Experience
          </h2>

          <p className="mt-2 max-w-xl text-sm text-white/55 md:text-base">
            Find something that fits the moment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {experiences.map((experience) => (
            <button
              key={experience.title}
              type="button"
              className="group relative h-64 overflow-hidden rounded-2xl border border-white/10 text-left"
            >
              <Image
                src={experience.image}
                alt={experience.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-serif text-xl text-white">
                  {experience.title}
                </h3>

                <p className="mt-1 text-sm text-white/65">
                  {experience.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}