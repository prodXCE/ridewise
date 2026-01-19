import React, { useState } from 'react';
import StationMap from '../components/dashboard/StationMap';
import PaymentModal from '../components/dashboard/PaymentModal';

const MapPage = () => {
  const [selectedStation, setSelectedStation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReserve = (station) => {
    setSelectedStation(station);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Live Station Grid</h1>
          <p className="text-slate-500 mt-2">Real-time availability and instant reservation system</p>
        </div>

        <div className="flex items-center gap-4 bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
            <span className="text-xs font-bold text-slate-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
            <span className="text-xs font-bold text-slate-600">Filling Fast</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
            <span className="text-xs font-bold text-slate-600">Critical Low</span>
          </div>
        </div>
      </div>

      <StationMap onReserve={handleReserve} />

      {selectedStation && (
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          station={selectedStation}
        />
      )}

    </div>
  );
};

export default MapPage;
