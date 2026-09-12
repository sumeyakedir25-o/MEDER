 "use client";

import {
  FormEvent,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@/Lib/supabase/client";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  MapPin,
  Save,
  Sparkles,
  Store,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const categories = [
  "Food & Dining",
  "Coffee & Cafe",
  "Entertainment",
  "Dessert & Ice Cream",
  "Games & Recreation",
];

const purposes = [
  "Eat",
  "Hang Out",
  "Celebrate",
  "Relax",
  "Work",
  "Study",
  "Entertainment",
  "Coffee",
  "Explore",
  "Photography",
  "Shopping",
];

const audiences = [
  "Solo",
  "Couples",
  "Friends",
  "Families",
  "Students",
  "Professionals",
  "Groups",
  "Children",
  "Tourists",
  "Business Customers",
];

const experiences = [
  "Date",
  "Friends Outing",
  "Family Outing",
  "Business Meeting",
  "Study Session",
  "Work Session",
  "Celebration",
  "Casual Hangout",
  "Relaxation",
  "Entertainment",
  "Photography",
  "Exploring",
  "Group Gathering",
];

const vibes = [
  "Quiet",
  "Cozy",
  "Romantic",
  "Luxury",
  "Elegant",
  "Casual",
  "Lively",
  "Energetic",
  "Chill",
  "Aesthetic",
  "Modern",
  "Traditional",
  "Social",
  "Peaceful",
];

const cuisines = [
  "Ethiopian",
  "Italian",
  "Indian",
  "Chinese",
  "Korean",
  "Japanese",
  "Asian",
  "Fast Food",
  "Burger",
  "Pizza",
  "Chicken",
  "Pasta",
  "Seafood",
  "Dessert",
  "Coffee",
  "Juice",
  "Bakery",
  "Breakfast",
  "Vegan / Vegetarian",
  "Other",
];

const amenities = [
  "Wi-Fi",
  "Power Outlets",
  "Comfortable Seating",
  "Indoor Seating",
  "Outdoor Seating",
  "Private Room",
  "Air Conditioning",
  "Restroom",
  "Wheelchair Accessible",
  "Kids Area",
  "Smoking Area",
  "Rooftop",
  "Live Music",
];

const paymentMethods = [
  "Cash",
  "Telebirr",
  "CBE Birr",
  "Bank Transfer",
  "Card",
  "Other",
];

const reservationOptions = [
  "Walk-in",
  "Reservation Recommended",
  "Reservation Required",
  "Phone Reservation",
  "WhatsApp Reservation",
];

const verificationSources = [
  "Google Maps",
  "Official Website",
  "Official Instagram",
  "Official TikTok",
  "Business Owner",
  "Direct Research",
  "User Contribution",
];

const areas = [
  "Bole",
  "Kazanchis",
  "Piassa",
  "Mexico",
  "CMC",
  "Gerji",
  "Sar Bet",
  "4 Kilo",
  "6 Kilo",
  "Old Airport",
  "Megenagna",
  "Other",
];

type SectionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  number: string;
};

function Section({
  title,
  description,
  children,
  open,
  onToggle,
  number,
}: SectionProps) {
  return (
    <section className="border-b border-white/10">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-white/[0.03]"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/40 text-sm text-[#D4AF37]">
            {number}
          </div>

          <div>
            <h2 className="text-base font-semibold text-white">{title}</h2>
            <p className="mt-1 text-sm text-white/45">{description}</p>
          </div>
        </div>

        {open ? (
          <ChevronUp className="h-5 w-5 text-white/50" />
        ) : (
          <ChevronDown className="h-5 w-5 text-white/50" />
        )}
      </button>

      {open && <div className="px-6 pb-7">{children}</div>}
    </section>
  );
}

function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-2 block text-sm font-medium text-white/80">
      {children}
      {required && (
        <span className="ml-2 text-xs font-semibold text-[#D4AF37]">
          ✨ Required
        </span>
      )}
    </label>
  );
}
 function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF37]/60 focus:bg-white/[0.06]"
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF37]/60 focus:bg-white/[0.06]"
    />
  );
}

function MultiSelect({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option);

        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={`rounded-full border px-3 py-2 text-xs transition ${
              active
                ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                : "border-white/10 bg-white/[0.03] text-white/65 hover:border-white/25 hover:text-white"
            }`}
          >
            {active && <Check className="mr-1 inline h-3 w-3" />}
            {option}
          </button>
        );
      })}
    </div>
  );
}

function NewPlacePage() {
  const supabase = createClient();
  const searchParams = useSearchParams();
const editId = searchParams.get("edit");
const isEditing = !!editId;

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: true,
    discovery: true,
    experience: false,
    food: false,
    location: false,
    practical: false,
    media: false,
    trust: false,
    publish: true,
  });

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [cmsCategories, setCmsCategories] = useState<
  {
    id: string;
    name: string;
    slug: string;
    category_group: string;
  }[]
>([]);
  const [description, setDescription] = useState("");

  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([]);
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);

  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);

  const [priceLevel, setPriceLevel] = useState("");
  const [spendMin, setSpendMin] = useState("");
  const [spendMax, setSpendMax] = useState("");

  const [city, setCity] = useState("Addis Ababa");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [tiktokVideos, setTiktokVideos] = useState<string[]>([]);
  const [facebook, setFacebook] = useState("");
  const [telegram, setTelegram] = useState("");
 const [wifi, setWifi] = useState(false);
  const [powerOutlets, setPowerOutlets] = useState(false);
  const [comfortableSeating, setComfortableSeating] = useState(false);
  const [indoorSeating, setIndoorSeating] = useState(false);
  const [outdoorSeating, setOutdoorSeating] = useState(false);
  const [privateRoom, setPrivateRoom] = useState(false);
  const [airConditioning, setAirConditioning] = useState(false);
  const [restroom, setRestroom] = useState(false);
  const [wheelchairAccessible, setWheelchairAccessible] = useState(false);
  const [kidsArea, setKidsArea] = useState(false);
  const [smokingArea, setSmokingArea] = useState(false);
  const [rooftop, setRooftop] = useState(false);
  const [liveMusic, setLiveMusic] = useState(false);

  const [noiseLevel, setNoiseLevel] = useState("");
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [reservation, setReservation] = useState("");
  const [reservationPhone, setReservationPhone] = useState("");
  const [reservationWhatsapp, setReservationWhatsapp] = useState("");
  const [reservationUrl, setReservationUrl] = useState("");

  const [coverImage, setCoverImage] = useState("");
  const [featuredVideo, setFeaturedVideo] = useState("");

  const [verificationStatus, setVerificationStatus] = useState("Unverified");
  const [verificationSource, setVerificationSource] = useState("");
  const [verificationNotes, setVerificationNotes] = useState("");

  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

   useEffect(() => {
  if (!editId) return;

  async function loadPlace() {
    const { data, error } = await supabase
      .from("places")
      .select("*")
      .eq("id", editId)
      .single();

    if (error || !data) {
      console.error(error);
      setMessage("Unable to load this place.");
      return;
    }

    const practical = data.practical_data || {};

    setName(data.name || "");
    setType(data.type || "");
    setCategory(data.category || "");
    setDescription(data.description || "");

    setSelectedPurposes(
      (data.experiences || [])
        .filter((item: string) => item.startsWith("Purpose: "))
        .map((item: string) => item.replace("Purpose: ", ""))
    );

    setSelectedAudiences(
      (data.experiences || [])
        .filter((item: string) => item.startsWith("Audience: "))
        .map((item: string) => item.replace("Audience: ", ""))
    );

    setSelectedExperiences(
      (data.experiences || [])
        .filter((item: string) => item.startsWith("Experience: "))
        .map((item: string) => item.replace("Experience: ", ""))
    );

    setSelectedVibes(
      (data.experiences || [])
        .filter((item: string) => item.startsWith("Vibe: "))
        .map((item: string) => item.replace("Vibe: ", ""))
    );

    setSelectedCuisines(data.cuisines || []);

    setPriceLevel(
      data.price_level !== null && data.price_level !== undefined
        ? String(data.price_level)
        : ""
    );

    setSpendMin(
      practical.spend_min !== null && practical.spend_min !== undefined
        ? String(practical.spend_min)
        : ""
    );

    setSpendMax(
      practical.spend_max !== null && practical.spend_max !== undefined
        ? String(practical.spend_max)
        : ""
    );

    setCity(practical.city || "Addis Ababa");
    setArea(data.area || "");
    setAddress(data.address || "");
    setLandmark(practical.landmark || "");
    setBuilding(practical.building || "");
    setFloor(practical.floor || "");

    setLatitude(
      data.latitude !== null && data.latitude !== undefined
        ? String(data.latitude)
        : ""
    );

    setLongitude(
      data.longitude !== null && data.longitude !== undefined
        ? String(data.longitude)
        : ""
    );

    setPhone(data.phone || "");
    setWhatsapp(data.whatsapp || "");
    setWebsite(data.website || "");
    setInstagram(practical.instagram || "");
    setTiktok(data.tiktok_url || "");
    setFacebook(practical.facebook || "");
    setTelegram(practical.telegram || "");

    setWifi((practical.amenities || []).includes("Wi-Fi"));
    setPowerOutlets((practical.amenities || []).includes("Power Outlets"));
    setComfortableSeating(
      (practical.amenities || []).includes("Comfortable Seating")
    );
    setIndoorSeating(
      (practical.amenities || []).includes("Indoor Seating")
    );
    setOutdoorSeating(
      (practical.amenities || []).includes("Outdoor Seating")
    );
    setPrivateRoom(
      (practical.amenities || []).includes("Private Room")
    );
    setAirConditioning(
      (practical.amenities || []).includes("Air Conditioning")
    );
    setRestroom((practical.amenities || []).includes("Restroom"));
    setWheelchairAccessible(
      (practical.amenities || []).includes("Wheelchair Accessible")
    );
    setKidsArea((practical.amenities || []).includes("Kids Area"));
    setSmokingArea((practical.amenities || []).includes("Smoking Area"));
    setRooftop((practical.amenities || []).includes("Rooftop"));
    setLiveMusic((practical.amenities || []).includes("Live Music"));

    setNoiseLevel(practical.noise_level || "");
    setSelectedPayments(practical.payment_methods || []);
    setReservation(practical.reservation_type || "");
    setReservationPhone(practical.reservation_phone || "");
    setReservationWhatsapp(practical.reservation_whatsapp || "");
    setReservationUrl(practical.reservation_url || "");
 setCoverImage(data.cover_image || "");
    setFeaturedVideo(data.featured_video_url || "");
    

    setTiktokVideos(
      Array.isArray(practical.tiktok_videos)
        ? practical.tiktok_videos
        : []
    );

    setVerificationStatus(data.verification_status || "Unverified");
    setVerificationSource(practical.verification_source || "");
    setVerificationNotes(practical.verification_notes || "");

    setStatus(
      data.status === "published"
        ? "published"
        : "draft"
    );
  }

  loadPlace();
}, [editId]);
useEffect(() => {
  async function loadCmsCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, category_group")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error("Failed to load CMS categories:", error);
      return;
    }

    setCmsCategories(data || []);
  }

  loadCmsCategories();
}, []);
const cmsPlaceTypes = cmsCategories
  .filter((item) => item.category_group === "place_type")
  .map((item) => item.name);

const cmsPrimaryCategories = cmsCategories
  .filter((item) => item.category_group === "category")
  .map((item) => item.name);

const cmsPurposes = cmsCategories
  .filter((item) => item.category_group === "purpose")
  .map((item) => item.name);

const cmsAudiences = cmsCategories
  .filter((item) => item.category_group === "audience")
  .map((item) => item.name);

const cmsExperiences = cmsCategories
  .filter((item) => item.category_group === "experience")
  .map((item) => item.name);

const cmsVibes = cmsCategories
  .filter((item) => item.category_group === "mood")
  .map((item) => item.name);

const cmsCuisines = cmsCategories
  .filter((item) => item.category_group === "cuisine")
  .map((item) => item.name);

  const completeness = useMemo(() => {
  const sections = [
    !!name.trim() && !!type && !!category,
    !!description.trim(),
    selectedPurposes.length > 0 &&
      selectedAudiences.length > 0,
    selectedExperiences.length > 0 &&
      selectedVibes.length > 0,
    !!city &&
      !!area &&
      !!address.trim() &&
      !!latitude &&
      !!longitude,
    !!coverImage.trim(),
    !!verificationSource,
  ];

  return Math.round(
    (sections.filter(Boolean).length / sections.length) * 100
  );
}, [
  name,
  type,
  category,
  description,
  selectedPurposes,
  selectedAudiences,
  selectedExperiences,
  selectedVibes,
  city,
  area,
  address,
  latitude,
  longitude,
  coverImage,
  verificationSource,
]);

  function toggleSection(section: string) {
    setOpenSections((previous) => ({
      ...previous,
      [section]: !previous[section],
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");

    if (status === "published") {
  if (!name.trim()) {
    setMessage("Place name is required before publishing.");
    setOpenSections((previous) => ({ ...previous, basic: true }));
    return;
  }

  if (!type || !category) {
    setMessage("Place type and primary category are required before publishing.");
    setOpenSections((previous) => ({ ...previous, basic: true }));
    return;
  }

  if (!description.trim()) {
    setMessage("Description is required before publishing.");
    setOpenSections((previous) => ({ ...previous, basic: true }));
    return;
  }

  if (!city || !area || !address.trim()) {
    setMessage("City, area, and full address are required before publishing.");
    setOpenSections((previous) => ({ ...previous, location: true }));
    return;
  }

  if (!verificationSource) {
    setMessage(
      "Please select at least one information source before publishing."
    );
    setOpenSections((previous) => ({ ...previous, trust: true }));
    return;
  }
}
    setSaving(true);
 const slug =
      name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") +
      "-" +
      Date.now().toString().slice(-6);

    const amenities = [
      wifi && "Wi-Fi",
      powerOutlets && "Power Outlets",
      comfortableSeating && "Comfortable Seating",
      indoorSeating && "Indoor Seating",
      outdoorSeating && "Outdoor Seating",
      privateRoom && "Private Room",
      airConditioning && "Air Conditioning",
      restroom && "Restroom",
      wheelchairAccessible && "Wheelchair Accessible",
      kidsArea && "Kids Area",
      smokingArea && "Smoking Area",
      rooftop && "Rooftop",
      liveMusic && "Live Music",
    ].filter(Boolean);

    const practicalData = {
  city,
  landmark,
  building,
  floor,

  instagram,
  facebook,
  telegram,

  noise_level: noiseLevel,

  amenities,
  payment_methods: selectedPayments,

  reservation_type: reservation,
  reservation_phone: reservationPhone,
  reservation_whatsapp: reservationWhatsapp,
  reservation_url: reservationUrl,

  tiktok_videos: tiktokVideos.filter((url) => url.trim() !== ""),

  spend_min: spendMin ? Number(spendMin) : null,
  spend_max: spendMax ? Number(spendMax) : null,

  verification_source: verificationSource,
  verification_notes: verificationNotes,
};

    const placeData = {
  name: name.trim(),
  slug:
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") +
    "-" +
    Date.now().toString().slice(-6),
  type,
  category,
  area,
  address: address.trim(),
  description: description.trim(),
  phone: phone.trim() || null,
  whatsapp: whatsapp.trim() || null,
  website: website.trim() || null,
  latitude: Number(latitude),
  longitude: Number(longitude),
  price_level: priceLevel ? Number(priceLevel) : null,
  status,
  cuisines: selectedCuisines,
  experiences: [
    ...selectedPurposes.map((item) => `Purpose: ${item}`),
    ...selectedAudiences.map((item) => `Audience: ${item}`),
    ...selectedExperiences.map((item) => `Experience: ${item}`),
    ...selectedVibes.map((item) => `Vibe: ${item}`),
  ],
  cover_image: coverImage.trim(),
  photos: [coverImage.trim()],
  tiktok_url: tiktok.trim() || null,
  featured_video_url: featuredVideo.trim() || null,
  practical_data: practicalData,
  verification_status: verificationStatus,
};

const { error } = isEditing
  ? await supabase
      .from("places")
      .update(placeData)
      .eq("id", editId)
  : await supabase.from("places").insert(placeData);
    if (error) {
      console.error(error);
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setMessage(
  isEditing
    ? "Place updated successfully."
    : status === "published"
      ? "Place published successfully."
      : "Place saved as draft successfully."
);

    setTimeout(() => {
  window.location.href = "/admin/places";
}, 1000);
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-7xl px-6 pt-20 md:pt-24">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/dashboard"
              className="mb-4 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Command Center
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10">
                <Store className="h-5 w-5 text-[#D4AF37]" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
                  MEDER Administration
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight">
  {isEditing ? "Edit Place" : "Add New Place"}
</h1>
              </div>
            </div>
          </div>
 <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
            <div className="mb-2 flex items-center justify-between gap-8">
              <span className="text-xs text-white/45">Profile completeness</span>
              <span className="text-sm font-semibold text-[#D4AF37]">
                {completeness}%
              </span>
            </div>

            <div className="h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#D4AF37] transition-all"
                style={{ width: `${completeness}% `}}
              />
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.05] p-5">
          <div className="flex gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[#D4AF37]" />

            <div>
              <p className="font-medium text-white">
                Build a place MEDER can understand.
              </p>
              <p className="mt-1 text-sm leading-6 text-white/50">
                You're not just adding a listing. You're giving MEDER the
                structured information it needs to help people discover and
                choose the right place.
              </p>
            </div>
          </div>
        </div>
        <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 text-xs">
  <span className="font-semibold text-[#D4AF37]">
    ✨ Required to publish
  </span>

  <span className="text-white/40">
    Everything else is optional and can be completed later.
  </span>
</div>

        <form onSubmit={handleSubmit}>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#080808] shadow-2xl">
            <Section
              number="01"
              title="Basic Information"
              description="What is this place?"
              open={openSections.basic}
              onToggle={() => toggleSection("basic")}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <FieldLabel required>Place name</FieldLabel>
                  <Input
                    value={name}
                    onChange={setName}
                    placeholder="e.g. Tomoca Coffee"
                  />
                </div>

                <div>
  <FieldLabel required>Place type</FieldLabel>

  <select
    value={type}
    onChange={(e) => setType(e.target.value)}
    className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37]/60"
  >
    <option value="">Select place type</option>

    {cmsPlaceTypes.map((item) => (
      <option key={item} value={item}>
        {item}
      </option>
    ))}
  </select>
</div>

                <div>
                  <FieldLabel required>Primary category</FieldLabel>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37]/60"
                  >
                    <option value="">Select category</option>
                    {cmsPrimaryCategories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <FieldLabel >Short description</FieldLabel>
                  <Textarea
                    value={description}
                    onChange={setDescription}
                    placeholder="Describe what makes this place useful or interesting to someone deciding where to go."
                  />
                </div>
              </div>
            </Section>
 <Section
              number="02"
              title="Discovery Intelligence"
              description="Why would someone choose this place?"
              open={openSections.discovery}
              onToggle={() => toggleSection("discovery")}
            >
              <div className="space-y-7">
                <div>
                  <FieldLabel >What can people do here?</FieldLabel>
                  <MultiSelect
                    options={cmsPurposes}
                    selected={selectedPurposes}
                    onChange={setSelectedPurposes}
                  />
                </div>

                <div>
                  <FieldLabel >Who is it good for?</FieldLabel>
                  <MultiSelect
                    options={cmsAudiences}
                    selected={selectedAudiences}
                    onChange={setSelectedAudiences}
                  />
                </div>
              </div>
            </Section>

            <Section
              number="03"
              title="Experience"
              description="What does the place feel like?"
              open={openSections.experience}
              onToggle={() => toggleSection("experience")}
            >
              <div className="space-y-7">
                <div>
                  <FieldLabel >Experience / use cases</FieldLabel>
                  <MultiSelect
                    options={cmsExperiences}
                    selected={selectedExperiences}
                    onChange={setSelectedExperiences}
                  />
                </div>

                <div>
                  <FieldLabel >Vibe / atmosphere</FieldLabel>
                  <MultiSelect
                    options={cmsVibes}
                    selected={selectedVibes}
                    onChange={setSelectedVibes}
                  />
                </div>

                <div>
                  <FieldLabel>Noise level</FieldLabel>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {[
                      "Very Quiet",
                      "Quiet",
                      "Moderate",
                      "Lively",
                      "Very Lively",
                    ].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setNoiseLevel(item)}
                        className={`rounded-xl border px-3 py-3 text-xs transition ${
                          noiseLevel === item
                            ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                            : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            <Section
              number="04"
              title="Food & Offerings"
              description="What does this place provide?"
              open={openSections.food}
              onToggle={() => toggleSection("food")}
            >
              <div className="space-y-6">
                <div>
                  <FieldLabel>Food / cuisine / offering categories</FieldLabel>
                  <MultiSelect
                    options={cmsCuisines}
                    selected={selectedCuisines}
                    onChange={setSelectedCuisines}
                  />
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex gap-3">
                    <CircleHelp className="h-5 w-5 shrink-0 text-[#D4AF37]" />
 <p className="text-sm leading-6 text-white/50">
                      Individual offerings such as dishes, drinks, products
                      and services will be managed separately in MEDER's
                      Offerings system. This section only captures the
                      high-level discovery information for the place.
                    </p>
                  </div>
                </div>
              </div>
            </Section>

            <Section
              number="05"
              title="Location"
              description="Where exactly is it?"
              open={openSections.location}
              onToggle={() => toggleSection("location")}
            >
              <div className="space-y-5">
                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <FieldLabel required>City</FieldLabel>
                    <Input value={city} onChange={setCity} />
                  </div>

                  <div>
                    <FieldLabel required>Area / neighborhood</FieldLabel>
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37]/60"
                    >
                      <option value="">Select area</option>
                      {areas.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <FieldLabel>Landmark</FieldLabel>
                    <Input
                      value={landmark}
                      onChange={setLandmark}
                      placeholder="Nearby landmark"
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel required>Full address</FieldLabel>
                  <Textarea
                    value={address}
                    onChange={setAddress}
                    placeholder="Full physical address"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <FieldLabel>Building</FieldLabel>
                    <Input
                      value={building}
                      onChange={setBuilding}
                      placeholder="Building / mall name"
                    />
                  </div>

                  <div>
                    <FieldLabel>Floor</FieldLabel>
                    <Input
                      value={floor}
                      onChange={setFloor}
                      placeholder="e.g. 2nd Floor"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.04] p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-[#D4AF37]" />
                    <div>
                      <p className="text-sm font-medium text-white">
                        Exact map coordinates
                      </p>
                      <p className="text-xs text-white/40">
                        MEDER uses these later to calculate distance from the
                        user.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <FieldLabel required>Latitude</FieldLabel>
                      <Input
                        value={latitude}
                        onChange={setLatitude}
                        placeholder="e.g. 9.0054"
                      />
                    </div>
 <div>
                      <FieldLabel required>Longitude</FieldLabel>
                      <Input
                        value={longitude}
                        onChange={setLongitude}
                        placeholder="e.g. 38.7636"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            <Section
              number="06"
              title="Practical Information"
              description="Can someone actually visit and use it?"
              open={openSections.practical}
              onToggle={() => toggleSection("practical")}
            >
              <div className="space-y-7">
                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <FieldLabel>Phone</FieldLabel>
                    <Input
                      value={phone}
                      onChange={setPhone}
                      placeholder="+251..."
                    />
                  </div>

                  <div>
                    <FieldLabel>WhatsApp</FieldLabel>
                    <Input
                      value={whatsapp}
                      onChange={setWhatsapp}
                      placeholder="+251..."
                    />
                  </div>

                  <div>
                    <FieldLabel>Website</FieldLabel>
                    <Input
                      value={website}
                      onChange={setWebsite}
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <FieldLabel>Instagram</FieldLabel>
                    <Input
                      value={instagram}
                      onChange={setInstagram}
                      placeholder="Profile URL"
                    />
                  </div>

                  <div>
  <FieldLabel>TikTok Profile</FieldLabel>
  <Input
    value={tiktok}
    onChange={setTiktok}
    placeholder="TikTok profile URL"
  />
</div>

<div className="md:col-span-3">
  <FieldLabel>TikTok Videos</FieldLabel>

  <div className="space-y-3">
    {tiktokVideos.map((video, index) => (
      <div
        key={index}
        className="flex gap-2"
      >
        <Input
          value={video}
          onChange={(value) => {
            setTiktokVideos((previous) =>
              previous.map((item, itemIndex) =>
                itemIndex === index ? value : item
              )
            );
          }}
          placeholder="https://www.tiktok.com/@username/video/..."
        />

        <button
          type="button"
          onClick={() => {
            setTiktokVideos((previous) =>
              previous.filter(
                (_, itemIndex) => itemIndex !== index
              )
            );
          }}
          className="rounded-xl border border-white/10 px-4 text-xs text-white/50 transition hover:border-red-400/40 hover:text-red-400"
        >
          Remove
        </button>
      </div>
    ))}

    <button
      type="button"
      onClick={() =>
        setTiktokVideos((previous) => [...previous, ""])
      }
      className="rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-3 text-xs font-medium text-[#D4AF37] transition hover:bg-[#D4AF37]/15"
    >
      + Add TikTok Video
    </button>
  </div>
</div>

                  <div>
                    <FieldLabel>Facebook</FieldLabel>
                    <Input
                      value={facebook}
                      onChange={setFacebook}
                      placeholder="Profile URL"
                    />
                  </div>

                  <div>
                    <FieldLabel>Telegram</FieldLabel>
                    <Input
                      value={telegram}
                      onChange={setTelegram}
                      placeholder="Profile / channel URL"
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel>Payment methods</FieldLabel>
                  <MultiSelect
                    options={paymentMethods}
                    selected={selectedPayments}
                    onChange={setSelectedPayments}
                  />
                </div>

                <div>
                  <FieldLabel>Reservation</FieldLabel>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {reservationOptions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setReservation(item)}
                        className={`rounded-xl border px-4 py-3 text-xs transition ${
                          reservation === item
                            ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                            : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
 {reservation && reservation !== "Walk-in" && (
                  <div className="grid gap-5 md:grid-cols-3">
                    <div>
                      <FieldLabel>Reservation phone</FieldLabel>
                      <Input
                        value={reservationPhone}
                        onChange={setReservationPhone}
                        placeholder="+251..."
                      />
                    </div>

                    <div>
                      <FieldLabel>Reservation WhatsApp</FieldLabel>
                      <Input
                        value={reservationWhatsapp}
                        onChange={setReservationWhatsapp}
                        placeholder="+251..."
                      />
                    </div>

                    <div>
                      <FieldLabel>Reservation link</FieldLabel>
                      <Input
                        value={reservationUrl}
                        onChange={setReservationUrl}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                )}

                <div>
                  <FieldLabel>Facilities & amenities</FieldLabel>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      ["Wi-Fi", wifi, setWifi],
                      ["Power Outlets", powerOutlets, setPowerOutlets],
                      [
                        "Comfortable Seating",
                        comfortableSeating,
                        setComfortableSeating,
                      ],
                      ["Indoor Seating", indoorSeating, setIndoorSeating],
                      ["Outdoor Seating", outdoorSeating, setOutdoorSeating],
                      ["Private Room", privateRoom, setPrivateRoom],
                      [
                        "Air Conditioning",
                        airConditioning,
                        setAirConditioning,
                      ],
                      ["Restroom", restroom, setRestroom],
                      [
                        "Wheelchair Accessible",
                        wheelchairAccessible,
                        setWheelchairAccessible,
                      ],
                      ["Kids Area", kidsArea, setKidsArea],
                      ["Smoking Area", smokingArea, setSmokingArea],
                      ["Rooftop", rooftop, setRooftop],
                      ["Live Music", liveMusic, setLiveMusic],
                    ].map(([label, checked, setter]) => (
                      <button
                        key={String(label)}
                        type="button"
                        onClick={() =>
                          (setter as (value: boolean) => void)(
                            !(checked as boolean)
                          )
                        }
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-xs transition ${
                          checked
                            ? "border-[#D4AF37]/60 bg-[#D4AF37]/10 text-white"
                            : "border-white/10 bg-white/[0.02] text-white/55 hover:border-white/20"
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded border ${
                            checked
                              ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                              : "border-white/20"
                          }`}
                        >
                          {checked && <Check className="h-3 w-3" />}
                        </span>
                        {String(label)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Section>
 <Section
              number="07"
              title="Media"
              description="Help people see and understand the place."
              open={openSections.media}
              onToggle={() => toggleSection("media")}
            >
              <div className="space-y-5">
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex gap-3">
                    <Upload className="h-5 w-5 shrink-0 text-[#D4AF37]" />
                    <p className="text-sm leading-6 text-white/50">
                      V1 currently stores image/video URLs. Full image upload,
                      galleries and media organization will be handled in
                      Phase 12.8.
                    </p>
                  </div>
                </div>

                <div>
                  <FieldLabel>Cover image URL</FieldLabel>
                  <Input
                    value={coverImage}
                    onChange={setCoverImage}
                    placeholder="https://..."
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <FieldLabel>Featured video URL</FieldLabel>
                    <Input
                      value={featuredVideo}
                      onChange={setFeaturedVideo}
                      placeholder="TikTok / Instagram / YouTube video"
                    />
                  </div>


                </div>
              </div>
            </Section>

            <Section
              number="08"
              title="Trust & Verification"
              description="Can MEDER trust this information?"
              open={openSections.trust}
              onToggle={() => toggleSection("trust")}
            >
              <div className="space-y-6">
                <div>
                  <FieldLabel>Verification status</FieldLabel>

                  <div className="grid gap-2 md:grid-cols-3">
                    {[
                      "Unverified",
                      "MEDER Verified",
                      "Business Verified",
                    ].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setVerificationStatus(item)}
                        className={`rounded-xl border px-4 py-4 text-sm transition ${
                          verificationStatus === item
                            ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                            : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <FieldLabel required>Information source</FieldLabel>
                  <MultiSelect
                    options={verificationSources}
                    selected={verificationSource ? [verificationSource] : []}
                    onChange={(values) =>
                      setVerificationSource(values[0] || "")
                    }
                  />
                </div>
 <div>
                  <FieldLabel>Internal verification notes</FieldLabel>
                  <Textarea
                    value={verificationNotes}
                    onChange={setVerificationNotes}
                    placeholder="Internal notes about how this information was verified."
                  />
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-sm leading-6 text-white/50">
                    Verification, freshness, quality and confidence will
                    eventually become a larger MEDER trust system. Do not
                    manually enter a quality score here.
                  </p>
                </div>
              </div>
            </Section>

            <Section
              number="09"
              title="Publish"
              description="Choose whether MEDER should make it public."
              open={openSections.publish}
              onToggle={() => toggleSection("publish")}
            >
              <div className="space-y-6">
                <div>
                  <FieldLabel>Publishing status</FieldLabel>

                  <div className="grid gap-3 md:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setStatus("draft")}
                      className={`rounded-2xl border p-5 text-left transition ${
                        status === "draft"
                          ? "border-[#D4AF37] bg-[#D4AF37]/10"
                          : "border-white/10 bg-white/[0.03]"
                      }`}
                    >
                      <p className="font-medium text-white">Draft</p>
                      <p className="mt-1 text-xs leading-5 text-white/45">
                        Save the place privately while you continue building
                        the profile.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStatus("published")}
                      className={`rounded-2xl border p-5 text-left transition ${
                        status === "published"
                          ? "border-[#D4AF37] bg-[#D4AF37]/10"
                          : "border-white/10 bg-white/[0.03]"
                      }`}
                    >
                      <p className="font-medium text-white">Published</p>
                      <p className="mt-1 text-xs leading-5 text-white/45">
                        Make the place available to public MEDER discovery.
                      </p>
                    </button>
                  </div>
                </div>

                {message && (
                  <div className="rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-3 text-sm text-[#D4AF37]">
                    {message}
                  </div>
                )}

                <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Ready to save this place?
                    </p>
                    <p className="mt-1 text-xs text-white/40">
                      You can always edit the profile later.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-[#e4c35a] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
 {saving
  ? "Saving..."
  : isEditing
    ? "Save Changes"
    : status === "published"
      ? "Publish Place"
      : "Save Draft"}
                  </button>
                </div>
              </div>
            </Section>
          </div>
        </form>
      </div>
    </main>
  );
}
export default function NewPlacePageWrapper() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#050505] px-5 py-16 text-white md:px-8">
          <div className="mx-auto max-w-7xl text-center text-sm text-white/40">
            Loading place manager...
          </div>
        </main>
      }
    >
      <NewPlacePage />
    </Suspense>
  );
}