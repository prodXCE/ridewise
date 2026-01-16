import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Mic, MicOff } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hi! I am powered by Llama 3. Speak or type to me.' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const messagesEndRef = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = useRef(new SpeechRecognition());

  useEffect(() => {
    // Configure Recognition
    recognition.current.continuous = false;
    recognition.current.interimResults = false;
    recognition.current.lang = 'en-US';

    recognition.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(null, transcript); // Auto-send when speaking stops
    };

    recognition.current.onend = () => setIsListening(false);

    // Scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const toggleMic = () => {
    if (isListening) {
      recognition.current.stop();
    } else {
      recognition.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async (e, overrideText = null) => {
    if (e) e.preventDefault();
    const textToSend = overrideText || input;

    if (!textToSend.trim()) return;


    const userMsg = { id: Date.now(), type: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await fetch('http://127.0.0.1:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await response.json();

      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: "Error: Is Ollama and Python running?" }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[60] p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-slate-800 text-slate-400 rotate-90' : 'bg-sky-600 text-white hover:bg-sky-500 shadow-sky-500/30'
        }`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[60] w-96 h-[500px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">

          <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center gap-3">
            <div className="bg-sky-600/20 p-2 rounded-lg">
              <Bot className="h-5 w-5 text-sky-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">RideWise Local AI</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs text-slate-400">Llama 3 Active</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                  msg.type === 'user'
                    ? 'bg-sky-600 text-white rounded-tr-none'
                    : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none p-3 flex gap-2 items-center text-xs text-slate-400">
                  <span className="animate-pulse">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={(e) => handleSend(e)} className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
            <button
              type="button"
              onClick={toggleMic}
              className={`p-2.5 rounded-lg transition-colors ${
                isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or Speak..."
              className="flex-1 bg-slate-900 border border-slate-800 text-white text-sm rounded-lg px-4 focus:outline-none focus:border-sky-500 transition-colors"
            />

            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white p-2.5 rounded-lg transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
