 "use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Save,
  MessageCircle,
} from "lucide-react";

interface BusinessInformation {
  id: string;
  businessName: string;
  businessType: string;
  area: string;
  address: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  updatedAt?: string;
}

export default function BusinessInformationPage() {
  const [business, setBusiness] = useState<BusinessInformation | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const registrations = JSON.parse(
      localStorage.getItem("meder-business-registrations") || "[]",
    );

    const claims = JSON.parse(
      localStorage.getItem("meder-business-claims") || "[]",
    );

    const existingInformation = JSON.parse(
      localStorage.getItem("meder-business-information") || "[]",
    );

    if (existingInformation.length > 0) {
      setBusiness(existingInformation[existingInformation.length - 1]);
      return;
    }

    const approvedClaim = [...claims]
      .reverse()
      .find((claim: { status: string }) => claim.status === "approved");

    const approvedRegistration = [...registrations]
      .reverse()
      .find(
        (registration: { status: string }) =>
          registration.status === "approved",
      );

    if (approvedClaim) {
      setBusiness({
        id: approvedClaim.placeId,
        businessName: approvedClaim.placeName,
        businessType: "Business",
        area: "",
        address: "",
        description: "",
        phone: approvedClaim.phone || "",
        whatsapp: "",
        email: approvedClaim.email || "",
      });

      return;
    }

    if (approvedRegistration) {
      setBusiness({
        id: approvedRegistration.id,
        businessName: approvedRegistration.businessName,
        businessType: approvedRegistration.businessType,
        area: approvedRegistration.area,
        address: approvedRegistration.address,
        description: "",
        phone: approvedRegistration.phone,
        whatsapp: "",
        email: approvedRegistration.email,
      });
    }
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!business) {
      return;
    }

    const form = new FormData(event.currentTarget);

    const updatedBusiness: BusinessInformation = {
      id: business.id,
      businessName: String(form.get("businessName") || ""),
      businessType: String(form.get("businessType") || ""),
      area: String(form.get("area") || ""),
      address: String(form.get("address") || ""),
      description: String(form.get("description") || ""),
      phone: String(form.get("phone") || ""),
      whatsapp: String(form.get("whatsapp") || ""),
      email: String(form.get("email") || ""),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "meder-business-information",
      JSON.stringify([updatedBusiness]),
    );

    setBusiness(updatedBusiness);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  if (!business) {
    return (
      <main className="min-h-screen bg-black px-4 py-10 text-white sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/for-business/dashboard"
            className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <Building2 className="mx-auto h-10 w-10 text-[#D4AF37]" />

            <h1 className="mt-5 font-serif text-3xl text-white">
              No business found
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/40">
              Register or claim a business before managing its information.
            </p>
 <Link
              href="/for-business"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black"
            >
              Go to For Business
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
          href="/for-business/dashboard"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" />
          Business dashboard
        </Link>

        <div className="mt-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
            Business profile
          </p>

          <h1 className="mt-2 font-serif text-3xl text-white sm:text-4xl">
            Business information
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/40">
            Keep your MEDER listing accurate so customers can make better
            decisions.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
        >
          <div className="grid gap-6">
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
                  required
                  defaultValue={business.businessName}
                  className="min-h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none focus:border-[#D4AF37]/50"
                />
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
                  defaultValue={business.businessType}
                  className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-[#D4AF37]/50"
                >
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
                    required
                    defaultValue={business.area}
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

              <textarea
                id="address"
                name="address"
                required
                rows={3}
                defaultValue={business.address}
                placeholder="Full business address"
                className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="text-sm font-medium text-white/80"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                defaultValue={business.description}
                placeholder="Tell people what makes your business special..."
                className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37]/50"
              />

              <p className="mt-2 text-xs text-white/30">
                Keep it useful and customer-focused.
              </p>
            </div>

            <div className="border-t border-white/10 pt-6">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                Contact information
              </p>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
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
                      defaultValue={business.phone}
                      placeholder="+251 ..."
                      className="min-h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37]/50"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="whatsapp"
                    className="text-sm font-medium text-white/80"
                  >
                    WhatsApp
                  </label>

                  <div className="relative mt-2">
                    <MessageCircle className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                    <input
                      id="whatsapp"
                      name="whatsapp"
                      type="tel"
                      defaultValue={business.whatsapp}
                      placeholder="+251 ..."
                      className="min-h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37]/50"
                    />
                  </div>
                </div>
              </div>
 <div className="mt-5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-white/80"
                >
                  Business email
                </label>

                <div className="relative mt-2">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    defaultValue={business.email}
                    placeholder="business@example.com"
                    className="min-h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37]/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {saved && (
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4 text-sm text-[#D4AF37]">
              <CheckCircle2 className="h-4 w-4" />
              Business information saved successfully.
            </div>
          )}

          <button
            type="submit"
            className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
          >
            <Save className="h-4 w-4" />
            Save changes
          </button>
        </form>
      </div>
    </main>
  );
}