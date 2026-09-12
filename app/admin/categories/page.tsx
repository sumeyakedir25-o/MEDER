 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/Lib/supabase/client";

type CategoryGroup =
  | "location"
  | "place_type"
  | "category"
  | "cuisine"
  | "purpose"
  | "audience"
  | "experience"
  | "mood";

type Category = {
  id: string;
  name: string;
  slug: string;
  category_group: CategoryGroup;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

const groupLabels: Record<CategoryGroup, string> = {
  location: "Locations",
  place_type: "Place Types",
  category: "Categories",
  cuisine: "Cuisines",
  purpose: "Purposes",
  audience: "Audiences",
  experience: "Experiences",
  mood: "Moods & Vibes",
};

export default function AdminCategoriesPage() {
  const supabase = createClient();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadCategories() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("category_group", { ascending: true })
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setCategories((data as Category[]) || []);
    setLoading(false);
  }
  async function toggleCategory(
  categoryId: string,
  categoryName: string,
  isActive: boolean
) {
  const action = isActive ? "deactivate" : "activate";

  const confirmed = window.confirm(
    `Are you sure you want to ${action} "${categoryName}"?`
  );

  if (!confirmed) return;

  setMessage("");

  const { error } = await supabase
    .from("categories")
    .update({
      is_active: !isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", categoryId);

  if (error) {
    setMessage(error.message);
    return;
  }

  setMessage(
    isActive
      ? `"${categoryName}" has been deactivated.`
      : `"${categoryName}" has been activated.`
  );

  await loadCategories();
}

  useEffect(() => {
    loadCategories();
  }, []);

  const activeCount = categories.filter(
    (category) => category.is_active
  ).length;

  const inactiveCount = categories.filter(
    (category) => !category.is_active
  ).length;

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-10 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              MEDER Administration
            </p>

            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Categories
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
              Control the categories that power MEDER discovery, search, and
              recommendations.
            </p>
          </div>

          <Link
            href="/admin/categories/new"
            className="inline-flex items-center justify-center rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#e4c45a]"
          >
            + Add Category
          </Link>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {message}
          </div>
        )}

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-wider text-white/40">
              Total Categories
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {categories.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-wider text-white/40">
              Active
            </p>

            <p className="mt-2 text-2xl font-semibold text-emerald-300">
              {activeCount}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-wider text-white/40">
              Inactive
            </p>

            <p className="mt-2 text-2xl font-semibold text-white/40">
              {inactiveCount}
            </p>
          </div>
        </div>
 {/* Categories */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          <div className="border-b border-white/10 px-5 py-5">
            <h2 className="font-semibold">All Categories</h2>

            <p className="mt-1 text-sm text-white/40">
              Manage the controlled vocabulary used throughout MEDER.
            </p>
          </div>

          {loading ? (
            <div className="px-5 py-12 text-center text-sm text-white/40">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <p className="text-lg font-medium">No categories yet</p>

              <p className="mt-2 text-sm text-white/40">
                Add your first category to start building the MEDER taxonomy.
              </p>

              <Link
                href="/admin/categories/new"
                className="mt-6 inline-flex rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black"
              >
                Add Your First Category
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-col gap-5 px-5 py-5 transition hover:bg-white/[0.03] md:flex-row md:items-center md:justify-between"
                >
                  {/* Information */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      {category.icon && (
                        <span className="text-lg">{category.icon}</span>
                      )}

                      <h3 className="font-semibold">{category.name}</h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                          category.is_active
                            ? "bg-emerald-500/10 text-emerald-300"
                            : "bg-white/10 text-white/40"
                        }`}
                      >
                        {category.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-white/45">
                      <span>{groupLabels[category.category_group]}</span>

                      <span>• {category.slug}</span>

                      <span>• Order {category.sort_order}</span>
                    </div>

                    {category.description && (
                      <p className="mt-2 max-w-2xl text-sm text-white/40">
                        {category.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
<div className="flex shrink-0 gap-3">
  <Link
    href={`/admin/categories/new?edit=${category.id}`}
    className="rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#e4c45a]"
  >
    Edit
  </Link>

  <button
    type="button"
    onClick={() =>
      toggleCategory(
        category.id,
        category.name,
        category.is_active
      )
    }
    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
      category.is_active
        ? "border-red-500/20 text-red-300 hover:border-red-500/40 hover:bg-red-500/10"
        : "border-emerald-500/20 text-emerald-300 hover:border-emerald-500/40 hover:bg-emerald-500/10"
    }`}
  >
    {category.is_active ? "Deactivate" : "Activate"}
  </button>
</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}