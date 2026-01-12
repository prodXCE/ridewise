import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Components
import Navbar from './components/Navbar'; // <-- Import the Navbar
import Chatbot from './components/Chatbot';

// Import Pages
import Home from './pages/Home';
import Predict from './pages/Predict';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Locations from './pages/Locations';
import Contact from './pages/Contact';

const App = () => {
  return (
    <Router>
      <div className="relative min-h-screen bg-slate-900">

        {/* 1. Navbar goes here so it shows on ALL pages */}
        <Navbar />

        {/* 2. Page Content */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

        {/* 3. Floating Chatbot */}
        <Chatbot />

      </div>
    </Router>
  );
};

export default App;
