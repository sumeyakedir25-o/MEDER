"use client";

import MederMap from "@/components/meder/MederMap";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  MapPin,
  Phone,
  MessageCircle,
  Star,
} from "lucide-react";

import { mederPlaces } from "@/Lib/meder/places";

export default function PlaceDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const place = mederPlaces.find((item) => item.id === id);

  const [saved, setSaved] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

useEffect(() => {
  setCurrentTime(new Date());

  const interval = setInterval(() => {
    setCurrentTime(new Date());
  }, 60000);

  return () => clearInterval(interval);
}, []);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    if (!place) return;

    const savedPlaces = JSON.parse(
      localStorage.getItem("meder-saved-places") || "[]",
    );

    setSaved(savedPlaces.includes(place.id));
  }, [place]);

  if (!place) {
    return (
      <main className="min-h-screen bg-black px-5 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-3xl">
            Place not found
          </h1>

          <p className="mt-3 text-sm text-white/50">
            We couldn't find this place in MEDER.
          </p>

          <Link
            href="/discover"
            className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black"
          >
            Back to Discover
          </Link>
        </div>
      </main>
    );
  }
  const dayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  timeZone: "Africa/Addis_Ababa",
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Africa/Addis_Ababa",
});

const todayName = currentTime
  ? dayFormatter.format(currentTime)
  : "";

const currentTimeText = currentTime
  ? timeFormatter.format(currentTime)
  : "";

const currentMinutes = currentTimeText
  ? Number(currentTimeText.split(":")[0]) * 60 +
    Number(currentTimeText.split(":")[1])
  : 0;

const todayHours = place.openingHours?.find(
  (item) => item.day === todayName,
);

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

let isOpen = false;

if (todayHours && currentTime) {
  const openMinutes = timeToMinutes(todayHours.open);
  let closeMinutes = timeToMinutes(todayHours.close);

  // 00:00 means midnight
  if (closeMinutes === 0) {
    closeMinutes = 24 * 60;
  }

  isOpen =
    currentMinutes >= openMinutes &&
    currentMinutes < closeMinutes;
}

  const handleSave = () => {
    const savedPlaces = JSON.parse(
      localStorage.getItem("meder-saved-places") || "[]",
    );

    if (saved) {
      const updated = savedPlaces.filter(
        (savedId: string) => savedId !== place.id,
      );

      localStorage.setItem(
        "meder-saved-places",
        JSON.stringify(updated),
      );

      setSaved(false);
    } else {
      if (!savedPlaces.includes(place.id)) {
        savedPlaces.push(place.id);
      }

      localStorage.setItem(
        "meder-saved-places",
        JSON.stringify(savedPlaces),
      );

      setSaved(true);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Discover
        </Link>

        {/* Hero */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">

          {/* Photo Gallery */}
<div className="p-3 sm:p-4">
  {/* Main photo */}
  <div className="relative h-[320px] overflow-hidden rounded-2xl sm:h-[450px]">
    <img
      src={place.photos?.[activePhoto] || place.image}
      alt={place.name}
      className="h-full w-full object-cover transition duration-500"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

    {/* Place type */}
    <div className="absolute left-4 top-4">
      <span className="rounded-full bg-[#D4AF37] px-4 py-2 text-xs font-bold text-black">
        {place.type}
      </span>
    </div>

    {/* Photo count */}
    <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-2 text-xs text-white backdrop-blur-md">
      {activePhoto + 1} / {place.photos?.length || 1}
    </div>
  </div>

  {/* Photo thumbnails */}
  {place.photos && place.photos.length > 0 && (
    <div className="mt-3 grid grid-cols-4 gap-2">
      {place.photos.slice(0, 4).map((photo, index) => (
        <button
          key={`${photo}-${index}`}
          type="button"
          onClick={() => setActivePhoto(index)}
          className={`relative h-20 overflow-hidden rounded-xl border transition sm:h-24 ${
            activePhoto === index
              ? "border-[#D4AF37] ring-1 ring-[#D4AF37]"
              : "border-white/10 hover:border-white/30"
          }`}
          aria-label={`View photo ${index + 1} of ${place.name}`}
        >
          <img
            src={photo}
            alt={`${place.name} photo ${index + 1}`}
            className="h-full w-full object-cover"
          />

          {activePhoto === index && (
            <div className="absolute inset-0 bg-[#D4AF37]/10" />
          )}
        </button>
      ))}
    </div>
  )}
</div>
          {/* Main information */}
          <div className="p-5 sm:p-8">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

              <div>
                <h1 className="font-serif text-3xl text-white sm:text-5xl">
                  {place.name}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/60">

                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#D4AF37]" />
                    {place.area}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
                    {place.rating}

                    <span className="text-white/35">
                      ({place.reviews} reviews)
                    </span>
                  </span>

                </div>
              </div>
              {/* Save button */}
              <button
                type="button"
                onClick={handleSave}
                aria-label={
                  saved
                    ? "Remove from saved places"
                    : "Save place"
                }
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-medium transition ${
                  saved
                    ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                    : "border-white/10 text-white/70 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                }`}
              >
                <Bookmark
                  className={`h-4 w-4 ${
                    saved ? "fill-current" : ""
                  }`}
                />

                {saved ? "Saved" : "Save Place"}
              </button>

            </div>

            {/* Quick facts */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3">

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Location
                </p>

                <p className="mt-2 text-sm text-white/80">
                  {place.area}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Budget
                </p>

                <p className="mt-2 text-sm text-white/80">
                  {place.budget.join(" · ")}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Best for
                </p>

                <p className="mt-2 text-sm text-white/80">
                  {place.who.join(" · ")}
                </p>
              </div>

            </div>

            {/* Vibe */}
            <div className="mt-8">
              <h2 className="font-serif text-2xl text-white">
                The vibe
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {place.vibe.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-3.5 py-2 text-xs text-[#D4AF37]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* What you can do */}
            <div className="mt-8">
              <h2 className="font-serif text-2xl text-white">
                What you can do
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {place.what.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white/65"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            {/* About */}
{place.description && (
  <section className="mt-10 border-t border-white/10 pt-8">
    <h2 className="font-serif text-2xl text-white">
      About this place
    </h2>

    <p className="mt-4 max-w-3xl text-sm leading-7 text-white/60 sm:text-base">
      {place.description}
    </p>
  </section>
)}

{/* Place details */}
{(place.cuisine?.length ||
  place.amenities?.length ||
  place.payment?.length) && (
  <section className="mt-8 grid gap-4 md:grid-cols-3">

    {/* Cuisine */}
    {place.cuisine?.length && (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h3 className="font-serif text-lg text-white">
          Food & specialties
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {place.cuisine.map((item) => (
            <span
              key={item}
              className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-3 py-1.5 text-xs text-[#D4AF37]"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Menu */}
{place.menu?.length && (
  <section className="mt-10 border-t border-white/10 pt-8">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
          Food & drinks
        </p>

        <h2 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
          Menu
        </h2>
      </div>

      <span className="text-xs text-white/40">
        Sample menu
      </span>
    </div>

    <div className="mt-6 space-y-6">
      {place.menu.map((category) => (
        <div
          key={category.category}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
        >
          {/* Category */}
          <div className="border-b border-white/10 bg-black/20 px-5 py-4">
            <h3 className="font-serif text-xl text-white">
              {category.category}
            </h3>
          </div>

          {/* Items */}
          <div className="divide-y divide-white/10">
            {category.items.map((item) => (
              <div
                key={item.name}
                className="flex items-start justify-between gap-5 px-5 py-4"
              >
                <div>
                  <h4 className="text-sm font-medium text-white">
                    {item.name}
                  </h4>

                  {item.description && (
                    <p className="mt-1 text-xs leading-5 text-white/45">
                      {item.description}
                    </p>
                  )}
                </div>

                <span className="shrink-0 font-medium text-[#D4AF37]">
                  {item.price} ETB
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    <p className="mt-4 text-xs text-white/35">
      Menu items and prices may change. Please confirm with the business before visiting.
    </p>
  </section>
)}

    {/* Amenities */}
    {place.amenities?.length && (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h3 className="font-serif text-lg text-white">
          Amenities
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {place.amenities.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/65"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Payment */}
    {place.payment?.length && (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h3 className="font-serif text-lg text-white">
          Payment
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {place.payment.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/65"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    )}

  </section>
)}
{/* Opening Hours */}
{place.openingHours?.length && (
  <section className="mt-10 border-t border-white/10 pt-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
          Plan your visit
        </p>

        <h2 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
          Opening hours
        </h2>
      </div>

      {currentTime && (
        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium ${
            isOpen
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isOpen ? "bg-green-400" : "bg-red-400"
            }`}
          />

          {isOpen ? "Open now" : "Closed now"}
        </div>
      )}
    </div>

    {/* Today's hours */}
    {todayHours && (
      <div className="mt-6 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5">
        <p className="text-xs uppercase tracking-wider text-white/40">
          Today
        </p>

        <div className="mt-2 flex items-center justify-between gap-4">
          <span className="font-medium text-white">
            {todayHours.day}
          </span>

          <span className="text-[#D4AF37]">
            {todayHours.open} – {todayHours.close}
          </span>
        </div>
      </div>
    )}

    {/* Weekly hours */}
    <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      {place.openingHours.map((item) => {
        const isToday = item.day === todayName;

        return (
          <div
            key={item.day}
            className={`flex items-center justify-between border-b border-white/10 px-5 py-4 last:border-b-0 ${
              isToday ? "bg-[#D4AF37]/5" : ""
            }`}
          >
            <span
              className={
                isToday
                  ? "font-medium text-[#D4AF37]"
                  : "text-sm text-white/70"
              }
            >
              {item.day}
            </span>

            <span
              className={
                isToday
                  ? "font-medium text-[#D4AF37]"
                  : "text-sm text-white/50"
              }
            >
              {item.open} – {item.close}
            </span>
          </div>
        );
      })}
    </div>

    <p className="mt-4 text-xs text-white/35">
      Opening hours may change. Please confirm with the business before visiting.
    </p>
  </section>
)}

            {/* Location */}
<section className="mt-10 border-t border-white/10 pt-8">
  <div className="mb-5">
    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
      Location
    </p>

    <h2 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
      Find this place
    </h2>

    <p className="mt-2 text-sm text-white/45">
      {place.area}
    </p>
  </div>

  <div className="overflow-hidden rounded-2xl border border-white/10">
    {place.latitude !== undefined &&
      place.longitude !== undefined && (
        <MederMap
          latitude={place.latitude}
          longitude={place.longitude}
          placeName={place.name}
        />
      )}
  </div>
</section>
{/* Contact */}
{(place.phone || place.whatsapp) && (
  <section className="mt-10 border-t border-white/10 pt-8">
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
        Contact
      </p>

      <h2 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
        Get in touch
      </h2>

      <p className="mt-2 text-sm text-white/45">
        Contact the place directly before your visit.
      </p>
    </div>

    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      {place.phone && (
        <a
          href={`tel:${place.phone}`}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 text-sm font-medium text-white transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
        >
          <Phone className="h-4 w-4" />
          Call
        </a>
      )}

      {place.whatsapp && (
        <a
          href={`https://wa.me/${place.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      )}
    </div>
  </section>
)}

          </div>

        </section>

      </div>
    </main>
  );
}