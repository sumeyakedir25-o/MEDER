 "use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Image as ImageIcon,
  Plus,
  Search,
  Star,
  Trash2,
  Video,
} from "lucide-react";
import { createClient } from "@/Lib/supabase/client";

type Place = {
  id: string;
  name: string;
  area: string | null;
  status: "draft" | "published" | "archived";
};

type Media = {
  id: string;
  place_id: string;
  media_type: "image" | "video";
  title: string | null;
  url: string;
  thumbnail_url: string | null;
  alt_text: string | null;
  sort_order: number;
  is_cover: boolean;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
};

export default function AdminMediaPage() {
  const supabase = createClient();

  const [places, setPlaces] = useState<Place[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
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

    const { data: mediaData, error: mediaError } = await supabase
      .from("place_media")
      .select(
        "id, place_id, media_type, title, url, thumbnail_url, alt_text, sort_order, is_cover, is_featured, is_active, created_at"
      )
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (mediaError) {
      setMessage(mediaError.message);
      setLoading(false);
      return;
    }

    const loadedPlaces = (placeData || []) as Place[];
    const loadedMedia = (mediaData || []) as Media[];

    setPlaces(loadedPlaces);
    setMedia(loadedMedia);

    setSelectedPlaceId((current) => {
      if (
        current &&
        loadedPlaces.some((place) => place.id === current)
      ) {
        return current;
      }

      if (loadedMedia.length > 0) {
        const firstMediaPlace = loadedPlaces.find(
          (place) => place.id === loadedMedia[0].place_id
        );

        if (firstMediaPlace) {
          return firstMediaPlace.id;
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

  const selectedMedia = useMemo(() => {
    return media.filter(
      (item) => item.place_id === selectedPlaceId
    );
  }, [media, selectedPlaceId]);

  const filteredMedia = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return selectedMedia;
    }

    return selectedMedia.filter((item) => {
      return (
        item.title?.toLowerCase().includes(searchText) ||
        item.url.toLowerCase().includes(searchText) ||
        item.media_type.toLowerCase().includes(searchText)
      );
    });
  }, [selectedMedia, search]);

  const imageCount = selectedMedia.filter(
    (item) => item.media_type === "image"
  ).length;

  const videoCount = selectedMedia.filter(
    (item) => item.media_type === "video"
  ).length;

  async function setCover(mediaItem: Media) {
    setActionLoading(mediaItem.id);
    setMessage("");

    const { error: clearError } = await supabase
      .from("place_media")
      .update({
        is_cover: false,
        updated_at: new Date().toISOString(),
      })
      .eq("place_id", mediaItem.place_id);

    if (clearError) {
      setMessage(clearError.message);
      setActionLoading("");
      return;
    }
 const { error: setError } = await supabase
      .from("place_media")
      .update({
        is_cover: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", mediaItem.id);

    if (setError) {
      setMessage(setError.message);
      setActionLoading("");
      return;
    }

    setMedia((current) =>
      current.map((item) => ({
        ...item,
        is_cover: item.id === mediaItem.id,
      }))
    );

    setMessage(`"${mediaItem.title || "Media"}" is now the cover image.`);
    setActionLoading("");
  }

  async function setFeatured(mediaItem: Media) {
    setActionLoading(mediaItem.id);
    setMessage("");

    const newFeatured = !mediaItem.is_featured;

    const { error } = await supabase
      .from("place_media")
      .update({
        is_featured: newFeatured,
        updated_at: new Date().toISOString(),
      })
      .eq("id", mediaItem.id);

    if (error) {
      setMessage(error.message);
      setActionLoading("");
      return;
    }

    setMedia((current) =>
      current.map((item) =>
        item.id === mediaItem.id
          ? {
              ...item,
              is_featured: newFeatured,
            }
          : item
      )
    );

    setMessage(
      `"${mediaItem.title || "Media"}" ${
        newFeatured ? "is now featured." : "is no longer featured."
      }`
    );

    setActionLoading("");
  }

  async function toggleActive(mediaItem: Media) {
    setActionLoading(mediaItem.id);
    setMessage("");

    const newActive = !mediaItem.is_active;

    const { error } = await supabase
      .from("place_media")
      .update({
        is_active: newActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", mediaItem.id);

    if (error) {
      setMessage(error.message);
      setActionLoading("");
      return;
    }

    setMedia((current) =>
      current.map((item) =>
        item.id === mediaItem.id
          ? {
              ...item,
              is_active: newActive,
            }
          : item
      )
    );

    setMessage(
      `"${mediaItem.title || "Media"}" ${
        newActive ? "is active." : "has been hidden."
      }`
    );

    setActionLoading("");
  }

  async function deleteMedia(mediaItem: Media) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${
        mediaItem.title || "this media"
      }"?`
    );

    if (!confirmed) return;

    setActionLoading(mediaItem.id);
    setMessage("");

    const { error } = await supabase
      .from("place_media")
      .delete()
      .eq("id", mediaItem.id);

    if (error) {
      setMessage(error.message);
      setActionLoading("");
      return;
    }

    setMedia((current) =>
      current.filter((item) => item.id !== mediaItem.id)
    );

    setMessage(
      `"${mediaItem.title || "Media"}" has been deleted.`
    );

    setActionLoading("");
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">

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
                <ImageIcon
                  size={22}
                  className="text-[#D4AF37]"
                />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                  MEDER Administration
                </p>
 <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                  Media Manager
                </h1>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/50">
              Manage photos, videos, cover images, featured media,
              and visual content for every place on MEDER.
            </p>
          </div>

          <Link
            href={
              selectedPlaceId
                ? `/admin/media/new?place=${selectedPlaceId}`
                : "/admin/media/new"
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#e3c45a]"
          >
            <Plus size={18} />
            Add Media
          </Link>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-3 text-sm text-[#D4AF37]">
            {message}
          </div>
        )}

        <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
            Select Place
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Choose which place you want to manage
          </h2>

          <select
            value={selectedPlaceId}
            onChange={(event) => {
              setSelectedPlaceId(event.target.value);
              setSearch("");
              setMessage("");
            }}
            className="mt-5 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37]/50 md:max-w-xl"
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

        {selectedPlace && (
          <section className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-white/40">
                Total Media
              </p>

              <p className="mt-3 text-3xl font-semibold">
                {selectedMedia.length}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-white/40">
                Images
              </p>

              <p className="mt-3 text-3xl font-semibold text-[#D4AF37]">
                {imageCount}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-white/40">
                Videos
              </p>

              <p className="mt-3 text-3xl font-semibold">
                {videoCount}
              </p>
            </div>
          </section>
        )}

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
              placeholder="Search media..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#D4AF37]/50"
            />
          </div>
        </section>
 <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-lg font-semibold">
              {selectedPlace
                ? `${selectedPlace.name} — Media`
                : "Media"}
            </h2>

            <p className="mt-1 text-sm text-white/40">
              Control how this place appears visually across MEDER.
            </p>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center text-sm text-white/40">
              Loading media...
            </div>
          ) : !selectedPlace ? (
            <div className="px-6 py-16 text-center">
              <p className="text-white/50">
                Create a place first before adding media.
              </p>

              <Link
                href="/admin/places/new"
                className="mt-5 inline-flex rounded-xl border border-[#D4AF37]/30 px-5 py-3 text-sm font-semibold text-[#D4AF37] hover:bg-[#D4AF37]/10"
              >
                Add Place
              </Link>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10">
                <ImageIcon
                  size={22}
                  className="text-[#D4AF37]"
                />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                {search
                  ? "No matching media"
                  : "No media yet"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
                {search
                  ? "Try a different search term."
                  : "Add photos or videos to make this place profile more compelling."}
              </p>

              {!search && (
                <Link
                  href={`/admin/media/new?place=${selectedPlaceId}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black"
                >
                  <Plus size={18} />
                  Add First Media
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredMedia.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-black"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.03]">
                    {item.media_type === "image" ? (
                      <img
                        src={item.url}
                        alt={item.alt_text || item.title || ""}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Video
                          size={42}
                          className="text-[#D4AF37]"
                        />
                      </div>
                    )}

                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      {item.is_cover && (
                        <span className="rounded-full bg-[#D4AF37] px-3 py-1 text-[11px] font-bold text-black">
                          COVER
                        </span>
                      )}

                      {item.is_featured && (
                        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-black">
                          FEATURED
                        </span>
                      )}
 {!item.is_active && (
                        <span className="rounded-full bg-black/80 px-3 py-1 text-[11px] font-bold text-white/60">
                          HIDDEN
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">
                          {item.title || "Untitled Media"}
                        </h3>

                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-white/30">
                          {item.media_type}
                        </p>
                      </div>

                      {item.media_type === "image" && (
                        <ImageIcon
                          size={18}
                          className="shrink-0 text-white/30"
                        />
                      )}

                      {item.media_type === "video" && (
                        <Video
                          size={18}
                          className="shrink-0 text-white/30"
                        />
                      )}
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      {item.media_type === "image" && (
                        <button
                          type="button"
                          disabled={
                            actionLoading === item.id
                          }
                          onClick={() => setCover(item)}
                          className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
                            item.is_cover
                              ? "border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]"
                              : "border-white/10 text-white/60 hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
                          }`}
                        >
                          Set Cover
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={
                          actionLoading === item.id
                        }
                        onClick={() => setFeatured(item)}
                        className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
                          item.is_featured
                            ? "border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]"
                            : "border-white/10 text-white/60 hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
                        }`}
                      >
                        <span className="inline-flex items-center gap-1">
                          <Star size={13} />
                          {item.is_featured
                            ? "Featured"
                            : "Feature"}
                        </span>
                      </button>

                      <button
                        type="button"
                        disabled={
                          actionLoading === item.id
                        }
                        onClick={() =>
                          toggleActive(item)
                        }
                        className="rounded-xl border border-white/10 px-3 py-2.5 text-xs font-semibold text-white/60 transition hover:border-white/20 hover:text-white"
                      >
                        {item.is_active
                          ? "Hide"
                          : "Show"}
                      </button>

                      <button
                        type="button"
 disabled={
                          actionLoading === item.id
                        }
                        onClick={() =>
                          deleteMedia(item)
                        }
                        className="inline-flex items-center justify-center gap-1 rounded-xl border border-red-500/20 px-3 py-2.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/10"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="mt-8 rounded-2xl border border-[#D4AF37]/10 bg-[#D4AF37]/[0.03] p-6">
          <p className="text-sm font-semibold text-[#D4AF37]">
            MEDER Media Intelligence
          </p>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/50">
            Media is attached directly to a place. Cover images,
            featured media, photos, and videos can later power
            Place Profiles, Explore, search results, and MEDER IT.
          </p>
        </div>
      </div>
    </main>
  );
}