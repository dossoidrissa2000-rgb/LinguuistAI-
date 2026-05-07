import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Baby, 
  Users, 
  BriefcaseBusiness, 
  ArrowRight,
  Sparkles,
  Trophy,
  BookOpen,
  MessageCircle,
  BarChart3,
  Volume2,
  RotateCw,
  Calendar
} from 'lucide-react';
import { cn } from './lib/utils';
import { UserProfile, CEFRLevel, VocabularyWord } from './types';
import { generateVocabulary } from './services/geminiService';

// Mock Data for the prototype
const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>('A1');
  const [activeTab, setActiveTab] = useState<'lessons' | 'chat' | 'stats' | 'vocabulary' | 'practice'>('lessons');

  if (!profile) {
    return <ProfileSelector onSelect={setProfile} />;
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500",
      profile === 'kids' && "bg-amber-50",
      profile === 'professionals' && "bg-slate-900 text-white",
      profile === 'adults' && "bg-white"
    )}>
      {/* Navigation */}
      <nav className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-md px-6 py-4 flex justify-between items-center",
        profile === 'professionals' ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-100"
      )}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg">
            <GraduationCap size={24} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">LinguistAI</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 font-medium">
          <button onClick={() => setActiveTab('lessons')} className={cn(activeTab === 'lessons' ? "text-brand-primary" : "opacity-60")}>Paths</button>
          <button onClick={() => setActiveTab('vocabulary')} className={cn(activeTab === 'vocabulary' ? "text-brand-primary" : "opacity-60")}>Vocabulary</button>
          <button onClick={() => setActiveTab('practice')} className={cn(activeTab === 'practice' ? "text-brand-primary" : "opacity-60")}>Practice</button>
          <button onClick={() => setActiveTab('chat')} className={cn(activeTab === 'chat' ? "text-brand-primary" : "opacity-60")}>AI Tutor</button>
          <button onClick={() => setActiveTab('stats')} className={cn(activeTab === 'stats' ? "text-brand-primary" : "opacity-60")}>Progress</button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/10 rounded-full text-brand-primary font-bold">
            <Trophy size={16} />
            <span>1,240 XP</span>
          </div>
          <button 
            onClick={() => setProfile(null)}
            className="text-xs opacity-50 hover:opacity-100 transition-opacity"
          >
            Switch Profile
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-brand-primary mb-2">
            <Sparkles size={16} />
            <span className="text-sm font-bold uppercase tracking-wider">Welcome back!</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Ready to master {selectedLevel} English?
          </h1>
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {levels.map(level => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={cn(
                  "px-6 py-2 rounded-xl border-2 transition-all font-bold",
                  selectedLevel === level 
                    ? "bg-brand-primary border-brand-primary text-white shadow-indigo-200" 
                    : profile === 'professionals' 
                      ? "border-slate-800 hover:border-slate-700" 
                      : "border-slate-100 hover:border-slate-200"
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'lessons' && <LearningGrid key="lessons" profile={profile} level={selectedLevel} />}
          {activeTab === 'vocabulary' && <VocabularyModule key="vocabulary" profile={profile} level={selectedLevel} />}
          {activeTab === 'practice' && <PracticeSection key="practice" profile={profile} level={selectedLevel} />}
          {activeTab === 'chat' && <AITutor key="chat" profile={profile} level={selectedLevel} />}
          {activeTab === 'stats' && <Statistics key="stats" profile={profile} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

function ProfileSelector({ onSelect }: { onSelect: (p: UserProfile) => void }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tighter">Choose your path</h1>
          <p className="text-slate-500 text-lg">We'll customize your experience based on your goals.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProfileCard 
            icon={<Baby className="text-orange-500" size={32} />}
            title="Kids"
            description="Playful and visual learning for ages 4-12."
            color="bg-orange-100 border-orange-200"
            onClick={() => onSelect('kids')}
          />
          <ProfileCard 
            icon={<Users className="text-indigo-500" size={32} />}
            title="Adults"
            description="Balanced and comprehensive approach."
            color="bg-indigo-100 border-indigo-200"
            onClick={() => onSelect('adults')}
          />
          <ProfileCard 
            icon={<BriefcaseBusiness className="text-slate-800" size={32} />}
            title="Professionals"
            description="Focus on business and career success."
            color="bg-slate-200 border-slate-300"
            onClick={() => onSelect('professionals')}
          />
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ icon, title, description, color, onClick }: any) {
  return (
    <motion.button
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "p-8 rounded-3xl border-2 text-left flex flex-col gap-6 transition-shadow hover:shadow-xl group",
        color
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-2 group-hover:text-brand-primary transition-colors">{title}</h3>
        <p className="text-slate-600 leading-relaxed font-medium">{description}</p>
      </div>
      <div className="mt-auto flex items-center gap-2 font-bold text-sm">
        Start Journey <ArrowRight size={16} />
      </div>
    </motion.button>
  );
}

function LearningGrid({ profile, level }: { profile: UserProfile, level: CEFRLevel }) {
  const modules = [
    { title: "Daily Greeting", duration: "5 min", type: "Speaking", progress: 100 },
    { title: "Working with Numbers", duration: "10 min", type: "Vocabulary", progress: 65 },
    { title: "At the Restaurant", duration: "12 min", type: "Listening", progress: 0 },
    { title: "Simple Past Tense", duration: "15 min", type: "Grammar", progress: 0 },
    { title: "Meeting New People", duration: "8 min", type: "Conversation", progress: 0 },
    { title: "Weekly Challenge", duration: "20 min", type: "Special", progress: 0 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {modules.map((m, i) => (
        <div 
          key={i} 
          className={cn(
            "p-6 rounded-2xl border transition-all cursor-pointer group hover:shadow-lg",
            profile === 'professionals' 
              ? "bg-slate-800/50 border-slate-700 active:bg-slate-800" 
              : "bg-white border-slate-100 active:bg-slate-50"
          )}
        >
          <div className="flex justify-between items-start mb-4">
            <div className={cn(
              "px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-tight",
              profile === 'professionals' ? "bg-slate-700" : "bg-brand-primary/10 text-brand-primary"
            )}>
              {m.type}
            </div>
            <span className="text-xs opacity-50 font-medium">{m.duration}</span>
          </div>
          <h3 className="text-xl font-bold mb-4 group-hover:translate-x-1 transition-transform">{m.title}</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold opacity-60">
              <span>Progress</span>
              <span>{m.progress}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${m.progress}%` }}
                className="h-full bg-brand-primary"
              />
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function AITutor({ profile, level }: { profile: UserProfile, level: CEFRLevel }) {
  const [messages, setMessages] = useState([
    { role: 'model', content: `Hello! I'm your AI English tutor. I've adapted to your ${profile} profile. Want to practice a conversation for level ${level}?` }
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    // In a real app, call geminiService here
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'model', content: "That's a great sentence! You used the correct auxiliary verb for this level. Keep going!" }]);
    }, 800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto h-[600px] flex flex-col rounded-3xl border border-slate-200 overflow-hidden bg-white shadow-xl"
    >
      <div className="bg-brand-primary p-6 text-white flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <MessageCircle size={24} />
        </div>
        <div>
          <h3 className="font-bold">LinguistAI Tutor</h3>
          <p className="text-xs opacity-80">Online & Ready to help</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={cn(
            "max-w-[80%] p-4 rounded-2xl text-sm font-medium leading-relaxed",
            m.role === 'user' 
              ? "bg-brand-primary text-white ml-auto rounded-tr-none" 
              : "bg-slate-100 text-slate-800 rounded-tl-none"
          )}>
            {m.content}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100 flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && send()}
          placeholder="Type your message..."
          className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-brand-primary outline-none"
        />
        <button 
          onClick={send}
          className="bg-brand-primary text-white font-bold px-6 rounded-xl hover:opacity-90 transition-opacity"
        >
          Send
        </button>
      </div>
    </motion.div>
  );
}

function Statistics({ profile }: { profile: UserProfile }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      <div className={cn(
        "p-8 rounded-3xl border",
        profile === 'professionals' ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
      )}>
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <BarChart3 className="text-brand-primary" /> Skill Distribution
        </h3>
        <div className="space-y-6">
          <SkillBar label="Vocabulary" value={75} />
          <SkillBar label="Speaking" value={45} />
          <SkillBar label="Grammar" value={60} />
          <SkillBar label="Listening" value={90} />
        </div>
      </div>

      <div className={cn(
        "p-8 rounded-3xl border flex flex-col items-center justify-center text-center",
        profile === 'professionals' ? "bg-slate-800 border-slate-700" : "bg-brand-primary/5 border-brand-primary/10"
      )}>
        <Trophy size={64} className="text-brand-primary mb-4" />
        <h3 className="text-3xl font-bold mb-2 text-brand-primary">Next Milestone</h3>
        <p className="font-medium opacity-70 mb-6">Complete 3 more lessons to unlock the "Independent Speaker" badge.</p>
        <div className="w-full h-4 bg-slate-100 dark:bg-slate-700 rounded-full max-w-sm mb-4">
          <div className="h-full bg-brand-primary w-[70%] rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
        </div>
        <span className="text-sm font-bold opacity-60">70% towards Level B1</span>
      </div>
    </motion.div>
  );
}

function SkillBar({ label, value }: { label: string, value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-bold">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className="h-full bg-brand-primary"
        />
      </div>
    </div>
  );
}

function PracticeSection({ profile, level }: { profile: UserProfile, level: CEFRLevel }) {
  const [activeView, setActiveView] = useState<'exercises' | 'notes'>('exercises');

  const notes = [
    { title: "Irregular Verbs Cheat Sheet", type: "Grammar", icon: <BookOpen />, date: "May 2026" },
    { title: "Business Email Etiquette", type: "Writing", icon: <BriefcaseBusiness />, date: "May 2026" },
    { title: "Phonetic Symbols Guide", type: "Speaking", icon: <Volume2 />, date: "June 2026" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-brand-primary/5 p-8 rounded-3xl border border-brand-primary/10">
        <div>
          <h2 className="text-3xl font-extrabold flex items-center gap-2">
            <Trophy className="text-brand-primary" /> Practice & Resources
          </h2>
          <p className="opacity-60 font-medium mt-1">Hone your skills and review important concepts.</p>
        </div>
        
        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl shadow-inner border border-slate-100 dark:border-slate-700">
          <button 
            onClick={() => setActiveView('exercises')}
            className={cn(
              "px-6 py-2 rounded-lg font-bold text-sm transition-all",
              activeView === 'exercises' ? "bg-brand-primary text-white shadow-md" : "opacity-60 hover:opacity-100"
            )}
          >
            Practice Exercises
          </button>
          <button 
            onClick={() => setActiveView('notes')}
            className={cn(
              "px-6 py-2 rounded-lg font-bold text-sm transition-all",
              activeView === 'notes' ? "bg-brand-primary text-white shadow-md" : "opacity-60 hover:opacity-100"
            )}
          >
            Study Notes
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'exercises' ? (
          <motion.div 
            key="exercises"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className={cn(
              "p-8 rounded-3xl border flex flex-col items-center justify-center text-center group",
              profile === 'professionals' ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
            )}>
              <div className="w-16 h-16 bg-brand-accent/20 text-brand-accent rounded-full flex items-center justify-center mb-6">
                <RotateCw size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Exam Simulator</h3>
              <p className="opacity-60 mb-6 font-medium">A full-length mock exam tailored for {level} level.</p>
              <button className="bg-brand-accent text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
                Start Exam
              </button>
            </div>

            <div className={cn(
              "p-8 rounded-3xl border flex flex-col items-center justify-center text-center group",
              profile === 'professionals' ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
            )}>
              <div className="w-16 h-16 bg-brand-primary/20 text-brand-primary rounded-full flex items-center justify-center mb-6">
                <Sparkles size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Quick Drill</h3>
              <p className="opacity-60 mb-6 font-medium">10 fast questions on today's topics.</p>
              <button className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
                Start Drill
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="notes"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {notes.map((note, i) => (
              <div 
                key={i}
                className={cn(
                  "p-6 rounded-2xl border flex flex-col gap-4 hover:border-brand-primary transition-all cursor-pointer",
                  profile === 'professionals' ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100 shadow-sm"
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center">
                    {note.icon}
                  </div>
                  <span className="text-xs font-bold opacity-40 uppercase tracking-tighter">{note.date}</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1 leading-tight">{note.title}</h4>
                  <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-500 font-bold">{note.type}</span>
                </div>
                <div className="mt-auto flex items-center gap-2 text-xs font-extrabold text-brand-primary pt-4 uppercase">
                  Download PDF <ArrowRight size={12} />
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function VocabularyModule({ profile, level }: { profile: UserProfile, level: CEFRLevel }) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonth = months[new Date().getMonth()];
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const newWords = await generateVocabulary(level, profile, selectedMonth);
      setWords(newWords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="text-brand-primary" /> Vocabulary Builder
          </h2>
          <p className="opacity-60 font-medium">Master specific terms for your level and goals.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={cn(
                "appearance-none pl-10 pr-8 py-3 rounded-xl border-2 font-bold focus:ring-2 focus:ring-brand-primary outline-none transition-all",
                profile === 'professionals' ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
              )}
            >
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary" size={18} />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={loading}
            className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-primary/20 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <RotateCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
            Generate New Words
          </motion.button>
        </div>
      </div>

      {words.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {words.map((item, idx) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              key={idx}
              className={cn(
                "p-6 rounded-3xl border border-dashed flex flex-col gap-4",
                profile === 'professionals' ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
              )}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-mono text-brand-primary font-bold">{item.phonetic}</span>
                <button 
                  onClick={() => playAudio(item.word)}
                  className="p-2 hover:bg-brand-primary/10 rounded-full text-brand-primary transition-colors"
                >
                  <Volume2 size={20} />
                </button>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold mb-1">{item.word}</h3>
                <p className="text-sm opacity-80 leading-relaxed italic">{item.definition}</p>
              </div>
              <div className="mt-auto p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
                <p className="text-xs font-bold text-brand-primary uppercase mb-1">In a sentence:</p>
                <p className="text-sm font-medium leading-relaxed">"{item.example}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className={cn(
          "h-[400px] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center p-12",
          profile === 'professionals' ? "border-slate-800" : "border-slate-100"
        )}>
          <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-6">
            <BookOpen size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-2">Build your glossary</h3>
          <p className="opacity-50 max-w-sm font-medium">Click the generate button above to get personalized vocabulary words for {selectedMonth}.</p>
        </div>
      )}
    </motion.div>
  );
}
