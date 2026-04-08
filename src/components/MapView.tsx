"use client";

import { useEffect, useState } from "react";
import { TYPE_COLORS, type CatalogItem, type ItemType } from "../types/catalog";

interface MapViewProps {
  items: CatalogItem[];
  onItemClick: (item: CatalogItem) => void;
}

// Leaflet must be loaded client-side only
export default function MapView({ items, onItemClick }: MapViewProps) {
  const [mapReady, setMapReady] = useState(false);
  const [LeafletComponents, setLeafletComponents] = useState<{
    MapContainer: typeof import("react-leaflet").MapContainer;
    TileLayer: typeof import("react-leaflet").TileLayer;
    Marker: typeof import("react-leaflet").Marker;
    Popup: typeof import("react-leaflet").Popup;
    L: typeof import("leaflet");
  } | null>(null);

  useEffect(() => {
    Promise.all([import("react-leaflet"), import("leaflet")]).then(
      ([rl, L]) => {
        setLeafletComponents({
          MapContainer: rl.MapContainer,
          TileLayer: rl.TileLayer,
          Marker: rl.Marker,
          Popup: rl.Popup,
          L: L,
        });
        setMapReady(true);
      }
    );
  }, []);

  const geoItems = items.filter(
    (item) => item.location.lat != null && item.location.lng != null
  );

  if (!mapReady || !LeafletComponents) {
    return (
      <div className="h-[600px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
        Loading map...
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, L } = LeafletComponents;

  function iconForType(type: string) {
    const color = TYPE_COLORS[type as ItemType]?.dot || "#6b7280";
    return L.divIcon({
      html: `<div style="width:14px;height:14px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>`,
      className: "dot-marker",
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      popupAnchor: [0, -10],
    });
  }

  if (geoItems.length === 0) {
    return (
      <div className="h-[600px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
        <div className="text-center">
          <p className="text-sm">No geocoded items to display</p>
          <p className="text-xs mt-1">
            Run the geocoding script to add coordinates
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <MapContainer
        center={[42, -72]}
        zoom={5}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoItems.map((item) => (
          <Marker
            key={item.id}
            position={[item.location.lat!, item.location.lng!]}
            icon={iconForType(item.type)}
          >
            <Popup>
              <div className="min-w-[180px]">
                <img
                  src={`/images/thumbs/${item.image.replace(/\.(jpe?g|png|webp|tiff?)$/i, ".jpg")}`}
                  alt={item.title}
                  className="w-full h-24 object-cover rounded mb-2"
                />
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-gray-500">{item.publisher}</p>
                <button
                  onClick={() => onItemClick(item)}
                  className="mt-2 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  View details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
