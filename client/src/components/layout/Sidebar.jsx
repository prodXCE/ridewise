import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BrainCircuit, Map, History, LogOut, Bike } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' }, // This might redirect to Predict
    { icon: BrainCircuit, label: 'Predictor', path: '/dashboard/predict' },
    { icon: Map, label: 'Live Grid', path: '/dashboard/map' },
    { icon: History, label: 'History', path: '/dashboard/history' },
  ];

  return (
    <div className="w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-sky-500 rounded-xl flex items-center justify-center">
            <Bike className="text-white h-6 w-6" />
          </div>
          <span className="text-xl font-bold text-white">RideWise</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
              ${isActive
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/50'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
            `}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-400 hover:bg-white/5 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Disconnect
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
