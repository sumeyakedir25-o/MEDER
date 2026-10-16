 "use client";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

type MederMapProps = {
  latitude: number;
  longitude: number;
  placeName: string;
};

const markerIcon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function CustomZoomControls() {
  const map = useMap();

  return (
    <div
      className="absolute right-3 top-3 z-[1000] flex flex-col gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => map.zoomIn()}
        aria-label="Zoom in"
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-[#0F0F0F] text-2xl font-bold text-[#D4AF37] shadow-lg"
      >
        +
      </button>

      <button
        type="button"
        onClick={() => map.zoomOut()}
        aria-label="Zoom out"
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-[#0F0F0F] text-2xl font-bold text-[#D4AF37] shadow-lg"
      >
        −
      </button>
    </div>
  );
}

export default function MederMap({
  latitude,
  longitude,
  placeName,
}: MederMapProps) {
  const validCoordinates =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !(latitude === 0 && longitude === 0);

  const directionsUrl = new URL(
    "https://www.google.com/maps/dir/"
  );

  directionsUrl.searchParams.set("api", "1");
  directionsUrl.searchParams.set(
    "destination",
    `${latitude},${longitude}`
  );
  directionsUrl.searchParams.set(
    "destination_place_id",
    ""
  );

  useEffect(() => {
    if (!validCoordinates) return;
  }, [validCoordinates]);

  if (!validCoordinates) {
    return (
      <div className="flex min-h-40 flex-col items-center justify-center gap-2 bg-white/[0.03] p-6 text-center">
        <p className="text-sm text-white/70">
          Location coordinates are not available for this place yet.
        </p>
        <p className="text-xs text-white/40">
          MEDER needs a valid location to show the map and directions.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative">
        <MapContainer
          center={[latitude, longitude]}
          zoom={15}
          zoomControl={false}
          scrollWheelZoom={true}
          className="h-[320px] w-full sm:h-[400px]"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <CustomZoomControls />

          <Marker
            position={[latitude, longitude]}
            icon={markerIcon}
          >
            <Popup>
              <div className="min-w-[150px]">
                <p className="font-semibold">{placeName}</p>
                <a
                  href={directionsUrl.toString()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block font-medium"
                >
                  Get directions ↗
                </a>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 bg-[#0F0F0F] p-4 sm:flex-row sm:items-center sm:justify-between">
 <div>
          <p className="text-sm font-medium text-white">
            {placeName}
          </p>
          <p className="mt-1 text-xs text-white/45">
            {latitude.toFixed(5)}, {longitude.toFixed(5)}
          </p>
        </div>

        <a
          href={directionsUrl.toString()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
        >
          Get directions ↗
        </a>
      </div>
    </div>
  );
}