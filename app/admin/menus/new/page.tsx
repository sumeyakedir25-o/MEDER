 "use client";

import {
  FormEvent,
  Suspense,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { ArrowLeft, Save, Utensils } from "lucide-react";
import { createClient } from "@/Lib/supabase/client";
import { useSearchParams } from "next/navigation";

type Place = {
  id: string;
  name: string;
  area: string | null;
};

type Offering = {
  id: string;
  place_id: string;
  name: string;
  category: string | null;
  description: string | null;
  price: number | null;
  price_type: "fixed" | "from" | "range" | "contact";
  price_max: number | null;
  currency: string;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
};
function NewOfferingPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const editId = searchParams.get("edit");
  const placeIdFromUrl = searchParams.get("place");

  const isEditing = !!editId;

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [placeId, setPlaceId] = useState(placeIdFromUrl || "");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState<
    "fixed" | "from" | "range" | "contact"
  >("fixed");
  const [priceMax, setPriceMax] = useState("");
  const [currency, setCurrency] = useState("ETB");
  const [imageUrl, setImageUrl] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const { data: placeData, error: placeError } = await supabase
        .from("places")
        .select("id, name, area")
        .order("name", { ascending: true });

      if (placeError) {
        setMessage(placeError.message);
        setLoading(false);
        return;
      }

      const loadedPlaces = placeData || [];
      setPlaces(loadedPlaces);

      if (!placeId && loadedPlaces.length > 0) {
        setPlaceId(loadedPlaces[0].id);
      }

      const { data: categoryData } = await supabase
        .from("categories")
        .select("name")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });

      setCategories(
        (categoryData || []).map((item) => item.name)
      );

      if (editId) {
        const { data: offering, error: offeringError } = await supabase
          .from("offerings")
          .select("*")
          .eq("id", editId)
          .single();

        if (offeringError) {
          setMessage(offeringError.message);
          setLoading(false);
          return;
        }

        const item = offering as Offering;

        setPlaceId(item.place_id);
        setName(item.name || "");
        setCategory(item.category || "");
        setDescription(item.description || "");
        setPrice(
          item.price !== null && item.price !== undefined
            ? String(item.price)
            : ""
        );
        setPriceType(item.price_type || "fixed");
        setPriceMax(
          item.price_max !== null && item.price_max !== undefined
            ? String(item.price_max)
            : ""
        );
        setCurrency(item.currency || "ETB");
        setImageUrl(item.image_url || "");
        setIsAvailable(item.is_available);
        setSortOrder(String(item.sort_order ?? 0));
      }

      setLoading(false);
    }

    loadData();
  }, [editId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    if (!placeId) {
      setMessage("Please select a place.");
      return;
    }

    if (!name.trim()) {
      setMessage("Offering name is required.");
      return;
    }
 if (
      (priceType === "fixed" ||
        priceType === "from" ||
        priceType === "range") &&
      !price
    ) {
      setMessage("Please enter a price.");
      return;
    }

    if (priceType === "range" && !priceMax) {
      setMessage("Please enter the maximum price for the range.");
      return;
    }

    setSaving(true);

    const payload = {
      place_id: placeId,
      name: name.trim(),
      category: category.trim() || null,
      description: description.trim() || null,
      price: price ? Number(price) : null,
      price_type: priceType,
      price_max: priceMax ? Number(priceMax) : null,
      currency: currency.trim() || "ETB",
      image_url: imageUrl.trim() || null,
      is_available: isAvailable,
      sort_order: Number(sortOrder) || 0,
      updated_at: new Date().toISOString(),
    };

    let error = null;

    if (isEditing && editId) {
      const result = await supabase
        .from("offerings")
        .update(payload)
        .eq("id", editId);

      error = result.error;
    } else {
      const result = await supabase
        .from("offerings")
        .insert({
          ...payload,
          created_at: new Date().toISOString(),
        });

      error = result.error;
    }

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setMessage(
      isEditing
        ? "Offering updated successfully."
        : "Offering created successfully."
    );

    setTimeout(() => {
      window.location.href = "/admin/menus";
    }, 900);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-white/40">
            Loading offering...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-5xl px-6 py-10 md:px-10">

        {/* Header */}
        <div className="mb-10">
          <Link
            href="/admin/menus"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
          >
            <ArrowLeft size={16} />
            Back to Menu Manager
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10">
              <Utensils
                size={22}
                className="text-[#D4AF37]"
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                MEDER Administration
              </p>

              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                {isEditing ? "Edit Offering" : "Add Offering"}
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/50">
            Add a dish, drink, product, service, activity, or any other
            offering that belongs to a MEDER place.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              message.includes("successfully")
                ? "border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37]"
                : "border-red-500/20 bg-red-500/10 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* 01 Place */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
                01
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Place
              </h2>
 <p className="mt-1 text-sm text-white/40">
                Choose which MEDER place this offering belongs to.
              </p>
            </div>

            <label className="mb-2 block text-sm font-medium text-white/80">
              Place
            </label>

            <select
              value={placeId}
              onChange={(event) => setPlaceId(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-[#D4AF37]/50"
            >
              <option value="">Select a place</option>

              {places.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.name}
                  {place.area ?  `— ${place.area}` : ""}
                </option>
              ))}
            </select>
          </section>

          {/* 02 Basic Information */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
                02
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Basic Information
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Offering Name
                  <span className="ml-2 text-xs font-semibold text-[#D4AF37]">
                    ✨ Required
                  </span>
                </label>

                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Margherita Pizza"
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF37]/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-[#D4AF37]/50"
                >
                  <option value="">Select category</option>

                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs text-white/30">
                  Categories are managed from the MEDER CMS.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Display Order
                </label>

                <input
                  type="number"
                  min="0"
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-[#D4AF37]/50"
                />

                <p className="mt-2 text-xs text-white/30">
                  Lower numbers appear first.
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Description
                </label>
 <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  rows={4}
                  placeholder="Describe this offering..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF37]/50"
                />
              </div>
            </div>
          </section>

          {/* 03 Pricing */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
                03
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Pricing
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Give MEDER accurate pricing information for recommendations.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Price Type
                </label>

                <select
                  value={priceType}
                  onChange={(event) =>
                    setPriceType(
                      event.target.value as
                        | "fixed"
                        | "from"
                        | "range"
                        | "contact"
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-[#D4AF37]/50"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="from">Starting From</option>
                  <option value="range">Price Range</option>
                  <option value="contact">Contact for Price</option>
                </select>
              </div>

              {priceType !== "contact" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    {priceType === "from"
                      ? "Starting Price"
                      : "Price"}
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    placeholder="450"
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF37]/50"
                  />
                </div>
              )}

              {priceType === "range" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Maximum Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={priceMax}
                    onChange={(event) =>
                      setPriceMax(event.target.value)
                    }
                    placeholder="650"
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF37]/50"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Currency
                </label>
 <input
                  value={currency}
                  onChange={(event) =>
                    setCurrency(event.target.value)
                  }
                  placeholder="ETB"
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF37]/50"
                />
              </div>
            </div>
          </section>

          {/* 04 Media */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
                04
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Media
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Add an image for this offering.
              </p>
            </div>

            <label className="mb-2 block text-sm font-medium text-white/80">
              Image URL
            </label>

            <input
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF37]/50"
            />

            <p className="mt-2 text-xs text-white/30">
              We&apos;ll connect this to MEDER media storage later.
            </p>

            {imageUrl && (
              <div className="mt-5 overflow-hidden rounded-xl border border-white/10">
                <img
                  src={imageUrl}
                  alt="Offering preview"
                  className="h-56 w-full object-cover"
                />
              </div>
            )}
          </section>

          {/* 05 Availability */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
                05
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Availability
              </h2>
            </div>

            <label className="flex cursor-pointer items-center justify-between gap-6 rounded-xl border border-white/10 bg-black/40 p-5">
              <div>
                <p className="font-medium">
                  Available for customers
                </p>

                <p className="mt-1 text-sm text-white/40">
                  Turn this off if the offering is temporarily unavailable.
                </p>
              </div>

              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(event) =>
                  setIsAvailable(event.target.checked)
                }
                className="h-5 w-5 accent-[#D4AF37]"
              />
            </label>
          </section>

          {/* Save */}
          <div className="flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:justify-end">
            <Link
              href="/admin/menus"
              className="rounded-xl border border-white/10 px-6 py-3 text-center text-sm font-medium text-white/60 transition hover:border-white/20 hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-7 py-3 text-sm font-semibold text-black transition hover:bg-[#e3c45a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />
 {saving
                ? "Saving..."
                : isEditing
                ? "Save Changes"
                : "Create Offering"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
export default function NewOfferingPageWrapper() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#050505] px-5 py-16 text-white md:px-8">
          <div className="mx-auto max-w-5xl text-center text-sm text-white/40">
            Loading offering manager...
          </div>
        </main>
      }
    >
      <NewOfferingPage />
    </Suspense>
  );
}