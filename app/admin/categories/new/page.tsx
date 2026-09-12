 "use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

const groupOptions: {
  value: CategoryGroup;
  label: string;
  description: string;
}[] = [
  {
    value: "location",
    label: "Location",
    description: "Areas and locations where people can discover places.",
  },
  {
    value: "place_type",
    label: "Place Type",
    description: "The kind of place, such as Cafe or Restaurant.",
  },
  {
    value: "category",
    label: "Category",
    description: "The primary discovery category for a place.",
  },
  {
    value: "cuisine",
    label: "Cuisine",
    description: "Food and cuisine categories.",
  },
  {
    value: "purpose",
    label: "Purpose",
    description: "What someone wants to do, such as Eat, Study, or Work.",
  },
  {
    value: "audience",
    label: "Audience",
    description: "Who the place is suitable for.",
  },
  {
    value: "experience",
    label: "Experience",
    description: "The type of experience or occasion.",
  },
  {
    value: "mood",
    label: "Mood & Vibe",
    description: "The atmosphere or feeling of a place.",
  },
];
function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminCategoryFormPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const editId = searchParams.get("edit");
  const isEditing = !!editId;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryGroup, setCategoryGroup] =
    useState<CategoryGroup>("place_type");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [sortOrder, setSortOrder] = useState("0");

  const [loading, setLoading] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(isEditing);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!editId) {
      setLoadingCategory(false);
      return;
    }

    async function loadCategory() {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", editId)
        .single();

      if (error) {
        setMessage(error.message);
        setLoadingCategory(false);
        return;
      }

      setName(data.name || "");
      setSlug(data.slug || "");
      setCategoryGroup(data.category_group);
      setDescription(data.description || "");
      setIcon(data.icon || "");
      setSortOrder(String(data.sort_order ?? 0));

      setLoadingCategory(false);
    }

    loadCategory();
  }, [editId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    if (!name.trim()) {
      setMessage("Category name is required.");
      return;
    }

    if (!categoryGroup) {
      setMessage("Please select a category group.");
      return;
    }

    const finalSlug = slug.trim() || createSlug(name);

    if (!finalSlug) {
      setMessage("A valid category slug could not be created.");
      return;
    }

    setLoading(true);

    const categoryData = {
      name: name.trim(),
      slug: finalSlug,
      category_group: categoryGroup,
      description: description.trim() || null,
      icon: icon.trim() || null,
      sort_order: Number(sortOrder) || 0,
      updated_at: new Date().toISOString(),
    };

    let error;

    if (isEditing) {
      const result = await supabase
        .from("categories")
        .update(categoryData)
        .eq("id", editId);

      error = result.error;
    } else {
      const result = await supabase.from("categories").insert({
        ...categoryData,
        is_active: true,
      });

      error = result.error;
    }

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      isEditing
        ? "Category updated successfully."
        : "Category created successfully."
    );

    setLoading(false);

    setTimeout(() => {
      window.location.href = "/admin/categories";
    }, 700);
  }
 if (loadingCategory) {
    return (
      <main className="min-h-screen bg-[#050505] px-5 py-16 text-white md:px-8">
        <div className="mx-auto max-w-3xl text-center text-sm text-white/40">
          Loading category...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-10 text-white md:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10 border-b border-white/10 pb-8">
          <Link
            href="/admin/categories"
            className="text-sm text-white/40 transition hover:text-white"
          >
            ← Back to Categories
          </Link>

          <p className="mb-2 mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
            MEDER Administration
          </p>

          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {isEditing ? "Edit Category" : "Add Category"}
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/55">
            {isEditing
              ? "Update this category in the MEDER taxonomy."
              : "Create a controlled category that can be used throughout MEDER."}
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              message.includes("successfully")
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                : "border-red-500/20 bg-red-500/10 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                Category Information
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Define the category and where it belongs in MEDER.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Category Name
                  <span className="ml-2 text-xs font-semibold text-[#D4AF37]">
                    ✨ Required
                  </span>
                </label>

                <input
                  value={name}
                  onChange={(event) => {
                    const value = event.target.value;
                    setName(value);

                    if (!isEditing || !slug) {
                      setSlug(createSlug(value));
                    }
                  }}
                  placeholder="e.g. Cafe"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF37]/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Category Group
                  <span className="ml-2 text-xs font-semibold text-[#D4AF37]">
                    ✨ Required
                  </span>
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  {groupOptions.map((group) => (
                    <button
                      key={group.value}
                      type="button"
                      onClick={() => setCategoryGroup(group.value)}
                      className={`rounded-xl border p-4 text-left transition ${
                        categoryGroup === group.value
                          ? "border-[#D4AF37]/60 bg-[#D4AF37]/10"
 : "border-white/10 bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      <p
                        className={`font-medium ${
                          categoryGroup === group.value
                            ? "text-[#D4AF37]"
                            : "text-white"
                        }`}
                      >
                        {group.label}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/40">
                        {group.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Slug
                  <span className="ml-2 text-xs text-white/35">
                    Optional
                  </span>
                </label>

                <input
                  value={slug}
                  onChange={(event) => setSlug(createSlug(event.target.value))}
                  placeholder="cafe"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF37]/50"
                />

                <p className="mt-2 text-xs text-white/30">
                  Automatically generated from the category name.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Description
                  <span className="ml-2 text-xs text-white/35">
                    Optional
                  </span>
                </label>

                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={4}
                  placeholder="Short explanation of what this category means."
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF37]/50"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Icon / Emoji
                    <span className="ml-2 text-xs text-white/35">
                      Optional
                    </span>
                  </label>

                  <input
                    value={icon}
                    onChange={(event) => setIcon(event.target.value)}
                    placeholder="☕"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF37]/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Sort Order
                    <span className="ml-2 text-xs text-white/35">
                      Optional
                    </span>
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={sortOrder}
                    onChange={(event) => setSortOrder(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-[#D4AF37]/50"
                  />
                </div>
              </div>
            </div>
          </section>
 {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/categories"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white/60 transition hover:border-white/20 hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#e4c45a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}