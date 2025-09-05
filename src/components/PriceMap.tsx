import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Basic price icon using DivIcon
function priceIcon(price: number) {
  return L.divIcon({
    className: 'price-marker',
    html: `<div style="background:#111827;color:#fff;padding:6px 10px;border-radius:9999px;font-weight:800;font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial;font-size:12px;box-shadow:0 6px 16px rgba(0,0,0,.25);border:2px solid #f59e0b;">${price} DH</div>`,
    iconSize: [60, 30],
    iconAnchor: [30, 15],
  });
}

export interface PriceVenue {
  id: string;
  name: string;
  price: number;
  lat: number;
  lng: number;
  address?: string;
  distanceKm?: number;
}

interface PriceMapProps {
  center: { lat: number; lng: number };
  venues: PriceVenue[];
  zoom?: number;
}

const PriceMap = ({ center, venues, zoom = 13 }: PriceMapProps) => {
  return (
    <div className="w-full h-[480px] rounded-2xl overflow-hidden shadow border border-orange-200">
      <MapContainer center={[center.lat, center.lng]} zoom={zoom} scrollWheelZoom className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {venues.map((v) => (
          <Marker key={v.id} position={[v.lat, v.lng]} icon={priceIcon(v.price)}>
            <Popup>
              <div style={{ minWidth: 180 }}>
                <div style={{ fontWeight: 900 }}>{v.name}</div>
                {v.address && <div style={{ fontSize: 12, color: '#4b5563' }}>{v.address}</div>}
                {typeof v.distanceKm === 'number' && (
                  <div style={{ fontSize: 12, marginTop: 4, color: '#374151' }}>{v.distanceKm} km away</div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default PriceMap;
