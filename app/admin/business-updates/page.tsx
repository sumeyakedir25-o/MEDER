 "use client";

import { useEffect, useState } from "react";
import { createClient } from "@/Lib/supabase/client";
import Link from "next/link";

type UpdateRequest = {
  id: string;
  place_id: string;
  requested_by: string | null;
  status: "pending" | "approved" | "rejected";
  requested_changes: Record<string, string>;
  reason: string | null;
  admin_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
};

type Place = {
  id: string;
  name: string;
};

type RequestWithPlace = UpdateRequest & {
  place?: Place;
};

export default function BusinessUpdatesPage() {
  const supabase = createClient();

  const [requests, setRequests] = useState<RequestWithPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadRequests() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("business_update_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setMessage(error.message);
      setLoading(false);
      return;
    }

    const requestRows = data || [];

    const placeIds = [
      ...new Set(
        requestRows.map((request) => request.place_id),
      ),
    ];

    let places: Place[] = [];

    if (placeIds.length > 0) {
      const { data: placeData, error: placeError } =
        await supabase
          .from("places")
          .select("id, name")
          .in("id", placeIds);

      if (placeError) {
        console.error(placeError);
      } else {
        places = placeData || [];
      }
    }

    const combined = requestRows.map((request) => ({
      ...request,
      place: places.find(
        (place) => place.id === request.place_id,
      ),
    }));

    setRequests(combined);
    setLoading(false);
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function handleReview(
    request: RequestWithPlace,
    decision: "approved" | "rejected",
  ) {
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("You must be signed in as an admin.");
      return;
    }

    if (decision === "approved") {
      const changes = request.requested_changes || {};

      const allowedFields = [
        "name",
        "phone",
        "whatsapp",
        "website",
        "address",
        "description",
        "tiktok_url",
      ];

      const placeUpdates: Record<string, string | null> = {};

      for (const field of allowedFields) {
        if (
          Object.prototype.hasOwnProperty.call(changes, field)
        ) {
          placeUpdates[field] = changes[field] || null;
        }
      }

      if (changes.instagram !== undefined) {
        const { data: currentPlace } = await supabase
          .from("places")
          .select("practical_data")
          .eq("id", request.place_id)
          .single();

        const practicalData =
          currentPlace?.practical_data || {};

        placeUpdates.practical_data = JSON.stringify({
          ...practicalData,
          instagram: changes.instagram || "",
        });
      }

      if (Object.keys(placeUpdates).length > 0) {
        const { error: placeError } = await supabase
          .from("places")
          .update(placeUpdates)
          .eq("id", request.place_id);

        if (placeError) {
          console.error(placeError);
          setMessage(placeError.message);
          return;
        }
      }
    }

    const { error } = await supabase
      .from("business_update_requests")
      .update({
        status: decision,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", request.id);

    if (error) {
      console.error(error);
      setMessage(error.message);
      return;
    }

    setRequests((current) =>
      current.filter((item) => item.id !== request.id),
    );
 setMessage(
      decision === "approved"
        ? "Update approved and applied to the place."
        : "Update request rejected.",
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-white/50">
            Loading update requests...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/dashboard"
          className="text-sm text-white/40 transition hover:text-white"
        >
          ← Back to admin dashboard
        </Link>

        <div className="mt-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF6A]">
            Trust & Verification
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            Business update requests
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
            Review proposed business information changes before
            they become official MEDER information.
          </p>
        </div>

        {message && (
          <div className="mt-6 rounded-xl border border-[#D4AF6A]/20 bg-[#D4AF6A]/[0.06] p-4 text-sm text-[#D4AF6A]">
            {message}
          </div>
        )}

        {requests.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
            <p className="text-white/50">
              No pending business update requests.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {requests.map((request) => (
              <div
                key={request.id}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold">
                      {request.place?.name ||
                        "Unknown place"}
                    </p>

                    <p className="mt-1 text-xs text-white/35">
                      Submitted{" "}
                      {new Date(
                        request.created_at,
                      ).toLocaleString()}
                    </p>
                  </div>

                  <span className="inline-flex w-fit rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
                    Pending
                  </span>
                </div>

                {request.reason && (
                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-wider text-white/35">
                      Reason
                    </p>

                    <p className="mt-2 text-sm leading-6 text-white/70">
                      {request.reason}
                    </p>
                  </div>
                )}

                <div className="mt-6">
                  <p className="text-xs uppercase tracking-wider text-white/35">
                    Proposed changes
                  </p>

                  <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
                    {Object.entries(
                      request.requested_changes || {},
                    ).map(([field, value]) => (
                      <div
                        key={field}
                        className="grid gap-2 border-b border-white/10 p-4 last:border-b-0 sm:grid-cols-[160px_1fr]"
                      >
                        <p className="text-sm capitalize text-white/40">
                          {field.replaceAll("_", " ")}
                        </p>
 <p className="break-words text-sm text-white/80">
                          {value || "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() =>
                      handleReview(
                        request,
                        "approved",
                      )
                    }
                    className="flex-1 rounded-xl bg-[#D4AF6A] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#e2bd7b]"
                  >
                    Approve & Apply
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleReview(
                        request,
                        "rejected",
                      )
                    }
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}