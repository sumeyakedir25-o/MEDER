 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Check,
  ChevronDown,
  Compass,
  Eye,
  Heart,
  Menu,
  MessageCircle,
  Phone,
  TrendingUp,
} from "lucide-react";

type Range = "7 days" | "30 days" | "90 days";

type AnalyticsData = {
  profileViews: number;
  menuViews: number;
  whatsappClicks: number;
  phoneClicks: number;
  directions: number;
  saves: number;
};

const defaultAnalytics: Record<Range, AnalyticsData> = {
  "7 days": {
    profileViews: 214,
    menuViews: 96,
    whatsappClicks: 18,
    phoneClicks: 9,
    directions: 27,
    saves: 14,
  },
  "30 days": {
    profileViews: 842,
    menuViews: 361,
    whatsappClicks: 64,
    phoneClicks: 31,
    directions: 97,
    saves: 52,
  },
  "90 days": {
    profileViews: 2318,
    menuViews: 984,
    whatsappClicks: 177,
    phoneClicks: 86,
    directions: 284,
    saves: 143,
  },
};

export default function BusinessAnalyticsPage() {
  const [range, setRange] = useState<Range>("30 days");
  const [analytics, setAnalytics] = useState<AnalyticsData>(
    defaultAnalytics["30 days"]
  );
  const [businessName, setBusinessName] = useState("Your Business");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedAnalytics = localStorage.getItem(
      "meder-business-analytics"
    );

    if (savedAnalytics) {
      try {
        const data = JSON.parse(savedAnalytics);

        if (data["7 days"]) {
          setAnalytics(data[range]);
        }
      } catch {
        console.log("Could not load analytics data.");
      }
    }

    const savedInformation = localStorage.getItem(
      "meder-business-information"
    );

    if (savedInformation) {
      try {
        const data = JSON.parse(savedInformation);

        if (data.businessName) {
          setBusinessName(data.businessName);
        }
      } catch {
        console.log("Could not load business information.");
      }
    }
  }, [range]);

  const changeRange = (newRange: Range) => {
    setRange(newRange);
    setAnalytics(defaultAnalytics[newRange]);
  };

  const totalActions =
    analytics.whatsappClicks +
    analytics.phoneClicks +
    analytics.directions;

  const totalEngagement =
    analytics.menuViews +
    analytics.whatsappClicks +
    analytics.phoneClicks +
    analytics.directions +
    analytics.saves;

  const actionRate =
    analytics.profileViews > 0
      ? ((totalActions / analytics.profileViews) * 100).toFixed(1)
      : "0.0";

  const saveRate =
    analytics.profileViews > 0
      ? ((analytics.saves / analytics.profileViews) * 100).toFixed(1)
      : "0.0";

  const cards = [
    {
      label: "Profile views",
      value: analytics.profileViews,
      icon: Eye,
      description: "People who viewed your profile",
    },
    {
      label: "Menu views",
      value: analytics.menuViews,
      icon: Menu,
      description: "People who opened your menu",
    },
    {
      label: "WhatsApp clicks",
      value: analytics.whatsappClicks,
      icon: MessageCircle,
      description: "Customers who started WhatsApp",
    },
    {
      label: "Phone clicks",
      value: analytics.phoneClicks,
      icon: Phone,
      description: "Customers who tapped call",
    },
    {
      label: "Directions",
      value: analytics.directions,
      icon: Compass,
      description: "Customers who requested directions",
    },
    {
      label: "Saves",
      value: analytics.saves,
      icon: Heart,
      description: "People who saved your place",
    },
  ];

  const saveAnalytics = () => {
    localStorage.setItem(
      "meder-business-analytics",
      JSON.stringify(defaultAnalytics)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };
 return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {/* Back */}
        <Link
          href="/for-business/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10">
              <BarChart3
                className="text-[#D4AF37]"
                size={24}
              />
            </div>

            <p className="mb-2 text-sm text-[#D4AF37]">
              Business performance
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Analytics
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
              Understand how customers discover your business and what they
              do after finding you on MEDER.
            </p>
          </div>

          {/* Range selector */}
          <div className="relative">
            <label className="mb-2 block text-xs text-white/40">
              Date range
            </label>

            <div className="relative">
              <CalendarDays
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              />

              <select
                value={range}
                onChange={(e) =>
                  changeRange(e.target.value as Range)
                }
                className="appearance-none rounded-xl border border-white/10 bg-white/[0.05] py-3 pl-10 pr-10 text-sm outline-none focus:border-[#D4AF37]/60"
              >
                <option value="7 days">Last 7 days</option>
                <option value="30 days">Last 30 days</option>
                <option value="90 days">Last 90 days</option>
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
              />
            </div>
          </div>
        </div>

        {/* Business */}
        <div className="mb-8 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/30">
              Business
            </p>

            <p className="mt-1 font-medium">{businessName}</p>
          </div>

          <div className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-1 text-xs text-[#D4AF37]">
            {range}
          </div>
        </div>

        {/* Main Stats */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/15"
              >
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                    <Icon
                      size={19}
                      className="text-[#D4AF37]"
                    />
                  </div>

                  <TrendingUp
                    size={17}
                    className="text-white/25"
                  />
                </div>

                <p className="text-3xl font-semibold tracking-tight">
                  {card.value.toLocaleString()}
                </p>

                <p className="mt-2 font-medium text-white/80">
                  {card.label}
                </p>
<p className="mt-1 text-xs leading-5 text-white/35">
                  {card.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* Customer Actions */}
        <section className="mb-8 rounded-3xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5 sm:p-7">
          <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Customer actions
              </h2>

              <p className="mt-1 text-sm text-white/45">
                Actions that show stronger customer intent than simply viewing
                your profile.
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs text-white/35">
                Total actions
              </p>

              <p className="text-2xl font-semibold text-[#D4AF37]">
                {totalActions.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <ActionCard
              icon={MessageCircle}
              label="WhatsApp"
              value={analytics.whatsappClicks}
              total={totalActions}
            />

            <ActionCard
              icon={Phone}
              label="Phone"
              value={analytics.phoneClicks}
              total={totalActions}
            />

            <ActionCard
              icon={Compass}
              label="Directions"
              value={analytics.directions}
              total={totalActions}
            />
          </div>
        </section>

        {/* Performance */}
        <section className="mb-8 grid gap-5 lg:grid-cols-2">
          {/* Action rate */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                Profile → action rate
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Percentage of profile visitors who called, messaged, or asked
                for directions.
              </p>
            </div>

            <div className="flex items-end gap-3">
              <span className="text-5xl font-semibold tracking-tight">
                {actionRate}%
              </span>

              <span className="mb-2 inline-flex items-center gap-1 text-sm text-white/45">
                <TrendingUp size={14} />
                Intent
              </span>
            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#D4AF37]"
                style={{
                  width:` ${Math.min(
                    Number(actionRate) * 5,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Save rate */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                Save rate
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Percentage of profile visitors who saved your business.
              </p>
            </div>

            <div className="flex items-end gap-3">
              <span className="text-5xl font-semibold tracking-tight">
                {saveRate}%
              </span>

              <span className="mb-2 flex items-center gap-1 text-sm text-white/45">
                <Heart size={14} />
                Saves
              </span>
            </div>
 <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#D4AF37]"
                style={{
                  width: `${Math.min(
                    Number(saveRate) * 10,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        </section>

        {/* Engagement Summary */}
        <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Engagement summary
            </h2>

            <p className="mt-1 text-sm text-white/45">
              A simple view of how much interaction your MEDER profile is
              generating.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <SummaryItem
              label="Profile views"
              value={analytics.profileViews}
            />

            <SummaryItem
              label="Total engagement"
              value={totalEngagement}
            />

            <SummaryItem
              label="High-intent actions"
              value={totalActions}
            />
          </div>
        </section>

        {/* Insight */}
        <section className="mb-8 rounded-3xl border border-white/10 bg-black p-5 sm:p-7">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10">
              <BarChart3
                size={19}
                className="text-[#D4AF37]"
              />
            </div>

            <div>
              <h2 className="font-semibold">
                MEDER insight
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/50">
                Your profile generated{" "}
                <span className="font-medium text-white">
                  {totalActions.toLocaleString()}
                </span>{" "}
                high-intent customer actions during the selected period.
                Keep your photos, menu, opening hours, and contact information
                accurate to make those visits more likely to convert.
              </p>
            </div>
          </div>
        </section>

        {/* Prototype note */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-xs leading-5 text-white/30">
          Prototype analytics: these numbers are currently sample data.
          Later, MEDER will replace them with real event tracking from profile
          views, menu opens, WhatsApp clicks, phone clicks, directions, and
          saves.
        </div>

        {/* Save prototype */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/35">
            Analytics structure is ready for real MEDER tracking.
          </p>

          <button
            type="button"
            onClick={saveAnalytics}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 py-3 font-semibold text-black transition hover:brightness-110"
          >
            {saved ? <Check size={18} /> : <BarChart3 size={18} />}
            {saved ? "Saved successfully" : "Save analytics data"}
          </button>
        </div>
      </div>
    </main>
  );
}

function ActionCard({
  icon: Icon,
  label,
  value,
  total,
}: {
  icon: typeof MessageCircle;
  label: string;
  value: number;
  total: number;
}) {
  const percentage =
    total > 0 ? ((value / total) * 100).toFixed(0) : "0";

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
          <Icon size={17} className="text-white/60" />
        </div>
 <span className="text-xs text-white/30">
          {percentage}%
        </span>
      </div>

      <p className="text-2xl font-semibold">
        {value.toLocaleString()}
      </p>

      <p className="mt-1 text-sm text-white/45">
        {label} clicks
      </p>
    </div>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
      <p className="text-sm text-white/40">{label}</p>

      <p className="mt-2 text-3xl font-semibold">
        {value.toLocaleString()}
      </p>
    </div>
  );
}