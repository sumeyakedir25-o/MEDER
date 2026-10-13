 "use client";

import Link from "next/link";
import { MapPin, Star, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/Lib/supabase/client";

interface Experience {
  id: string;
  placeId: string;
  tags?: string[];
  details?: string;
  media?: unknown[];
  createdAt: string;
}

interface ExperiencedPlace {
  placeId: string;
  count: number;
  latestExperience: string;
}

interface Place {
  id: string;
  name: string;
  type: string;
  area: string;
  image: string;
  rating?: number;
}

export default function ExperiencedPlaces() {
  const [experiencedPlaces, setExperiencedPlaces] = useState<
    ExperiencedPlace[]
  >([]);

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedExperiences = JSON.parse(
      localStorage.getItem("meder-experiences") || "[]",
    ) as Experience[];

    const groupedPlaces = savedExperiences.reduce<
      Record<string, ExperiencedPlace>
    >((accumulator, experience) => {
      const existingPlace =
        accumulator[experience.placeId];

      if (existingPlace) {
        existingPlace.count += 1;

        if (
          new Date(experience.createdAt).getTime() >
          new Date(existingPlace.latestExperience).getTime()
        ) {
          existingPlace.latestExperience =
            experience.createdAt;
        }
      } else {
        accumulator[experience.placeId] = {
          placeId: experience.placeId,
          count: 1,
          latestExperience: experience.createdAt,
        };
      }

      return accumulator;
    }, {});

    setExperiencedPlaces(
      Object.values(groupedPlaces).sort(
        (a, b) =>
          new Date(b.latestExperience).getTime() -
          new Date(a.latestExperience).getTime(),
      ),
    );
  }, []);

  useEffect(() => {
    const loadPlaces = async () => {
      if (experiencedPlaces.length === 0) {
        setPlaces([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const placeIds = experiencedPlaces.map(
        (experience) => experience.placeId,
      );

      const supabase = createClient();

      const { data } = await supabase
        .from("places")
        .select(
          "id, name, type, area, cover_image, photos, status",
        )
        .eq("status", "published")
        .in("id", placeIds);

      const mappedPlaces: Place[] =
        (data ?? []).map((place) => {
          const photos = Array.isArray(place.photos)
            ? place.photos
            : [];

          return {
            id: place.id,
            name: place.name,
            type: place.type || "Place",
            area: place.area || "Addis Ababa",
            image:
              place.cover_image ||
              photos[0] ||
              "/placeholder-place.jpg",
          };
        });

      setPlaces(mappedPlaces);
      setLoading(false);
    };

    loadPlaces();
  }, [experiencedPlaces]);

  const experiencedPlaceCards = experiencedPlaces
    .map((experience) => {
      const place = places.find(
        (item) => item.id === experience.placeId,
      );

      return place
        ? {
            place,
            experience,
          }
        : null;
    })
    .filter(
      (
        item,
      ): item is {
        place: Place;
        experience: ExperiencedPlace;
      } => item !== null,
    );

  return (
    <section className="mt-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
            Your journey
          </p>

          <h2 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
            Places you experienced
          </h2>

          <p className="mt-2 text-sm text-white/45">
            Places where you shared your experience with the MEDER community.
          </p>
        </div>
 <div className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-3 py-1.5 text-xs font-medium text-[#D4AF37]">
          {experiencedPlaceCards.length}{" "}
          {experiencedPlaceCards.length === 1
            ? "place"
            : "places"}
        </div>
      </div>

      {loading ? (
        <div className="mt-6 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/10">
            <Heart className="h-5 w-5 text-[#D4AF37]" />
          </div>

          <p className="mt-4 text-sm text-white/45">
            Loading your journey...
          </p>
        </div>
      ) : experiencedPlaceCards.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {experiencedPlaceCards.map(
            ({ place, experience }) => (
              <Link
                key={place.id}
                href={`/places/${place.id}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-[#D4AF37]/40"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white backdrop-blur-md">
                    <Heart className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />

                    {experience.count}{" "}
                    {experience.count === 1
                      ? "experience"
                      : "experiences"}
                  </div>

                  {place.rating !== undefined &&
                    place.rating > 0 && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white backdrop-blur-md">
                        <Star className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                        {place.rating}
                      </div>
                    )}
                </div>

                <div className="p-4">
                  <h3 className="font-serif text-xl text-white">
                    {place.name}
                  </h3>

                  <p className="mt-1 text-sm text-white/45">
                    {place.type}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 text-sm text-white/55">
                    <MapPin className="h-4 w-4 text-[#D4AF37]" />
                    {place.area}
                  </div>
                </div>
              </Link>
            ),
          )}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/10">
            <Heart className="h-5 w-5 text-[#D4AF37]" />
          </div>

          <h3 className="mt-4 font-serif text-xl text-white">
            Your journey starts here
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/45">
            Visit a place and share your experience to start building your
            explorer journey.
          </p>

          <Link
            href="/discover"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
          >
            Explore places
          </Link>
        </div>
      )}
    </section>
  );
}