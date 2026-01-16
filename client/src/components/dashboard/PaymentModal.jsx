import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle2, Bike } from 'lucide-react';
import Modal from '/src/components/common/Modal';

const PaymentModal = ({ isOpen, onClose, station }) => {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    }, 2000);
  };

  if (!station) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={success ? "Booking Confirmed" : "Secure Reservation"}>
      {success ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-500/10 text-green-500 mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h4 className="text-2xl font-bold text-white mb-2">Ride Confirmed!</h4>
          <p className="text-slate-400">
            Bike reserved at <span className="text-white font-semibold">{station.name}</span>.
            <br />
            Unlock code: <span className="font-mono text-sky-400">RW-{Math.floor(Math.random() * 9000) + 1000}</span>
          </p>
        </div>
      ) : (
        <form onSubmit={handlePayment} className="space-y-6">
          {/* Order Summary */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-sky-500/20 p-2 rounded-lg text-sky-400">
                <Bike className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Standard E-Bike</p>
                <p className="text-xs text-slate-400">{station.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-white">$4.50</p>
              <p className="text-xs text-slate-500">/ 30 mins</p>
            </div>
          </div>

          {/* Payment Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Card Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-sky-500 outline-none font-mono text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Expiry</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-sky-500 outline-none font-mono text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CVC</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="123"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-sky-500 outline-none font-mono text-sm"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {processing ? 'Processing...' : 'Pay & Unlock'}
            {!processing && <Lock className="h-4 w-4" />}
          </button>
        </form>
      )}
    </Modal>
  );
};

export default PaymentModal;
