 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Plus,
  Save,
  Trash2,
  Video,
} from "lucide-react";

type SocialData = {
  tiktok: string;
  videos: VideoItem[];
};

type VideoItem = {
  id: string;
  title: string;
  url: string;
};

const emptySocial: SocialData = {
  tiktok: "",
  videos: [],
};

export default function BusinessSocialPage() {
  const [tiktok, setTiktok] = useState("");
  const [videos, setVideos] = useState<VideoItem[]>([]);

  const [showAddVideo, setShowAddVideo] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSocial = localStorage.getItem("meder-business-social");

    if (!savedSocial) return;

    try {
      const data: SocialData = JSON.parse(savedSocial);

      setTiktok(data.tiktok || "");
      setVideos(data.videos || []);
    } catch {
      console.log("Could not load saved social information.");
    }
  }, []);

  const addVideo = () => {
    if (!videoUrl.trim()) return;

    const newVideo: VideoItem = {
      id: Date.now().toString(),
      title: videoTitle.trim() || "Featured video",
      url: videoUrl.trim(),
    };

    setVideos((current) => [...current, newVideo]);

    setVideoTitle("");
    setVideoUrl("");
    setShowAddVideo(false);
  };

  const removeVideo = (id: string) => {
    setVideos((current) => current.filter((video) => video.id !== id));
  };

  const saveSocial = () => {
    const socialData: SocialData = {
      tiktok,
      videos,
    };

    localStorage.setItem(
      "meder-business-social",
      JSON.stringify(socialData)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        {/* Back */}
        <Link
          href="/for-business/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10">
            <Video className="text-[#D4AF37]" size={24} />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Social & Videos
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
            Connect your TikTok and add featured videos so customers can
            discover your business beyond photos and menus.
          </p>
        </div>

        {/* TikTok */}
        <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">TikTok</h2>
            <p className="mt-1 text-sm text-white/45">
              Add your official TikTok profile so customers can explore more
              of your content.
            </p>
          </div>

          <label className="mb-2 block text-sm font-medium text-white/75">
            TikTok profile URL
          </label>

          <input
            type="url"
            value={tiktok}
            onChange={(e) => setTiktok(e.target.value)}
            placeholder="https://www.tiktok.com/@yourbusiness"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-white/25 focus:border-[#D4AF37]/60"
          />

          {tiktok && (
 <a
              href={tiktok}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-[#D4AF37] hover:underline"
            >
              Open TikTok profile
              <ExternalLink size={14} />
            </a>
          )}
        </section>

        {/* Featured Videos */}
        <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Featured videos</h2>
              <p className="mt-1 text-sm text-white/45">
                Add videos that show the atmosphere, food, service, or
                experience of your business.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddVideo(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-black transition hover:brightness-110"
            >
              <Plus size={17} />
              Add video
            </button>
          </div>

          {/* Add Video Form */}
          {showAddVideo && (
            <div className="mb-6 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5">
              <h3 className="mb-4 font-semibold">Add featured video</h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Video title
                  </label>

                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Example: Our Friday night atmosphere"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-white/25 focus:border-[#D4AF37]/60"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Video URL
                  </label>

                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.tiktok.com/..."
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-white/25 focus:border-[#D4AF37]/60"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={addVideo}
                    disabled={!videoUrl.trim()}
                    className="rounded-xl bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Add video
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowAddVideo(false);
                      setVideoTitle("");
                      setVideoUrl("");
                    }}
                    className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white/70 transition hover:bg-white/5"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Video List */}
          {videos.length > 0 ? (
            <div className="space-y-3">
              {videos.map((video) => (
 <div
                  key={video.id}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Video
                        size={17}
                        className="shrink-0 text-[#D4AF37]"
                      />

                      <h3 className="truncate font-medium">
                        {video.title}
                      </h3>
                    </div>

                    <p className="mt-2 truncate text-xs text-white/35">
                      {video.url}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
                    >
                      <ExternalLink size={15} />
                      Open
                    </a>

                    <button
                      type="button"
                      onClick={() => removeVideo(video.id)}
                      className="inline-flex items-center justify-center rounded-xl border border-red-500/20 px-3 py-2 text-red-400 transition hover:bg-red-500/10"
                      aria-label={`Delete ${video.title}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
              <Video
                size={28}
                className="mx-auto mb-3 text-white/20"
              />

              <p className="text-sm text-white/45">
                No featured videos yet.
              </p>

              <p className="mt-1 text-xs text-white/25">
                Add videos that help customers understand your experience.
              </p>
            </div>
          )}
        </section>

        {/* Content Guidance */}
        <section className="mb-8 rounded-3xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5 sm:p-7">
          <h2 className="mb-4 text-lg font-semibold">
            What makes a good MEDER video?
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Show the actual atmosphere",
              "Show signature dishes or drinks",
              "Show what a customer experience feels like",
              "Keep information authentic and current",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white/60"
              >
                <Check
                  size={16}
                  className="mt-0.5 shrink-0 text-[#D4AF37]"
                />
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Save */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/40">
            Your social and video information is saved to your business
            profile.
          </p>

          <button
            type="button"
            onClick={saveSocial}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 py-3 font-semibold text-black transition hover:brightness-110"
          >
            {saved ? <Check size={18} /> : <Save size={18} />}
            {saved ? "Saved successfully" : "Save changes"}
          </button>
        </div>
      </div>
    </main>
  );
}