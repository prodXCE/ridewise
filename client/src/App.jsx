import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Predict from './pages/Predict';
import MapPage from './pages/MapPage';
import History from './pages/History';
import Dashboard from './pages/Dashboard'; // <--- Import the new page

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} /> {/* <--- Use the Component */}
          <Route path="predict" element={<Predict />} />
          <Route path="map" element={<MapPage />} />
          <Route path="history" element={<History />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
