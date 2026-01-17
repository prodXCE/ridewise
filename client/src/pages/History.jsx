import React, { useEffect, useState } from 'react';
import { FileDown, Search, Filter, Calendar, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const History = () => {
  const { token } = useAuth();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch Real Data on Mount
  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://127.0.0.1:5001/api/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.status === 401 || res.status === 422) {
           throw new Error("Session expired. Please login again.");
        }

        if (!res.ok) throw new Error("Failed to load history");

        const data = await res.json();
        setHistoryData(data);
      } catch (err) {
        console.error("History Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  // --- NEW: Export Functionality ---
  const handleExport = () => {
    if (historyData.length === 0) return;

    // 1. Define Headers
    const headers = ["ID", "Date", "Summary", "Projected Demand", "Created At"];

    // 2. Convert Data to CSV String
    const csvContent = [
      headers.join(","), // Header Row
      ...historyData.map(row => {
        // Wrap text in quotes to handle commas safely
        return [
          row.id,
          row.date,
          `"${row.summary}"`,
          row.value,
          row.created_at
        ].join(",");
      })
    ].join("\n");

    // 3. Create a Blob and Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ridewise_history_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Prediction History</h1>
          <p className="text-slate-500 mt-2">Archive of your personal forecasts</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors font-medium shadow-sm">
            <Filter className="h-4 w-4" /> Filter
          </button>

          {/* UPDATED: Added onClick Handler */}
          <button
            onClick={handleExport}
            disabled={loading || historyData.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-sky-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileDown className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by Prediction ID, Date, or Result..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all shadow-sm"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-sky-600" />
          Loading your data...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && historyData.length === 0 && (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-slate-900 font-bold text-lg mb-2">No predictions found</p>
          <p className="text-slate-500 mb-6">Go to the Predictor page to generate your first report.</p>
        </div>
      )}

      {/* Data Table */}
      {!loading && historyData.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-xs uppercase text-slate-500 font-bold tracking-wider">
                  <th className="p-4">Prediction ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Input Summary</th>
                  <th className="p-4">Projected Demand</th>
                  <th className="p-4">Created At</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historyData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 text-sky-600 font-mono text-sm font-medium">#{item.id}</td>
                    <td className="p-4 text-slate-600 text-sm">
                      <div className="flex items-center gap-2">
                         <Calendar className="h-4 w-4 text-slate-400" />
                         {item.date}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 text-sm font-medium">
                      {item.summary}
                    </td>
                    <td className="p-4">
                      <span className="text-slate-900 font-bold text-base">{item.value.toLocaleString()}</span>
                      <span className="text-slate-500 text-xs font-normal ml-1">bikes</span>
                    </td>
                    <td className="p-4 text-slate-500 text-xs">
                      {item.created_at} UTC
                    </td>
                    <td className="p-4 text-right">
                       <button className="text-sm font-medium text-slate-400 hover:text-sky-600 transition-colors">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination (Visual Only) */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50">
            <span>Showing {historyData.length} results</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-600 disabled:opacity-50">Previous</button>
              <button className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-600">Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
