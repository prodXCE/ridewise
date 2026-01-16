import React, { useState } from 'react';
import StationMap from '../components/dashboard/StationMap';
import PaymentModal from '../components/dashboard/PaymentModal';

const MapPage = () => {
  const [selectedStation, setSelectedStation] = useState(null);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  const handleReserve = (station) => {
    setSelectedStation(station);
    setIsPaywallOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Live Station Grid</h1>
          <p className="text-slate-400 mt-2">Real-time availability and instant reservation system</p>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-500"></span>
            <span className="text-sm text-slate-300">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-500"></span>
            <span className="text-sm text-slate-300">Filling Fast</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500"></span>
            <span className="text-sm text-slate-300">Critical Low</span>
          </div>
        </div>
      </div>

      {/* Map Component with Reserve Callback */}
      <StationMap onReserve={handleReserve} />

      {/* Payment Paywall Modal */}
      <PaymentModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        station={selectedStation}
      />
    </div>
  );
};

export default MapPage;
