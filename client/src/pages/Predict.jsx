import React, { useState, useEffect } from 'react';
import { Wind, Thermometer, Droplets, Calendar, Clock, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Predict = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    temperature: 20,
    humidity: 60,
    windspeed: 15,
    season: '1',
    hour: 12,
    isHoliday: false,
    isWorkingDay: true,
    weather: '1'
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login'); // Redirect if not logged in
    } else {
      setUser(JSON.parse(userStr));
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          user_id: user.id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPrediction(data.prediction);
      } else {
        alert(data.error || "Error getting prediction");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800">

      {/* Header */}
      <div className="bg-blue-600 text-white py-12 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Calculator className="w-8 h-8" />
            Demand Forecaster
          </h1>
          <p className="text-blue-100 mt-2 max-w-2xl">
            Adjust the weather parameters below to simulate demand.
            Results are saved to your account history.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">

          {/* Left Column: Input Form */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 border-b pb-4 text-slate-700">
              <Calendar className="w-5 h-5 text-blue-600" />
              Simulation Parameters
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Row 1: Temp & Humidity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
                    <Thermometer className="w-4 h-4" /> Temperature (°C)
                  </label>
                  <input
                    type="range"
                    name="temperature"
                    min="-10"
                    max="40"
                    value={formData.temperature}
                    onChange={handleChange}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="text-right text-sm font-mono text-blue-600 mt-1">{formData.temperature}°C</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
                    <Droplets className="w-4 h-4" /> Humidity (%)
                  </label>
                  <input
                    type="range"
                    name="humidity"
                    min="0"
                    max="100"
                    value={formData.humidity}
                    onChange={handleChange}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="text-right text-sm font-mono text-blue-600 mt-1">{formData.humidity}%</div>
                </div>
              </div>

              {/* Row 2: Wind & Hour */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
                    <Wind className="w-4 h-4" /> Wind Speed (km/h)
                  </label>
                  <input
                    type="range"
                    name="windspeed"
                    min="0"
                    max="60"
                    value={formData.windspeed}
                    onChange={handleChange}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="text-right text-sm font-mono text-blue-600 mt-1">{formData.windspeed} km/h</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Time of Day (24h)
                  </label>
                  <input
                    type="number"
                    name="hour"
                    min="0"
                    max="23"
                    value={formData.hour}
                    onChange={handleChange}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Selects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Season</label>
                  <select
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="1">Spring</option>
                    <option value="2">Summer</option>
                    <option value="3">Fall</option>
                    <option value="4">Winter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Weather Condition</label>
                  <select
                    name="weather"
                    value={formData.weather}
                    onChange={handleChange}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="1">Clear / Partly Cloudy</option>
                    <option value="2">Mist / Cloudy</option>
                    <option value="3">Light Rain / Snow</option>
                    <option value="4">Heavy Rain / Ice</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {loading ? 'Running Model...' : 'Predict Demand'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Results */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
              <h3 className="text-slate-500 font-medium uppercase tracking-wider text-xs mb-2">Predicted Demand</h3>
              <div className="py-4">
                {prediction !== null ? (
                  <div className="animate-in fade-in zoom-in duration-300">
                    <span className="text-6xl font-black text-blue-600 block">{prediction}</span>
                    <span className="text-slate-400 font-medium">bikes / hour</span>
                  </div>
                ) : (
                  <div className="text-slate-300 py-8">
                    <div className="text-4xl font-bold mb-2">--</div>
                    <span>Run simulation to see results</span>
                  </div>
                )}
              </div>
            </div>

            {/* Context Card */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <h4 className="font-semibold text-blue-800 mb-2 text-sm">Did you know?</h4>
              <p className="text-sm text-blue-700 leading-relaxed">
                Temperature is the highest correlated factor with bike demand, followed closely by the hour of the day. Rain reduces demand by an average of 40%.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Predict;
