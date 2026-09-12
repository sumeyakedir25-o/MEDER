 "use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Edit3,
  Plus,
  Search,
  Trash2,
  Utensils,
} from "lucide-react";
import { createClient } from "@/Lib/supabase/client";

type Place = {
  id: string;
  name: string;
  area: string | null;
  status: "draft" | "published" | "archived";
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

export default function AdminMenusPage() {
  const supabase = createClient();

  const [places, setPlaces] = useState<Place[]>([]);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  async function loadData() {
    setLoading(true);
    setMessage("");

    const { data: placeData, error: placeError } = await supabase
      .from("places")
      .select("id, name, area, status")
      .order("name", { ascending: true });

    if (placeError) {
      setMessage(placeError.message);
      setLoading(false);
      return;
    }

    const { data: offeringData, error: offeringError } = await supabase
      .from("offerings")
      .select(
        "id, place_id, name, category, description, price, price_type, price_max, currency, image_url, is_available, sort_order"
      )
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (offeringError) {
      setMessage(offeringError.message);
      setLoading(false);
      return;
    }

    const loadedPlaces = (placeData || []) as Place[];
    const loadedOfferings = (offeringData || []) as Offering[];

    setPlaces(loadedPlaces);
    setOfferings(loadedOfferings);

    setSelectedPlaceId((current) => {
      if (
        current &&
        loadedPlaces.some((place) => place.id === current)
      ) {
        return current;
      }

      if (loadedOfferings.length > 0) {
        const offeringPlaceExists = loadedPlaces.some(
          (place) => place.id === loadedOfferings[0].place_id
        );

        if (offeringPlaceExists) {
          return loadedOfferings[0].place_id;
        }
      }

      return loadedPlaces[0]?.id || "";
    });

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const selectedPlace = places.find(
    (place) => place.id === selectedPlaceId
  );

  const selectedPlaceOfferings = useMemo(() => {
    return offerings.filter(
      (offering) => offering.place_id === selectedPlaceId
    );
  }, [offerings, selectedPlaceId]);

  const filteredOfferings = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return selectedPlaceOfferings;
    }

    return selectedPlaceOfferings.filter((offering) => {
      return (
        offering.name.toLowerCase().includes(searchText) ||
        offering.category?.toLowerCase().includes(searchText) ||
        offering.description?.toLowerCase().includes(searchText)
      );
    });
  }, [selectedPlaceOfferings, search]);

  const availableCount = selectedPlaceOfferings.filter(
    (offering) => offering.is_available
  ).length;

  const unavailableCount = selectedPlaceOfferings.filter(
    (offering) => !offering.is_available
  ).length;

  const categoryGroups = useMemo(() => {
    const groups: Record<string, Offering[]> = {};

    filteredOfferings.forEach((offering) => {
      const category =
        offering.category?.trim() || "Uncategorized";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(offering);
    });
 return Object.entries(groups).sort(([a], [b]) =>
      a.localeCompare(b)
    );
  }, [filteredOfferings]);

  function formatPrice(offering: Offering) {
    if (offering.price_type === "contact") {
      return "Contact";
    }

    if (offering.price_type === "from") {
      return `From ${offering.currency} ${offering.price ?? 0}`;
    }

    if (offering.price_type === "range") {
      return `${offering.currency} ${offering.price ?? 0} – ${offering.price_max ?? 0}`;
    }

    return `${offering.currency} ${offering.price ?? 0}`;
  }

  async function toggleAvailability(
    offering: Offering
  ) {
    setActionLoading(offering.id);
    setMessage("");

    const newAvailability = !offering.is_available;

    const { error } = await supabase
      .from("offerings")
      .update({
        is_available: newAvailability,
        updated_at: new Date().toISOString(),
      })
      .eq("id", offering.id);

    if (error) {
      setMessage(error.message);
      setActionLoading("");
      return;
    }

    setOfferings((current) =>
      current.map((item) =>
        item.id === offering.id
          ? {
              ...item,
              is_available: newAvailability,
            }
          : item
      )
    );

    setMessage(
      `"${offering.name}" is now ${
        newAvailability ? "available" : "unavailable"
      }.`
    );

    setActionLoading("");
  }

  async function deleteOffering(
    offering: Offering
  ) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${offering.name}"?`
    );

    if (!confirmed) return;

    setActionLoading(offering.id);
    setMessage("");

    const { error } = await supabase
      .from("offerings")
      .delete()
      .eq("id", offering.id);

    if (error) {
      setMessage(error.message);
      setActionLoading("");
      return;
    }

    setOfferings((current) =>
      current.filter((item) => item.id !== offering.id)
    );

    setMessage(`"${offering.name}" has been deleted.`);

    setActionLoading("");
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">

        {/* HEADER */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/admin/dashboard"
              className="mb-5 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
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
                  Menu Manager
                </h1>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/50">
              Manage dishes, drinks, products, services, activities,
              and other offerings for every place on MEDER.
            </p>
          </div>

          <Link
            href={
              selectedPlaceId
                ? `/admin/menus/new?place=${selectedPlaceId}`
                : "/admin/menus/new"
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#e3c45a]"
          >
            <Plus size={18} />
            Add Offering
          </Link>
        </div>
 {/* MESSAGE */}
        {message && (
          <div className="mb-6 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-3 text-sm text-[#D4AF37]">
            {message}
          </div>
        )}

        {/* PLACE SELECTOR */}
        <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
              Select Place
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Choose which place you want to manage
            </h2>
          </div>

          <select
            value={selectedPlaceId}
            onChange={(event) => {
              setSelectedPlaceId(event.target.value);
              setSearch("");
              setMessage("");
            }}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-[#D4AF37]/50 md:max-w-xl"
          >
            {places.length === 0 && (
              <option value="">No places available</option>
            )}

            {places.map((place) => (
              <option key={place.id} value={place.id}>
                {place.name}
                {place.area ?  `— ${place.area}` : ""}
              </option>
            ))}
          </select>
        </section>

        {/* STATS */}
        {selectedPlace && (
          <section className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-white/40">
                Total Offerings
              </p>

              <p className="mt-3 text-3xl font-semibold">
                {selectedPlaceOfferings.length}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-white/40">
                Available
              </p>

              <p className="mt-3 text-3xl font-semibold text-[#D4AF37]">
                {availableCount}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-white/40">
                Unavailable
              </p>

              <p className="mt-3 text-3xl font-semibold">
                {unavailableCount}
              </p>
            </div>
          </section>
        )}

        {/* SEARCH */}
        <section className="mb-6">
          <div className="relative max-w-xl">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search offerings..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#D4AF37]/50"
            />
          </div>
        </section>

        {/* MENU */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-lg font-semibold">
              {selectedPlace
                ? `${selectedPlace.name} — Menu`
                : "Menu"}
            </h2>

            <p className="mt-1 text-sm text-white/40">
              Organize and manage everything this place offers.
            </p>
          </div>
 {loading ? (
            <div className="px-6 py-16 text-center text-sm text-white/40">
              Loading menu...
            </div>
          ) : !selectedPlace ? (
            <div className="px-6 py-16 text-center">
              <p className="text-white/50">
                Create a place first before adding offerings.
              </p>

              <Link
                href="/admin/places/new"
                className="mt-5 inline-flex rounded-xl border border-[#D4AF37]/30 px-5 py-3 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
              >
                Add Place
              </Link>
            </div>
          ) : filteredOfferings.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10">
                <Utensils
                  size={22}
                  className="text-[#D4AF37]"
                />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                {search
                  ? "No matching offerings"
                  : "No offerings yet"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
                {search
                  ? "Try a different search term."
                  : "Start building this place's menu by adding the first offering."}
              </p>

              {!search && (
                <Link
                  href={`/admin/menus/new?place=${selectedPlaceId}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#e3c45a]"
                >
                  <Plus size={18} />
                  Add First Offering
                </Link>
              )}
            </div>
          ) : (
            <div>
              {categoryGroups.map(
                ([categoryName, categoryOfferings]) => (
                  <div key={categoryName}>

                    {/* CATEGORY */}
                    <div className="border-b border-white/10 bg-white/[0.015] px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
                            Category
                          </p>

                          <h3 className="mt-1 text-lg font-semibold">
                            {categoryName}
                          </h3>
                        </div>

                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/40">
                          {categoryOfferings.length}{" "}
                          {categoryOfferings.length === 1
                            ? "item"
                            : "items"}
                        </span>
                      </div>
                    </div>

                    {/* ITEMS */}
                    <div className="divide-y divide-white/10">
                      {categoryOfferings.map((offering) => (
                        <div
                          key={offering.id}
                          className="flex flex-col gap-5 px-6 py-5 transition hover:bg-white/[0.02] md:flex-row md:items-center md:justify-between"
                        >
                          <div className="flex min-w-0 gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                              {offering.image_url ? (
                                <img
 src={offering.image_url}
                                  alt={offering.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Utensils
                                  size={18}
                                  className="text-white/30"
                                />
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-3">
                                <h4 className="font-semibold">
                                  {offering.name}
                                </h4>

                                <span
                                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                    offering.is_available
                                      ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                                      : "bg-white/5 text-white/40"
                                  }`}
                                >
                                  {offering.is_available
                                    ? "Available"
                                    : "Unavailable"}
                                </span>
                              </div>

                              {offering.description && (
                                <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-5 text-white/40">
                                  {offering.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 md:justify-end">
                            <p className="mr-2 text-sm font-semibold text-[#D4AF37]">
                              {formatPrice(offering)}
                            </p>

                            <button
                              type="button"
                              disabled={
                                actionLoading === offering.id
                              }
                              onClick={() =>
                                toggleAvailability(offering)
                              }
                              className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                offering.is_available
                                  ? "border-white/10 text-white/60 hover:border-white/20 hover:text-white"
                                  : "border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
                              }`}
                            >
                              {actionLoading === offering.id
                                ? "..."
                                : offering.is_available
                                ? "Mark Unavailable"
                                : "Mark Available"}
                            </button>

                            <Link
                              href={`/admin/menus/new?edit=${offering.id}`}
                              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/70 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                            >
                              <Edit3 size={16} />
                              Edit
                            </Link>

                            <button
                              type="button"
                              disabled={
                                actionLoading === offering.id
 }
                              onClick={() =>
                                deleteOffering(offering)
                              }
                              className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:border-red-500/40 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* NOTE */}
        <div className="mt-8 rounded-2xl border border-[#D4AF37]/10 bg-[#D4AF37]/[0.03] p-6">
          <p className="text-sm font-semibold text-[#D4AF37]">
            MEDER Menu Intelligence
          </p>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/50">
            Every offering belongs to a specific place. MEDER can use
            category, price, availability, and other offering information
            when generating personalized recommendations through MEDER IT.
          </p>
        </div>
      </div>
    </main>
  );
}