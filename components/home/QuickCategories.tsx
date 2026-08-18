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
    <section className="w-full">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:justify-center">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <button
              key={category.name}
              type="button"
              className="flex min-w-fit shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/80 transition hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
            >
              <Icon className="h-4 w-4" />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}