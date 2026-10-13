import { createClient } from "@/Lib/supabase/client";

export type AnalyticsEventName =
  | "meder_it_started"
  | "meder_it_completed"
  | "meder_it_results_shown"
  | "place_viewed"
  | "place_saved"
  | "place_unsaved"
  | "directions_clicked"
  | "contact_clicked";

type TrackEventOptions = {
  eventName: AnalyticsEventName;
  placeId?: string;
  metadata?: Record<string, unknown>;
};

export async function trackEvent({
  eventName,
  placeId,
  metadata = {},
}: TrackEventOptions) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("analytics_events")
      .insert({
        event_name: eventName,
        user_id: user?.id ?? null,
        place_id: placeId ?? null,
        metadata,
      });

    if (error) {
      console.error("Analytics event failed:", error);
    }
  } catch (error) {
    console.error("Analytics tracking error:", error);
  }
}

export async function getPlaceViewCount(placeId: string) {
  try {
    const supabase = createClient();

    const { count, error } = await supabase
      .from("analytics_events")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("event_name", "place_viewed")
      .eq("place_id", placeId);

    if (error) {
      console.error("Failed to get place views:", error);
      return 0;
    }

    return count ?? 0;
  } catch (error) {
    console.error("Place view count error:", error);
    return 0;
  }
}