 "use client";

import {
  ChangeEvent,
  FormEvent,
  Suspense,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { ArrowLeft, ImagePlus, Save, Upload, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/Lib/supabase/client";

function AdminMediaNewPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const placeId = searchParams.get("place") || "";
  const editId = searchParams.get("edit") || "";

  const [placeName, setPlaceName] = useState("");

  const [mediaType, setMediaType] =
    useState<"image" | "video">("image");

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isCover, setIsCover] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);

      if (placeId) {
        const { data } = await supabase
          .from("places")
          .select("name")
          .eq("id", placeId)
          .single();

        setPlaceName(data?.name || "");
      }

      if (editId) {
        const { data, error } = await supabase
          .from("place_media")
          .select("*")
          .eq("id", editId)
          .single();

        if (error) {
          setMessage(error.message);
          setLoading(false);
          return;
        }

        if (data) {
          setMediaType(data.media_type);
          setTitle(data.title || "");
          setUrl(data.url || "");
          setThumbnailUrl(data.thumbnail_url || "");
          setAltText(data.alt_text || "");
          setSortOrder(String(data.sort_order ?? 0));
          setIsCover(data.is_cover);
          setIsFeatured(data.is_featured);
          setIsActive(data.is_active);
          setPreviewUrl(
            data.media_type === "image" ? data.url : ""
          );
        }
      }

      setLoading(false);
    }

    load();
  }, [placeId, editId]);

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage("Image must be smaller than 10MB.");
      return;
    }

    setMessage("");
    setSelectedFile(file);

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
  }

  function removeSelectedFile() {
    setSelectedFile(null);

    if (editId && url) {
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  }

  async function uploadImage(
    targetPlaceId: string
  ) {
    if (!selectedFile) return url;

    setUploading(true);

    const extension =
      selectedFile.name.split(".").pop()?.toLowerCase() || "jpg";

    const safeName = selectedFile.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    const filePath =
      `${targetPlaceId}/${Date.now()}-${safeName}.${extension}`;

    const { error } = await supabase.storage
      .from("place-media")
      .upload(filePath, selectedFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: selectedFile.type,
      });

    if (error) {
      setUploading(false);
      throw new Error(error.message);
    }

    const { data } = supabase.storage
      .from("place-media")
      .getPublicUrl(filePath);

    setUploading(false);
 return data.publicUrl;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");

    if (mediaType === "image" && !url && !selectedFile) {
      setMessage("Please upload an image.");
      return;
    }

    if (mediaType === "video" && !url.trim()) {
      setMessage("Video URL is required.");
      return;
    }

    setSaving(true);

    try {
      const targetPlaceId =
        placeId ||
        (
          await supabase
            .from("place_media")
            .select("place_id")
            .eq("id", editId)
            .single()
        ).data?.place_id;

      if (!targetPlaceId) {
        setMessage("Place is required.");
        setSaving(false);
        return;
      }

      if (isCover && mediaType !== "image") {
        setMessage("Only an image can be used as a cover.");
        setSaving(false);
        return;
      }

      let finalUrl = url.trim();

      if (selectedFile) {
        finalUrl = await uploadImage(targetPlaceId);
      }

      if (!finalUrl) {
        setMessage("Media URL could not be created.");
        setSaving(false);
        return;
      }

      if (isCover) {
        const { error: clearError } = await supabase
          .from("place_media")
          .update({
            is_cover: false,
            updated_at: new Date().toISOString(),
          })
          .eq("place_id", targetPlaceId);

        if (clearError) {
          setMessage(clearError.message);
          setSaving(false);
          return;
        }
      }

      const payload = {
        place_id: targetPlaceId,
        media_type: mediaType,
        title: title.trim() || null,
        url: finalUrl,
        thumbnail_url: thumbnailUrl.trim() || null,
        alt_text: altText.trim() || null,
        sort_order: Number(sortOrder) || 0,
        is_cover:
          mediaType === "image" ? isCover : false,
        is_featured: isFeatured,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      };

      let error;

      if (editId) {
        ({ error } = await supabase
          .from("place_media")
          .update(payload)
          .eq("id", editId));
      } else {
        ({ error } = await supabase
          .from("place_media")
          .insert(payload));
      }

      if (error) {
        setMessage(error.message);
        setSaving(false);
        return;
      }

      router.push(
        `/admin/media?place=${targetPlaceId}`
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );

      setSaving(false);
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">

        <Link
          href={`/admin/media${
            placeId ? `?place=${placeId}` : ""
          }`}
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft size={16} />
          Back to Media Manager
        </Link>

        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
            MEDER Administration
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            {editId ? "Edit Media" : "Add Media"}
          </h1>

          {placeName && (
            <p className="mt-3 text-sm text-white/40">
              Place:{" "}
              <span className="text-white/70">
                {placeName}
              </span>
            </p>
          )}
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {message}
          </div>
        )}
 {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center text-white/40">
            Loading...
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >

            <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">

              <div className="mb-6 flex items-center gap-3">
                <ImagePlus
                  size={20}
                  className="text-[#D4AF37]"
                />

                <h2 className="text-lg font-semibold">
                  Media
                </h2>
              </div>

              <div className="space-y-6">

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Media Type
                  </label>

                  <select
                    value={mediaType}
                    onChange={(event) =>
                      setMediaType(
                        event.target.value as
                          | "image"
                          | "video"
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37]/50"
                  >
                    <option value="image">
                      Image
                    </option>

                    <option value="video">
                      Video URL
                    </option>
                  </select>
                </div>

                {mediaType === "image" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/80">
                      Upload Image
                    </label>

                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black px-6 py-10 text-center transition hover:border-[#D4AF37]/40">
                      <Upload
                        size={26}
                        className="text-[#D4AF37]"
                      />

                      <p className="mt-4 text-sm font-semibold">
                        Choose an image
                      </p>

                      <p className="mt-1 text-xs text-white/40">
                        JPG, PNG, WEBP • Maximum 10MB
                      </p>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    {selectedFile && (
                      <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-black p-3">
                        <p className="truncate text-sm text-white/60">
                          {selectedFile.name}
                        </p>

                        <button
                          type="button"
                          onClick={removeSelectedFile}
                          className="ml-3 rounded-lg p-2 text-white/40 hover:text-white"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}

                    {previewUrl && (
                      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-[420px] w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}
 {mediaType === "video" && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/80">
                        Video URL
                        <span className="ml-2 text-xs font-semibold text-[#D4AF37]">
                          ✨ Required
                        </span>
                      </label>

                      <input
                        value={url}
                        onChange={(event) =>
                          setUrl(event.target.value)
                        }
                        placeholder="https://..."
                        required
                        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#D4AF37]/50"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/80">
                        Thumbnail URL
                      </label>

                      <input
                        value={thumbnailUrl}
                        onChange={(event) =>
                          setThumbnailUrl(
                            event.target.value
                          )
                        }
                        placeholder="https://..."
                        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#D4AF37]/50"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Title
                  </label>

                  <input
                    value={title}
                    onChange={(event) =>
                      setTitle(event.target.value)
                    }
                    placeholder="e.g. Interior, Signature Pizza, Exterior"
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#D4AF37]/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Alt Text
                  </label>

                  <input
                    value={altText}
                    onChange={(event) =>
                      setAltText(event.target.value)
                    }
                    placeholder="Describe the image for accessibility"
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#D4AF37]/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Display Order
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={sortOrder}
                    onChange={(event) =>
                      setSortOrder(event.target.value)
                    }
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37]/50"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">

              <h2 className="text-lg font-semibold">
                Media Controls
              </h2>

              <div className="mt-6 space-y-4">
 {mediaType === "image" && (
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 p-4 hover:bg-white/[0.02]">
                    <input
                      type="checkbox"
                      checked={isCover}
                      onChange={(event) =>
                        setIsCover(
                          event.target.checked
                        )
                      }
                      className="h-4 w-4 accent-[#D4AF37]"
                    />

                    <div>
                      <p className="text-sm font-semibold">
                        Use as Cover Image
                      </p>

                      <p className="mt-1 text-xs text-white/40">
                        This becomes the main visual for the place.
                      </p>
                    </div>
                  </label>
                )}

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 p-4 hover:bg-white/[0.02]">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(event) =>
                      setIsFeatured(
                        event.target.checked
                      )
                    }
                    className="h-4 w-4 accent-[#D4AF37]"
                  />

                  <div>
                    <p className="text-sm font-semibold">
                      Featured Media
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      Mark this media for future featured placements.
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 p-4 hover:bg-white/[0.02]">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(event) =>
                      setIsActive(
                        event.target.checked
                      )
                    }
                    className="h-4 w-4 accent-[#D4AF37]"
                  />

                  <div>
                    <p className="text-sm font-semibold">
                      Active
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      Active media can appear publicly on MEDER.
                    </p>
                  </div>
                </label>
              </div>
            </section>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving || uploading}
                className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#e3c45a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={17} />

                {uploading
                  ? "Uploading..."
                  : saving
                  ? "Saving..."
                  : editId
                  ? "Save Changes"
                  : "Upload Media"}
              </button>
            </div>

          </form>
        )}
      </div>
    </main>
  );
}

export default function AdminMediaNewPageWrapper() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#050505] px-5 py-16 text-white md:px-8">
          <div className="mx-auto max-w-4xl text-center text-sm text-white/40">
            Loading media manager...
          </div>
        </main>
      }
    >
      <AdminMediaNewPage />
    </Suspense>
  );
}