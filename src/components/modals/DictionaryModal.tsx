import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface DictionaryModalProps {
  dictWord: any;
  setDictWord: (val: any) => void;
}

export default function DictionaryModal({ dictWord, setDictWord }: DictionaryModalProps) {
  return (
    <AnimatePresence>
      {dictWord && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-6" onClick={() => setDictWord(null)}>
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-[20px] p-8 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setDictWord(null)} className="absolute top-6 right-6 text-white/50 hover:text-white"><X size={20} /></button>
            
            <h3 className="text-3xl font-serif font-black text-[#FFEB3B] mb-1 capitalize">{dictWord.word}</h3>
            {dictWord.phonetic && <p className="text-white/50 font-mono text-sm mb-6">{dictWord.phonetic}</p>}

            <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {dictWord.meanings.map((meaning: any, i: number) => (
                <div key={i} className="border-t border-white/5 pt-4">
                  <span className="text-[#FF9800] text-xs font-bold uppercase tracking-widest bg-[#FF9800]/10 px-2 py-1 rounded-md mb-3 inline-block">
                    {meaning.partOfSpeech}
                  </span>
                  <ul className="space-y-3">
                    {meaning.definitions.slice(0, 2).map((def: any, j: number) => (
                      <li key={j} className="text-white/80 text-sm leading-relaxed">
                        <span className="text-white/30 mr-2">{j + 1}.</span> {def.definition}
                        {def.example && <p className="text-white/40 italic mt-1 text-xs">"{def.example}"</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
