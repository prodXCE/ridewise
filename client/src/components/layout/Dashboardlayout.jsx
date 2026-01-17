import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Chatbot from '../common/Chatbot';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-row text-slate-900 font-sans">

      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full z-50 shadow-xl">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Global Chatbot Widget */}
      <Chatbot />

    </div>
  );
};

export default DashboardLayout;
