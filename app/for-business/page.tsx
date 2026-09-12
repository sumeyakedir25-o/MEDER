 "use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Camera,
  Check,
  ChevronRight,
  Clock3,
  Menu,
  MessageCircle,
  Play,
  ShieldCheck,
} from "lucide-react";

export default function ForBusinessPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* subtle background glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.06] blur-[140px]" />

        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-16 sm:px-8 sm:pt-24 lg:px-10 lg:pb-32">
          {/* top label */}
          <div className="flex items-center gap-3 text-sm text-white/40">
            <div className="h-px w-8 bg-[#D4AF37]" />
            MEDER FOR BUSINESS
          </div>

          <div className="mt-10 max-w-4xl">
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Your place.
              <br />
              <span className="text-[#D4AF37]">More discoverable.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-white/45 sm:text-lg">
              Manage how your business appears on MEDER and turn discovery
              into real customer action.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/for-business/register"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#D4AF37] px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-[#e3c354]"
            >
              Get started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/for-business/claim"
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-7 py-3.5 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.04]"
            >
              Claim your place
            </Link>
          </div>

          {/* simple trust row */}
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-white/30">
            <div className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-[#D4AF37]" />
              Free to get started
            </div>

            <div className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-[#D4AF37]" />
              Easy profile management
            </div>

            <div className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-[#D4AF37]" />
              Customer insights
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD ENTRY */}
<section className="border-y border-white/[0.07]">
  <div className="mx-auto max-w-6xl px-6 py-6 sm:px-8 lg:px-10">
    <Link
      href="/for-business/dashboard"
      className="group flex items-center justify-between gap-6 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.05] px-4 py-4 transition hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/[0.08] sm:px-5"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.08]">
          <Building2 className="h-5 w-5 text-[#D4AF37]" />
        </div>

        <div>
          <p className="text-sm font-semibold text-white">
            Already on MEDER?
          </p>

          <p className="mt-1 text-xs text-white/40">
            Open your Business Dashboard
          </p>
        </div>
      </div>

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/[0.06] transition group-hover:border-[#D4AF37]/50 group-hover:bg-[#D4AF37]/[0.12]">
        <ChevronRight className="h-4 w-4 text-[#D4AF37] transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  </div>
</section>
 {/* WHAT YOU CAN MANAGE */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
            Business tools
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything important,
            <br />
            in one place.
          </h2>
        </div>

        <div className="mt-14 grid overflow-hidden rounded-3xl border border-white/[0.08] sm:grid-cols-2 lg:grid-cols-3">
          <Tool
            icon={Building2}
            title="Business profile"
            description="Keep your business details accurate and up to date."
          />

          <Tool
            icon={Camera}
            title="Photos"
            description="Show customers what your place actually feels like."
          />

          <Tool
            icon={Menu}
            title="Menu"
            description="Manage items, prices, descriptions, and availability."
          />

          <Tool
            icon={Clock3}
            title="Hours & contact"
            description="Make it easy for customers to know when and how to reach you."
          />

          <Tool
            icon={Play}
            title="Videos"
            description="Add your TikTok presence and featured videos."
          />

          <Tool
            icon={BarChart3}
            title="Performance"
            description="Understand views, saves, calls, WhatsApp, and directions."
          />
        </div>
      </section>

      {/* VALUE SECTION */}
      <section className="border-y border-white/[0.07] bg-white/[0.015]">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                Why MEDER
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Don't just be listed.
                <br />
                Be chosen.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/40">
                MEDER helps people decide where to go. Your job is to make
                sure the information they see gives them a reason to choose
                you.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Value
                icon={MessageCircle}
                title="High-intent actions"
                text="See when customers contact or navigate to you."
              />

              <Value
                icon={BarChart3}
                title="Useful insights"
                text="Understand how people interact with your place."
              />

              <Value
                icon={ShieldCheck}
                title="Trusted presence"
                text="Keep your business information accurate and credible."
              />

              <Value
                icon={Building2}
                title="One dashboard"
                text="Manage your MEDER presence without jumping between tools."
              />
            </div>
          </div>
        </div>
      </section>

      {/* SIMPLE START */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
            Get started
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
            Your MEDER presence starts here.
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/40">
            New to MEDER? Register your business. Already listed? Claim your
            place.
          </p>
 <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/for-business/register"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[#D4AF37] px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-[#e3c354]"
            >
              Register business
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/for-business/claim"
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-7 py-3.5 text-sm font-medium text-white/80 transition hover:bg-white/[0.04]"
            >
              Claim a place
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-xs text-white/25 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <span className="font-serif text-lg tracking-wide text-[#D4AF37]">
            MEDER
          </span>

          <span>Help people spend less time searching.</span>
        </div>
      </footer>
    </main>
  );
}

function Tool({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="group border-white/[0.08] p-7 transition hover:bg-white/[0.025] sm:p-8 lg:border-b lg:border-r">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] transition group-hover:border-[#D4AF37]/20 group-hover:bg-[#D4AF37]/[0.06]">
        <Icon className="h-4.5 w-4.5 text-white/60 transition group-hover:text-[#D4AF37]" />
      </div>

      <h3 className="mt-6 text-sm font-semibold">{title}</h3>

      <p className="mt-2 text-xs leading-6 text-white/35">{description}</p>
    </div>
  );
}

function Value({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] p-6">
      <Icon className="h-5 w-5 text-[#D4AF37]" />

      <h3 className="mt-5 text-sm font-semibold">{title}</h3>

      <p className="mt-2 text-xs leading-6 text-white/35">{text}</p>
    </div>
  );
}