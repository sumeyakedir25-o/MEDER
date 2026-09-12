import Link from "next/link";
import { ArrowLeft, Utensils } from "lucide-react";
import { mederPlaces } from "@/Lib/meder/places";

export default function FoodCategoryPage() {
  const foodCategories = Array.from(
    new Set(
      mederPlaces.flatMap((place) => place.cuisine || []),
    ),
  );

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" />
          Categories
        </Link>

        <section className="mt-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
            MEDER Categories
          </p>

          <h1 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
            Food
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50 sm:text-base">
            Discover food and cuisines available around you.
          </p>
        </section>

        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {foodCategories.map((food) => {
            const count = mederPlaces.filter((place) =>
              (place.cuisine || []).includes(food),
            ).length;

            return (
              <Link
                key={food}
                href={`/search?cuisine=${encodeURIComponent(food)}`}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:bg-white/[0.05]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10">
                  <Utensils className="h-5 w-5 text-[#D4AF37]" />
                </div>

                <h2 className="mt-5 font-serif text-2xl text-white">
                  {food}
                </h2>

                <p className="mt-2 text-sm text-white/40">
                  {count} {count === 1 ? "place" : "places"}
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