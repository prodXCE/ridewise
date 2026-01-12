import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Bike } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const Locations = () => {
  const [spots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [bookingDate, setBookingDate] = useState('');

  useEffect(() => {
    fetch('/api/locations').then(res => res.json()).then(setSpots);
  }, []);

  const handleBook = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return alert("Please login first");

    const user = JSON.parse(userStr);

    const res = await fetch('/api/book', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        user_id: user.id,
        location_id: selectedSpot.id,
        date: bookingDate
      })
    });

    if (res.ok) {
      alert("Booking Confirmed!");
      window.location.reload();
    } else {
      alert("Booking Failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navbar Removed from here */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 h-[80vh]">

          <div className="lg:col-span-2 rounded-xl overflow-hidden border border-slate-700 shadow-2xl relative z-0">
            <MapContainer center={[40.7829, -73.9654]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {spots.map(spot => (
                <Marker key={spot.id} position={[spot.lat, spot.lng]}>
                  <Popup>
                    <div className="text-slate-900">
                      <h3 className="font-bold">{spot.name}</h3>
                      <p>{spot.bikes_available} bikes available</p>
                      <button onClick={() => setSelectedSpot(spot)} className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm w-full">
                        Select
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="text-blue-500" /> Reserve a Bike
            </h2>

            {selectedSpot ? (
              <div className="space-y-6">
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold">{selectedSpot.name}</h3>
                  <div className="flex items-center gap-2 text-slate-400 mt-1">
                    <Bike className="w-4 h-4" />
                    <span>{selectedSpot.bikes_available} bikes ready</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Select Date</label>
                  <input
                    type="date"
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white"
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleBook}
                  disabled={!bookingDate || selectedSpot.bikes_available === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Reservation
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center">
                <MapPin className="w-12 h-12 mb-4 opacity-20" />
                <p>Select a location on the map<br/>to start booking</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Locations;
