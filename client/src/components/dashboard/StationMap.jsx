import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { BatteryCharging, Bike } from 'lucide-react';

// Enhanced Data: Mumbai Metro Stations with Bike Counts
const stations = [
  { id: 1, name: "Versova Metro Stn", lat: 19.1314, lng: 72.8105, capacity: 85, bikes: 12, status: "critical" },
  { id: 2, name: "Andheri Metro (WEH)", lat: 19.1206, lng: 72.8480, capacity: 45, bikes: 8, status: "warning" },
  { id: 3, name: "Marol Naka", lat: 19.1064, lng: 72.8826, capacity: 90, bikes: 42, status: "healthy" },
  { id: 4, name: "Ghatkopar Terminus", lat: 19.0855, lng: 72.9082, capacity: 15, bikes: 3, status: "critical" },
  { id: 5, name: "BKC Connector", lat: 19.0600, lng: 72.8700, capacity: 60, bikes: 25, status: "healthy" },
];

const StationMap = ({ onReserve }) => { // <--- New Prop

  const getColor = (status) => {
    switch(status) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#22c55e';
    }
  };

  return (
    <div className="h-[600px] w-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative z-0">
      <MapContainer
        center={[19.1060, 72.8600]}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {stations.map(station => (
          <CircleMarker
            key={station.id}
            center={[station.lat, station.lng]}
            radius={10}
            pathOptions={{
              color: getColor(station.status),
              fillColor: getColor(station.status),
              fillOpacity: 0.7
            }}
          >
            <Popup className="custom-popup">
              <div className="p-1 min-w-[150px]">
                <h3 className="font-bold text-slate-900 text-base">{station.name}</h3>

                <div className="flex items-center gap-2 mt-2 mb-3 text-slate-700">
                  <Bike className="h-4 w-4" />
                  <span className="font-bold">{station.bikes} Bikes Available</span>
                </div>

                <div className="flex items-center gap-2 mb-3 text-xs text-slate-500">
                  <BatteryCharging className="h-3 w-3 text-green-600" />
                  <span>Avg. Charge: 85%</span>
                </div>

                <button
                  onClick={() => onReserve(station)} // <--- Trigger Modal
                  className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold rounded-md transition-colors shadow-md"
                >
                  Reserve Now
                </button>
              </div>
            </Popup>
            <Tooltip>{station.name} ({station.bikes} bikes)</Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default StationMap;
