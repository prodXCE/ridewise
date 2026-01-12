import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Mic, Send } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hi! Ask me about bike availability.", isBot: true }]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = useRef(null);

  useEffect(() => {
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.lang = 'en-US';
      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognition.current.onerror = (event) => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      recognition.current.start();
      setIsListening(true);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { text: input, isBot: false }];
    setMessages(newMessages);
    setInput('');

    setTimeout(() => {
      let botResponse = "I'm mostly a demo bot, but try asking about 'weather' or 'booking'.";
      const lower = input.toLowerCase();
      if (lower.includes('book')) botResponse = "You can book bikes on the Locations page!";
      if (lower.includes('weather')) botResponse = "Weather affects rental demand heavily!";
      if (lower.includes('hello')) botResponse = "Hello there! Ready to ride?";
      if (lower.includes('contact')) botResponse = "Check the Contact page for support info.";

      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl z-50 transition-all hover:scale-110">
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-200">
      <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
        <span className="font-bold flex items-center gap-2"><MessageCircle className="w-5 h-5"/> RideWise AI</span>
        <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></button>
      </div>

      <div className="h-64 overflow-y-auto p-4 space-y-3 bg-slate-900/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.isBot ? 'bg-slate-700 text-slate-200' : 'bg-blue-600 text-white'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
        <button onClick={toggleListening} className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}>
          <Mic className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 text-white text-sm focus:outline-none focus:border-blue-500"
          placeholder="Type or speak..."
        />
        <button onClick={handleSend} className="text-blue-500 hover:text-blue-400"><Send className="w-5 h-5" /></button>
      </div>
    </div>
  );
};

export default Chatbot;
