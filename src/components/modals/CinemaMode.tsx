import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface CinemaModeProps {
  cinemaMode: boolean;
  setCinemaMode: (val: boolean) => void;
  translatedText: string;
}

export default function CinemaMode({ cinemaMode, setCinemaMode, translatedText }: CinemaModeProps) {
  return (
    <AnimatePresence>
      {cinemaMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-10 sm:p-20"
        >
          <button onClick={() => setCinemaMode(false)} className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors p-4 rounded-full hover:bg-white/10">
            <X size={32} />
          </button>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-serif leading-tight text-center max-w-7xl mx-auto"
          >
            {translatedText}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
