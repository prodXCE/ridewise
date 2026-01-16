import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BrainCircuit, Map, History, LogOut, Bike } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // <--- Import Auth Context

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth(); // <--- Get user data & logout function

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: BrainCircuit, label: 'Predictor', path: '/dashboard/predict' },
    { icon: Map, label: 'Live Grid', path: '/dashboard/map' },
    { icon: History, label: 'History', path: '/dashboard/history' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">

      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-sky-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-900/50">
            <Bike className="text-white h-6 w-6" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">RideWise</span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
              ${isActive
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/50 translate-x-1'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
            `}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/30">

        {/* User Info Badge */}
        {user && (
          <div className="mb-4 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Logged in as</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-white font-bold text-sm truncate">{user.username}</p>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer group"
        >
          <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Disconnect
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
