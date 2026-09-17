"use client";

import Link from "next/link";
import {
  Utensils,
  Coffee,
  Martini,
  Sparkles,
  CakeSlice,
  ShoppingBag,
  Ellipsis,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/Lib/supabase/client";

const iconMap: Record<string, any> = {
  restaurant: Utensils,
  restaurants: Utensils,
  cafe: Coffee,
  cafés: Coffee,
  cafes: Coffee,
  nightlife: Martini,
  experience: Sparkles,
  experiences: Sparkles,
  dessert: CakeSlice,
  desserts: CakeSlice,
  shop: ShoppingBag,
  shops: ShoppingBag,
};

function getIcon(name: string) {
  const key = name.trim().toLowerCase();

  return iconMap[key] || Sparkles;
}

export default function QuickCategories() {
  const [categories, setCategories] = useState<
    { name: string; slug: string }[]
  >([]);

  useEffect(() => {
    async function loadCategories() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("categories")
        .select("name, slug, sort_order")
        .eq("group", "category")
        .order("sort_order", { ascending: true })
        .limit(6);

      if (error) {
        console.error("Error loading quick categories:", error);
        return;
      }

      setCategories(data ?? []);
    }

    loadCategories();
  }, []);

  return (
    <section className="w-full min-w-0 px-4 py-2 md:px-8">
      <div className="mx-auto flex w-full min-w-0 max-w-7xl gap-2 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap md:justify-center">
        {categories.map((category) => {
          const Icon = getIcon(category.name);

          return (
            <Link
              key={category.slug || category.name}
              href={`/search?q=${encodeURIComponent(category.name)}`}
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