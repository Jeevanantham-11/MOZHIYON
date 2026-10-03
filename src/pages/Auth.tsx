import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMessage('');
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Registration successful! You can now log in.');
      }
    } catch (error: any) { setMessage(error.message); } finally { setLoading(false); }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex bg-[#FFEB3B] text-[#600000] p-4 rounded-3xl shadow-[0_0_30px_rgba(255,235,59,0.5)] mb-6">
          <span className="font-serif font-black text-5xl tracking-wider">M</span>
        </div>
        <h2 className="text-5xl font-serif font-black text-white drop-shadow-xl">MOZHIYON</h2>
        <h3 className="mt-2 text-3xl text-[#FFEB3B] font-['Kavivanar'] font-bold drop-shadow-[0_0_15px_rgba(255,235,59,0.4)]">மொழியோன்</h3>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="mt-12 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-black/50 backdrop-blur-3xl py-12 px-8 shadow-2xl sm:rounded-[40px] border border-white/10">
          <form className="space-y-8" onSubmit={handleAuth}>
            <div>
              <label className="block text-lg font-bold text-white/90">Email address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-3 appearance-none block w-full px-5 py-4 border border-white/20 rounded-2xl shadow-inner focus:outline-none focus:ring-4 focus:ring-[#FFEB3B]/50 bg-black/40 text-white text-lg placeholder-white/30" placeholder="Enter your email" />
            </div>
            <div>
              <label className="block text-lg font-bold text-white/90">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-3 appearance-none block w-full px-5 py-4 border border-white/20 rounded-2xl shadow-inner focus:outline-none focus:ring-4 focus:ring-[#FFEB3B]/50 bg-black/40 text-white text-lg placeholder-white/30" placeholder="••••••••" />
            </div>
            {message && <div className="text-lg font-bold text-[#FFEB3B] p-4 text-center bg-[#FFEB3B]/10 rounded-2xl border border-[#FFEB3B]/30">{message}</div>}
            <button type="submit" disabled={loading} className="w-full py-5 px-4 border border-transparent rounded-2xl shadow-[0_0_20px_rgba(255,235,59,0.2)] text-xl font-black text-[#600000] bg-[#FFEB3B] hover:shadow-[0_0_40px_rgba(255,235,59,0.5)] transition-all uppercase tracking-widest">
              {loading ? 'Authenticating...' : isLogin ? 'Access System' : 'Create Account'}
            </button>
          </form>
          <div className="mt-8 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-white/60 hover:text-[#FFEB3B] font-bold text-lg transition-colors">
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
