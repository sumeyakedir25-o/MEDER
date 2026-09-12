"use client";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import { Icon } from "leaflet";
import Link from "next/link";
import type { MederPlace } from "@/Lib/meder/matching";

import "leaflet/dist/leaflet.css";

interface LeafletMapProps {
  places: MederPlace[];
}

const markerIcon = new Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function LeafletMap({
  places,
}: LeafletMapProps) {
  return (
    <div className="h-[500px] w-full overflow-hidden rounded-2xl">
      <MapContainer
        center={[9.03, 38.78]}
        zoom={12}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.latitude, place.longitude]}
            icon={markerIcon}
          >
            <Popup>
              <div className="min-w-[180px]">
                <img
                  src={place.image}
                  alt={place.name}
                  className="h-24 w-full rounded-lg object-cover"
                />

                <h3 className="mt-3 text-base font-semibold">
                  {place.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {place.type}
                </p>

                <p className="mt-2 text-sm">
                  ⭐ {place.rating}
                </p>

                <Link
                  href={`/places/${place.id}`}
                  className="mt-3 inline-block text-sm font-medium text-[#D4AF37]"
                >
                  View place →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}