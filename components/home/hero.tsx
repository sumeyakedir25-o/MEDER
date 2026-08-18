import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative mt-16 min-h-[330px] overflow-hidden bg-black">
      {/* Background visual */}
      <div className="absolute inset-0">

  <div
    className="absolute inset-0 scale-105 bg-cover bg-center blur-[2px]"
    style={{
      backgroundImage:
        "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4')",
    }}
  />

  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(212,175,106,0.16),transparent_35%)]" />

  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />

  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

</div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-[330px] max-w-7xl items-center px-5 py-8 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <p className="mb-2 font-sans text-sm font-medium uppercase tracking-[0.3em] text-[#d4af6a]">
            Discover • Decide • Enjoy
          </p>

          <h1 className="font-serif text-3xl leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-5xl">
            Where do you
            <span className="block text-[#d4af6a]">want to go?</span>
          </h1>

          <p className="mt-3 max-w-2xl font-sans text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
            MEDER helps you discover places and experiences tailored to your
            mood, budget, and location.
          </p>

          {/* Actions */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/meder-it"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#d4af6a] px-7 font-sans text-sm font-semibold text-black transition hover:bg-[#e2c184]"
            >
              + MEDER IT
            </Link>

            <Link
              href="/discover"
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#d4af6a]/70 bg-black/30 px-7 font-sans text-sm font-semibold text-[#d4af6a] backdrop-blur-sm transition hover:bg-[#d4af6a]/10"
            >
              Explore Places
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#d4af6a]/60 to-transparent" />
    </section>
  );
}