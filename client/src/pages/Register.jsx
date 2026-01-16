import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Bike, ArrowRight, Loader2, UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth(); // Use the register function from context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Call the registration API
    const res = await register(formData.username, formData.password);

    if (res.success) {
      // If successful, go to login page (or directly dashboard if you prefer)
      navigate('/login');
    } else {
      setError(res.msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="h-12 w-12 bg-sky-600 rounded-xl flex items-center justify-center">
            <Bike className="text-white h-7 w-7" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-2">Create Account</h2>
        <p className="text-slate-400 text-center mb-8">Join RideWise to manage your fleet</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Username</label>
            <input
              type="text"
              className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-sky-500 outline-none"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
            <input
              type="password"
              className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-sky-500 outline-none"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign Up'}
            {!loading && <UserPlus className="h-4 w-4" />}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account? <Link to="/login" className="text-sky-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
