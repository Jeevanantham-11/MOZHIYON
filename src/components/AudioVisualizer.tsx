import { motion } from 'framer-motion';

export default function AudioVisualizer({ isPlaying }: { isPlaying: boolean }) {
  if (!isPlaying) return null;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 h-12 bg-black/60 backdrop-blur-xl px-6 py-2 rounded-full border border-[#FFEB3B]/30 shadow-[0_0_20px_rgba(255,235,59,0.3)]">
      {[...Array(7)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ height: ['20%', '100%', '20%'] }}
          transition={{
            repeat: Infinity,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
          className="w-1.5 bg-[#FFEB3B] rounded-full"
        />
      ))}
      <span className="ml-3 text-xs font-bold text-[#FFEB3B] uppercase tracking-widest animate-pulse">Playing</span>
    </div>
  );
}
