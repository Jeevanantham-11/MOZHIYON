import { motion, AnimatePresence } from 'framer-motion';
import { History, X, Info, Trash2 } from 'lucide-react';

interface HistoryModalProps {
  showHistory: boolean;
  setShowHistory: (val: boolean) => void;
  history: any[];
  totalWords: number;
  hoursSaved: string;
  setInputText: (val: string) => void;
  setTranslatedText: (val: string) => void;
  setCurrentId: (val: string) => void;
  handleDeleteRecord: (id: string) => void;
}

export default function HistoryModal({ 
  showHistory, setShowHistory, history, totalWords, hoursSaved, 
  setInputText, setTranslatedText, setCurrentId, handleDeleteRecord 
}: HistoryModalProps) {
  return (
    <>
      <AnimatePresence>
        {showHistory && (
          <motion.div key="history-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setShowHistory(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showHistory && (
          <motion.div 
            key="history-panel"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
            className="fixed inset-y-0 right-0 max-w-lg w-full bg-[#3e0000]/70 backdrop-blur-3xl shadow-[-20px_0_50px_rgba(0,0,0,0.8)] z-50 flex flex-col border-l border-[#FFEB3B]/20"
          >
              <div className="p-8 border-b border-[#FFEB3B]/20 flex justify-between items-center bg-black/40">
                <h2 className="text-2xl font-serif font-black text-white drop-shadow-md">Translation History</h2>
                <div className="flex items-center gap-4">
                  <button onClick={() => setShowHistory(false)} className="p-3 hover:bg-white/10 rounded-full transition-colors text-[#FFEB3B]"><X size={24} /></button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {history.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-black/40 p-4 rounded-2xl border border-white/10 text-center shadow-inner">
                        <p className="text-3xl font-black text-[#FFEB3B]">{history.length}</p>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">Docs</p>
                    </div>
                    <div className="bg-black/40 p-4 rounded-2xl border border-white/10 text-center shadow-inner">
                        <p className="text-3xl font-black text-[#FFEB3B]">{totalWords}</p>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">Words</p>
                    </div>
                    <div className="bg-black/40 p-4 rounded-2xl border border-white/10 text-center shadow-inner relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent"></div>
                        <p className="text-3xl font-black text-green-400">{hoursSaved}h</p>
                        <p className="text-[10px] text-green-400/50 uppercase tracking-widest mt-1">Saved</p>
                    </div>
                  </div>
                )}
                {history.length === 0 ? (
                  <div className="text-center mt-20 text-[#FFEB3B]/40">
                    <History size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="font-bold uppercase tracking-widest">No history found</p>
                  </div>
                ) : (
                  history.map((record) => (
                    <motion.div key={record.id} layout className="bg-black/40 p-6 rounded-3xl border border-white/10 hover:border-[#FFEB3B]/50 transition-colors shadow-lg group relative">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{new Date(record.created_at).toLocaleDateString()}</span>
                        <div className="flex gap-2">
                          <button onClick={() => { setInputText(record.english_text); setTranslatedText(record.tamil_text); setCurrentId(record.id); setShowHistory(false); }} className="text-[#FFEB3B]/50 hover:text-[#FFEB3B] transition-colors"><Info size={18} /></button>
                          <button onClick={() => handleDeleteRecord(record.id)} className="text-red-400/50 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </div>
                      <p className="text-white/70 mb-3 text-sm line-clamp-2">{record.english_text}</p>
                      <p className="text-[#FFEB3B] font-serif text-xl line-clamp-2">{record.tamil_text}</p>
                    </motion.div>
                  ))
                )}
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
