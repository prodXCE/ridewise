import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Mic, Send, Volume2 } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hi! I'm RideWise AI (powered by Gemini). Ask me anything!", isBot: true }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput('');
    setLoading(true);

    // Call Backend Gemini API
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ message: userMsg })
    });
    const data = await res.json();

    setMessages(prev => [...prev, { text: data.reply, isBot: true }]);
    speak(data.reply); // Text to Speech
    setLoading(false);
  };

  if (!isOpen) return <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform"><MessageCircle /></button>;

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-700 z-50">
      <div className="bg-blue-600 p-4 text-white flex justify-between">
        <span className="font-bold flex gap-2"><Volume2 className="w-5 h-5" /> Gemini Assistant</span>
        <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></button>
      </div>
      <div className="h-80 overflow-y-auto p-4 space-y-3 bg-slate-900/90">
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded-lg text-sm max-w-[85%] ${m.isBot ? 'bg-slate-700 text-slate-200 self-start' : 'bg-blue-600 text-white ml-auto'}`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="text-slate-400 text-xs animate-pulse">Thinking...</div>}
      </div>
      <div className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
        <input className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 text-white focus:outline-none" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="Ask Gemini..." />
        <button onClick={handleSend} className="text-blue-500"><Send /></button>
      </div>
    </div>
  );
};
export default Chatbot;
