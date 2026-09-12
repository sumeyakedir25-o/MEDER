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

const stats = [
  {
    label: "Total Places",
    value: "0",
    icon: MapPin,
    href: "#",
  },
  {
    label: "Businesses",
    value: "0",
    icon: Building2,
    href: "#",
  },
  {
    label: "Pending Claims",
    value: "0",
    icon: ClipboardList,
    href: "#",
  },
  {
    label: "Reports",
    value: "0",
    icon: Flag,
    href: "#",
  },
];

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