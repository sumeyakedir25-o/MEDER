 "use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ImagePlus,
  Star,
  Trash2,
} from "lucide-react";

interface BusinessPhoto {
  id: string;
  name: string;
  preview: string;
  isCover: boolean;
}

export default function BusinessPhotosPage() {
  const [photos, setPhotos] = useState<BusinessPhoto[]>([]);
  const [businessName, setBusinessName] = useState("Your business");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const information = JSON.parse(
      localStorage.getItem("meder-business-information") || "[]",
    );

    if (information.length > 0) {
      setBusinessName(
        information[information.length - 1].businessName || "Your business",
      );
    }

    const storedPhotos = JSON.parse(
      localStorage.getItem("meder-business-photos") || "[]",
    );

    setPhotos(storedPhotos);
  }, []);

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    const newPhotos: BusinessPhoto[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      preview: URL.createObjectURL(file),
      isCover: false,
    }));

    setPhotos((current) => {
      if (current.length === 0 && newPhotos.length > 0) {
        newPhotos[0].isCover = true;
      }

      return [...current, ...newPhotos];
    });

    event.target.value = "";
  };

  const removePhoto = (id: string) => {
    setPhotos((current) => {
      const photoToRemove = current.find((photo) => photo.id === id);

      if (photoToRemove) {
        URL.revokeObjectURL(photoToRemove.preview);
      }

      const remaining = current.filter((photo) => photo.id !== id);

      if (
        photoToRemove?.isCover &&
        remaining.length > 0
      ) {
        remaining[0] = {
          ...remaining[0],
          isCover: true,
        };
      }

      return remaining;
    });
  };

  const setCoverPhoto = (id: string) => {
    setPhotos((current) =>
      current.map((photo) => ({
        ...photo,
        isCover: photo.id === id,
      })),
    );
  };

  const savePhotos = () => {
    localStorage.setItem(
      "meder-business-photos",
      JSON.stringify(photos),
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/for-business/dashboard"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" />
          Business dashboard
        </Link>

        <div className="mt-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
            Business profile
          </p>

          <h1 className="mt-2 font-serif text-3xl text-white sm:text-4xl">
            Photos
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
            Show customers what {businessName} looks and feels like.
          </p>
        </div>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white">
                Business gallery
              </p>

              <p className="mt-1 text-xs text-white/35">
                Add high-quality photos of your space, food, products or
                experience.
              </p>
            </div>

            <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#E5C158]">
              <ImagePlus className="h-4 w-4" />
              Add photos
 <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>

          {photos.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-black/20 p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                <ImagePlus className="h-6 w-6 text-[#D4AF37]" />
              </div>

              <h2 className="mt-5 font-serif text-xl text-white">
                Your gallery is empty
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/35">
                Add photos to make your MEDER profile more attractive and
                useful to customers.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black"
                >
                  <img
                    src={photo.preview}
                    alt={photo.name}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 pt-10">
                    {photo.isCover && (
                      <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-[#D4AF37] px-2 py-1 text-[10px] font-semibold text-black">
                        <Star className="h-3 w-3 fill-current" />
                        Cover photo
                      </div>
                    )}

                    <p className="truncate text-xs text-white/70">
                      {photo.name}
                    </p>
                  </div>

                  <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition group-hover:opacity-100">
                    {!photo.isCover && (
                      <button
                        type="button"
                        onClick={() => setCoverPhoto(photo.id)}
                        title="Set as cover"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-black/80 text-white transition hover:bg-[#D4AF37] hover:text-black"
                      >
                        <Star className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      title="Remove photo"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-black/80 text-white transition hover:bg-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs leading-5 text-white/35">
              Tip: Use clear photos that show the actual customer experience.
              Your cover photo will be the first image people see on your
              business profile.
            </p>
          </div>

          {saved && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4 text-sm text-[#D4AF37]">
              <CheckCircle2 className="h-4 w-4" />
              Photos saved successfully.
            </div>
          )}
 <button
            type="button"
            onClick={savePhotos}
            className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
          >
            <CheckCircle2 className="h-4 w-4" />
            Save gallery
          </button>
        </section>

        <section className="mt-6 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-[#D4AF37]" />

          <div>
            <p className="text-sm font-medium text-white">
              Keep your photos authentic
            </p>

            <p className="mt-1 text-xs leading-5 text-white/35">
              MEDER should help people understand the real experience of a
              place. Avoid misleading or unrelated images.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}