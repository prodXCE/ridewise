import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BrainCircuit, Map, History, LogOut, Bike, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  // Safe checks to prevent crash if AuthContext is null
  const user = auth?.user;
  const logout = auth?.logout || (() => console.log("Logout unavailable"));

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: BrainCircuit, label: 'Predictor', path: '/dashboard/predict' },
    { icon: Map, label: 'Live Grid', path: '/dashboard/map' },
    { icon: History, label: 'History', path: '/dashboard/history' },
    { icon: MessageSquare, label: 'Feedback', path: '/dashboard/contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 h-full bg-white border-r border-slate-200 flex flex-col shrink-0">

      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-sky-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-200">
            <Bike className="text-white h-6 w-6" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">RideWise</span>
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
                ? 'bg-sky-50 text-sky-700 border border-sky-100 shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
            `}
          >
            {/* FIX: Use a function here to access 'isActive' correctly */}
            {({ isActive }) => (
              <>
                <item.icon className={`h-5 w-5 ${isActive ? 'text-sky-600' : ''}`} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">

        {user && (
          <div className="mb-4 px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Logged in as</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <p className="text-slate-700 font-bold text-sm truncate">{user.username}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all cursor-pointer"
        >
          <LogOut className="h-5 w-5" />
          Disconnect
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
