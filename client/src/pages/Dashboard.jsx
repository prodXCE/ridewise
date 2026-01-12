import React, { useEffect, useState } from 'react';
import { BarChart3, Users, Bike, TrendingUp, AlertCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [stats, setStats] = useState({
    total_predictions: 0,
    avg_prediction: 0,
    hourly_traffic: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    recent_alerts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Authenticate
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);

    // 2. Fetch Personal Stats
    fetch(`/api/stats?user_id=${userData.id}`)
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem('user');
          navigate('/login');
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => console.error("Failed to fetch stats:", err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Hello, {user?.name || 'User'}
            </h1>
            <p className="text-slate-500 mt-1">
              {loading ? "Loading your analytics..." : "Here is your personal prediction history."}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Predictions"
            value={stats.total_predictions}
            trend="+Live"
            icon={<Bike className="text-blue-600" />}
          />
          <StatCard
            title="Avg. Predicted Demand"
            value={stats.avg_prediction}
            trend="bikes/hr"
            icon={<TrendingUp className="text-emerald-600" />}
          />
          <StatCard
            title="Active Model"
            value="v1.0"
            sub="Random Forest"
            icon={<Users className="text-purple-600" />}
          />
          <StatCard
            title="Account Status"
            value="Active"
            sub="Standard Plan"
            icon={<AlertCircle className="text-green-600" />}
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Chart Section */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-slate-400" />
                Your Demand Trends (24h)
              </h3>
            </div>

            {/* Dynamic Chart */}
            <div className="h-64 flex items-end justify-between gap-2 pt-4 border-b border-l border-slate-100 px-4 pb-2">
              {stats.hourly_traffic && stats.hourly_traffic.map((height, i) => {
                // Normalize height for display (max 100%)
                const maxVal = Math.max(...stats.hourly_traffic, 10); // Use 10 as min divisor to avoid /0
                const percent = (height / maxVal) * 100;

                return (
                  <div key={i} className="w-full group relative flex flex-col justify-end items-center gap-2">
                    <div
                      className="w-full bg-blue-100 hover:bg-blue-500 transition-all rounded-t-md relative group-hover:shadow-lg"
                      style={{ height: `${percent}%` }}
                    >
                      {/* Tooltip */}
                      {height > 0 && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {height} avg
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">{i * 2}h</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-center text-slate-400 mt-4">Average predicted demand by hour of day</p>
          </div>

          {/* Side List: Recent Alerts */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-lg mb-4">System Events</h3>
            <div className="space-y-4">
              <AlertItem title="Data Sync" time="Just now" type="success" />
              <AlertItem title="Model Updated" time="Yesterday" type="neutral" />
              {stats.total_predictions === 0 && (
                <div className="p-4 bg-blue-50 text-blue-700 text-sm rounded-lg border border-blue-100">
                  Welcome! Go to the Predict page to generate your first data point.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, trend, sub, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-slate-900">{value}</h3>
      </div>
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
    </div>
    <div className="flex items-center text-sm">
      {sub ? <span className="text-slate-400">{sub}</span> : <span className="text-emerald-500 font-medium">{trend}</span>}
    </div>
  </div>
);

const AlertItem = ({ title, time, type }) => {
  const colors = {
    warning: "bg-amber-100 text-amber-700 border-amber-200",
    success: "bg-emerald-100 text-emerald-700 border-emerald-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200"
  };
  return (
    <div className={`p-3 rounded-lg border ${colors[type] || colors.neutral} flex justify-between items-center`}>
      <span className="font-medium text-sm">{title}</span>
      <span className="text-xs opacity-75">{time}</span>
    </div>
  );
};

export default Dashboard;
