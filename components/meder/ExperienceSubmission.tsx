 "use client";

import { ChangeEvent, useState } from "react";
import {
  ImagePlus,
  Video,
  X,
  Send,
  Heart,
  Award,
} from "lucide-react";

interface ExperienceSubmissionProps {
  placeId: string;
  placeName: string;
  onClose: () => void;
}

interface MediaItem {
  type: "image" | "video";
  name: string;
  preview: string;
}

export default function ExperienceSubmission({
  placeId,
  placeName,
  onClose,
}: ExperienceSubmissionProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [details, setDetails] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);

  const experienceOptions = [
    "Loved the vibe",
    "Great food",
    "Good value",
    "Great service",
    "Quiet & relaxing",
    "Good for dates",
    "Good for friends",
    "Beautiful place",
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );
  };

  const handleMediaChange = (
    event: ChangeEvent<HTMLInputElement>,
    type: "image" | "video",
  ) => {
    const files = Array.from(event.target.files || []);

    const newMedia = files.map((file) => ({
      type,
      name: file.name,
      preview: URL.createObjectURL(file),
    }));

    setMedia((current) => [...current, ...newMedia]);
    event.target.value = "";
  };

  const removeMedia = (index: number) => {
    setMedia((current) => {
      URL.revokeObjectURL(current[index].preview);

      return current.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const calculateReputation = () => {
    let points = 0;

    // Base contribution
    points += 5;

    // Useful experience tags
    points += Math.min(selectedTags.length * 2, 10);

    // Detailed written experience
    if (details.trim().length >= 50) {
      points += 5;
    }

    if (details.trim().length >= 150) {
      points += 5;
    }

    // Photos and videos
    const imageCount = media.filter(
      (item) => item.type === "image",
    ).length;

    const videoCount = media.filter(
      (item) => item.type === "video",
    ).length;

    points += Math.min(imageCount * 3, 9);
    points += Math.min(videoCount * 5, 10);

    return Math.min(points, 35);
  };

  const handleSubmit = () => {
    if (
      selectedTags.length === 0 &&
      !details.trim() &&
      media.length === 0
    ) {
      return;
    }

    const reputationPoints = calculateReputation();

    const existing = JSON.parse(
      localStorage.getItem("meder-experiences") || "[]",
    );

    const newExperience = {
      id: Date.now().toString(),
      placeId,
      tags: selectedTags,
      details: details.trim(),
      media,
      reputationPoints,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "meder-experiences",
      JSON.stringify([...existing, newExperience]),
    );

    onClose();
  };

  const estimatedPoints =
    selectedTags.length > 0 ||
    details.trim().length > 0 ||
    media.length > 0
      ? calculateReputation()
      : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 px-4 py-6 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#111] p-6 shadow-2xl sm:p-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/10">
                <Heart className="h-5 w-5 text-[#D4AF37]" />
              </div>

              <h2 className="mt-4 font-serif text-2xl text-white">
                Share your experience
              </h2>

              <p className="mt-2 text-sm text-white/45">
                Help others know what {placeName} is really like.
              </p>
            </div>
 <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-white/40 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Reputation preview */}
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                <Award className="h-5 w-5 text-[#D4AF37]" />
              </div>

              <div>
                <p className="text-sm font-medium text-white">
                  Contribution quality
                </p>

                <p className="mt-1 text-xs text-white/40">
                  More useful details can earn more reputation.
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-lg font-semibold text-[#D4AF37]">
                +{estimatedPoints}
              </p>

              <p className="text-[10px] uppercase tracking-wider text-white/35">
                reputation
              </p>
            </div>
          </div>

          <div className="mt-7">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
              What was your experience like?
            </label>

            <div className="mt-3 flex flex-wrap gap-2">
              {experienceOptions.map((tag) => {
                const selected = selectedTags.includes(tag);

                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full border px-4 py-2.5 text-sm transition ${
                      selected
                        ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                        : "border-white/10 bg-white/[0.03] text-white/60 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
              Tell us more{" "}
              <span className="normal-case">(optional)</span>
            </label>

            <textarea
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              placeholder="What happened? Tell us anything that would help someone decide..."
              rows={4}
              className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#D4AF37]/50"
            />

            <p className="mt-2 text-right text-xs text-white/30">
              {details.trim().length} characters
            </p>
          </div>

          {/* Photos and videos */}
          <div className="mt-6">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
              Add photos or videos{" "}
              <span className="normal-case">(optional)</span>
            </label>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <label className="flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-4 text-sm text-white/60 transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]">
                <ImagePlus className="h-4 w-4" />
                Add photos
 <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) =>
                    handleMediaChange(event, "image")
                  }
                  className="hidden"
                />
              </label>

              <label className="flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-4 text-sm text-white/60 transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]">
                <Video className="h-4 w-4" />
                Add video

                <input
                  type="file"
                  accept="video/*"
                  onChange={(event) =>
                    handleMediaChange(event, "video")
                  }
                  className="hidden"
                />
              </label>
            </div>

            {media.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {media.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black"
                  >
                    {item.type === "image" ? (
                      <img
                        src={item.preview}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <video
                        src={item.preview}
                        controls
                        className="h-full w-full object-cover"
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/80 text-white transition hover:bg-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              selectedTags.length === 0 &&
              !details.trim() &&
              media.length === 0
            }
            className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#E5C158] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
            Share experience
          </button>
        </div>
      </div>
    </div>
  );
}