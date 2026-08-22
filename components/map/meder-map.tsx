"use client";

import dynamic from "next/dynamic";
import type { MederPlace } from "@/Lib/meder/matching";

interface MederMapProps {
  places: MederPlace[];
}

const LeafletMap = dynamic(
  () => import("./LeafletMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] w-full rounded-2xl border border-white/10 flex items-center justify-center">
        Loading map...
      </div>
    ),
  }
);

export default function MederMap({ places }: MederMapProps) {
  return <LeafletMap places={places} />;
}