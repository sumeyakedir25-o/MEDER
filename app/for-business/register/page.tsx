 "use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Send,
  User,
} from "lucide-react";

export default function BusinessRegistrationPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const existing = JSON.parse(
      localStorage.getItem("meder-business-registrations") || "[]",
    );

    const registration = {
      id: Date.now().toString(),
      businessName: form.get("businessName"),
      ownerName: form.get("ownerName"),
      email: form.get("email"),
      phone: form.get("phone"),
      businessType: form.get("businessType"),
      area: form.get("area"),
      address: form.get("address"),
      status: "approved",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "meder-business-registrations",
      JSON.stringify([...existing, registration]),
    );

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-black px-4 py-16 text-white sm:px-6">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/10">
              <CheckCircle2 className="h-8 w-8 text-[#D4AF37]" />
            </div>

            <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
              Registration received
            </p>

            <h1 className="mt-3 font-serif text-3xl text-white sm:text-4xl">
              Welcome to MEDER
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/50">
              Your business registration has been submitted. The MEDER team
              will review your information before your business profile is
              activated.
            </p>

            <div className="mt-7 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4 text-left">
              <p className="text-xs font-medium uppercase tracking-wider text-[#D4AF37]">
                Status
              </p>
              <p className="mt-2 text-sm text-white">
                Registration pending review
              </p>
            </div>

            <Link
              href="/for-business"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
            >
              Back to For Business
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/for-business"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to For Business
        </Link>

        <div className="mt-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
            <Building2 className="h-6 w-6 text-[#D4AF37]" />
          </div>

          <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
            For businesses
          </p>

          <h1 className="mt-2 font-serif text-3xl text-white sm:text-5xl">
            Register your business
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
            Add your business to MEDER and help people discover your place,
            understand what you offer, and decide whether it is right for them.
          </p>
        </div>
 <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
              Business information
            </p>

            <h2 className="mt-2 font-serif text-2xl text-white">
              Tell us about your business
            </h2>
          </div>

          <div className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="businessName"
                className="text-sm font-medium text-white/80"
              >
                Business name
              </label>

              <div className="relative mt-2">
                <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  required
                  placeholder="e.g. Example Café"
                  className="min-h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37]/50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="ownerName"
                className="text-sm font-medium text-white/80"
              >
                Owner / manager name
              </label>

              <div className="relative mt-2">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                <input
                  id="ownerName"
                  name="ownerName"
                  type="text"
                  required
                  placeholder="Your full name"
                  className="min-h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37]/50"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-white/80"
                >
                  Email
                </label>

                <div className="relative mt-2">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="min-h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37]/50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-white/80"
                >
                  Phone
                </label>

                <div className="relative mt-2">
                  <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+251 ..."
                    className="min-h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37]/50"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="businessType"
                  className="text-sm font-medium text-white/80"
                >
                  Business type
                </label>
<select
                  id="businessType"
                  name="businessType"
                  required
                  defaultValue=""
                  className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-[#D4AF37]/50"
                >
                  <option value="" disabled className="bg-black">
                    Select type
                  </option>
                  <option value="Restaurant" className="bg-black">
                    Restaurant
                  </option>
                  <option value="Cafe" className="bg-black">
                    Café
                  </option>
                  <option value="Juice Bar" className="bg-black">
                    Juice Bar
                  </option>
                  <option value="Bakery" className="bg-black">
                    Bakery
                  </option>
                  <option value="Lounge" className="bg-black">
                    Lounge
                  </option>
                  <option value="Other" className="bg-black">
                    Other
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="area"
                  className="text-sm font-medium text-white/80"
                >
                  Area
                </label>

                <div className="relative mt-2">
                  <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                  <input
                    id="area"
                    name="area"
                    type="text"
                    required
                    placeholder="e.g. Bole"
                    className="min-h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37]/50"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="text-sm font-medium text-white/80"
              >
                Address
              </label>

              <div className="relative mt-2">
                <MapPin className="absolute left-4 top-4 h-4 w-4 text-white/30" />

                <textarea
                  id="address"
                  name="address"
                  required
                  rows={3}
                  placeholder="Business address or a clear location description"
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/30 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37]/50"
                />
              </div>
            </div>
          </div>

          <div className="mt-7 rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs leading-5 text-white/40">
              By submitting this registration, you understand that MEDER may
              review the information before activating or verifying the
              business profile.
            </p>
          </div>

          <button
            type="submit"
            className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
          >
            <Send className="h-4 w-4" />
            Submit business registration
          </button>
        </form>
      </div>
    </main>
  );
}