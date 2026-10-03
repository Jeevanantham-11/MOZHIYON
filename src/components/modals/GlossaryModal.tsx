import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, Trash2 } from 'lucide-react';

interface GlossaryModalProps {
  showGlossary: boolean;
  setShowGlossary: (val: boolean) => void;
  glossary: string[];
  setGlossary: (val: string[]) => void;
  newGlossaryWord: string;
  setNewGlossaryWord: (val: string) => void;
  addGlossaryWord: () => void;
}

export default function GlossaryModal({ 
  showGlossary, setShowGlossary, glossary, setGlossary, 
  newGlossaryWord, setNewGlossaryWord, addGlossaryWord 
}: GlossaryModalProps) {
  return (
    <AnimatePresence>
      {showGlossary && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-6">
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#111] border border-white/10 w-full max-w-md rounded-[30px] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-black text-white flex items-center gap-3"><ShieldAlert className="text-[#FFEB3B]" /> Brand Memory</h2>
              <button onClick={() => setShowGlossary(false)} className="text-white/50 hover:text-white"><X size={24} /></button>
            </div>
            <p className="text-sm text-white/60 mb-6">Add enterprise names or specific words that should <strong className="text-[#FFEB3B]">never</strong> be translated into Tamil.</p>
            
            <div className="flex gap-2 mb-6">
              <input 
                type="text" 
                value={newGlossaryWord}
                onChange={(e) => setNewGlossaryWord(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addGlossaryWord()}
                placeholder="e.g. MOZHIYON" 
                className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FFEB3B]/50"
              />
              <button onClick={addGlossaryWord} className="bg-[#FFEB3B] text-[#600000] font-black px-6 rounded-xl hover:bg-[#FFEB3B]/80 transition">ADD</button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {glossary.map((word, idx) => (
                <div key={idx} className="flex justify-between items-center bg-black/30 border border-white/5 p-3 rounded-xl">
                  <span className="text-white font-bold">{word}</span>
                  <button onClick={() => setGlossary(glossary.filter(w => w !== word))} className="text-red-400 hover:bg-red-500/20 p-2 rounded-lg transition"><Trash2 size={16}/></button>
                </div>
              ))}
              {glossary.length === 0 && <p className="text-center text-white/30 py-4 text-sm font-bold uppercase">No locked words</p>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
