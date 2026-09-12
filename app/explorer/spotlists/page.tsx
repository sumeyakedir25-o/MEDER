 "use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  Compass,
  MapPin,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { mederPlaces } from "@/Lib/meder/places";

interface Spotlist {
  id: string;
  name: string;
  description: string;
  placeIds: string[];
  createdAt: string;
}

export default function SpotlistsPage() {
  const [spotlists, setSpotlists] = useState<Spotlist[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);

  useEffect(() => {
    const storedSpotlists = JSON.parse(
      localStorage.getItem("meder-spotlists") || "[]",
    );

    setSpotlists(storedSpotlists);
  }, []);

  const togglePlace = (placeId: string) => {
    setSelectedPlaces((current) =>
      current.includes(placeId)
        ? current.filter((id) => id !== placeId)
        : [...current, placeId],
    );
  };

  const closeCreateForm = () => {
    setShowCreateForm(false);
    setName("");
    setDescription("");
    setSelectedPlaces([]);
  };

  const createSpotlist = () => {
    if (!name.trim()) return;

    const newSpotlist: Spotlist = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      placeIds: selectedPlaces,
      createdAt: new Date().toISOString(),
    };

    const updatedSpotlists = [newSpotlist, ...spotlists];

    localStorage.setItem(
      "meder-spotlists",
      JSON.stringify(updatedSpotlists),
    );

    setSpotlists(updatedSpotlists);

    closeCreateForm();
  };

  const deleteSpotlist = (spotlistId: string) => {
    const updatedSpotlists = spotlists.filter(
      (spotlist) => spotlist.id !== spotlistId,
    );

    localStorage.setItem(
      "meder-spotlists",
      JSON.stringify(updatedSpotlists),
    );

    setSpotlists(updatedSpotlists);
  };

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/explorer"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Explorer
        </Link>

        {/* Header */}
        <section className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
              Your collections
            </p>

            <h1 className="mt-3 font-serif text-3xl text-white sm:text-5xl">
              Spotlists
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/45 sm:text-base">
              Create collections of places for your moods, plans,
              people, and future adventures.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
          >
            <Plus className="h-4 w-4" />
            Create spotlist
          </button>
        </section>

        {/* Spotlists */}
        {spotlists.length > 0 ? (
          <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {spotlists.map((spotlist) => {
              const places = mederPlaces.filter((place) =>
                spotlist.placeIds.includes(place.id),
              );

              return (
                <article
                  key={spotlist.id}
 className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition hover:border-[#D4AF37]/40"
                >
                  <div className="relative p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                        <Compass className="h-6 w-6 text-[#D4AF37]" />
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteSpotlist(spotlist.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-white/30 transition hover:bg-red-500/10 hover:text-red-400"
                        aria-label={`Delete ${spotlist.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <h2 className="mt-6 font-serif text-2xl text-white">
                      {spotlist.name}
                    </h2>

                    {spotlist.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/45">
                        {spotlist.description}
                      </p>
                    )}

                    <div className="mt-6 flex items-center gap-2 text-xs text-white/40">
                      <MapPin className="h-4 w-4 text-[#D4AF37]" />

                      {places.length}{" "}
                      {places.length === 1 ? "place" : "places"}
                    </div>
                  </div>

                  {places.length > 0 && (
                    <div className="grid grid-cols-3 gap-px bg-white/10">
                      {places.slice(0, 3).map((place) => (
                        <Link
                          key={place.id}
                          href={`/places/${place.id}`}
                          className="aspect-square overflow-hidden bg-black"
                        >
                          <img
                            src={place.image}
                            alt={place.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        </Link>
                      ))}
                    </div>
                  )}

                  {places.length === 0 && (
                    <div className="flex min-h-28 items-center justify-center border-t border-white/10 bg-black/20 text-xs text-white/30">
                      No places added yet
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        ) : (
          <section className="mt-8 rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/10">
              <Bookmark className="h-7 w-7 text-[#D4AF37]" />
            </div>

            <h2 className="mt-6 font-serif text-2xl text-white">
              Create your first Spotlist
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/45">
              Collect places around a mood, plan, person, or idea.
              Your perfect place list starts here.
            </p>

            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
            >
              <Plus className="h-4 w-4" />
              Create Spotlist
            </button>
          </section>
        )}
 {/* Create modal */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 px-4 py-6 backdrop-blur-sm">
            <div className="flex min-h-full items-center justify-center">
              <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#111] p-6 shadow-2xl sm:p-8">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                      New collection
                    </p>

                    <h2 className="mt-3 font-serif text-2xl text-white">
                      Create a Spotlist
                    </h2>

                    <p className="mt-2 text-sm text-white/45">
                      Give your collection a name and choose places
                      to add.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeCreateForm}
                    className="rounded-full p-2 text-white/40 transition hover:bg-white/10 hover:text-white"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-7">
                  <label className="text-xs font-medium uppercase tracking-[0.15em] text-white/40">
                    Spotlist name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="For example: Date Night Ideas"
                    className="mt-3 min-h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#D4AF37]/50"
                  />
                </div>

                <div className="mt-5">
                  <label className="text-xs font-medium uppercase tracking-[0.15em] text-white/40">
                    Description{" "}
                    <span className="normal-case">(optional)</span>
                  </label>

                  <textarea
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    placeholder="What is this collection for?"
                    rows={3}
                    className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#D4AF37]/50"
                  />
                </div>

                <div className="mt-7">
                  <div className="flex items-center justify-between gap-4">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-white/40">
                      Add places
                    </label>

                    <span className="text-xs text-[#D4AF37]">
                      {selectedPlaces.length} selected
                    </span>
                  </div>

                  <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
                    {mederPlaces.map((place) => {
                      const selected = selectedPlaces.includes(
                        place.id,
                      );

                      return (
                        <button
                          key={place.id}
                          type="button"
                          onClick={() => togglePlace(place.id)}
                          className={`flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition ${
 selected
                              ? "border-[#D4AF37]/50 bg-[#D4AF37]/10"
                              : "border-white/10 bg-white/[0.02] hover:border-white/20"
                          }`}
                        >
                          <img
                            src={place.image}
                            alt={place.name}
                            className="h-14 w-14 shrink-0 rounded-xl object-cover"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-white">
                              {place.name}
                            </p>

                            <p className="mt-1 truncate text-xs text-white/40">
                              {place.type} · {place.area}
                            </p>
                          </div>

                          <div
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
                              selected
                                ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                                : "border-white/20 text-transparent"
                            }`}
                          >
                            ✓
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeCreateForm}
                    className="min-h-11 rounded-xl border border-white/10 px-5 text-sm text-white/60 transition hover:border-white/20 hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={createSpotlist}
                    disabled={!name.trim()}
                    className="min-h-11 rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black transition hover:bg-[#E5C158] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Create Spotlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}