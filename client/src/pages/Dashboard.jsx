import React from 'react';
import { BarChart3, Calendar, Clock, Activity, ArrowUpRight, TrendingUp, Users } from 'lucide-react';
import Card from '../components/common/Card';

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-20">

      {/* Welcome Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">System Overview</h1>
          <p className="text-slate-400 mt-2">Real-time fleet performance and prediction metrics</p>
        </div>
        <div className="flex gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium text-green-400">System Operational</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Total Predictions"
          value="1,284"
          icon={BarChart3}
          trend="+12%"
          color="text-sky-400"
          bgColor="bg-sky-500/10"
        />
        <MetricCard
          label="Avg. Daily Demand"
          value="845"
          icon={Calendar}
          trend="+5%"
          color="text-indigo-400"
          bgColor="bg-indigo-500/10"
        />
        <MetricCard
          label="Active Users"
          value="156"
          icon={Users}
          trend="+8%"
          color="text-emerald-400"
          bgColor="bg-emerald-500/10"
        />
        <MetricCard
          label="System Load"
          value="24%"
          icon={Activity}
          trend="-2%"
          color="text-amber-400"
          bgColor="bg-amber-500/10"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Activity Table (Left - Wider) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Recent Forecasts</h3>
              <button className="text-sm text-sky-400 hover:text-sky-300 font-medium transition-colors">View All</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-xs uppercase text-slate-500 font-bold">
                  <tr>
                    <th className="p-4">Type</th>
                    <th className="p-4">Prediction</th>
                    <th className="p-4">Confidence</th>
                    <th className="p-4 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {[1, 2, 3, 4].map((i) => (
                    <tr key={i} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 group-hover:bg-sky-500/10 group-hover:text-sky-400 transition-colors">
                          <Clock className="h-3 w-3" /> Hourly
                        </span>
                      </td>
                      <td className="p-4 text-white font-bold">724 Bikes</td>
                      <td className="p-4 text-sm text-slate-400">98.2%</td>
                      <td className="p-4 text-right text-sm text-slate-500">2 min ago</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions / Tips (Right - Narrower) */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-sky-600 to-indigo-600 border-none">
            <h3 className="text-xl font-bold text-white mb-2">Start New Analysis</h3>
            <p className="text-indigo-100 mb-6 text-sm opacity-90">
              Run a new prediction model based on current weather parameters or upload historical data.
            </p>
            <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-lg shadow-lg hover:bg-indigo-50 transition-colors">
              Launch Predictor
            </button>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-2 rounded-lg bg-emerald-500/10">
                 <TrendingUp className="h-5 w-5 text-emerald-400" />
               </div>
               <h4 className="font-bold text-white">Insight</h4>
             </div>
             <p className="text-sm text-slate-400 leading-relaxed">
               Demand is currently <span className="text-emerald-400 font-bold">15% higher</span> than the monthly average due to clear weather conditions.
             </p>
          </Card>
        </div>

      </div>
    </div>
  );
};

// Helper Component for the 4 Top Cards
const MetricCard = ({ label, value, icon: Icon, trend, color, bgColor }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between hover:border-slate-700 transition-colors">
    <div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <h3 className="text-3xl font-bold text-white">{value}</h3>
      <p className={`text-xs font-bold mt-2 flex items-center gap-1 ${trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
        <ArrowUpRight className="h-3 w-3" /> {trend} vs last week
      </p>
    </div>
    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${bgColor} ${color}`}>
      <Icon className="h-6 w-6" />
    </div>
  </div>
);

export default Dashboard;
