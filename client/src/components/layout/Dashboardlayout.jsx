import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Chatbot from '../common/Chatbot'; // <--- Import the Chatbot

const DashboardLayout = () => {
  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-row text-white">

      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full z-50">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Global Chatbot Widget */}
      <Chatbot />  {/* <--- Add this line here */}

    </div>
  );
};

export default DashboardLayout;
