import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { motion } from 'framer-motion';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Share from './pages/Share';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#600000] text-white font-sans selection:bg-[#FFEB3B] selection:text-[#600000] relative overflow-hidden">
      
      {/* CINEMATIC FILM GRAIN */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* GLOBAL CINEMATIC RED & YELLOW BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-br from-[#8B0000] via-[#500000] to-[#200000]">
        
        {/* Sunburst Ray Effect */}
        <motion.div 
          animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-100%] opacity-[0.07]"
          style={{ background: "repeating-conic-gradient(from 0deg, transparent 0deg 5deg, #FFC107 5deg 10deg)" }}
        />

        {/* Massive Yellow/Gold Orbs */}
        <motion.div 
          animate={{ y: [0, -50, 0], x: [0, 30, 0], scale: [1, 1.2, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[0%] left-[0%] w-[600px] h-[600px] bg-[#FFEB3B] rounded-full mix-blend-screen filter blur-[200px] opacity-40"
        />
        <motion.div 
          animate={{ y: [0, 50, 0], x: [0, -40, 0], scale: [1, 1.5, 1] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[800px] bg-[#FF9800] rounded-full mix-blend-screen filter blur-[250px] opacity-50"
        />
      </div>

      {/* ROUTER (Z-10 so pages sit above the cinematic background) */}
      <div className="relative z-10 h-full w-full overflow-y-auto">
        <Router>
          <Routes>
            <Route path="/" element={<Landing session={session} />} />
            <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={session ? <Dashboard session={session} /> : <Navigate to="/auth" />} />
            <Route path="/share/:id" element={<Share />} />
          </Routes>
        </Router>
      </div>

    </div>
  );
}

export default App;
