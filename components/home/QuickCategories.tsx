"use client";

import {
  Utensils,
  Coffee,
  Martini,
  Sparkles,
  CakeSlice,
  ShoppingBag,
  Ellipsis,
} from "lucide-react";

const categories = [
  { name: "Restaurants", icon: Utensils },
  { name: "Cafés", icon: Coffee },
  { name: "Nightlife", icon: Martini },
  { name: "Experiences", icon: Sparkles },
  { name: "Desserts", icon: CakeSlice },
  { name: "Shops", icon: ShoppingBag },
  { name: "More", icon: Ellipsis },
];

export default function QuickCategories() {
  return (
    <section className="w-full min-w-0 px-4 py-2 md:px-8">
      <div className="mx-auto flex w-full min-w-0 max-w-7xl gap-2 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap md:justify-center">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <button
              key={category.name}
              type="button"
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 transition hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] md:px-4 md:py-2.5 md:text-sm"
            >
              <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}