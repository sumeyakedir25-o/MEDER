 "use client";

import { useState } from "react";
import { createClient } from "@/Lib/supabase/client";

type BusinessUpdateRequestProps = {
  placeId: string;
};

const editableFields = [
  {
    key: "name",
    label: "Place name",
    placeholder: "Correct place name",
  },
  {
    key: "phone",
    label: "Phone",
    placeholder: "+251...",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    placeholder: "+251...",
  },
  {
    key: "website",
    label: "Website",
    placeholder: "https://...",
  },
  {
    key: "address",
    label: "Address",
    placeholder: "Correct physical address",
  },
  {
    key: "description",
    label: "Description",
    placeholder: "Correct description",
  },
  {
    key: "instagram",
    label: "Instagram",
    placeholder: "Instagram profile URL",
  },
  {
    key: "tiktok_url",
    label: "TikTok",
    placeholder: "TikTok profile URL",
  },
];

export default function BusinessUpdateRequest({
  placeId,
}: BusinessUpdateRequestProps) {
  const supabase = createClient();

  const [changes, setChanges] = useState<Record<string, string>>({});
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  function updateField(key: string, value: string) {
    setChanges((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  async function handleSubmit() {
    setMessage("");

    const cleanedChanges = Object.fromEntries(
      Object.entries(changes).filter(
        ([, value]) => value.trim() !== ""
      )
    );

    if (Object.keys(cleanedChanges).length === 0) {
      setMessage("Please enter at least one change.");
      return;
    }

    if (!reason.trim()) {
      setMessage("Please tell MEDER why this information should be changed.");
      return;
    }

    setSubmitting(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("Please sign in before submitting an update.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase
      .from("business_update_requests")
      .insert({
        place_id: placeId,
        requested_by: user.id,
        requested_changes: cleanedChanges,
        reason: reason.trim(),
        status: "pending",
      });

    if (error) {
      console.error(error);
      setMessage(error.message);
      setSubmitting(false);
      return;
    }

    setChanges({});
    setReason("");
    setMessage(
      "Update request submitted. MEDER will review the changes before they appear publicly."
    );

    setSubmitting(false);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
          MEDER Trust
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          Request an information update
        </h2>

        <p className="mt-2 text-sm leading-6 text-white/45">
          See something about your business that needs to be corrected?
          Submit the proposed changes and MEDER will review them before
          updating the public information.
        </p>
      </div>

      <div className="space-y-5">
        {editableFields.map((field) => (
          <div key={field.key}>
            <label className="mb-2 block text-sm font-medium text-white/75">
              {field.label}
            </label>

            <input
              type="text"
              value={changes[field.key] || ""}
              onChange={(event) =>
                updateField(field.key, event.target.value)
              }
              placeholder={field.placeholder}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF37]/60"
            />
          </div>
        ))}
 <div>
          <label className="mb-2 block text-sm font-medium text-white/75">
            Why should this information be changed?
          </label>

          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={4}
            placeholder="For example: Our phone number changed recently."
            className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF37]/60"
          />
        </div>

        {message && (
          <div className="rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.06] px-4 py-3 text-sm text-[#D4AF37]">
            {message}
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full rounded-xl bg-[#D4AF37] px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-[#e4c45a] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Submitting..."
            : "Submit Update Request"}
        </button>
      </div>
    </div>
  );
}