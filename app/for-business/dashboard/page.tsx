 "use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Eye,
  Menu,
  MessageCircle,
  Phone,
  Sparkles,
  TrendingUp,
  Users,
  Video,
  MapPin,
} from "lucide-react";

type Business = {
  businessName: string;
  ownerName?: string;
  businessType?: string;
  area?: string;
  address?: string;
  email?: string;
  phone?: string;
};

export default function BusinessDashboardPage() {
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    try {
      const information = localStorage.getItem("meder-business-information");

      if (information) {
        setBusiness(JSON.parse(information));
        return;
      }

      const claims = JSON.parse(
        localStorage.getItem("meder-business-claims") || "[]"
      );

      const approvedClaim = claims.find(
        (claim: any) => claim.status === "approved"
      );

      if (approvedClaim) {
        setBusiness({
          businessName: approvedClaim.placeName,
          ownerName: approvedClaim.ownerName,
          email: approvedClaim.email,
          phone: approvedClaim.phone,
        });
        return;
      }

      const registrations = JSON.parse(
        localStorage.getItem("meder-business-registrations") || "[]"
      );

      const approvedRegistration = registrations.find(
        (registration: any) => registration.status === "approved"
      );

      if (approvedRegistration) {
        setBusiness(approvedRegistration);
      }
    } catch (error) {
      console.error("Unable to load business:", error);
    }
  }, []);

  if (!business) {
    return <NoBusinessConnected />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* HERO */}
      <section className="border-b border-white/[0.07]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#D4AF37]">
                <Sparkles className="h-3.5 w-3.5" />
                MEDER Business
              </div>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Welcome back,
                <br className="sm:hidden" />{" "}
                <span className="text-[#D4AF37]">
                  {business.businessName}
                </span>
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/35">
                {business.businessType && (
                  <span>{business.businessType}</span>
                )}

                {business.area && (
                  <>
                    <span className="text-white/15">•</span>
                    <span>{business.area}</span>
                  </>
                )}

                <span className="flex items-center gap-1.5 text-[#D4AF37]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Connected
                </span>
              </div>
            </div>

            <Link
              href="/for-business/dashboard/information"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/[0.06] px-5 py-2.5 text-sm font-medium text-[#D4AF37] transition hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/[0.1]"
            >
              Edit Profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
 <div className="grid gap-3 sm:grid-cols-3">
          <QuickAction
            href="/for-business/dashboard/information"
            icon={Building2}
            title="Business Information"
            description="Keep your details updated"
          />

          <QuickAction
            href="/for-business/dashboard/menu"
            icon={Menu}
            title="Update Menu"
            description="Manage items and prices"
          />

          <QuickAction
            href="/for-business/dashboard/photos"
            icon={Camera}
            title="Add Photos"
            description="Showcase your place"
          />
        </div>
      </section>

      {/* PERFORMANCE */}
      <section className="mx-auto max-w-7xl px-5 pb-10 sm:px-8 lg:px-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#D4AF37]">
              Performance
            </p>

            <h2 className="mt-2 text-xl font-semibold">Your place at a glance</h2>
          </div>

          <Link
            href="/for-business/dashboard/analytics"
            className="hidden items-center gap-1 text-xs font-medium text-white/35 transition hover:text-[#D4AF37] sm:flex"
          >
            View analytics
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={Eye}
            label="Profile Views"
            value="842"
            change="+12%"
          />

          <MetricCard
            icon={MessageCircle}
            label="WhatsApp"
            value="64"
            change="+8%"
          />

          <MetricCard
            icon={Phone}
            label="Phone"
            value="31"
            change="+5%"
          />

          <MetricCard
            icon={MapPin}
            label="Directions"
            value="97"
            change="+14%"
          />
        </div>

        <Link
          href="/for-business/dashboard/analytics"
          className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] py-3 text-xs font-medium text-white/40 transition hover:border-[#D4AF37]/20 hover:bg-[#D4AF37]/[0.04] hover:text-[#D4AF37] sm:hidden"
        >
          View full analytics
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>

      {/* MANAGEMENT */}
      <section className="border-y border-white/[0.07] bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#D4AF37]">
              Manage
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Your MEDER presence
            </h2>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <ManagementCard
              href="/for-business/dashboard/information"
              icon={Building2}
              title="Information"
            />

            <ManagementCard
              href="/for-business/dashboard/photos"
              icon={Camera}
              title="Photos"
            />

            <ManagementCard
              href="/for-business/dashboard/menu"
              icon={Menu}
              title="Menu"
            />

            <ManagementCard
              href="/for-business/dashboard/contact"
              icon={Clock3}
              title="Hours & Contact"
            />

            <ManagementCard
              href="/for-business/dashboard/social"
              icon={Video}
              title="Social & Videos"
            />
          </div>
        </div>
      </section>
 {/* LEADS + INSIGHT */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-4 lg:grid-cols-2">
          {/* LEADS */}
          <Link
            href="/for-business/dashboard/leads"
            className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition hover:border-[#D4AF37]/25 hover:bg-[#D4AF37]/[0.03]"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.06]">
                <Users className="h-4.5 w-4.5 text-[#D4AF37]" />
              </div>

              <ChevronRight className="h-5 w-5 text-white/20 transition group-hover:translate-x-1 group-hover:text-[#D4AF37]" />
            </div>

            <h3 className="mt-6 text-lg font-semibold">Customer Leads</h3>

            <p className="mt-2 text-sm leading-6 text-white/35">
              Track customer actions and understand high-intent interest in
              your business.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs font-medium text-[#D4AF37]">
              Open leads
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          {/* INSIGHT */}
          <div className="rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.035] p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.06]">
              <TrendingUp className="h-4.5 w-4.5 text-[#D4AF37]" />
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.16em] text-[#D4AF37]">
              MEDER Insight
            </p>

            <h3 className="mt-2 text-lg font-semibold">
              Customers are discovering your place.
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/35">
              Your profile has received strong interest. Keep your photos,
              menu, and business information fresh to give people more reasons
              to choose you.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER SPACE */}
      <div className="h-8" />
    </div>
  );
}

/* ------------------------------------------------ */
/* QUICK ACTION */
/* ------------------------------------------------ */

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 transition hover:border-[#D4AF37]/25 hover:bg-[#D4AF37]/[0.03]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.05]">
        <Icon className="h-4 w-4 text-[#D4AF37]" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white/80">
          {title}
        </p>

        <p className="mt-1 truncate text-xs text-white/30">
          {description}
        </p>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-white/20 transition group-hover:translate-x-1 group-hover:text-[#D4AF37]" />
    </Link>
  );
}

/* ------------------------------------------------ */
/* METRIC CARD */
/* ------------------------------------------------ */

function MetricCard({
  icon: Icon,
  label,
  value,
  change,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition hover:border-[#D4AF37]/20">
      <div className="flex items-center justify-between">
        <Icon className="h-4 w-4 text-white/30" />

        <span className="text-[10px] font-medium text-[#D4AF37]">
          {change}
        </span>
      </div>
 <p className="mt-6 text-2xl font-semibold tracking-tight">{value}</p>

      <p className="mt-1 text-xs text-white/35">{label}</p>
    </div>
  );
}

/* ------------------------------------------------ */
/* MANAGEMENT CARD */
/* ------------------------------------------------ */

function ManagementCard({
  href,
  icon: Icon,
  title,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:border-[#D4AF37]/25 hover:bg-[#D4AF37]/[0.04]"
    >
      <Icon className="h-4 w-4 shrink-0 text-white/35 transition group-hover:text-[#D4AF37]" />

      <span className="text-xs font-medium text-white/55 transition group-hover:text-white">
        {title}
      </span>

      <ChevronRight className="ml-auto h-3.5 w-3.5 text-white/15 transition group-hover:translate-x-0.5 group-hover:text-[#D4AF37]" />
    </Link>
  );
}

/* ------------------------------------------------ */
/* NO BUSINESS */
/* ------------------------------------------------ */

function NoBusinessConnected() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#050505] px-6 text-white">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.06]">
          <Building2 className="h-6 w-6 text-[#D4AF37]" />
        </div>

        <h1 className="mt-7 text-2xl font-semibold">
          No business connected yet
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/35">
          Register your business or claim an existing place on MEDER to access
          your Business Dashboard.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/for-business/register"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#e3c354]"
          >
            Register Business
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/for-business/claim"
            className="inline-flex items-center justify-center rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/[0.05] px-6 py-3 text-sm font-medium text-[#D4AF37] transition hover:border-[#D4AF37]/45 hover:bg-[#D4AF37]/[0.1]"
          >
            Claim a Place
          </Link>
        </div>
      </div>
    </div>
  );
}