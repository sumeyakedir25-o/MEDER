 "use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Search,
  Send,
} from "lucide-react";
import { createClient } from "@/Lib/supabase/client";

type Place = {
  id: string;
  name: string;
  type: string | null;
  area: string | null;
  status: string;
};

export default function BusinessClaimPage() {
  const supabase = createClient();

  const [places, setPlaces] = useState<Place[]>([]);
  const [search, setSearch] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadPlaces() {
      setLoading(true);

      const { data, error } = await supabase
        .from("places")
        .select("id, name, type, area, status")
        .eq("status", "published")
        .order("name", { ascending: true });

      if (error) {
        console.error("Failed to load places:", error);
        setPlaces([]);
      } else {
        setPlaces((data || []) as Place[]);
      }

      setLoading(false);
    }

    loadPlaces();
  }, [supabase]);

  const filteredPlaces = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return places.slice(0, 6);
    }

    return places
      .filter((place) => {
        return (
          place.name.toLowerCase().includes(query) ||
          place.area?.toLowerCase().includes(query) ||
          place.type?.toLowerCase().includes(query)
        );
      })
      .slice(0, 6);
  }, [places, search]);

  const selectedPlace = places.find(
    (place) => place.id === selectedPlaceId,
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedPlace) {
      return;
    }

    setSubmitting(true);

    const form = new FormData(event.currentTarget);

    const ownerName = String(form.get("ownerName") || "").trim();
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();

    const { error } = await supabase
      .from("business_claims")
      .insert({
        place_id: selectedPlace.id,
        owner_name: ownerName,
        email,
        phone: phone || null,
        status: "pending",
      });

    if (error) {
      console.error("Claim submission failed:", error);
      alert(`We couldn't submit your claim: ${error.message}`);
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-black px-4 py-16 text-white sm:px-6">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/10">
              <CheckCircle2 className="h-8 w-8 text-[#D4AF37]" />
            </div>

            <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
              Claim submitted
            </p>

            <h1 className="mt-3 font-serif text-3xl text-white sm:text-4xl">
              We received your request
            </h1>

            <p className="mt-4 text-sm leading-7 text-white/50">
              Your claim for{" "}
              <span className="text-white">{selectedPlace?.name}</span> is now
              pending review.
            </p>

            <div className="mt-7 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4 text-left">
              <p className="text-xs font-medium uppercase tracking-wider text-[#D4AF37]">
                Claim status
              </p>
 <p className="mt-2 text-sm text-white">
                Pending MEDER verification
              </p>
            </div>

            <Link
              href="/for-business"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
            >
              Back to For Business
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/for-business"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to For Business
        </Link>

        <div className="mt-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
            <Building2 className="h-6 w-6 text-[#D4AF37]" />
          </div>

          <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
            For businesses
          </p>

          <h1 className="mt-2 font-serif text-3xl text-white sm:text-5xl">
            Claim your business
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
            Already listed on MEDER? Find your business and request access to
            manage its profile.
          </p>
        </div>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <label
            htmlFor="business-search"
            className="text-xs font-medium uppercase tracking-[0.2em] text-white/40"
          >
            Find your business
          </label>

          <div className="relative mt-3">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />

            <input
              id="business-search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setSelectedPlaceId("");
              }}
              placeholder="Search by business name, area, or type..."
              className="min-h-14 w-full rounded-2xl border border-white/10 bg-black/30 pl-12 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37]/50"
            />
          </div>

          <div className="mt-4 space-y-2">
            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center">
                <p className="text-sm text-white/40">
                  Loading businesses...
                </p>
              </div>
            ) : filteredPlaces.length > 0 ? (
              filteredPlaces.map((place) => {
                const selected = selectedPlaceId === place.id;

                return (
                  <button
                    key={place.id}
                    type="button"
                    onClick={() => setSelectedPlaceId(place.id)}
                    className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "border-[#D4AF37]/60 bg-[#D4AF37]/10"
                        : "border-white/10 bg-black/20 hover:border-white/20"
                    }`}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5">
                      <Building2 className="h-5 w-5 text-[#D4AF37]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {place.name}
                      </p>

                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/40">
                        <span>{place.type || "Business"}</span>
 <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {place.area || "Location not listed"}
                        </span>
                      </div>
                    </div>

                    {selected && (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#D4AF37]" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center">
                <p className="text-sm text-white/50">
                  No businesses found.
                </p>

                <Link
                  href="/for-business/register"
                  className="mt-3 inline-block text-sm text-[#D4AF37] hover:underline"
                >
                  Register a new business instead →
                </Link>
              </div>
            )}
          </div>
        </section>

        {selectedPlace && (
          <form
            onSubmit={handleSubmit}
            className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                Claim request
              </p>

              <h2 className="mt-2 font-serif text-2xl text-white">
                Claim {selectedPlace.name}
              </h2>

              <p className="mt-2 text-sm text-white/40">
                Tell us who you are and how we can verify your connection to
                this business.
              </p>
            </div>

            <div className="mt-7 space-y-5">
              <div>
                <label
                  htmlFor="ownerName"
                  className="text-sm font-medium text-white/80"
                >
                  Owner / manager name
                </label>

                <input
                  id="ownerName"
                  name="ownerName"
                  type="text"
                  required
                  placeholder="Your full name"
                  className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37]/50"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-white/80"
                  >
                    Email
                  </label>

                  <div className="relative mt-2">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="min-h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37]/50"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-white/80"
                  >
                    Phone
                  </label>

                  <div className="relative mt-2">
                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                    <input
                      id="phone"
                      name="phone"
 type="tel"
                      required
                      placeholder="+251 ..."
                      className="min-h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37]/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs leading-5 text-white/40">
                MEDER will review your claim before granting business access.
                Your request will remain pending until verification is
                completed.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#E5C158] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {submitting ? "Submitting..." : "Submit claim request"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}