 "use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clock,
  Compass,
  Filter,
  MessageCircle,
  Phone,
  Save,
  TrendingUp,
  UserRound,
  X,
} from "lucide-react";

type LeadStatus = "New" | "Contacted" | "Converted" | "Lost";

type Lead = {
  id: string;
  type: "WhatsApp" | "Phone" | "Directions" | "Save";
  title: string;
  description: string;
  createdAt: string;
  status: LeadStatus;
  notes: string;
};

const defaultLeads: Lead[] = [
  {
    id: "lead-1",
    type: "WhatsApp",
    title: "WhatsApp inquiry",
    description: "Customer opened WhatsApp from your MEDER profile.",
    createdAt: "2026-09-03T09:42:00",
    status: "New",
    notes: "",
  },
  {
    id: "lead-2",
    type: "Directions",
    title: "Directions requested",
    description: "Customer requested directions to your location.",
    createdAt: "2026-09-02T18:15:00",
    status: "Contacted",
    notes: "Customer said they may visit this weekend.",
  },
  {
    id: "lead-3",
    type: "Phone",
    title: "Phone inquiry",
    description: "Customer tapped the phone button on MEDER.",
    createdAt: "2026-09-02T14:30:00",
    status: "Converted",
    notes: "Customer booked a table.",
  },
  {
    id: "lead-4",
    type: "Save",
    title: "Business saved",
    description: "Customer saved your business for later.",
    createdAt: "2026-09-01T11:20:00",
    status: "New",
    notes: "",
  },
  {
    id: "lead-5",
    type: "WhatsApp",
    title: "WhatsApp inquiry",
    description: "Customer opened WhatsApp from your MEDER profile.",
    createdAt: "2026-08-31T16:05:00",
    status: "Lost",
    notes: "No response after follow-up.",
  },
];

const statusOptions: LeadStatus[] = [
  "New",
  "Contacted",
  "Converted",
  "Lost",
];

export default function BusinessLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(defaultLeads);
  const [filter, setFilter] = useState<"All" | LeadStatus>("All");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedLeads = localStorage.getItem("meder-business-leads");

    if (!savedLeads) return;

    try {
      const parsed = JSON.parse(savedLeads);

      if (Array.isArray(parsed)) {
        setLeads(parsed);
      }
    } catch {
      console.log("Could not load saved leads.");
    }
  }, []);

  const filteredLeads = useMemo(() => {
    if (filter === "All") return leads;

    return leads.filter((lead) => lead.status === filter);
  }, [filter, leads]);

  const newLeads = leads.filter(
    (lead) => lead.status === "New"
  ).length;

  const contactedLeads = leads.filter(
    (lead) => lead.status === "Contacted"
  ).length;

  const convertedLeads = leads.filter(
    (lead) => lead.status === "Converted"
  ).length;

  const lostLeads = leads.filter(
    (lead) => lead.status === "Lost"
  ).length;

  const conversionRate =
    leads.length > 0
      ? ((convertedLeads / leads.length) * 100).toFixed(1)
      : "0.0";

  const updateLeadStatus = (
    id: string,
    status: LeadStatus
  ) => {
    setLeads((current) =>
      current.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              status,
            }
          : lead
      )
    );

    setSelectedLead((current) =>
      current && current.id === id
        ? {
            ...current,
            status,
          }
        : current
    );
  };

  const updateLeadNotes = (
    id: string,
    notes: string
  ) => {
    setLeads((current) =>
      current.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              notes,
            }
          : lead
      )
    );

    setSelectedLead((current) =>
      current && current.id === id
        ? {
            ...current,
            notes,
          }
        : current
    );
  };

  const saveLeads = () => {
    localStorage.setItem(
      "meder-business-leads",
      JSON.stringify(leads)
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
        <div className="mb-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10">
            <UserRound
              size={24}
              className="text-[#D4AF37]"
            />
          </div>

          <p className="mb-2 text-sm text-[#D4AF37]">
            Customer intent
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Leads
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
            Track customer actions that show real interest in your business
            and manage them from one place.
          </p>
        </div>

        {/* Summary */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="New"
            value={newLeads}
            icon={Clock}
          />

          <SummaryCard
            label="Contacted"
            value={contactedLeads}
            icon={MessageCircle}
          />

          <SummaryCard
            label="Converted"
            value={convertedLeads}
            icon={Check}
          />

          <SummaryCard
            label="Conversion rate"
            value={`${conversionRate}%`}
            icon={TrendingUp}
          />
        </section>

        {/* Lead Funnel */}
        <section className="mb-8 rounded-3xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5 sm:p-7">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Lead pipeline
            </h2>

            <p className="mt-1 text-sm text-white/45">
              See how customer interest moves through your pipeline.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <PipelineItem
              label="New"
              value={newLeads}
            />

            <PipelineItem
              label="Contacted"
              value={contactedLeads}
            />

            <PipelineItem
              label="Converted"
              value={convertedLeads}
            />

            <PipelineItem
              label="Lost"
              value={lostLeads}
            />
          </div>
        </section>

        {/* Leads */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
          {/* Section header */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Customer leads
              </h2>

              <p className="mt-1 text-sm text-white/45">
                Review and update the status of your leads.
              </p>
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              />

              <select
                value={filter}
                onChange={(e) =>
                  setFilter(
                    e.target.value as
                      | "All"
                      | LeadStatus
                  )
                }
                className="appearance-none rounded-xl border border-white/10 bg-black py-3 pl-9 pr-10 text-sm outline-none focus:border-[#D4AF37]/60"
              >
                <option value="All">All leads</option>
 {statusOptions.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
              />
            </div>
          </div>

          {/* Lead list */}
          {filteredLeads.length > 0 ? (
            <div className="space-y-3">
              {filteredLeads.map((lead) => (
                <LeadRow
                  key={lead.id}
                  lead={lead}
                  onOpen={() => setSelectedLead(lead)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
              <UserRound
                size={28}
                className="mx-auto mb-3 text-white/20"
              />

              <p className="text-sm text-white/45">
                No leads in this category.
              </p>
            </div>
          )}
        </section>

        {/* Save */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-white/30">
            Prototype leads are stored locally. Real MEDER leads will come
            from customer actions tracked by the platform.
          </p>

          <button
            type="button"
            onClick={saveLeads}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 py-3 font-semibold text-black transition hover:brightness-110"
          >
            {saved ? <Check size={18} /> : <Save size={18} />}
            {saved ? "Saved successfully" : "Save changes"}
          </button>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0b0b0b] p-5 shadow-2xl sm:p-7">
            {/* Modal header */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs uppercase tracking-wider text-[#D4AF37]">
                  Lead details
                </p>

                <h2 className="text-xl font-semibold">
                  {selectedLead.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="rounded-xl border border-white/10 p-2 text-white/50 transition hover:bg-white/5 hover:text-white"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Lead type */}
            <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-3">
                <LeadIcon type={selectedLead.type} />

                <div>
                  <p className="text-sm font-medium">
                    {selectedLead.type}
                  </p>

                  <p className="mt-1 text-xs text-white/35">
                    {formatDate(selectedLead.createdAt)}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-white/50">
                {selectedLead.description}
              </p>
            </div>

            {/* Status */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-white/70">
                Lead status
              </label>
 <div className="relative">
                <select
                  value={selectedLead.status}
                  onChange={(e) =>
                    updateLeadStatus(
                      selectedLead.id,
                      e.target.value as LeadStatus
                    )
                  }
                  className="w-full appearance-none rounded-xl border border-white/10 bg-black px-4 py-3 pr-10 text-sm outline-none focus:border-[#D4AF37]/60"
                >
                  {statusOptions.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-white/70">
                Internal notes
              </label>

              <textarea
                value={selectedLead.notes}
                onChange={(e) =>
                  updateLeadNotes(
                    selectedLead.id,
                    e.target.value
                  )
                }
                placeholder="Add notes about this lead..."
                rows={4}
                className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none placeholder:text-white/25 focus:border-[#D4AF37]/60"
              />
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={() => setSelectedLead(null)}
              className="w-full rounded-xl bg-[#D4AF37] px-5 py-3 font-semibold text-black transition hover:brightness-110"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon: typeof Clock;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10">
        <Icon size={19} className="text-[#D4AF37]" />
      </div>

      <p className="text-3xl font-semibold tracking-tight">
        {value}
      </p>

      <p className="mt-2 text-sm text-white/45">
        {label}
      </p>
    </div>
  );
}

function PipelineItem({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <p className="text-xs text-white/35">{label}</p>

      <p className="mt-2 text-2xl font-semibold">
        {value}
      </p>
    </div>
  );
}

function LeadRow({
  lead,
  onOpen,
}: {
  lead: Lead;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-white/20 hover:bg-white/[0.04]"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <LeadIcon type={lead.type} />

          <div className="min-w-0">
            <p className="truncate font-medium">
              {lead.title}
            </p>

            <p className="mt-1 truncate text-xs text-white/35">
              {lead.description}
            </p>

            <p className="mt-2 text-xs text-white/25">
              {formatDate(lead.createdAt)}
            </p>
          </div>
        </div>

        <StatusBadge status={lead.status} />
      </div>
    </button>
  );
}
 function LeadIcon({
  type,
}: {
  type: Lead["type"];
}) {
  const Icon =
    type === "WhatsApp"
      ? MessageCircle
      : type === "Phone"
      ? Phone
      : type === "Directions"
      ? Compass
      : Save;

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
      <Icon size={18} className="text-[#D4AF37]" />
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: LeadStatus;
}) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full border px-3 py-1.5 text-xs ${
        status === "New"
          ? "border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]"
          : status === "Contacted"
          ? "border-white/15 bg-white/5 text-white/60"
          : status === "Converted"
          ? "border-green-500/20 bg-green-500/10 text-green-400"
          : "border-red-500/20 bg-red-500/10 text-red-400"
      }`}
    >
      {status}
    </span>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}