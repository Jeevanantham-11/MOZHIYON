import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Volume2, Upload, History, ArrowRight, X, Info, Copy, Check, Trash2, Download, Share2, Type, ShieldAlert, Wand2, Subtitles } from 'lucide-react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

// Utils & Components
import { exportToPDF, exportToAudio, exportToSRT } from '../utils/exportUtils';
import AudioVisualizer from '../components/AudioVisualizer';
import DictionaryModal from '../components/modals/DictionaryModal';
import ProfileModal from '../components/modals/ProfileModal';
import HistoryModal from '../components/modals/HistoryModal';
import GlossaryModal from '../components/modals/GlossaryModal';
import CinemaMode from '../components/modals/CinemaMode';

interface TranslationRecord {
  id: string;
  english_text: string;
  tamil_text: string;
  created_at: string;
}

export default function Dashboard({ session }: { session: any }) {
  const [inputText, setInputText] = useState(() => localStorage.getItem(`mozhiyon_draft_${session?.user?.id}`) || '');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [history, setHistory] = useState<TranslationRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Profile Customization
  const [showProfile, setShowProfile] = useState(false);
  const [displayName, setDisplayName] = useState(() => {
    const saved = localStorage.getItem(`mozhiyon_name_${session?.user?.id}`);
    if (saved) return saved;
    const emailName = session?.user?.email?.split('@')[0] || 'User';
    return emailName.replace(/[._-]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  });

  // Pro Max Features State
  const [isReverse, setIsReverse] = useState(false); 
  const [cinemaMode, setCinemaMode] = useState(false);
  const [tone, setTone] = useState('Standard');
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [showPromptStudio, setShowPromptStudio] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  
  // Enterprise Features
  const [showGlossary, setShowGlossary] = useState(false);
  const [glossary, setGlossary] = useState<string[]>(['MOZHIYON']);
  const [newGlossaryWord, setNewGlossaryWord] = useState('');

  // Dictionary & Analytics State
  const [dictWord, setDictWord] = useState<any>(null);

  // Derived Analytics (History)
  const totalWords = history.reduce((acc, curr) => acc + (curr.english_text?.split(' ').length || 0), 0);
  const hoursSaved = (totalWords / 250).toFixed(1);

  // Live Readability Analytics
  const getReadabilityStats = (text: string) => {
    if (!text.trim()) return null;
    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    const chars = text.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;
    const readTime = Math.ceil(words / 200) || 1;
    let ari = (4.71 * (chars / words)) + (0.5 * (words / sentences)) - 21.43;
    let level = 'Basic';
    if (ari > 8) level = 'Intermediate';
    if (ari > 12) level = 'Professional';
    if (ari > 16) level = 'Academic';
    return { words, chars, readTime, level };
  };
  const liveStats = getReadabilityStats(translatedText);

  const handleWordDoubleClick = async (word: string) => {
    if (!isReverse) return showToast('Dictionary is only available for English words.', 'error');
    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
    if (!cleanWord) return;
    
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`);
      if (!res.ok) {
        showToast('Definition not found', 'error');
        return;
      }
      const data = await res.json();
      setDictWord(data[0]);
    } catch (e) {
      showToast('Failed to fetch dictionary', 'error');
    }
  };

  // Auto-Save Draft
  useEffect(() => {
    localStorage.setItem(`mozhiyon_draft_${session?.user?.id}`, inputText);
  }, [inputText, session?.user?.id]);

  // Global Keyboard Shortcuts (Swap)
  useEffect(() => {
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsReverse((prevReverse) => {
          const newReverse = !prevReverse;
          showToast(`Switched to ${newReverse ? 'Tamil to English' : 'English to Tamil'}`, 'success');
          return newReverse;
        });
        setInputText(translatedText);
        setTranslatedText('');
        setCurrentId(null);
      }
    };
    window.addEventListener('keydown', handleGlobalKeydown);
    return () => window.removeEventListener('keydown', handleGlobalKeydown);
  }, [translatedText]);

  useEffect(() => {
    fetchHistory();
    const hasSeenGuide = localStorage.getItem('mozhiyon_guide_seen');
    if (!hasSeenGuide) {
      setTimeout(() => startTour(), 1000);
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const startTour = () => {
    localStorage.setItem('mozhiyon_guide_seen', 'true');
    try {
      const driverObj = driver({
        showProgress: true,
        popoverClass: 'driverjs-theme',
        animate: true,
        steps: [
          { element: '#tour-profile', popover: { title: 'User Profile', description: 'View your account and securely sign out.', side: "bottom", align: 'end' } },
          { element: '#tour-glossary-btn', popover: { title: 'Brand Memory', description: 'Set locked words that should never be translated.', side: "bottom", align: 'center' } },
          { element: '#tour-history-btn', popover: { title: 'Translation History', description: 'View past translations and productivity metrics.', side: "bottom", align: 'center' } },
          { element: '#tour-tone', popover: { title: 'Contextual Tone [Exp]', description: 'Experiment with tone adjustment.', side: "bottom", align: 'center' } },
          { element: '#tour-prompt-studio', popover: { title: 'AI Prompt Studio', description: 'Write custom AI instructions (e.g., "Translate for a 5 year old").', side: "bottom", align: 'center' } },
          isReverse ? { element: '#tour-tanglish', popover: { title: 'Phonetic Mode', description: 'Convert English letters to Tamil script (Tanglish).', side: "bottom", align: 'center' } } : null,
          { element: '#tour-voice', popover: { title: 'Voice Dictation', description: 'Use your microphone for speech-to-text input.', side: "bottom", align: 'center' } },
          { element: '#tour-upload', popover: { title: 'Document Parsing', description: 'Upload .txt or .docx files for bulk processing.', side: "bottom", align: 'center' } },
          { element: '#tour-swap', popover: { title: 'Language Swap', description: 'Toggle source languages. Swap to Tamil to unlock Phonetic Tanglish mode!', side: "left", align: 'center' } },
          { element: '#tour-translate', popover: { title: 'Machine Translation', description: 'Instant translation via standard API.', side: "top", align: 'center' } },
          { element: '#tour-share', popover: { title: 'Share Link', description: 'Generate a public, read-only URL to share this translation.', side: "bottom", align: 'center' } },
          { element: '#tour-mp3', popover: { title: 'Export MP3', description: 'Download the spoken translation as an audio file.', side: "bottom", align: 'center' } },
          { element: '#tour-srt', popover: { title: 'Export Subtitles (.SRT)', description: 'Generate a timestamped subtitle file for YouTube/video editors.', side: "bottom", align: 'center' } },
          { element: '#tour-pdf', popover: { title: 'Export PDF', description: 'Save your translation as a formatted PDF file.', side: "bottom", align: 'center' } },
          { element: '#tour-cinema', popover: { title: 'Focus Mode', description: 'Expand the translation to full-screen for easier reading.', side: "bottom", align: 'center' } },
          { element: '#tour-audio', popover: { title: 'Pronounce', description: 'Listen to the translated text.', side: "bottom", align: 'center' } },
        ].filter(Boolean) as any
      });
      driverObj.drive();
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) showToast('Error signing out', 'error');
  };

  const fetchHistory = async () => {
    const { data, error } = await supabase.from('translations').select('*').order('created_at', { ascending: false });
    if (!error && data) setHistory(data);
  };

  const handleSwap = () => {
    setIsReverse(!isReverse);
    setInputText(translatedText);
    setTranslatedText('');
    setCurrentId(null);
    showToast(`Switched to ${isReverse ? 'English to Tamil' : 'Tamil to English'}`, 'success');
  };

  const handlePhoneticConvert = async () => {
    if (!inputText) return;
    setIsTranslating(true);
    try {
      const words = inputText.split(' ');
      const transliterated = await Promise.all(words.map(async (word) => {
        if (!word.trim()) return word;
        try {
          const res = await fetch(`https://inputtools.google.com/request?text=${word}&itc=ta-t-i0-und&num=1`);
          const data = await res.json();
          if (data[0] === 'SUCCESS') return data[1][0][1][0] || word;
        } catch(e) {}
        return word;
      }));
      setInputText(transliterated.join(' '));
      showToast('Phonetic Transliteration Complete', 'success');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    try {
      // Glossary Protection (Brand Memory)
      let query = inputText;
      
      glossary.forEach((word, idx) => {
        query = query.replace(new RegExp(`\\b${word}\\b`, 'gi'), `__KEEP_${idx}__`);
      });

      // Tone & Prompt Appending
      const toneInstruction = tone !== 'Standard' ? `(Translate in a ${tone.toLowerCase()} tone) ` : '';
      const customInstruction = customPrompt ? `(Follow this instruction strictly: ${customPrompt}) ` : '';
      const finalQuery = (toneInstruction || customInstruction) ? `${toneInstruction}${customInstruction}${query}` : query;
      
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${isReverse ? 'ta' : 'en'}&tl=${isReverse ? 'en' : 'ta'}&dt=t&q=${encodeURIComponent(finalQuery)}`;
      const res = await fetch(url);
      const data = await res.json();
      let resultText = data[0].map((item: any) => item[0]).join('');
      
      if (tone !== 'Standard' || customPrompt) {
         // Clean up the instruction prefix from the output if Google literally translated it
         resultText = resultText.replace(/^\(.*?\)\s*/i, '');
         resultText = resultText.replace(/^.*?strict.*?\:\s*/i, ''); // Extra cleanup for Tamil artifacts
      }

      // Glossary Restoration
      glossary.forEach((word, idx) => {
        resultText = resultText.replace(new RegExp(`__KEEP_${idx}__`, 'gi'), word);
      });

      setTranslatedText(resultText);

      const { data: insertData, error } = await supabase
        .from('translations')
        .insert([{ 
          user_id: session.user.id, 
          english_text: isReverse ? resultText : inputText, 
          tamil_text: isReverse ? inputText : resultText 
        }])
        .select();

      if (!error && insertData) {
        fetchHistory();
        setCurrentId(insertData[0].id);
      }
    } catch (error) {
      showToast('Error translating text. Please try again.', 'error');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (!currentId) return showToast('Please translate text first to share.', 'error');
    const url = `${window.location.origin}/share/${currentId}`;
    navigator.clipboard.writeText(url);
    showToast('Public link copied to clipboard!', 'success');
  };

  const downloadAudio = async () => {
    if (!translatedText) return showToast('Nothing to export!', 'error');
    try {
      showToast('Generating MP3...', 'success');
      await exportToAudio(translatedText, isReverse ? 'en' : 'ta');
    } catch (err) {
      showToast('Audio generation failed.', 'error');
    }
  };

  const speakText = () => {
    if (!translatedText) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = isReverse ? 'en-US' : 'ta-IN';
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleClearText = () => {
    setInputText('');
    setTranslatedText('');
    setCurrentId(null);
    showToast('Workspace cleared', 'success');
  };

  const handleDeleteRecord = async (id: string) => {
    const { error } = await supabase.from('translations').delete().eq('id', id);
    if (!error) {
      setHistory(history.filter(h => h.id !== id));
      if (id === currentId) setCurrentId(null);
      showToast('Translation deleted', 'success');
    } else showToast('Failed to delete', 'error');
  };


  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return showToast("Browser doesn't support Voice Input.", 'error');
    const recognition = new SpeechRecognition();
    recognition.lang = isReverse ? 'ta-IN' : 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(prev => prev ? prev + ' ' + transcript : transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.name.endsWith('.txt')) {
      const text = await file.text();
      setInputText(text);
      showToast('Document loaded successfully');
    } else if (file.name.endsWith('.docx')) {
      try {
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setInputText(result.value);
        showToast('Document loaded successfully');
      } catch (err) {
        showToast('Error loading Word document', 'error');
      }
    } else {
      showToast('Please upload a .txt or .docx file', 'error');
    }
  };

  const addGlossaryWord = () => {
    if (newGlossaryWord.trim() && !glossary.includes(newGlossaryWord.trim())) {
      setGlossary([...glossary, newGlossaryWord.trim()]);
      setNewGlossaryWord('');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <div className={`px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl border font-bold text-sm tracking-wide uppercase ${toast.type === 'success' ? 'bg-[#FFEB3B] text-[#600000] border-[#FFEB3B]/50' : 'bg-red-500 text-white border-red-400'}`}>
              {toast.type === 'success' ? <Check size={18} /> : <X size={18} />} {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-screen-2xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer transition-all duration-500 hover:scale-105">
            <div className="bg-[#FFEB3B] text-[#600000] p-2 rounded-xl shadow-[0_0_15px_rgba(255,235,59,0.4)] transition-transform group-hover:rotate-12">
              <span className="font-serif font-black text-2xl tracking-wider">M</span>
            </div>
            <div className="hidden md:flex flex-col justify-center">
              <span className="font-serif font-bold text-2xl tracking-[0.2em] text-white leading-none transition-all duration-500 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">MOZHIYON</span>
              <span className="text-[#FFEB3B] font-['Kavivanar'] text-xl mt-1 leading-none font-bold drop-shadow-[0_0_10px_rgba(255,235,59,0.3)] transition-all duration-500 group-hover:drop-shadow-[0_0_25px_rgba(255,235,59,0.9)]">மொழியோன்</span>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => { localStorage.removeItem('mozhiyon_guide_seen'); startTour(); }} className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white/80 p-2 hover:text-[#FFEB3B] transition uppercase tracking-wider">
              <Info size={20} /> <span className="hidden sm:inline">Guide</span>
            </button>
            <button id="tour-glossary-btn" onClick={() => setShowGlossary(true)} className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white/80 p-2 hover:text-[#FFEB3B] transition uppercase tracking-wider">
              <ShieldAlert size={20} /> <span className="hidden sm:inline">Glossary</span>
            </button>
            <button id="tour-history-btn" onClick={() => setShowHistory(true)} className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white/80 p-2 hover:text-[#FFEB3B] transition uppercase tracking-wider">
              <History size={20} /> <span className="hidden sm:inline">History</span>
            </button>
            <div className="w-px h-8 bg-white/20 mx-1 sm:mx-2"></div>
            
            <button 
              id="tour-profile" 
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-3 bg-black/40 border border-white/10 hover:border-[#FFEB3B]/50 pl-2 pr-4 py-1.5 rounded-full transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FFEB3B] to-[#FF9800] text-[#600000] font-black flex items-center justify-center text-sm">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden lg:block text-sm font-bold text-white/90 group-hover:text-[#FFEB3B] transition-colors line-clamp-1 max-w-[120px]">
                {displayName}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Translation Interface */}
      <main className="max-w-screen-2xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative">
          
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <button 
              id="tour-swap"
              onClick={handleSwap}
              title="Swap Languages (Ctrl+Shift+S)"
              className="bg-black/80 backdrop-blur-3xl p-5 shadow-[0_0_40px_rgba(255,235,59,0.5)] border border-[#FFEB3B]/50 rounded-full text-[#FFEB3B] cursor-pointer hover:scale-110 transition-transform duration-300"
            >
              <ArrowRight size={32} />
            </button>
          </div>

          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="bg-black/40 backdrop-blur-3xl rounded-[40px] shadow-2xl border border-white/10 overflow-hidden flex flex-col h-[700px]">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-black/30">
              <h2 className="font-serif font-black text-white text-3xl tracking-wide">
                {isReverse ? <span className="text-[#FFEB3B]">தமிழ் (Tamil)</span> : 'English'}
              </h2>
              <div className="flex gap-2 bg-black/50 rounded-2xl p-2 border border-white/10 shadow-inner items-center overflow-x-auto">
                <select id="tour-tone" value={tone} onChange={e => setTone(e.target.value)} className="bg-transparent text-[#FFEB3B] text-sm font-bold tracking-wider outline-none cursor-pointer appearance-none px-2 uppercase" title="Translation Tone">
                  <option className="bg-[#600000] text-white" value="Standard">Standard</option>
                  <option className="bg-[#600000] text-white" value="Professional">Professional [Exp]</option>
                  <option className="bg-[#600000] text-white" value="Cinematic">Creative [Exp]</option>
                </select>
                <div className="w-px bg-white/10 h-6 mx-1"></div>
                
                <button id="tour-prompt-studio" onClick={() => setShowPromptStudio(!showPromptStudio)} className={`p-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-1 ${showPromptStudio ? 'bg-[#FFEB3B] text-[#600000]' : 'hover:bg-white/10 text-[#FFEB3B]'}`} title="AI Prompt Studio">
                  <Wand2 size={16} /> <span className="hidden sm:inline">Studio</span>
                </button>
                <div className="w-px bg-white/10 h-6 mx-1"></div>

                {isReverse && (
                  <>
                    <button id="tour-tanglish" onClick={handlePhoneticConvert} className="p-2 rounded-xl hover:bg-white/10 text-[#FFEB3B] text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-1" title="Phonetic Convert">
                      <Type size={16} /> A➡️அ
                    </button>
                    <div className="w-px bg-white/10 h-6 mx-1"></div>
                  </>
                )}

                {inputText && (
                  <>
                    <button onClick={handleClearText} className="p-2 rounded-xl hover:bg-red-500/20 text-red-400 transition-colors" title="Clear Text">
                      <Trash2 size={20} />
                    </button>
                    <div className="w-px bg-white/10 h-6 mx-1"></div>
                  </>
                )}
                <button id="tour-voice" onClick={startListening} className={`p-2 rounded-xl transition-colors ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'hover:bg-white/10 text-[#FFEB3B]'}`} title="Voice Input">
                  <Mic size={20} />
                </button>
                <div className="w-px bg-white/10 h-6 mx-1"></div>
                <label id="tour-upload" className="cursor-pointer p-2 rounded-xl hover:bg-white/10 text-[#FFEB3B] transition-colors" title="Upload Document">
                  <Upload size={20} />
                  <input type="file" className="hidden" accept=".txt,.docx" onChange={handleFileUpload} />
                </label>
              </div>
            </div>
              <AnimatePresence>
                {showPromptStudio && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-10 pt-4 overflow-hidden">
                    <div className="bg-black/50 border border-[#FFEB3B]/30 rounded-xl p-4 shadow-inner flex flex-col gap-2 relative">
                      <label className="text-[10px] font-black text-[#FFEB3B] uppercase tracking-widest absolute -top-2.5 left-4 bg-[#600000] px-2 py-0.5 rounded-full border border-[#FFEB3B]/30" title="Requires an API Key in Production">Custom Instructions [Exp]</label>
                      <input 
                        type="text"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder='e.g., "Translate for a 5-year-old", "Use poetic vocabulary"'
                        className="bg-transparent text-white text-sm font-medium outline-none placeholder-white/30 w-full"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            <textarea
              className="flex-1 px-10 py-6 resize-none focus:outline-none text-2xl text-white bg-transparent placeholder-white/30 leading-relaxed font-medium"
              placeholder={`Start typing in ${isReverse ? 'Tamil' : 'English'}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  e.preventDefault();
                  handleTranslate();
                }
              }}
            />
            <div className="p-8 border-t border-white/10 bg-black/30 flex justify-end">
              <button
                id="tour-translate"
                onClick={handleTranslate}
                disabled={isTranslating || !inputText}
                className="px-10 py-5 bg-[#FFEB3B] text-[#600000] rounded-2xl font-black hover:shadow-[0_0_30px_rgba(255,235,59,0.5)] transition-all disabled:opacity-50 text-xl tracking-wider uppercase flex items-center gap-3"
              >
                {isTranslating ? (
                  <><div className="w-5 h-5 border-2 border-[#600000] border-t-transparent rounded-full animate-spin"></div> Translating...</>
                ) : (
                  <>Translate to {isReverse ? 'English' : 'Tamil'} <span className="text-xs opacity-50 bg-[#600000]/10 px-2 py-1 rounded-lg">Ctrl+Enter</span></>
                )}
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: "easeOut", delay: 0.2 }} className="bg-black/40 backdrop-blur-3xl rounded-[40px] shadow-2xl border border-white/10 overflow-hidden flex flex-col h-[700px] relative">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-black/30 relative z-20">
              <h2 className="font-serif font-black text-white text-3xl tracking-wide">
                {isReverse ? 'English' : <span className="text-[#FFEB3B] drop-shadow-[0_0_10px_rgba(255,235,59,0.4)]">தமிழ் (Tamil)</span>}
              </h2>
              <div className="flex gap-2">
                <button id="tour-share" onClick={handleShare} disabled={!currentId} className="p-3 bg-[#FFEB3B]/10 border border-[#FFEB3B]/30 rounded-xl hover:bg-[#FFEB3B]/20 text-[#FFEB3B] transition-colors disabled:opacity-30" title="Share Public Link">
                  <Share2 size={20} />
                </button>
                <div className="w-px bg-white/10 my-1 mx-1"></div>
                <button id="tour-mp3" onClick={downloadAudio} disabled={!translatedText} className="p-3 bg-[#FFEB3B]/10 border border-[#FFEB3B]/30 rounded-xl hover:bg-[#FFEB3B]/20 text-[#FFEB3B] transition-colors disabled:opacity-30" title="Download MP3">
                  <Download size={20} />
                </button>
                <button id="tour-srt" onClick={() => exportToSRT(translatedText)} disabled={!translatedText} className="p-3 bg-[#FFEB3B]/10 border border-[#FFEB3B]/30 rounded-xl hover:bg-[#FFEB3B]/20 text-[#FFEB3B] transition-colors disabled:opacity-30" title="Download SRT Subtitles">
                  <Subtitles size={20} />
                </button>
                <button id="tour-pdf" onClick={() => exportToPDF(inputText, translatedText, isReverse)} disabled={!translatedText} className="p-3 bg-[#FFEB3B]/10 border border-[#FFEB3B]/30 rounded-xl hover:bg-[#FFEB3B]/20 text-[#FFEB3B] transition-colors disabled:opacity-30 font-black text-xs uppercase" title="Export PDF">
                  PDF
                </button>
                <button id="tour-cinema" onClick={() => setCinemaMode(true)} disabled={!translatedText} className="p-3 bg-[#FFEB3B]/10 border border-[#FFEB3B]/30 rounded-xl hover:bg-[#FFEB3B]/20 text-[#FFEB3B] transition-colors disabled:opacity-30" title="Focus Mode">
                  <ArrowRight size={20} />
                </button>
                <div className="w-px bg-white/10 my-1 mx-1"></div>
                <button onClick={handleCopy} disabled={!translatedText} className="p-3 bg-[#FFEB3B]/10 border border-[#FFEB3B]/30 rounded-xl hover:bg-[#FFEB3B]/20 text-[#FFEB3B] transition-colors disabled:opacity-30" title="Copy Text">
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
                <button id="tour-audio" onClick={speakText} disabled={!translatedText} className="p-3 bg-[#FFEB3B]/10 border border-[#FFEB3B]/30 rounded-xl hover:bg-[#FFEB3B]/20 text-[#FFEB3B] transition-colors disabled:opacity-30" title="Pronounce">
                  <Volume2 size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-10 overflow-auto bg-transparent relative z-10">
              {translatedText ? (
                <p className="text-4xl text-white leading-[1.6] font-serif drop-shadow-lg flex flex-wrap gap-x-3 gap-y-2">
                  {translatedText.split(' ').map((word, i) => (
                    <motion.span 
                      key={`${word}-${i}`} 
                      initial={{ opacity: 0, y: 15, filter: "blur(5px)" }} 
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} 
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      onDoubleClick={() => handleWordDoubleClick(word)}
                      className={isReverse ? "cursor-help hover:text-[#FFEB3B] transition-colors" : ""}
                    >
                      {word}
                    </motion.span>
                  ))}
                </p>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/30 space-y-6">
                  <div className="p-6 rounded-full bg-black/30 border border-white/10 text-[#FFEB3B]/50">
                    <span className="text-5xl font-bold">{isReverse ? 'A' : 'அ'}</span>
                  </div>
                  <p className="font-bold text-xl uppercase tracking-widest">Waiting for input</p>
                </div>
              )}
            </div>

            {/* Live Readability Analytics */}
            {translatedText && liveStats && (
              <div className="absolute bottom-4 left-6 flex gap-4 text-xs font-bold text-white/50 bg-black/40 px-4 py-2 rounded-full border border-white/10 z-20 backdrop-blur-md">
                <span className="flex items-center gap-1">{liveStats.words} WORDS</span>
                <span className="w-px h-3 bg-white/20 self-center"></span>
                <span className="flex items-center gap-1">{liveStats.readTime}M READ</span>
                <span className="w-px h-3 bg-white/20 self-center"></span>
                <span className="text-[#FFEB3B] flex items-center gap-1">{liveStats.level.toUpperCase()} LEVEL</span>
              </div>
            )}

            {/* Cinematic Audio Visualizer overlay */}
            <AudioVisualizer isPlaying={isPlayingAudio} />
          </motion.div>
        </div>
      </main>

      {/* History Vault Slider */}
      <HistoryModal 
        showHistory={showHistory} 
        setShowHistory={setShowHistory} 
        history={history} 
        totalWords={totalWords} 
        hoursSaved={hoursSaved} 
        setInputText={setInputText} 
        setTranslatedText={setTranslatedText} 
        setCurrentId={setCurrentId} 
        handleDeleteRecord={handleDeleteRecord} 
      />

      <GlossaryModal 
        showGlossary={showGlossary} 
        setShowGlossary={setShowGlossary} 
        glossary={glossary} 
        setGlossary={setGlossary} 
        newGlossaryWord={newGlossaryWord} 
        setNewGlossaryWord={setNewGlossaryWord} 
        addGlossaryWord={addGlossaryWord} 
      />

      <CinemaMode 
        cinemaMode={cinemaMode} 
        setCinemaMode={setCinemaMode} 
        translatedText={translatedText} 
      />

      <DictionaryModal dictWord={dictWord} setDictWord={setDictWord} />
      
      <ProfileModal 
        showProfile={showProfile} 
        setShowProfile={setShowProfile} 
        displayName={displayName} 
        setDisplayName={setDisplayName} 
        session={session} 
        handleLogout={handleLogout} 
      />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10 w-full px-4">
        <p className="text-[9px] text-white/20 font-mono tracking-widest uppercase">Privacy Notice: Translation and audio generation are powered by public Google endpoints.</p>
      </div>
    </div>
  );
}
