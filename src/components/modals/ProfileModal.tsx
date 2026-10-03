import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut } from 'lucide-react';

interface ProfileModalProps {
  showProfile: boolean;
  setShowProfile: (val: boolean) => void;
  displayName: string;
  setDisplayName: (val: string) => void;
  session: any;
  handleLogout: () => void;
}

export default function ProfileModal({ showProfile, setShowProfile, displayName, setDisplayName, session, handleLogout }: ProfileModalProps) {
  return (
    <AnimatePresence>
      {showProfile && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-6">
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#111] border border-white/10 w-full max-w-sm rounded-[30px] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#600000] to-transparent opacity-50 pointer-events-none"></div>
            
            <div className="flex justify-between items-start relative z-10 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FFEB3B] to-[#FF9800] text-[#600000] font-black flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(255,235,59,0.3)] border-4 border-[#111]">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <button onClick={() => setShowProfile(false)} className="text-white/50 hover:text-white bg-black/50 p-2 rounded-full"><X size={20} /></button>
            </div>

            <div className="relative z-10 space-y-6">
              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Display Name</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    localStorage.setItem('mozhiyon_name', e.target.value);
                  }}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FFEB3B]/50 font-bold"
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Account Email</label>
                <div className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-3 text-white/60 font-mono text-sm">
                  {session?.user?.email || 'Demo User'}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <button onClick={handleLogout} className="w-full bg-red-500/10 border border-red-500/20 text-red-400 font-bold px-6 py-4 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm">
                  <LogOut size={18} /> Sign Out Securely
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
