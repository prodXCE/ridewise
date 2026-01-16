import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Bike, CreditCard, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const Locations = () => {
  const [spots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    fetch('/api/locations').then(res => res.json()).then(setSpots);
  }, []);

  const handlePayment = async () => {
    setPaymentProcessing(true);
    // Simulate Payment Gateway Delay
    setTimeout(async () => {
      const user = JSON.parse(localStorage.getItem('user'));

      const res = await fetch('/api/book', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          user_id: user.id,
          location_id: selectedSpot.id,
          date: bookingDate,
          amount: selectedSpot.hourly_rate * 24 // Assuming 1 day rental
        })
      });

      if (res.ok) {
        alert("Payment Successful! Bike Booked.");
        window.location.href = '/dashboard'; // Redirect to see booking
      }
      setPaymentProcessing(false);
      setShowPayment(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 h-[80vh]">

          {/* Mumbai Map */}
          <div className="lg:col-span-2 rounded-xl overflow-hidden border border-slate-700 shadow-2xl relative z-0">
            {/* Center on Mumbai */}
            <MapContainer center={[19.0760, 72.8777]} zoom={11} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {spots.map(spot => (
                <Marker key={spot.id} position={[spot.lat, spot.lng]}>
                  <Popup>
                    <div className="text-slate-900">
                      <h3 className="font-bold">{spot.name}</h3>
                      <p>{spot.bikes_available} bikes left</p>
                      <p className="text-sm font-semibold text-green-600">₹{spot.hourly_rate}/hr</p>
                      <button onClick={() => setSelectedSpot(spot)} className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm w-full">
                        Select
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Booking / Payment Panel */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="text-blue-500" /> Reserve a Bike
            </h2>

            {!showPayment ? (
              // STEP 1: SELECT SPOT & DATE
              selectedSpot ? (
                <div className="space-y-6">
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold">{selectedSpot.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                       <span className="flex items-center gap-2 text-slate-400"><Bike className="w-4 h-4" /> {selectedSpot.bikes_available} Avail.</span>
                       <span className="text-green-400 font-bold">₹{selectedSpot.hourly_rate}/hr</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Select Date</label>
                    <input type="date" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white" onChange={(e) => setBookingDate(e.target.value)} />
                  </div>
                  <button onClick={() => setShowPayment(true)} disabled={!bookingDate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg disabled:opacity-50">
                    Proceed to Pay
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center">
                  <MapPin className="w-12 h-12 mb-4 opacity-20" />
                  <p>Select a location on the map</p>
                </div>
              )
            ) : (
              // STEP 2: SIMULATED PAYMENT GATEWAY
              <div className="space-y-6 animate-in slide-in-from-right">
                <div className="border-b border-slate-700 pb-4">
                  <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>1 Day Rental</span>
                    <span>₹{selectedSpot.hourly_rate * 24}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-300 mt-1">
                    <span>Service Fee</span>
                    <span>₹50</span>
                  </div>
                  <div className="flex justify-between font-bold text-white mt-4 pt-2 border-t border-slate-600">
                    <span>Total</span>
                    <span>₹{(selectedSpot.hourly_rate * 24) + 50}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-400">Card Details</label>
                  <div className="flex items-center gap-2 bg-slate-900 p-3 rounded border border-slate-600 text-slate-500">
                    <CreditCard className="w-5 h-5" />
                    <span>**** **** **** 4242</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900 p-3 rounded border border-slate-600 text-slate-500">MM/YY</div>
                    <div className="bg-slate-900 p-3 rounded border border-slate-600 text-slate-500">CVC</div>
                  </div>
                </div>

                <button onClick={handlePayment} disabled={paymentProcessing} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2">
                  {paymentProcessing ? "Processing..." : `Pay ₹${(selectedSpot.hourly_rate * 24) + 50}`}
                </button>
                <button onClick={() => setShowPayment(false)} className="w-full text-slate-400 hover:text-white text-sm">Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Locations;
