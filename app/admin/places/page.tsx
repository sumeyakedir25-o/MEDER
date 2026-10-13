 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/Lib/supabase/client";
import FreshnessBadge from "@/components/place/freshnessbadge";

type Place = {
  id: string;
  name: string;
  type: string | null;
  category: string | null;
  area: string | null;
  status: "draft" | "published" | "archived";
  verification_status: string | null;
  created_at: string;
  updated_at: string;
  last_verified_at: string | null;
};

export default function AdminPlacesPage() {
  const supabase = createClient();

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadPlaces() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("places")
      .select(
  "id, name, type, category, area, status, verification_status, last_verified_at, created_at, updated_at"
)
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setPlaces((data as Place[]) || []);
    setLoading(false);
  }
  async function archivePlace(placeId: string, placeName: string) {
  const confirmed = window.confirm(
    `Are you sure you want to archive "${placeName}"?`
  );

  if (!confirmed) return;

  setMessage("");

  const { error } = await supabase
    .from("places")
    .update({ status: "archived" })
    .eq("id", placeId);

  if (error) {
    setMessage(error.message);
    return;
  }

  setMessage(`"${placeName}" has been archived.`);

  await loadPlaces();
}
async function restorePlace(placeId: string, placeName: string) {
  const confirmed = window.confirm(
    `Restore "${placeName}" and make it a draft?`
  );

  if (!confirmed) return;

  setMessage("");

  const { error } = await supabase
    .from("places")
    .update({ status: "draft" })
    .eq("id", placeId);

  if (error) {
    setMessage(error.message);
    return;
  }

  setMessage(`"${placeName}" has been restored as a draft.`);

  await loadPlaces();
}

  useEffect(() => {
    loadPlaces();
  }, []);

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
              Places
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
              Manage every place in the MEDER platform from one central place.
            </p>
          </div>

          <Link
            href="/admin/places/new"
            className="inline-flex items-center justify-center rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#e4c45a]"
          >
            + Add Place
          </Link>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {message}
          </div>
        )}

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-wider text-white/40">
              Total
            </p>
            <p className="mt-2 text-2xl font-semibold">{places.length}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-wider text-white/40">
              Published
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {places.filter((place) => place.status === "published").length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-wider text-white/40">
              Drafts
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {places.filter((place) => place.status === "draft").length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-wider text-white/40">
              Archived
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {places.filter((place) => place.status === "archived").length}
            </p>
          </div>
        </div>
 {/* Places */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          <div className="border-b border-white/10 px-5 py-5">
            <h2 className="font-semibold">All Places</h2>
            <p className="mt-1 text-sm text-white/40">
              Select a place to edit its MEDER information.
            </p>
          </div>

          {loading ? (
            <div className="px-5 py-12 text-center text-sm text-white/40">
              Loading places...
            </div>
          ) : places.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <p className="text-lg font-medium">No places yet</p>

              <p className="mt-2 text-sm text-white/40">
                Add your first place to start building the MEDER database.
              </p>

              <Link
                href="/admin/places/new"
                className="mt-6 inline-flex rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black"
              >
                Add Your First Place
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {places.map((place) => (
                <div
                  key={place.id}
                  className="flex flex-col gap-5 px-5 py-5 transition hover:bg-white/[0.03] md:flex-row md:items-center md:justify-between"
                >
                  {/* Place information */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="truncate font-semibold">
                        {place.name}
                      </h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                          place.status === "published"
                            ? "bg-emerald-500/10 text-emerald-300"
                            : place.status === "draft"
                              ? "bg-amber-500/10 text-amber-300"
                              : "bg-white/10 text-white/45"
                        }`}
                      >
                        {place.status}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-white/45">
                      {place.type && <span>{place.type}</span>}
                      {place.area && <span>• {place.area}</span>}
                      {place.category && <span>• {place.category}</span>}
                    </div>

                    {place.verification_status && (
                      <p className="mt-2 text-xs text-[#D4AF37]/80">
                        {place.verification_status}
                      </p>
                    )}
                    <div>
  <p className="text-sm text-white/50">
    {place.verification_status || "Unverified"}
  </p>

  <div className="mt-2">
    <FreshnessBadge
      lastVerifiedAt={place.last_verified_at}
      compact
    />
  </div>
</div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 gap-3">
  <Link
    href={`/places/${place.id}`}
    target="_blank"
    className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/70 transition hover:border-white/20 hover:text-white"
  >
    View
  </Link>

  <Link
    href={`/admin/places/new?edit=${place.id}`}
    className="rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#e4c45a]"
  >
    {place.status === "draft" ? "Continue Editing" : "Edit"}
  </Link>
  {place.status !== "archived" && (
  <button
    type="button"
    onClick={() => archivePlace(place.id, place.name)}
    className="rounded-xl border border-red-500/20 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:border-red-500/40 hover:bg-red-500/10"
  >
    Archive
  </button>
)}
{place.status === "archived" && (
  <button
    type="button"
    onClick={() => restorePlace(place.id, place.name)}
    className="rounded-xl border border-[#D4AF37]/30 px-4 py-2.5 text-sm font-medium text-[#D4AF37] transition hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/10"
  >
    Restore
  </button>
)}
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