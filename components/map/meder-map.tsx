"use client";

import dynamic from "next/dynamic";
import type { MapPlace } from "@/app/map/page";

interface MederMapProps {
  places: MapPlace[];
}

const LeafletMap = dynamic(
  () => import("./LeafletMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] w-full items-center justify-center rounded-2xl border border-white/10">
        Loading map...
      </div>
    ),
  },
);

export default function MederMap({
  places,
}: MederMapProps) {
  return <LeafletMap places={places} />;
}