 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  Camera,
  ChevronRight,
  Clock3,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Settings,
  Sparkles,
  Video,
} from "lucide-react";

const mainNavigation = [
  {
    label: "Overview",
    href: "/for-business/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Analytics",
    href: "/for-business/dashboard/analytics",
    icon: BarChart3,
  },
  {
    label: "Leads",
    href: "/for-business/dashboard/leads",
    icon: MessageCircle,
  },
];

const businessNavigation = [
  {
    label: "Business Information",
    href: "/for-business/dashboard/information",
    icon: Building2,
  },
  {
    label: "Photos",
    href: "/for-business/dashboard/photos",
    icon: Camera,
  },
  {
    label: "Menu",
    href: "/for-business/dashboard/menu",
    icon: Menu,
  },
  {
    label: "Hours & Contact",
    href: "/for-business/dashboard/contact",
    icon: Clock3,
  },
  {
    label: "Social & Videos",
    href: "/for-business/dashboard/social",
    icon: Video,
  },
];

export default function BusinessDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/for-business/dashboard") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* DESKTOP SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-white/[0.07] bg-[#050505] lg:flex lg:flex-col">
        {/* BRAND */}
        <div className="flex h-20 items-center border-b border-white/[0.07] px-7">
          <Link
            href="/for-business"
            className="group flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/[0.06]">
              <Sparkles className="h-4 w-4 text-[#D4AF37]" />
            </div>

            <div>
              <p className="font-serif text-xl tracking-wide text-[#D4AF37]">
                MEDER
              </p>

              <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
                Business
              </p>
            </div>
          </Link>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto px-4 py-7">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
            Overview
          </p>

          <div className="space-y-1">
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <NavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={Icon}
                  active={active}
                />
              );
            })}
          </div>

          <p className="mb-3 mt-9 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
            Manage Business
          </p>

          <div className="space-y-1">
            {businessNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <NavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={Icon}
                  active={active}
                />
              );
            })}
          </div>
        </nav>

        {/* BOTTOM */}
        <div className="border-t border-white/[0.07] p-4">
 <Link
            href="/profile/settings"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/45 transition hover:bg-white/[0.04] hover:text-white"
          >
            <Settings className="h-4 w-4" />
            Account Settings
          </Link>

          <Link
            href="/for-business"
            className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/45 transition hover:bg-white/[0.04] hover:text-[#D4AF37]"
          >
            <ChevronRight className="h-4 w-4" />
            Business Home
          </Link>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#050505]/95 backdrop-blur-xl lg:hidden">
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/for-business" className="flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-[#D4AF37]" />

            <div>
              <p className="font-serif text-lg tracking-wide text-[#D4AF37]">
                MEDER
              </p>

              <p className="-mt-0.5 text-[8px] uppercase tracking-[0.2em] text-white/30">
                Business
              </p>
            </div>
          </Link>

          <Link
            href="/profile/settings"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </div>

        {/* MOBILE NAV */}
        <div className="overflow-x-auto border-t border-white/[0.05]">
          <div className="flex min-w-max gap-1 px-4 py-2">
            {[...mainNavigation, ...businessNavigation].map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs whitespace-nowrap transition ${
                    active
                      ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                      : "text-white/40 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="lg:pl-[260px]">
        {/* DESKTOP TOP BAR */}
        <header className="hidden h-20 items-center justify-between border-b border-white/[0.07] bg-[#050505] px-8 lg:flex">
          <div>
            <p className="text-sm font-medium text-white/80">
              Business Portal
            </p>

            <p className="mt-1 text-xs text-white/30">
              Manage your MEDER presence
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/for-business"
              className="text-xs text-white/35 transition hover:text-[#D4AF37]"
            >
              Business Home
            </Link>

            <Link
              href="/profile/settings"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/40 transition hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </header>

        {/* PAGE */}
        <main className="min-h-[calc(100vh-4rem)] bg-[#050505]">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({
  href,
 label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center justify-between rounded-xl px-3 py-3 text-sm transition ${
        active
          ? "border border-[#D4AF37]/15 bg-[#D4AF37]/[0.08] text-[#D4AF37]"
          : "text-white/45 hover:bg-white/[0.04] hover:text-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={`h-4 w-4 ${
            active
              ? "text-[#D4AF37]"
              : "text-white/30 group-hover:text-white/70"
          }`}
        />

        <span>{label}</span>
      </div>

      {active && (
        <div className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
      )}
    </Link>
  );
}