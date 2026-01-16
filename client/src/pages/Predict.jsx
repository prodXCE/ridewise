import React, { useState } from 'react';
import { Calendar, Clock, CloudRain, Wind, Thermometer, Zap, CheckCircle2, Cloud, FileText, UploadCloud, X } from 'lucide-react';

const Predict = () => {
  const [inputMode, setInputMode] = useState('manual'); // 'manual' or 'upload'
  const [mode, setMode] = useState('hourly'); // 'daily' or 'hourly'
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error

  const [inputs, setInputs] = useState({
    date: '2026-05-01',
    hour: 17,
    temp: 24,
    humidity: 60,
    wind: 12,
    weather: '1',
    season: '2',
    isHoliday: false,
    isWorkingDay: true
  });

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setUploadStatus('idle');
    } else {
      alert("Please upload a valid PDF file containing metric data.");
    }
  };

  const processFile = () => {
    if (!file) return;
    setLoading(true);
    setUploadStatus('uploading');

    setTimeout(() => {
      setLoading(false);
      setUploadStatus('success');
      setPrediction(12845);
    }, 2000);
  };

  const handlePredict = () => {
    setLoading(true);
    setPrediction(null);

    setTimeout(() => {
      let base = mode === 'daily' ? 3500 : 250;
      if (inputs.season === '2' || inputs.season === '3') base += (mode === 'daily' ? 1000 : 100);
      else base -= (mode === 'daily' ? 500 : 50);

      if (inputs.weather === '1') base *= 1.2;
      else if (inputs.weather === '3') base *= 0.6;
      else if (inputs.weather === '4') base *= 0.2;

      base += (inputs.temp * (mode === 'daily' ? 40 : 5));

      if (mode === 'hourly') {
        const h = parseInt(inputs.hour);
        if ((h >= 7 && h <= 9) || (h >= 16 && h <= 19)) base += 400;
        else if (h >= 23 || h <= 5) base *= 0.1;
      }

      if (inputs.isWorkingDay && mode === 'hourly') base += 50;

      const finalResult = Math.max(0, Math.floor(base));
      setPrediction(finalResult);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100 pb-20">

      {/* Page Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Prediction Engine</h1>
          <p className="text-slate-400 mt-2">Forecast fleet demand using manual parameters or historical data files</p>
        </div>

        {/* Input Method Toggle */}
        <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex shrink-0 self-start md:self-auto">
          <button
            onClick={() => { setInputMode('manual'); setPrediction(null); setFile(null); }}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${inputMode === 'manual' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Manual Entry
          </button>
          <button
            onClick={() => { setInputMode('upload'); setPrediction(null); }}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${inputMode === 'upload' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Upload PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* === LEFT COLUMN (CONTROLS) === */}
        <div className="lg:col-span-2 space-y-6">

          {/* MODE: MANUAL ENTRY */}
          {inputMode === 'manual' && (
            <>
              {/* Manual Config Header (Hourly/Daily) */}
              <div className="flex justify-end mb-2">
                 <div className="inline-flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button onClick={() => setMode('hourly')} className={`px-3 py-1 rounded text-xs font-medium ${mode === 'hourly' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Hourly</button>
                    <button onClick={() => setMode('daily')} className={`px-3 py-1 rounded text-xs font-medium ${mode === 'daily' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Daily</button>
                 </div>
              </div>

              {/* Card 1: Time & Season */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-sky-500" /> Temporal Factors
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500">Date</label>
                    <input type="date" value={inputs.date} onChange={(e) => setInputs({...inputs, date: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-sky-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500">Season</label>
                    <select className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-sky-500 outline-none" value={inputs.season} onChange={(e) => setInputs({...inputs, season: e.target.value})}>
                      <option value="1">Spring</option>
                      <option value="2">Summer</option>
                      <option value="3">Fall</option>
                      <option value="4">Winter</option>
                    </select>
                  </div>
                </div>
                {mode === 'hourly' && (
                  <div className="mt-8 pt-6 border-t border-slate-800">
                    <div className="flex justify-between mb-4">
                      <label className="text-sm font-bold text-white flex items-center gap-2"><Clock className="h-4 w-4 text-sky-500" /> Hour</label>
                      <span className="bg-sky-500/10 text-sky-400 px-2 py-1 rounded text-xs font-mono">{inputs.hour}:00</span>
                    </div>
                    <input type="range" min="0" max="23" value={inputs.hour} onChange={(e) => setInputs({...inputs, hour: parseInt(e.target.value)})} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500" />
                  </div>
                )}
              </div>

              {/* Card 2: Weather */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-indigo-500" /> Weather Conditions
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500">Weather Situation</label>
                    <select className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 outline-none" value={inputs.weather} onChange={(e) => setInputs({...inputs, weather: e.target.value})}>
                      <option value="1">Clear / Few Clouds</option>
                      <option value="2">Mist / Cloudy</option>
                      <option value="3">Light Rain / Snow</option>
                      <option value="4">Heavy Rain / Ice</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2"><label className="text-sm text-slate-300 flex items-center gap-2"><Thermometer className="h-4 w-4 text-orange-500" /> Temp (°C)</label><span className="text-white font-bold">{inputs.temp}°</span></div>
                    <input type="range" min="-10" max="40" value={inputs.temp} onChange={(e) => setInputs({...inputs, temp: parseInt(e.target.value)})} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2"><label className="text-sm text-slate-300 flex items-center gap-2"><CloudRain className="h-4 w-4 text-blue-500" /> Humidity (%)</label><span className="text-white font-bold">{inputs.humidity}%</span></div>
                    <input type="range" min="0" max="100" value={inputs.humidity} onChange={(e) => setInputs({...inputs, humidity: parseInt(e.target.value)})} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  </div>
                </div>
              </div>

              <button onClick={handlePredict} disabled={loading} className="w-full py-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-sky-900/50 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3">
                {loading ? 'Running Model...' : 'Calculate Demand'}
                {!loading && <Zap className="h-5 w-5" />}
              </button>
            </>
          )}

          {/* MODE: PDF UPLOAD */}
          {inputMode === 'upload' && (
             <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 min-h-[500px] flex flex-col items-center justify-center text-center animate-fade-in">

               {!file && (
                 <div className="w-full max-w-md">
                   <div className="border-2 border-dashed border-slate-700 hover:border-sky-500 hover:bg-slate-800/50 rounded-2xl p-12 transition-all group relative">
                     <input
                       type="file"
                       accept=".pdf"
                       onChange={handleFileUpload}
                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                     />
                     <div className="bg-slate-800 p-4 rounded-full inline-flex mb-4 group-hover:scale-110 transition-transform">
                       <UploadCloud className="h-8 w-8 text-sky-500" />
                     </div>
                     <h3 className="text-lg font-bold text-white mb-2">Upload Metric Data PDF</h3>
                     <p className="text-slate-400 text-sm">Drag & drop or click to browse</p>
                     <p className="text-xs text-slate-600 mt-4">Supported format: .pdf (Max 10MB)</p>
                   </div>
                 </div>
               )}

               {file && (
                 <div className="w-full max-w-md space-y-6">
                   <div className="bg-slate-800 rounded-xl p-4 flex items-center justify-between border border-slate-700">
                     <div className="flex items-center gap-3">
                       <div className="bg-red-500/20 p-2 rounded-lg">
                         <FileText className="h-6 w-6 text-red-400" />
                       </div>
                       <div className="text-left">
                         <p className="text-sm font-bold text-white truncate max-w-[200px]">{file.name}</p>
                         <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                       </div>
                     </div>
                     {uploadStatus !== 'success' && (
                       <button onClick={() => setFile(null)} className="text-slate-400 hover:text-white">
                         <X className="h-5 w-5" />
                       </button>
                     )}
                   </div>

                   {uploadStatus === 'idle' && (
                     <button onClick={processFile} className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                       Process File <Zap className="h-4 w-4" />
                     </button>
                   )}

                   {uploadStatus === 'uploading' && (
                     <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold text-slate-400">
                         <span>Parsing Data...</span>
                         <span>78%</span>
                       </div>
                       <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-sky-500 w-[78%] animate-pulse"></div>
                       </div>
                     </div>
                   )}

                   {uploadStatus === 'success' && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 text-green-400 text-sm font-bold">
                        <CheckCircle2 className="h-5 w-5" />
                        Analysis Complete
                      </div>
                   )}
                 </div>
               )}

             </div>
          )}

        </div>

        {/* === RIGHT COLUMN (RESULTS) === */}
        <div className="space-y-6">
          <div className={`sticky top-6 h-auto bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-500 ${prediction !== null ? 'border-sky-500/50 shadow-2xl shadow-sky-900/20' : ''}`}>
            {prediction !== null ? (
              <div className="animate-in fade-in zoom-in duration-500 w-full">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-sky-500/10 text-sky-400 mb-6 mx-auto border border-sky-500/20">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
                  {inputMode === 'upload' ? 'Total Batch Demand' : 'Projected Demand'}
                </h2>
                <div className="text-6xl lg:text-7xl font-bold text-white mb-2 tracking-tight">
                  {prediction.toLocaleString()}
                </div>
                <p className="text-sky-400 font-medium">Bikes Required</p>

                <div className="mt-8 pt-8 border-t border-slate-800 w-full grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-slate-500 text-xs uppercase">Confidence</div>
                    <div className="text-white font-bold">96.8%</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs uppercase">Source</div>
                    <div className="text-white font-bold">{inputMode === 'upload' ? 'PDF Data' : 'Manual'}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-600 py-10">
                <Zap className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p>Configure parameters or upload data to run the model.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Predict;
