 "use client";

import { useEffect, useState } from "react";
import { createClient } from "@/Lib/supabase/client";
import Link from "next/link";
import {
  Check,
  X,
  ShieldCheck,
  Clock,
  Building2,
  ArrowLeft,
} from "lucide-react";

type Claim = {
  id: string;
  place_id: string;
  owner_name: string;
  email: string;
  phone: string | null;
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
  place?: {
  name: string;
  area: string | null;
  type: string | null;
  verification_status: string | null;
} | null;
};

export default function AdminBusinessesPage() {
  const supabase = createClient();

  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [notes, setNotes] = useState("");

  async function loadClaims() {
    setLoading(true);

    const { data, error } = await supabase
      .from("business_claims")
      .select(`
        id,
        place_id,
        owner_name,
        email,
        phone,
        status,
        admin_notes,
        created_at,
        reviewed_at,
        place:places (
          name,
          area,
          type,
          verification_status
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load business claims:", error);
      setClaims([]);
    } else {
      setClaims((data || []).map((claim: any) => ({
  ...claim,
  place: Array.isArray(claim.place)
    ? claim.place[0] || null
    : claim.place || null,
})) as Claim[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadClaims();
  }, []);

  async function updateClaim(
    claim: Claim,
    newStatus: "approved" | "rejected"
  ) {
    setProcessing(claim.id);

    const { error: claimError } = await supabase
      .from("business_claims")
      .update({
        status: newStatus,
        admin_notes: notes || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", claim.id);

    if (claimError) {
      console.error("Failed to update claim:", claimError);
      setProcessing(null);
      return;
    }

    if (newStatus === "approved") {
      const { error: placeError } = await supabase
        .from("places")
        .update({
          verification_status: "Business Verified",
        })
        .eq("id", claim.place_id);

      if (placeError) {
        console.error("Failed to verify place:", placeError);
      }
    }

    setSelectedClaim(null);
    setNotes("");
    setProcessing(null);

    await loadClaims();
  }

  const pendingClaims = claims.filter(
    (claim) => claim.status === "pending"
  );

  const approvedClaims = claims.filter(
    (claim) => claim.status === "approved"
  );

  const rejectedClaims = claims.filter(
    (claim) => claim.status === "rejected"
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <Link
            href="/admin/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
          >
            <ArrowLeft size={16} />
            Back to Command Center
          </Link>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <ShieldCheck
                  size={22}
                  className="text-[#D4AF37]"
                />
                <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
                  Business Verification
                </span>
              </div>

              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                Businesses
              </h1>
 <p className="mt-3 max-w-2xl text-white/50">
                Review business ownership claims and verify legitimate
                businesses on MEDER.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-10 grid gap-4 md:grid-cols-3">
          <StatCard
            label="Pending Review"
            value={pendingClaims.length}
            icon={<Clock size={18} />}
          />

          <StatCard
            label="Approved"
            value={approvedClaims.length}
            icon={<Check size={18} />}
          />

          <StatCard
            label="Rejected"
            value={rejectedClaims.length}
            icon={<X size={18} />}
          />
        </div>

        {/* Claims */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Verification Requests
              </h2>
              <p className="mt-1 text-sm text-white/40">
                Businesses waiting for review.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-white/40">
              Loading verification requests...
            </div>
          ) : pendingClaims.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
              <ShieldCheck
                size={34}
                className="mx-auto mb-4 text-[#D4AF37]"
              />

              <h3 className="text-lg font-medium">
                No pending claims
              </h3>

              <p className="mt-2 text-sm text-white/40">
                New business verification requests will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#D4AF37]/30"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10">
                        <Building2
                          size={21}
                          className="text-[#D4AF37]"
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold">
                          {claim.place?.name || "Unknown place"}
                        </h3>

                        <p className="mt-1 text-sm text-white/50">
                          {claim.place?.type || "Business"}{" "}
                          {claim.place?.area
                            ? `· ${claim.place.area}`
                            : ""}
                        </p>

                        <div className="mt-4 space-y-1 text-sm">
                          <p>
                            <span className="text-white/40">
                              Owner:
                            </span>{" "}
                            {claim.owner_name}
                          </p>

                          <p>
                            <span className="text-white/40">
                              Email:
                            </span>{" "}
                            {claim.email}
                          </p>

                          {claim.phone && (
                            <p>
 <span className="text-white/40">
                                Phone:
                              </span>{" "}
                              {claim.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedClaim(claim);
                        setNotes("");
                      }}
                      className="rounded-xl border border-[#D4AF37]/40 px-5 py-3 text-sm font-medium text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
                    >
                      Review Claim
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Review Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b0b0b] p-7 shadow-2xl">

            <div className="mb-6">
              <div className="mb-3 flex items-center gap-3">
                <ShieldCheck
                  size={20}
                  className="text-[#D4AF37]"
                />

                <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
                  Review
                </span>
              </div>

              <h2 className="text-2xl font-semibold">
                {selectedClaim.place?.name}
              </h2>

              <p className="mt-2 text-sm text-white/50">
                Review the ownership information before approving
                verification.
              </p>
            </div>

            <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-white/40">Owner</span>
                <span>{selectedClaim.owner_name}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-white/40">Email</span>
                <span>{selectedClaim.email}</span>
              </div>

              {selectedClaim.phone && (
                <div className="flex justify-between gap-4">
                  <span className="text-white/40">Phone</span>
                  <span>{selectedClaim.phone}</span>
                </div>
              )}

              <div className="flex justify-between gap-4">
                <span className="text-white/40">Place</span>
                <span>
                  {selectedClaim.place?.name}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm text-white/60">
                Admin Notes
              </label>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional internal note..."
                rows={3}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#D4AF37]/50"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() =>
                  updateClaim(selectedClaim, "rejected")
                }
                disabled={processing === selectedClaim.id}
                className="flex-1 rounded-xl border border-red-500/30 px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
              >
                <X size={16} className="mr-2 inline" />
                Reject
              </button>
 <button
                onClick={() =>
                  updateClaim(selectedClaim, "approved")
                }
                disabled={processing === selectedClaim.id}
                className="flex-1 rounded-xl bg-[#D4AF37] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#e1c45a] disabled:opacity-50"
              >
                <Check size={16} className="mr-2 inline" />
                {processing === selectedClaim.id
                  ? "Processing..."
                  : "Approve"}
              </button>
            </div>

            <button
              onClick={() => {
                setSelectedClaim(null);
                setNotes("");
              }}
              className="mt-4 w-full py-2 text-sm text-white/30 transition hover:text-white/60"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-4 flex items-center gap-2 text-[#D4AF37]">
        {icon}
        <span className="text-xs uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>

      <div className="text-3xl font-semibold">
        {value}
      </div>
    </div>
  );
}