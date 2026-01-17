import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Mic, Volume2, VolumeX, Loader2, StopCircle } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am RideWise AI. How can I help you analyze your fleet today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Voice & TTS State
  const [isListening, setIsListening] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true); // Toggle for TTS
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- TEXT TO SPEECH (TTS) ---
  const speak = (text) => {
    if (!soundEnabled) return;

    // Cancel any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Select a nicer voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  };

  // --- SPEECH TO TEXT (STT) ---
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Browser does not support voice input. Try Chrome.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      // Optional: Auto-send after voice
      // handleSend(transcript);
    };

    recognition.start();
  };

  const handleSend = async (manualText = null) => {
    const textToSend = manualText || input;
    if (!textToSend.trim()) return;

    // 1. Add User Message
    const userMsg = { id: Date.now(), text: textToSend, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // 2. Call Backend API
      const res = await fetch('http://127.0.0.1:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      const data = await res.json();

      // 3. Add Bot Response
      const botMsg = { id: Date.now() + 1, text: data.reply, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);

      // 4. Speak Response
      speak(data.reply);

    } catch (err) {
      console.error(err);
      const errorMsg = { id: Date.now() + 1, text: "I'm having trouble connecting to my brain. Is the server running?", sender: 'bot' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">

      {/* Toggle Button (When Closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 bg-sky-600 hover:bg-sky-700 text-white rounded-full shadow-lg shadow-sky-200 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        >
          <MessageSquare className="h-7 w-7" />
        </button>
      )}

      {/* Chat Window (When Open) */}
      {isOpen && (
        <div className="w-[380px] h-[600px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">

          {/* Header */}
          <div className="h-16 bg-sky-600 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="font-bold text-white text-lg">RideWise AI</h3>
            </div>
            <div className="flex items-center gap-1">
              {/* Sound Toggle */}
              <button
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  window.speechSynthesis.cancel();
                }}
                className="p-2 text-sky-100 hover:text-white hover:bg-sky-500/50 rounded-full transition-colors"
                title={soundEnabled ? "Mute Voice" : "Enable Voice"}
              >
                {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </button>
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-sky-100 hover:text-white hover:bg-sky-500/50 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-sky-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
                  <span className="text-xs font-medium text-slate-400">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about fleet demand..."
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-sm font-medium"
              />

              {/* Voice Button inside Input */}
              <button
                onClick={startListening}
                className={`absolute right-12 p-1.5 rounded-lg transition-colors ${isListening ? 'text-red-500 bg-red-50 animate-pulse' : 'text-slate-400 hover:text-sky-600'}`}
                title="Speak"
              >
                {isListening ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              {/* Send Button */}
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="absolute right-2 p-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:bg-slate-300"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">
              Powered by Ollama (Llama 3.2)
            </p>
          </div>

        </div>
      )}
    </div>
  );
};

export default Chatbot;
