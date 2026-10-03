import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Copy } from 'lucide-react';

export default function Share() {
  const { id } = useParams();
  const [translation, setTranslation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchTranslation() {
      if (!id) return;
      const { data, error } = await supabase
        .from('translations')
        .select('english_text, tamil_text, created_at')
        .eq('id', id)
        .single();
      
      if (error || !data) {
        setError("Translation not found or you don't have permission to view it.");
      } else {
        setTranslation(data);
      }
      setLoading(false);
    }
    fetchTranslation();
  }, [id]);

  const handleCopy = () => {
    if (!translation) return;
    navigator.clipboard.writeText(translation.tamil_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="w-16 h-16 border-4 border-[#FFEB3B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative z-10 text-center px-4">
        <h1 className="text-4xl font-serif text-[#FFEB3B] mb-4">Vault Locked</h1>
        <p className="text-white/70 mb-8">{error}</p>
        <Link to="/" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10 p-6 md:p-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition">
          <ArrowLeft size={20} /> Back to MOZHIYON
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl">
          <div className="flex justify-between items-center mb-8 pb-8 border-b border-white/10">
            <div>
              <h1 className="text-2xl font-serif font-black text-white tracking-widest uppercase">Shared Document</h1>
              <p className="text-[#FFEB3B]/50 text-sm mt-1">{new Date(translation.created_at).toLocaleString()}</p>
            </div>
            <button onClick={handleCopy} className="p-4 bg-[#FFEB3B]/10 hover:bg-[#FFEB3B]/20 text-[#FFEB3B] rounded-2xl transition">
              {copied ? <Check size={24} /> : <Copy size={24} />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <span className="text-xs font-black text-white/40 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 uppercase tracking-widest">Original Text</span>
              <p className="text-white/80 mt-6 text-xl leading-relaxed whitespace-pre-wrap">{translation.english_text}</p>
            </div>
            
            <div className="md:border-l md:border-white/10 md:pl-12">
              <span className="text-xs font-black text-[#600000] bg-[#FFEB3B] px-3 py-1.5 rounded-lg shadow-[0_0_10px_rgba(255,235,59,0.3)] uppercase tracking-widest">Translated (Tamil)</span>
              <p className="text-[#FFEB3B] mt-6 font-serif text-3xl leading-relaxed whitespace-pre-wrap drop-shadow-sm">{translation.tamil_text}</p>
            </div>
          </div>
        </motion.div>
        
        <p className="text-center text-white/30 text-sm mt-8">Securely generated via MOZHIYON Translation Vault</p>
      </div>
    </div>
  );
}
