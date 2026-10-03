import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Globe, Mic, FileText, Shield, ArrowRight, PlayCircle, ChevronDown } from 'lucide-react';

const playWelcomeSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc1.type = 'sine'; osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 1.5);
    osc2.frequency.setValueAtTime(659.25, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 1.5);
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
    osc1.connect(gainNode); osc2.connect(gainNode); gainNode.connect(ctx.destination);
    osc1.start(); osc2.start(); osc1.stop(ctx.currentTime + 2); osc2.stop(ctx.currentTime + 2);
  } catch (error) { console.log("Audio blocked"); }
};

export default function Landing({ session }: { session: any }) {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    playWelcomeSound();
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    playWelcomeSound();
    navigate(session ? '/dashboard' : '/auth');
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      
      {/* Epic Cinematic Splash Screen */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-black/50 backdrop-blur-md"
          >
            <motion.h1 
              initial={{ scale: 0.5, rotate: -5, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 100, delay: 0.2 }}
              className="text-8xl md:text-[12rem] text-[#FFEB3B] font-['Kavivanar'] z-10"
              style={{ textShadow: "0px 0px 40px rgba(255,235,59,0.6), 5px 5px 0px #4A0000, 10px 10px 0px rgba(0,0,0,0.5)", lineHeight: "1" }}
            >
              மொழியோன்
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }}
              className="text-[#FFEB3B] mt-8 font-serif tracking-[0.5em] text-xl md:text-2xl font-bold z-10 drop-shadow-2xl uppercase text-center"
            >
              English to Tamil Translation
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-32 flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="bg-[#FFEB3B] text-[#600000] p-3 rounded-xl shadow-[0_0_20px_rgba(255,235,59,0.5)] transform group-hover:rotate-12 transition-transform">
            <span className="font-serif font-black text-3xl tracking-wider">M</span>
          </div>
          <div className="flex flex-col transition-all duration-500 group-hover:scale-105 justify-center">
            <span className="font-serif font-bold text-3xl tracking-[0.2em] text-white leading-none transition-all duration-500 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">MOZHIYON</span>
            <span className="text-[#FFEB3B] font-['Kavivanar'] text-2xl mt-1 leading-none font-bold drop-shadow-[0_0_10px_rgba(255,235,59,0.3)] transition-all duration-500 group-hover:drop-shadow-[0_0_25px_rgba(255,235,59,0.9)]">மொழியோன்</span>
          </div>
        </div>
        <button 
          onClick={handleStart}
          className="font-black text-white hover:text-[#FFEB3B] transition-colors uppercase tracking-[0.3em] text-sm flex items-center gap-3 bg-black/40 backdrop-blur-xl px-8 py-4 rounded-full shadow-2xl border border-white/20 hover:bg-black/60 hover:border-[#FFEB3B]/50"
        >
          {session ? 'Dashboard' : 'Sign In'} <ArrowRight size={20} />
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 pb-20 flex flex-col items-center text-center">
        
        {/* Hero Section */}
        <div className="max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 2.8, ease: "easeOut" }}>
            <h1 className="text-5xl sm:text-7xl lg:text-[100px] font-serif font-black text-white leading-[1.1] mb-10 drop-shadow-2xl">
              Seamless English to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFEB3B] to-[#FF9800] filter drop-shadow-[0_0_20px_rgba(255,235,59,0.4)]">
                Tamil Translation.
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-white/80 mb-16 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-md">
              A fast and professional tool for translating English to Tamil. Includes built-in voice input, document text extraction, and history tracking.
            </p>
            <div className="flex justify-center">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0px 10px 50px rgba(255,235,59,0.6)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="flex items-center justify-center gap-4 bg-[#FFEB3B] text-[#600000] px-12 py-6 rounded-full font-black text-xl transition-all shadow-[0_0_30px_rgba(255,235,59,0.3)]"
              >
                {session ? 'ENTER DASHBOARD' : 'START TRANSLATING'} 
                <PlayCircle size={28} />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 4.5, duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mt-28 text-white/40 hover:text-[#FFEB3B] flex flex-col items-center gap-2 cursor-pointer transition-colors"
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase">Discover Features</span>
          <ChevronDown size={24} />
        </motion.button>

        {/* Features Grid */}
        <motion.div 
          id="features"
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-32 w-full text-left"
        >
          {[
            { icon: <Globe size={36} />, title: "Tanglish Engine", desc: "Type phonetically in English, instantly convert to native Tamil script." },
            { icon: <Shield size={36} />, title: "Brand Memory", desc: "Lock specific brand names or keywords to prevent them from being translated." },
            { icon: <FileText size={36} />, title: "Pro Exports", desc: "Generate MP3 audio, formatted PDFs, and YouTube-ready .SRT subtitle files." },
            { icon: <Mic size={36} />, title: "AI Prompt Studio [Exp]", desc: "UI concept for injecting hidden custom instructions (e.g. 'Translate for a 5-year old')." },
            { icon: <PlayCircle size={36} />, title: "Live Analytics", desc: "Real-time readability metrics calculating grade levels and reading times." },
            { icon: <ArrowRight size={36} />, title: "Focus Mode", desc: "A gorgeous, distraction-free cinematic overlay for reading large documents." },
          ].map((feat, idx) => (
            <motion.div key={idx} whileHover={{ y: -15, scale: 1.02 }} className="bg-black/40 backdrop-blur-2xl p-10 rounded-[30px] border border-white/10 hover:border-[#FFEB3B]/50 shadow-2xl transition-all duration-500">
              <div className="text-[#FFEB3B] mb-8 filter drop-shadow-[0_0_15px_rgba(255,235,59,0.5)]">
                {feat.icon}
              </div>
              <h3 className="text-3xl font-black font-serif text-white mb-4">{feat.title}</h3>
              <p className="text-white/60 font-medium text-lg leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-40 mb-10 flex flex-col items-center border border-white/10 bg-black/30 backdrop-blur-md p-16 rounded-[40px] w-full max-w-4xl"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-black text-white mb-10 drop-shadow-lg text-center">
            Ready to break the <br className="hidden md:block" /> language barrier?
          </h2>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 40px rgba(255,235,59,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="flex items-center justify-center gap-4 bg-transparent border-2 border-[#FFEB3B] text-[#FFEB3B] hover:bg-[#FFEB3B] hover:text-[#600000] px-10 py-5 rounded-full font-black text-lg transition-all"
          >
            {session ? 'RETURN TO WORKSPACE' : 'CREATE FREE ACCOUNT'}
            <ArrowRight size={24} />
          </motion.button>
        </motion.div>
      </main>

      {/* Tech Stack Footer */}
      <footer className="w-full border-t border-white/10 bg-black/60 backdrop-blur-3xl z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 group cursor-default">
            <span className="text-[#FFEB3B] font-['Kavivanar'] text-2xl font-bold drop-shadow-[0_0_10px_rgba(255,235,59,0.3)] transition-all duration-500 group-hover:drop-shadow-[0_0_25px_rgba(255,235,59,0.9)]">மொழியோன்</span>
            <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/20"></span>
            <p className="text-white/40 text-sm font-bold transition-all duration-500">© {new Date().getFullYear()} <span className="font-serif tracking-[0.1em] text-white/70 transition-all duration-500 group-hover:text-white group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">MOZHIYON</span>. All rights reserved.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 sm:mt-0">
            <div className="flex flex-col items-center sm:items-end group cursor-default">
              <span className="text-[#FFEB3B] font-['Kavivanar'] font-bold text-2xl tracking-widest drop-shadow-[0_0_10px_rgba(255,235,59,0.3)] transition-all group-hover:drop-shadow-[0_0_20px_rgba(255,235,59,0.8)]">
                யாதும் ஊரே யாவரும் கேளிர்
              </span>
              <span className="text-white/30 font-serif text-[10px] font-bold uppercase tracking-[0.2em] mt-1 group-hover:text-white/60 transition-colors">
                "To us all towns are one, all men our kin."
              </span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
