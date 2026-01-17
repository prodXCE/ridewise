import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import Card from '../components/common/Card';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Feedback & Support</h1>
        <p className="text-slate-500 mt-2">Have a suggestion or found a bug? Let us know.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            {submitted ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Message Sent!</h3>
                <p className="text-slate-500 mt-2">Thank you for your feedback. We'll get back to you shortly.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-sky-600 font-medium hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                    <input
                      type="text"
                      placeholder="Jane"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="jane@company.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Message Category</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:border-sky-500 outline-none">
                    <option>General Feedback</option>
                    <option>Report a Bug</option>
                    <option>Feature Request</option>
                    <option>Account Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Your Message</label>
                  <textarea
                    rows="5"
                    placeholder="Tell us what's on your mind..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-lg shadow-sky-200 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                  {!loading && <Send className="h-4 w-4" />}
                </button>
              </form>
            )}
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* FIX: Used a standard div (not Card) to force the Blue Background */}
          <div className="bg-sky-600 rounded-xl p-6 shadow-md text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-white">Direct Support</h3>
            </div>
            <p className="text-sky-100 mb-6 leading-relaxed">
              Need immediate assistance with your fleet prediction model? Our support team is available 24/7.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white">
                <Mail className="h-5 w-5" />
                <span className="font-medium">support@ridewise.ai</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
