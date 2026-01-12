import React, { useState } from 'react';
import { Mail, MessageSquare, Send, Star, MapPin } from 'lucide-react';

const Contact = () => {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  const submitFeedback = async (e) => {
    e.preventDefault();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    await fetch('/api/feedback', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ user_id: user?.id, message: feedback, rating })
    });
    alert("Thanks for your feedback!");
    setFeedback('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navbar Removed */}
      <div className="max-w-4xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-12">

        <div className="space-y-8">
          <h1 className="text-4xl font-bold">Get in Touch</h1>
          <p className="text-slate-400 text-lg">Have questions about our AI models or bike fleet? We're here to help.</p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-lg">
              <div className="bg-blue-600/20 p-3 rounded-full text-blue-500"><Mail /></div>
              <div>
                <p className="text-sm text-slate-400">Email us</p>
                <p className="font-medium">support@ridewise.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-lg">
              <div className="bg-emerald-600/20 p-3 rounded-full text-emerald-500"><MapPin /></div>
              <div>
                <p className="text-sm text-slate-400">HQ</p>
                <p className="font-medium">123 Innovation Dr, Tech City</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MessageSquare className="text-blue-500" /> Send Feedback
          </h2>
          <form onSubmit={submitFeedback} className="space-y-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Your Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} type="button" onClick={() => setRating(star)}>
                    <Star className={`w-8 h-8 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Message</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white h-32"
                placeholder="How can we improve?"
              ></textarea>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
