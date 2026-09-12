import Link from "next/link";
import {
  ArrowLeft,
  Utensils,
  Coffee,
  Sparkles,
  MapPin,
} from "lucide-react";

const categories = [
  {
    title: "Places",
    description: "Restaurants, cafés, lounges, and more.",
    href: "/categories/places",
    icon: Utensils,
  },
  {
    title: "Food",
    description: "Discover food and cuisines.",
    href: "/categories/food",
    icon: Coffee,
  },
  {
    title: "Experiences",
    description: "Find things to do and moments to enjoy.",
    href: "/categories/experiences",
    icon: Sparkles,
  },
  {
    title: "Locations",
    description: "Explore places by area.",
    href: "/categories/locations",
    icon: MapPin,
  },
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <section className="mt-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
            Explore MEDER
          </p>

          <h1 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
            Categories
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50 sm:text-base">
            Find the right place, food, experience, or
            location for what you have in mind.
          </p>
        </section>

        <section className="mt-10 grid gap-5 sm:grid-cols-2">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.title}
                href={category.href}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:bg-white/[0.05]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10">
                  <Icon className="h-5 w-5 text-[#D4AF37]" />
                </div>

                <h2 className="mt-5 font-serif text-2xl text-white">
                  {category.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  {category.description}
                </p>

                <p className="mt-5 text-sm font-medium text-[#D4AF37]">
                  Explore →
                </p>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}