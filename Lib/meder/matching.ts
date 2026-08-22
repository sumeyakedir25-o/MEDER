export type MederSelections = {
  who?: string[];
  what?: string[];
  vibe?: string[];
  budget?: string[];
  location?: string[];
  time?: string[];
};
export type MenuItem = {
  name: string;
  price: number;
  description?: string;
};

export type MenuCategory = {
  category: string;
  items: MenuItem[];
};

export type OpeningHour = {
  day: string;
  open: string;
  close: string;
};

export type MederPlace = {
  // Basic information
  id: string;
  name: string;
  type: string;
  area: string;
  description?: string;

  // Location
  // Location
latitude: number;
longitude: number;
distance?: string;
travelTime?: string;
address?: string;


  // Ratings
  rating: number;
  reviews: number;

  // Photos
  image: string;
photos?: string[];

cuisine?: string[];
amenities?: string[];
payment?: string[];

menu? : MenuCategory[];

  // Recommendation data
  who: string[];
  what: string[];
  vibe: string[];
  budget: string[];
  location: string[];
  time: string[];

  // Place information
  priceRange?: string;
  tags?: string[];

  // Opening hours
  openingHours?: OpeningHour[];

  // Contact
  phone?: string;
  whatsapp?: string;
  website?: string;

  // Official social links
  socialLinks?: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
  };

  // Experiences
  experiences?: string[];

  // Community videos
  videos?: {
    title?: string;
    url: string;
    thumbnail?: string;
  }[];

  // Freshness and verification
  verified?: boolean;
  lastVerified?: string;
  lastUpdated?: string;
};
export type MatchResult = {
  place: MederPlace;
  score: number;
  reasons: string[];
};

const weights = {
  what: 25,
  location: 20,
  vibe: 15,
  who: 15,
  budget: 15,
  time: 10,
};

function getMatches(
  selected: string[] | undefined,
  available: string[],
) {
  if (!selected || selected.length === 0) {
    return 0;
  }

  const matches = selected.filter((value) =>
    available.includes(value),
  );

  return matches.length / selected.length;
}

function addReason(
  reasons: string[],
  selected: string[] | undefined,
  available: string[],
  text: string,
) {
  if (!selected || selected.length === 0) {
    return;
  }

  if (selected.some((value) => available.includes(value))) {
    reasons.push(text);
  }
}

export function calculateMatch(
  selections: MederSelections,
  place: MederPlace,
): MatchResult {
  let totalScore = 0;
  let usedWeight = 0;
  const reasons: string[] = [];

  const dimensions = [
    {
      key: "what" as const,
      selected: selections.what,
      available: place.what,
      weight: weights.what,
      reason: "Matches what you're looking for",
    },
    {
      key: "location" as const,
      selected: selections.location,
      available: place.location,
      weight: weights.location,
      reason: `Matches your ${place.area} location`,
    },
    {
      key: "vibe" as const,
      selected: selections.vibe,
      available: place.vibe,
      weight: weights.vibe,
      reason: "Matches your preferred vibe",
    },
    {
      key: "who" as const,
      selected: selections.who,
      available: place.who,
      weight: weights.who,
      reason: "Fits your group",
    },
    {
      key: "budget" as const,
      selected: selections.budget,
      available: place.budget,
      weight: weights.budget,
      reason: "Fits your budget",
    },
    {
      key: "time" as const,
      selected: selections.time,
      available: place.time,
      weight: weights.time,
      reason: "Works for your timing",
    },
  ];

  for (const dimension of dimensions) {
    if (!dimension.selected || dimension.selected.length === 0) {
      continue;
    }

    const match = getMatches(
      dimension.selected,
      dimension.available,
    );

    totalScore += match * dimension.weight;
    usedWeight += dimension.weight;

    addReason(
      reasons,
      dimension.selected,
      dimension.available,
      dimension.reason,
    );
  }

  const score =
    usedWeight === 0
      ? 0
      : Math.round((totalScore / usedWeight) * 100);

  return {
    place,
    score,
    reasons: reasons.slice(0, 4),
  };
}

export function getRecommendations(
  selections: MederSelections,
  places: MederPlace[],
): MatchResult[] {
  return places
    .map((place) => calculateMatch(selections, place))
    .filter((result) => result.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return b.place.rating - a.place.rating;
    });
}