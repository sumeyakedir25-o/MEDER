"use client";

import Link from "next/link";
import {
  Utensils,
  Coffee,
  Gamepad2,
  CakeSlice,
  Sandwich,
  Sparkles,
  Ellipsis,
} from "lucide-react";

const quickCategories = [
  { name: "Restaurants", type: "Restaurant", icon: Utensils },
  { name: "Cafés", type: "Cafe", icon: Coffee },
  { name: "Game Zones", type: "game zone", icon: Gamepad2 },
  { name: "Desserts", type: "Dessert", icon: CakeSlice },
  { name: "Fast Food", type: "Fast Food", icon: Sandwich },
  { name: "Coffee", type: "Coffee", icon: Sparkles },
];

export default function QuickCategories() {
  return (
    <section className="w-full min-w-0 px-4 py-2 md:px-8">
      <div className="mx-auto flex w-full min-w-0 max-w-7xl gap-2 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap md:justify-center">
        {quickCategories.map((category) => {
          const Icon = category.icon;

          return (
            <Link
              key={category.type}
              href={`/search?type=${encodeURIComponent(category.type)}`}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 transition hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] md:px-4 md:py-2.5 md:text-sm"
            >
              <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span>{category.name}</span>
            </Link>
          );
        })}

        <Link
          href="/categories"
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 transition hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] md:px-4 md:py-2.5 md:text-sm"
        >
          <Ellipsis className="h-3.5 w-3.5 md:h-4 md:w-4" />
          <span>More</span>
        </Link>
      </div>
    </section>
  );
}