 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Clock,
  Mail,
  Phone,
  Save,
  MessageCircle,
} from "lucide-react";

type DayHours = {
  day: string;
  isOpen: boolean;
  open: string;
  close: string;
};

const defaultHours: DayHours[] = [
  { day: "Monday", isOpen: true, open: "08:00", close: "22:00" },
  { day: "Tuesday", isOpen: true, open: "08:00", close: "22:00" },
  { day: "Wednesday", isOpen: true, open: "08:00", close: "22:00" },
  { day: "Thursday", isOpen: true, open: "08:00", close: "22:00" },
  { day: "Friday", isOpen: true, open: "08:00", close: "23:00" },
  { day: "Saturday", isOpen: true, open: "09:00", close: "23:00" },
  { day: "Sunday", isOpen: true, open: "09:00", close: "21:00" },
];

export default function BusinessContactPage() {
  const [hours, setHours] = useState<DayHours[]>(defaultHours);

  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedContact = localStorage.getItem("meder-business-contact");
    const businessInfo = localStorage.getItem("meder-business-information");

    if (savedContact) {
      try {
        const data = JSON.parse(savedContact);

        if (data.hours) setHours(data.hours);
        if (data.phone) setPhone(data.phone);
        if (data.whatsapp) setWhatsapp(data.whatsapp);
        if (data.email) setEmail(data.email);
        if (data.website) setWebsite(data.website);
      } catch {
        console.log("Could not load saved contact information.");
      }
    } else if (businessInfo) {
      try {
        const data = JSON.parse(businessInfo);

        if (data.phone) setPhone(data.phone);
        if (data.whatsapp) setWhatsapp(data.whatsapp);
        if (data.email) setEmail(data.email);
      } catch {
        console.log("Could not load business information.");
      }
    }
  }, []);

  const updateDay = (
    index: number,
    field: keyof DayHours,
    value: string | boolean
  ) => {
    setHours((current) =>
      current.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const saveContact = () => {
    const contactData = {
      hours,
      phone,
      whatsapp,
      email,
      website,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "meder-business-contact",
      JSON.stringify(contactData)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        {/* Back */}
        <Link
          href="/for-business/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10">
            <Clock className="text-[#D4AF37]" size={24} />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Hours & Contact
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
            Keep your opening hours and customer contact information accurate
            so people know when and how to reach your business.
          </p>
        </div>

        {/* Opening Hours */}
        <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
 <div className="mb-6">
            <h2 className="text-xl font-semibold">Opening hours</h2>
            <p className="mt-1 text-sm text-white/45">
              Set the regular opening and closing time for each day.
            </p>
          </div>

          <div className="space-y-3">
            {hours.map((item, index) => (
              <div
                key={item.day}
                className="rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Day */}
                  <div className="flex items-center gap-3 sm:w-36">
                    <button
                      type="button"
                      onClick={() =>
                        updateDay(index, "isOpen", !item.isOpen)
                      }
                      className={`relative h-6 w-11 rounded-full transition ${
                        item.isOpen ? "bg-[#D4AF37]" : "bg-white/20"
                      }`}
                      aria-label={`Toggle ${item.day}`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-black transition ${
                          item.isOpen ? "left-6" : "left-1"
                        }`}
                      />
                    </button>

                    <span className="font-medium">{item.day}</span>
                  </div>

                  {/* Times */}
                  {item.isOpen ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="time"
                        value={item.open}
                        onChange={(e) =>
                          updateDay(index, "open", e.target.value)
                        }
                        className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white outline-none focus:border-[#D4AF37]/60"
                      />

                      <span className="text-white/30">to</span>

                      <input
                        type="time"
                        value={item.close}
                        onChange={(e) =>
                          updateDay(index, "close", e.target.value)
                        }
                        className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white outline-none focus:border-[#D4AF37]/60"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-white/35">Closed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Contact information</h2>
            <p className="mt-1 text-sm text-white/45">
              Give customers simple ways to contact your business.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Phone */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/75">
                <Phone size={16} className="text-[#D4AF37]" />
                Phone
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+251 9XX XXX XXX"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-white/25 focus:border-[#D4AF37]/60"
              />
            </div>
 {/* WhatsApp */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/75">
                <MessageCircle size={16} className="text-[#D4AF37]" />
                WhatsApp
              </label>

              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+251 9XX XXX XXX"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-white/25 focus:border-[#D4AF37]/60"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/75">
                <Mail size={16} className="text-[#D4AF37]" />
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@business.com"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-white/25 focus:border-[#D4AF37]/60"
              />
            </div>

            {/* Website */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/75">
                Website
              </label>

              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="www.yourbusiness.com"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-white/25 focus:border-[#D4AF37]/60"
              />
            </div>
          </div>
        </section>

        {/* Preview */}
        <section className="mb-8 rounded-3xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5 sm:p-7">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Customer preview</h2>
            <p className="mt-1 text-sm text-white/45">
              This is the type of information customers will see on your
              business profile.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Clock size={16} className="text-[#D4AF37]" />
                Opening hours
              </div>

              <div className="space-y-1 text-sm text-white/60">
                {hours.map((item) => (
                  <div
                    key={item.day}
                    className="flex justify-between gap-4"
                  >
                    <span>{item.day}</span>

                    <span>
                      {item.isOpen
                        ? `${item.open} – ${item.close}`
                        : "Closed"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="mb-3 text-sm font-medium">
                Contact options
              </div>

              <div className="space-y-3 text-sm text-white/60">
                {phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={15} />
                    {phone}
                  </div>
                )}

                {whatsapp && (
                  <div className="flex items-center gap-2">
                    <MessageCircle size={15} />
                    {whatsapp}
                  </div>
                )}
 {email && (
                  <div className="flex items-center gap-2 break-all">
                    <Mail size={15} />
                    {email}
                  </div>
                )}

                {website && (
                  <div className="break-all text-white/50">
                    {website}
                  </div>
                )}

                {!phone && !whatsapp && !email && !website && (
                  <span className="text-white/30">
                    No contact information added yet.
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Save */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-white/40">
            Keep this information updated whenever your hours or contact
            details change.
          </div>

          <button
            type="button"
            onClick={saveContact}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 py-3 font-semibold text-black transition hover:brightness-110"
          >
            {saved ? <Check size={18} /> : <Save size={18} />}
            {saved ? "Saved successfully" : "Save changes"}
          </button>
        </div>
      </div>
    </main>
  );
}