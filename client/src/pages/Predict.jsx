import React, { useState, useRef } from 'react';
import { Settings, CloudRain, Calendar, Wind, Thermometer, Upload, FileText, CheckCircle2, Loader2, BarChart3, X } from 'lucide-react';
import Card from '../components/common/Card';
import { useAuth } from '../context/AuthContext';

const Predict = () => {
  const { token } = useAuth();
  const [mode, setMode] = useState('manual');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const [inputs, setInputs] = useState({
    date: '2026-05-01', season: '3', hour: '17', weather: '1',
    temp: '24', humidity: '65', wind: '12'
  });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError('');
    }
  };

  const handlePredict = async () => {
    setLoading(true);
    setPrediction(null);
    setError('');

    try {
      let finalResult = 0;

      if (mode === 'upload') {
        if (!selectedFile) throw new Error("Please select a PDF file first.");

        const formData = new FormData();
        formData.append('file', selectedFile);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/batch-predict`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }, // No Content-Type for FormData!
          body: formData
        });

        if (!res.ok) throw new Error("Upload failed. Check file format.");
        const data = await res.json();
        finalResult = data.value;

      } else {
        await new Promise(r => setTimeout(r, 800));
        let base = inputs.season === '3' ? 300 : 150;
        if (inputs.weather === '3') base *= 0.4;
        if (parseInt(inputs.temp) > 30) base *= 0.8;
        const h = parseInt(inputs.hour);
        if ((h >= 8 && h <= 10) || (h >= 17 && h <= 19)) base *= 2.5;
        finalResult = Math.max(0, Math.floor(base));

        await fetch(`${import.meta.env.VITE_API_URL}/api/save-prediction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            date: inputs.date,
            value: finalResult,
            summary: `Manual / ${inputs.temp}°C / Hour ${inputs.hour}`
          })
        });
      }

      setPrediction(finalResult);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Prediction Engine</h1>
          <p className="text-slate-500 mt-2">Forecast fleet demand using manual parameters or historical data files</p>
        </div>

        <div className="flex bg-white border border-slate-200 p-1 rounded-lg shadow-sm">
          <button
            onClick={() => { setMode('manual'); setPrediction(null); setError(''); }}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mode === 'manual' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Manual Entry
          </button>
          <button
            onClick={() => { setMode('upload'); setPrediction(null); setError(''); }}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mode === 'upload' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Upload PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: Input Forms */}
        <div className="lg:col-span-2 space-y-6">

          {mode === 'manual' ? (
            <>
              <Card>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="p-2 bg-sky-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-sky-600" />
                  </div>
                  <h3 className="font-bold text-slate-900">Temporal Factors</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Date</label>
                    <input
                      type="date"
                      value={inputs.date}
                      onChange={(e) => setInputs({...inputs, date: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:border-sky-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Season</label>
                    <select
                      value={inputs.season}
                      onChange={(e) => setInputs({...inputs, season: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:border-sky-500 outline-none transition-all font-medium"
                    >
                      <option value="1">Spring</option>
                      <option value="2">Summer</option>
                      <option value="3">Fall</option>
                      <option value="4">Winter</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex justify-between mb-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Hour of Day (0-23)</label>
                      <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">{inputs.hour}:00</span>
                    </div>
                    <input
                      type="range"
                      min="0" max="23"
                      value={inputs.hour}
                      onChange={(e) => setInputs({...inputs, hour: e.target.value})}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                    />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <CloudRain className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-slate-900">Weather Conditions</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Weather Situation</label>
                    <select
                      value={inputs.weather}
                      onChange={(e) => setInputs({...inputs, weather: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:border-sky-500 outline-none transition-all font-medium"
                    >
                      <option value="1">Clear / Few Clouds</option>
                      <option value="2">Mist / Cloudy</option>
                      <option value="3">Light Snow / Rain</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                     <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Temp (°C)</label>
                      <input type="number" value={inputs.temp} onChange={(e) => setInputs({...inputs, temp: e.target.value})} className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg font-bold outline-none" />
                     </div>
                     <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Humidity</label>
                      <input type="number" value={inputs.humidity} onChange={(e) => setInputs({...inputs, humidity: e.target.value})} className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg font-bold outline-none" />
                     </div>
                     <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Wind</label>
                      <input type="number" value={inputs.wind} onChange={(e) => setInputs({...inputs, wind: e.target.value})} className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg font-bold outline-none" />
                     </div>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <Card className="border-dashed border-2 border-slate-300 bg-slate-50/50 min-h-[400px] flex flex-col items-center justify-center text-center relative">

              <input
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />

              {selectedFile ? (
                <div className="animate-in fade-in zoom-in duration-300">
                  <div className="h-20 w-20 bg-sky-100 rounded-full flex items-center justify-center shadow-sm mb-4 mx-auto">
                    <FileText className="h-10 w-10 text-sky-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedFile.name}</h3>
                  <p className="text-slate-500 mt-1 mb-6">{(selectedFile.size / 1024).toFixed(2)} KB</p>

                  <button
                    onClick={() => setSelectedFile(null)}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 rounded-lg transition-colors flex items-center gap-2 mx-auto font-medium"
                  >
                    <X className="h-4 w-4" /> Remove File
                  </button>
                </div>
              ) : (
                <>
                  <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                    <Upload className="h-10 w-10 text-sky-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Upload Historical Data</h3>
                  <p className="text-slate-500 max-w-sm mt-2 mb-8">
                    Select a PDF report containing historical ride data to run batch predictions.
                  </p>
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" /> Select PDF File
                  </button>
                </>
              )}
            </Card>
          )}

          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-sky-200 transition-all active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin h-6 w-6" /> : <BarChart3 className="h-6 w-6" />}
            {loading ? 'Processing...' : (mode === 'upload' ? 'Run Batch Analysis' : 'Run Prediction Model')}
          </button>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center font-medium border border-red-100">
              {error}
            </div>
          )}

        </div>

        <div>
          <div className={`h-full min-h-[300px] rounded-2xl p-8 flex flex-col items-center justify-center text-center border transition-all duration-500 ${prediction !== null ? 'bg-white border-sky-100 shadow-xl shadow-sky-100' : 'bg-slate-100 border-slate-200 border-dashed'}`}>

            {loading ? (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 text-sky-600 animate-spin mx-auto" />
                <p className="text-slate-500 font-medium">Running Algorithms...</p>
              </div>
            ) : prediction !== null ? (
              <div className="space-y-6 animate-in zoom-in-50 duration-300">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">
                  <CheckCircle2 className="h-4 w-4" /> {mode === 'upload' ? 'Batch Complete' : 'Prediction Complete'}
                </div>
                <div>
                  <p className="text-slate-500 font-medium uppercase tracking-widest text-xs mb-2">Total Projected Demand</p>
                  <h2 className="text-6xl font-black text-slate-900 tracking-tight">{prediction.toLocaleString()}</h2>
                  <p className="text-xl text-slate-400 font-medium mt-1">bikes required</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 opacity-50">
                <Settings className="h-16 w-16 text-slate-400 mx-auto" />
                <div>
                  <h3 className="text-lg font-bold text-slate-700">Ready to Predict</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-[200px] mx-auto">
                    Configure parameters or upload a file to see results.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Predict;
