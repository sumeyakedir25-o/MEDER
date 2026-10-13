import { createClient } from "@/Lib/supabase/server";

export async function getAnalyticsSummary() {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString();

  const { data, error } = await supabase
    .from("analytics_events")
    .select(
      "event_name, place_id, user_id, metadata, created_at"
    )
    .gte("created_at", todayIso);

  if (error) {
    console.error(
      "Analytics summary error:",
      error
    );

    return {
      placeViews: 0,
      saves: 0,
      directions: 0,
      contacts: 0,
      mederItSessions: 0,
      mederItCompleted: 0,
      completionRate: 0,
    };
  }

  const events = data ?? [];

  const count = (eventName: string) =>
    events.filter(
      (event) => event.event_name === eventName
    ).length;

  const mederItSessions =
    count("meder_it_started");

  const mederItCompleted =
    count("meder_it_completed");

  return {
    placeViews: count("place_viewed"),
    saves: count("place_saved"),
    directions: count("directions_clicked"),
    contacts: count("contact_clicked"),
    mederItSessions,
    mederItCompleted,
    completionRate:
      mederItSessions > 0
        ? Math.round(
            (mederItCompleted /
              mederItSessions) *
              1000
          ) / 10
        : 0,
  };
}

export async function getTopPlaces() {
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from("analytics_events")
    .select("event_name, place_id")
    .not("place_id", "is", null);

  if (error) {
    console.error(
      "Top places analytics error:",
      error
    );

    return [];
  }

  const placeIds = Array.from(
    new Set(
      (events ?? [])
        .map((event) => event.place_id)
        .filter(Boolean)
    )
  );

  if (placeIds.length === 0) {
    return [];
  }

  const { data: places } = await supabase
    .from("places")
    .select("id, name")
    .in("id", placeIds);

  const placeMap = new Map(
    (places ?? []).map((place) => [
      place.id,
      place.name,
    ])
  );

  const stats = new Map<
    string,
    {
      id: string;
      name: string;
      views: number;
      saves: number;
      directions: number;
      contacts: number;
    }
  >();

  for (const event of events ?? []) {
    if (!event.place_id) continue;

    const existing =
      stats.get(event.place_id) ?? {
        id: event.place_id,
        name:
          placeMap.get(event.place_id) ??
          "Unknown place",
        views: 0,
        saves: 0,
        directions: 0,
        contacts: 0,
      };

    if (event.event_name === "place_viewed") {
      existing.views++;
    }

    if (event.event_name === "place_saved") {
      existing.saves++;
    }

    if (
      event.event_name ===
      "directions_clicked"
    ) {
      existing.directions++;
    }

    if (
      event.event_name ===
      "contact_clicked"
    ) {
      existing.contacts++;
    }

    stats.set(event.place_id, existing);
  }

  return Array.from(stats.values())
    .sort(
      (a, b) =>
        b.views - a.views
    )
    .slice(0, 10);
}