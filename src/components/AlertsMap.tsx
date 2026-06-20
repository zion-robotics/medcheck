import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { format } from "date-fns";
import type { AlertReport } from "@/data/mockData";

const pinSvg = (color: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 48" width="36" height="48">
  <defs>
    <filter id="ds" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="1.6" flood-color="#001D39" flood-opacity="0.35"/>
    </filter>
  </defs>
  <path filter="url(#ds)" d="M18 0C8 0 0 7.6 0 17c0 12 18 31 18 31s18-19 18-31C36 7.6 28 0 18 0z" fill="${color}"/>
  <circle cx="18" cy="17" r="6.5" fill="#fff"/>
</svg>`;

const makeIcon = (color: string) =>
  L.divIcon({
    className: "medcheck-pin",
    html: pinSvg(color),
    iconSize: [36, 48],
    iconAnchor: [18, 46],
    popupAnchor: [0, -42],
  });

const ICON_HIGH = makeIcon("#E8503A");
const ICON_MED = makeIcon("#0A4174");

function clusterIcon(cluster: { getChildCount: () => number }) {
  const count = cluster.getChildCount();
  const size = count < 10 ? 38 : count < 50 ? 46 : 54;
  return L.divIcon({
    html: `<div style="width:${size}px;height:${size}px;display:grid;place-items:center;background:linear-gradient(135deg,#0A4174,#4E8EA2);color:#fff;border-radius:9999px;font-weight:700;font-size:13px;border:3px solid rgba(255,255,255,0.9);box-shadow:0 8px 20px rgba(0,29,57,0.3);">${count}</div>`,
    className: "medcheck-cluster",
    iconSize: [size, size],
  });
}

export default function AlertsMap({ alerts }: { alerts: AlertReport[] }) {
  return (
    <MapContainer
      center={[9.082, 8.6753]}
      zoom={6}
      scrollWheelZoom
      className="h-full w-full"
      attributionControl
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> · &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={clusterIcon}
        showCoverageOnHover={false}
        spiderfyOnMaxZoom
      >
        {alerts.map((a) => (
          <Marker
            key={a.id}
            position={[a.latitude, a.longitude]}
            icon={a.severity === "high" ? ICON_HIGH : ICON_MED}
          >
            <Popup>
              <div className="w-[240px]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${a.severity === "high" ? "bg-[#E8503A]/10 text-[#E8503A] border-[#E8503A]/30" : "bg-[#0A4174]/10 text-[#0A4174] border-[#0A4174]/30"}`}>{a.severity}</span>
                  <span className="text-[10px] text-[#5B7387]">{format(new Date(a.createdAt), "d MMM yyyy")}</span>
                </div>
                <p className="text-sm font-bold text-[#001D39] leading-snug">{a.title}</p>
                <p className="text-xs text-[#5B7387] mt-1">{a.drugName}</p>
                <p className="text-[11px] text-[#4E8EA2] font-semibold mt-1.5">📍 {a.state}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
