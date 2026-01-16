import React from 'react';
import { FileDown, Search, Filter, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import Card from '../components/common/Card';

const History = () => {
  // Mock History Data
  const historyData = [
    { id: 'PRED-001', date: '2026-05-01', type: 'Hourly', result: 718, confidence: '98%', status: 'accurate' },
    { id: 'PRED-002', date: '2026-05-01', type: 'Daily', result: 12450, confidence: '96%', status: 'pending' },
    { id: 'PRED-003', date: '2026-04-29', type: 'Batch PDF', result: 45200, confidence: '99%', status: 'accurate' },
    { id: 'PRED-004', date: '2026-04-28', type: 'Hourly', result: 45, confidence: '85%', status: 'deviation' },
    { id: 'PRED-005', date: '2026-04-28', type: 'Hourly', result: 120, confidence: '92%', status: 'accurate' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'accurate': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'deviation': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Prediction History</h1>
          <p className="text-slate-400 mt-2">Archive of all manual and batch forecasts</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors">
            <Filter className="h-4 w-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-sky-900/20">
            <FileDown className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
        <input
          type="text"
          placeholder="Search by Prediction ID, Date, or Result..."
          className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-sky-500 outline-none"
        />
      </div>

      {/* Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-xs uppercase text-slate-500 font-bold tracking-wider">
                <th className="p-4">Prediction ID</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Method</th>
                <th className="p-4">Projected Demand</th>
                <th className="p-4">Confidence</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {historyData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-sky-400 font-mono text-sm">{item.id}</td>
                  <td className="p-4 text-slate-300 text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-500" /> {item.date}
                  </td>
                  <td className="p-4 text-white font-medium text-sm">
                    {item.type}
                  </td>
                  <td className="p-4 text-white font-bold">
                    {item.result.toLocaleString()} <span className="text-slate-500 text-xs font-normal">bikes</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500" style={{ width: item.confidence }}></div>
                      </div>
                      <span className="text-xs text-slate-400">{item.confidence}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                      {item.status === 'accurate' && <CheckCircle2 className="h-3 w-3" />}
                      {item.status === 'deviation' && <AlertCircle className="h-3 w-3" />}
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-sm text-slate-400 hover:text-white font-medium">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400">
          <span>Showing 5 of 128 results</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-slate-950 border border-slate-800 rounded hover:border-slate-700">Previous</button>
            <button className="px-3 py-1 bg-slate-950 border border-slate-800 rounded hover:border-slate-700">Next</button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default History;
