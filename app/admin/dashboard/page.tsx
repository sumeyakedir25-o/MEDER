 import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ClipboardList,
  Flag,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Plus,
  RefreshCw,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  UtensilsCrossed,
  Image as ImageIcon,
} from "lucide-react";
import { createClient } from "@/Lib/supabase/server";
import {
  getAnalyticsSummary,
  getTopPlaces,
} from "@/Lib/analytics/admin";



const management = [
  {
    title: "Places",
    description: "Add, edit, publish, and archive MEDER places.",
    icon: MapPin,
    href: "/admin/places",
  },
  {
    title: "Businesses",
    description: "Review businesses and verify ownership claims.",
    icon: Building2,
    href: "/admin/businesses",
  },
  {
    title: "Categories",
    description: "Manage locations, cuisines, experiences, and place types.",
    icon: LayoutDashboard,
    href: "/admin/categories",
  },
  {
    title: "Menus",
    description: "Manage menu information across MEDER places.",
    icon: UtensilsCrossed,
    href: "/admin/menus",
  },
  {
    title: "Media",
    description: "Manage photos and videos used throughout MEDER.",
    icon: ImageIcon,
    href: "/admin/media",
  },
  {
    title: "Reports",
    description: "Review reported places, content, and problems.",
    icon: Flag,
    href: "/admin/reports",
  },
  {
    title: "Freshness",
    description: "Find places whose information may need updating.",
    icon: RefreshCw,
    href: "/admin/freshness",
  },
  {
    title: "Users",
    description: "Manage user accounts and moderation.",
    icon: Users,
    href: "/admin/users",
  },
  {
    title: "Experiences",
    description: "Review and moderate user experience feedback.",
    icon: MessageSquare,
    href: "/admin/experiences",
  },
];

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const analytics =
    await getAnalyticsSummary();

 const [
  placesResult,
  claimsResult,
  reportsResult,
  analyticsResult,
] = await Promise.all([
  supabase
    .from("places")
    .select("id", { count: "exact", head: true }),

  supabase
    .from("business_claims")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending"),

  supabase
    .from("place_reports")
    .select("id", { count: "exact", head: true }),

  supabase
    .from("analytics_events")
    .select("event_name, place_id, metadata, created_at")
    .gte(
      "created_at",
      new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
    ),
]);

const analyticsEvents = analyticsResult.data || [];

const countEvents = (eventName: string) =>
  analyticsEvents.filter(
    (event) => event.event_name === eventName
  ).length;

const placeViews = countEvents("place_viewed");
const saves = countEvents("place_saved");
const directions = countEvents("directions_clicked");
const contacts = countEvents("contact_clicked");

const mederItStarted = countEvents("meder_it_started");
const mederItCompleted = countEvents("meder_it_completed");

const completionRate =
  mederItStarted > 0
    ? Math.round(
        (mederItCompleted / mederItStarted) * 100
      )
    : 0;

const topPlaceMap = new Map<
  string,
  {
    views: number;
    saves: number;
    directions: number;
    contacts: number;
  }
>();

analyticsEvents.forEach((event) => {
  if (!event.place_id) return;

  if (!topPlaceMap.has(event.place_id)) {
    topPlaceMap.set(event.place_id, {
      views: 0,
      saves: 0,
      directions: 0,
      contacts: 0,
    });
  }

  const placeStats = topPlaceMap.get(event.place_id)!;

  if (event.event_name === "place_viewed") {
    placeStats.views++;
  }

  if (event.event_name === "place_saved") {
    placeStats.saves++;
  }

  if (event.event_name === "directions_clicked") {
    placeStats.directions++;
  }

  if (event.event_name === "contact_clicked") {
    placeStats.contacts++;
  }
});

const topPlaceIds = Array.from(topPlaceMap.entries())
  .sort((a, b) => b[1].views - a[1].views)
  .slice(0, 5);

const topPlaceIdList = topPlaceIds.map(([id]) => id);

const { data: topPlacesData } =
  topPlaceIdList.length > 0
    ? await supabase
        .from("places")
        .select("id, name")
        .in("id", topPlaceIdList)
    : { data: [] };

const topPlaces = topPlaceIds.map(([id, stats]) => ({
  id,
  name:
    topPlacesData?.find((place) => place.id === id)?.name ||
    "Unknown place",
  ...stats,
}));

const stats = [
  {
    label: "Total Places",
    value: String(placesResult.count ?? 0),
    icon: MapPin,
    href: "/admin/places",
  },
  {
    label: "Businesses",
    value: String(placesResult.count ?? 0),
    icon: Building2,
    href: "/admin/businesses",
  },
  {
    label: "Pending Claims",
    value: String(claimsResult.count ?? 0),
    icon: ClipboardList,
    href: "/admin/businesses",
  },
  {
    label: "Reports",
    value: String(reportsResult.count ?? 0),
    icon: Flag,
    href: "/admin/reports",
  },
];

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        {/* Header */}
        <header className="flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10">
                <ShieldCheck className="h-5 w-5 text-[#D4AF37]" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
                  MEDER
                </p>

                <p className="text-xs text-white/40">
                  Administration
                </p>
              </div>
            </div>

            <h1 className="mt-7 text-3xl font-semibold tracking-tight md:text-4xl">
              Command Center
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/50">
              Manage the places, businesses, content, and data that power
              the MEDER experience.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/70 transition hover:border-white/20 hover:text-white"
            >
              View MEDER
            </Link>

            <div className="rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2.5 text-right">
              <p className="text-xs text-white/40">Signed in as</p>
              <p className="mt-0.5 max-w-[220px] truncate text-sm text-[#D4AF37]">
                {user?.email}
              </p>
            </div>
          </div>
        </header>
 {/* Stats */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-[#D4AF37]/20"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-white/45">
                      {stat.label}
                    </p>

                    <p className="mt-3 text-3xl font-semibold tracking-tight">
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                    <Icon className="h-4 w-4 text-[#D4AF37]" />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="mt-10">
  <div className="mb-5">
    <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
      Analytics
    </p>

    <h2 className="mt-2 text-xl font-semibold">
      MEDER activity today
    </h2>

    <p className="mt-2 text-sm text-white/40">
      A simple view of what people are actually doing.
    </p>
  </div>

  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <AnalyticsCard
      label="Place Views"
      value={analytics.placeViews}
    />

    <AnalyticsCard
      label="Saves"
      value={analytics.saves}
    />

    <AnalyticsCard
      label="Directions"
      value={analytics.directions}
    />

    <AnalyticsCard
      label="Contacts"
      value={analytics.contacts}
    />

    <AnalyticsCard
      label="MEDER IT Sessions"
      value={analytics.mederItSessions}
    />

    <AnalyticsCard
      label="MEDER IT Completed"
      value={analytics.mederItCompleted}
    />
  </div>
</section>

<section className="mt-8">
  <div className="rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.04] p-6">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
          MEDER IT Funnel
        </p>

        <h3 className="mt-2 text-lg font-semibold">
          Recommendation journey
        </h3>
      </div>

      <div className="text-right">
        <p className="text-3xl font-semibold text-[#D4AF37]">
          {analytics.completionRate}%
        </p>

        <p className="text-xs text-white/40">
          completion rate
        </p>
      </div>
    </div>

    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      <FunnelItem
        label="Started"
        value={analytics.mederItSessions}
      />

      <FunnelItem
        label="Completed"
        value={analytics.mederItCompleted}
      />
    </div>
  </div>
</section>
<section className="mt-8">
  <div className="mb-5">
    <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
      Top Places
    </p>

    <h2 className="mt-2 text-xl font-semibold">
      Places getting attention
    </h2>
  </div>

  <div className="overflow-hidden rounded-2xl border border-white/10">
    {topPlaces.length === 0 ? (
      <div className="p-6 text-sm text-white/40">
        No place activity yet.
      </div>
    ) : (
      <div className="divide-y divide-white/10">
        {topPlaces.map((place, index) => (
          <div
            key={place.id}
            className="grid gap-4 px-5 py-4 sm:grid-cols-[40px_1fr_repeat(4,80px)] sm:items-center"
          >
            <span className="text-sm text-white/30">
              {index + 1}
            </span>

            <div>
              <p className="font-medium">
                {place.name}
              </p>

              <p className="mt-1 text-xs text-white/30">
                Place activity
              </p>
            </div>

            <div>
              <p className="text-xs text-white/30">
                Views
              </p>

              <p className="mt-1 text-sm">
                {place.views}
              </p>
            </div>

            <div>
              <p className="text-xs text-white/30">
                Saves
              </p>

              <p className="mt-1 text-sm">
                {place.saves}
              </p>
            </div>

            <div>
              <p className="text-xs text-white/30">
                Directions
              </p>

              <p className="mt-1 text-sm">
                {place.directions}
              </p>
            </div>

            <div>
              <p className="text-xs text-white/30">
                Contacts
              </p>

              <p className="mt-1 text-sm">
                {place.contacts}
              </p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</section>

        {/* Quick Actions */}
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
                Quick Actions
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Get things done
              </h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/admin/places/new"
              className="group rounded-2xl border border-[#D4AF37]/25 bg-[#D4AF37]/[0.06] p-6 transition hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/[0.1]"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37] text-black">
                  <Plus className="h-5 w-5" />
                </div>

                <ArrowRight className="h-5 w-5 text-[#D4AF37] transition group-hover:translate-x-1" />
              </div>

              <h3 className="mt-6 text-lg font-semibold">
                Add a Place
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/50">
                Add a restaurant, cafe, lounge, bakery, juice bar, or
                other place to MEDER.
              </p>
            </Link>

            <Link
              href="/admin/businesses"
              className="group rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition hover:border-[#D4AF37]/25"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black">
                  <Building2 className="h-5 w-5 text-[#D4AF37]" />
                </div>

                <ArrowRight className="h-5 w-5 text-white/30 transition group-hover:translate-x-1 group-hover:text-[#D4AF37]" />
              </div>

              <h3 className="mt-6 text-lg font-semibold">
                Review Businesses
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/50">
                Review registrations, ownership claims, and business
                verification requests.
              </p>
            </Link>
          </div>
        </section>

        {/* Management */}
        <section className="mt-12">
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
              CMS
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Manage MEDER
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {management.map((item) => {
              const Icon = item.icon;
 return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-[#D4AF37]/25 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black">
                      <Icon className="h-4 w-4 text-[#D4AF37]" />
                    </div>

                    <ArrowRight className="h-4 w-4 text-white/20 transition group-hover:translate-x-1 group-hover:text-[#D4AF37]" />
                  </div>

                  <h3 className="mt-5 font-medium">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-5 text-white/40">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Analytics */}
<section className="mt-12">
  <div className="mb-5">
    <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
      Analytics
    </p>

    <h2 className="mt-2 text-xl font-semibold">
      Today
    </h2>

    <p className="mt-1 text-sm text-white/40">
      MEDER activity from today.
    </p>
  </div>

  {/* Main analytics */}
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
    {[
      {
        label: "Place views",
        value: placeViews,
      },
      {
        label: "Saves",
        value: saves,
      },
      {
        label: "Directions",
        value: directions,
      },
      {
        label: "Contacts",
        value: contacts,
      },
      {
        label: "MEDER IT sessions",
        value: mederItStarted,
      },
    ].map((item) => (
      <div
        key={item.label}
        className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
      >
        <p className="text-sm text-white/45">
          {item.label}
        </p>

        <p className="mt-3 text-3xl font-semibold">
          {item.value}
        </p>
      </div>
    ))}
  </div>

  {/* MEDER IT */}
  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
          MEDER IT
        </p>

        <h3 className="mt-2 text-lg font-semibold">
          Decision engine usage
        </h3>
      </div>
    </div>

    <div className="mt-5 grid gap-4 sm:grid-cols-3">
      <div>
        <p className="text-sm text-white/40">
          Started
        </p>

        <p className="mt-2 text-2xl font-semibold">
          {mederItStarted}
        </p>
      </div>

      <div>
        <p className="text-sm text-white/40">
          Completed
        </p>

        <p className="mt-2 text-2xl font-semibold">
          {mederItCompleted}
        </p>
      </div>

      <div>
        <p className="text-sm text-white/40">
          Completion rate
        </p>

        <p className="mt-2 text-2xl font-semibold text-[#D4AF37]">
          {completionRate}%
        </p>
      </div>
    </div>
  </div>

  {/* Top places */}
  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
        Top Places
      </p>

      <h3 className="mt-2 text-lg font-semibold">
        Most viewed today
      </h3>
    </div>

    {topPlaces.length === 0 ? (
      <p className="mt-6 text-sm text-white/40">
        No place activity yet today.
      </p>
    ) : (
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[650px] text-left">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/30">
              <th className="pb-3 pr-4">Place</th>
              <th className="pb-3 pr-4">Views</th>
              <th className="pb-3 pr-4">Saves</th>
              <th className="pb-3 pr-4">Directions</th>
              <th className="pb-3">Contacts</th>
            </tr>
          </thead>

          <tbody>
            {topPlaces.map((place) => (
              <tr
                key={place.id}
                className="border-b border-white/5 last:border-0"
              >
                <td className="py-4 pr-4 font-medium text-white">
                  {place.name}
                </td>

                <td className="py-4 pr-4 text-white/60">
                  {place.views}
                </td>

                <td className="py-4 pr-4 text-white/60">
                  {place.saves}
                </td>

                <td className="py-4 pr-4 text-white/60">
                  {place.directions}
                </td>

                <td className="py-4 text-white/60">
                  {place.contacts}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</section>

        {/* Insight */}
        <section className="mt-12">
          <div className="rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.04] p-6 md:p-8">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10">
                <Sparkles className="h-5 w-5 text-[#D4AF37]" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
                  MEDER Insight
                </p>

                <h3 className="mt-2 text-lg font-semibold">
                  Your CMS is the engine behind discovery.
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
                  Every place you add, every menu you update, and every
                  piece of information you keep fresh improves the
                  recommendations users receive through MEDER IT.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-12 border-t border-white/10 pt-6 text-xs text-white/30">
          MEDER Admin • Content Management System
        </footer>
      </div>
    </main>
  );
}
function AnalyticsCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <p className="text-sm text-white/45">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold tracking-tight text-[#D4AF37]">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
function FunnelItem({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs text-white/40">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

