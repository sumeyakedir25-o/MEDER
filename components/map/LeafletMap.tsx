 "use client";

import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  CircleMarker,
  useMap,
} from "react-leaflet";
import { Icon } from "leaflet";
import Link from "next/link";
import type { MapPlace } from "@/app/map/page";
import "leaflet/dist/leaflet.css";

type UserLocation = {
  latitude: number;
  longitude: number;
} | null;

interface LeafletMapProps {
  places: MapPlace[];
  userLocation: UserLocation;
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

function MapController({
  userLocation,
}: {
  userLocation: UserLocation;
}) {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.setView(
        [userLocation.latitude, userLocation.longitude],
        15,
        { animate: true },
      );
    }
  }, [map, userLocation]);

  return null;
}
function CustomZoomControls() {
  const map = useMap();

  return (
    <div
      className="absolute right-4 top-4 z-[1000] flex flex-col gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => map.zoomIn()}
        aria-label="Zoom in"
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-[#0F0F0F] text-2xl font-bold text-[#D4AF37] shadow-lg hover:bg-[#252525]"
      >
        +
      </button>

      <button
        type="button"
        onClick={() => map.zoomOut()}
        aria-label="Zoom out"
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-[#0F0F0F] text-2xl font-bold text-[#D4AF37] shadow-lg hover:bg-[#252525]"
      >
        −
      </button>
    </div>
  );
}

export default function LeafletMap({
  places,
  userLocation,
}: LeafletMapProps) {
  return (
    <div className="h-[500px] w-full overflow-hidden rounded-2xl">
      <MapContainer
  center={[9.03, 38.78]}
  zoom={12}
  zoomControl={true}
  scrollWheelZoom
  className="h-full w-full"
>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CustomZoomControls />

        <MapController userLocation={userLocation} />

        {userLocation && (
          <CircleMarker
            center={[
              userLocation.latitude,
              userLocation.longitude,
            ]}
            radius={9}
            pathOptions={{
              color: "#FFFFFF",
              weight: 3,
              fillColor: "#D4AF37",
              fillOpacity: 1,
            }}
          >
            <Popup>You are here</Popup>
          </CircleMarker>
        )}

        {places.map((place) => {
          const directionsUrl = new URL(
            "https://www.google.com/maps/dir/",
          );

          directionsUrl.searchParams.set("api", "1");
          directionsUrl.searchParams.set(
            "destination",
            `${place.latitude},${place.longitude}`,
          );

          if (userLocation) {
            directionsUrl.searchParams.set(
              "origin",
              `${userLocation.latitude},${userLocation.longitude}`,
            );
          }

          return (
            <Marker
              key={place.id}
              position={[place.latitude, place.longitude]}
              icon={markerIcon}
            >
              <Popup>
                <div className="min-w-[180px]">
                  {place.image ? (
                    <img
                      src={place.image}
                      alt={place.name}
                      className="h-24 w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-24 w-full rounded-lg bg-gray-100" />
                  )}

                  <h3 className="mt-3 text-base font-semibold">
                    {place.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {place.type}
                  </p>

                  {place.area && (
                    <p className="mt-1 text-sm text-gray-500">
                      {place.area}
                    </p>
                  )}

                  {place.rating > 0 && (
                    <p className="mt-2 text-sm">
                      ⭐ {place.rating}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-3">
                    <Link
                      href={`/places/${place.id}`}
                      className="text-sm font-medium text-[#9B7610]"
                    >
                      View place →
                    </Link>
 <a
                      href={directionsUrl.toString()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-[#9B7610]"
                    >
                      Get directions ↗
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}