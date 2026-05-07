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
      "min-h-screen transition-colors duration-500 bg-slate-950 text-slate-200",
      profile === 'kids' && "bg-amber-950/20",
      profile === 'professionals' && "bg-slate-950"
    )}>
      {/* Navigation */}
      <nav className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-md px-6 py-4 flex justify-between items-center bg-slate-900/80 border-slate-800"
      )}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
            <GraduationCap size={24} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white">IDINGLES</span>
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
    <div className="min-h-screen bg-slate-950 overflow-x-hidden text-slate-200">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/20 text-brand-primary rounded-full font-bold text-sm mb-6">
              <Sparkles size={16} />
              <span>El mejor sitio para aprender inglés</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tighter leading-[0.9] text-white">
              APRENDE TU IDIOMA PREFERIDO DE FORMA <span className="text-brand-primary">MÁS FÁCIL</span> AQUÍ EN EL SITIO WEB DE <span className="underline decoration-brand-secondary decoration-8 underline-offset-8">IDINGLES</span>
            </h1>
            <p className="text-slate-400 text-xl font-medium max-w-xl leading-relaxed mb-10">
              Personalizamos tu aprendizaje con IA avanzada, desde niños hasta profesionales. Elige tu perfil y comienza hoy mismo.
            </p>
            <div className="flex items-center gap-4">
               <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <img key={i} className="w-10 h-10 rounded-full border-2 border-slate-900" src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                 ))}
               </div>
               <span className="text-sm font-bold text-slate-500">+10k estudiantes ya confían en nosotros</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-brand-primary/10 blur-[120px] rounded-full" />
            <div className="relative rounded-[40px] border-8 border-slate-900 shadow-2xl overflow-hidden aspect-video lg:aspect-auto lg:h-[500px]">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
                className="w-full h-full object-cover brightness-75"
                alt="Students learning together"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center text-white">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">IA Tutor Activo</p>
                    <p className="text-xs text-slate-400">Practica conversación 24/7</p>
                  </div>
                </div>
                <div className="flex gap-1 text-yellow-400">
                  <Trophy size={20} fill="currentColor" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Profile Cards */}
      <section className="bg-slate-900/50 py-24 px-6 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 tracking-tight text-white">Selecciona tu perfil para empezar</h2>
            <p className="text-slate-400 text-lg font-medium">Contenido adaptado a tus necesidades específicas.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProfileCard 
              icon={<Baby className="text-orange-400" size={32} />}
              title="Niños"
              description="Aprendizaje lúdico y visual para edades de 4 a 12 años."
              color="bg-orange-950/20 border-orange-900/30"
              onClick={() => onSelect('kids')}
            />
            <ProfileCard 
              icon={<Users className="text-indigo-400" size={32} />}
              title="Adultos"
              description="Enfoque equilibrado y completo para el día a día."
              color="bg-indigo-950/20 border-indigo-900/30"
              onClick={() => onSelect('adults')}
            />
            <ProfileCard 
              icon={<BriefcaseBusiness className="text-slate-300" size={32} />}
              title="Profesionales"
              description="Centrado en negocios y éxito profesional."
              color="bg-slate-800/40 border-slate-700/30"
              onClick={() => onSelect('professionals')}
            />
          </div>
        </div>
      </section>
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
        "p-8 rounded-3xl border-2 text-left flex flex-col gap-6 transition-shadow hover:shadow-2xl group",
        color
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-2 group-hover:text-brand-primary transition-colors text-white">{title}</h3>
        <p className="text-slate-400 leading-relaxed font-medium">{description}</p>
      </div>
      <div className="mt-auto flex items-center gap-2 font-bold text-sm text-brand-primary">
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
            "p-6 rounded-2xl border transition-all cursor-pointer group hover:shadow-lg bg-slate-900 border-slate-800 active:bg-slate-800 hover:border-slate-700"
          )}
        >
          <div className="flex justify-between items-start mb-4">
            <div className={cn(
              "px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-tight bg-brand-primary/20 text-brand-primary shadow-sm"
            )}>
              {m.type}
            </div>
            <span className="text-xs opacity-50 font-medium text-slate-400">{m.duration}</span>
          </div>
          <h3 className="text-xl font-bold mb-4 group-hover:translate-x-1 transition-transform text-white">{m.title}</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold opacity-60 text-slate-400">
              <span>Progress</span>
              <span>{m.progress}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${m.progress}%` }}
                className="h-full bg-brand-primary shadow-[0_0_8px_rgba(59,130,246,0.4)]"
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
      className="max-w-3xl mx-auto h-[600px] flex flex-col rounded-3xl border border-slate-800 overflow-hidden bg-slate-900 shadow-2xl"
    >
      <div className="bg-brand-primary p-6 text-white flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <MessageCircle size={24} />
        </div>
        <div>
          <h3 className="font-bold">IDINGLES Tutor</h3>
          <p className="text-xs opacity-80">Online & Ready to help</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={cn(
            "max-w-[80%] p-4 rounded-2xl text-sm font-medium leading-relaxed",
            m.role === 'user' 
              ? "bg-brand-primary text-white ml-auto rounded-tr-none shadow-lg shadow-brand-primary/20" 
              : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
          )}>
            {m.content}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800 flex gap-2 bg-slate-900/50">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && send()}
          placeholder="Type your message..."
          className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-brand-primary outline-none transition-all placeholder:text-slate-500"
        />
        <button 
          onClick={send}
          className="bg-brand-primary text-white font-bold px-6 rounded-xl hover:opacity-90 transition-all flex items-center gap-2"
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
        "p-8 rounded-3xl border bg-slate-900 border-slate-800"
      )}>
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
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
        "p-8 rounded-3xl border flex flex-col items-center justify-center text-center bg-slate-900 border-slate-800 shadow-xl"
      )}>
        <Trophy size={64} className="text-brand-primary mb-4 animate-bounce" />
        <h3 className="text-3xl font-bold mb-2 text-brand-primary">Next Milestone</h3>
        <p className="font-medium opacity-70 mb-6 text-slate-400">Complete 3 more lessons to unlock the "Independent Speaker" badge.</p>
        <div className="w-full h-4 bg-slate-800 rounded-full max-w-sm mb-4">
          <div className="h-full bg-brand-primary w-[70%] rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
        </div>
        <span className="text-sm font-bold opacity-60 text-slate-500">70% towards Level B1</span>
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
      <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className="h-full bg-brand-primary shadow-[0_0_8px_rgba(59,130,246,0.4)]"
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-3xl font-extrabold flex items-center gap-2 text-white">
            <Trophy className="text-brand-primary" /> Practice & Resources
          </h2>
          <p className="opacity-60 font-medium mt-1 text-slate-400">Hone your skills and review important concepts.</p>
        </div>
        
        <div className="flex bg-slate-950 p-1 rounded-xl shadow-inner border border-slate-800">
          <button 
            onClick={() => setActiveView('exercises')}
            className={cn(
              "px-6 py-2 rounded-lg font-bold text-sm transition-all",
              activeView === 'exercises' ? "bg-brand-primary text-white shadow-lg" : "text-slate-400 hover:text-white"
            )}
          >
            Practice Exercises
          </button>
          <button 
            onClick={() => setActiveView('notes')}
            className={cn(
              "px-6 py-2 rounded-lg font-bold text-sm transition-all",
              activeView === 'notes' ? "bg-brand-primary text-white shadow-lg" : "text-slate-400 hover:text-white"
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
              "p-8 rounded-3xl border flex flex-col items-center justify-center text-center group bg-slate-900 border-slate-800 hover:border-slate-700 transition-all"
            )}>
              <div className="w-16 h-16 bg-brand-accent/20 text-brand-accent rounded-full flex items-center justify-center mb-6">
                <RotateCw size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">Exam Simulator</h3>
              <p className="opacity-60 mb-6 font-medium text-slate-400">A full-length mock exam tailored for {level} level.</p>
              <button className="bg-brand-accent text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-brand-accent/20">
                Start Exam
              </button>
            </div>

            <div className={cn(
              "p-8 rounded-3xl border flex flex-col items-center justify-center text-center group bg-slate-900 border-slate-800 hover:border-slate-700 transition-all"
            )}>
              <div className="w-16 h-16 bg-brand-primary/20 text-brand-primary rounded-full flex items-center justify-center mb-6">
                <Sparkles size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">Quick Drill</h3>
              <p className="opacity-60 mb-6 font-medium text-slate-400">10 fast questions on today's topics.</p>
              <button className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-brand-primary/20">
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
                  "p-6 rounded-2xl border flex flex-col gap-4 hover:border-brand-primary transition-all cursor-pointer bg-slate-900 border-slate-800 shadow-lg"
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-brand-primary/20 text-brand-primary rounded-xl flex items-center justify-center">
                    {note.icon}
                  </div>
                  <span className="text-xs font-bold opacity-40 uppercase tracking-tighter text-slate-500">{note.date}</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1 leading-tight text-white">{note.title}</h4>
                  <span className="text-xs px-2 py-0.5 bg-slate-800 rounded text-slate-400 font-bold border border-slate-700">{note.type}</span>
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
          <h2 className="text-3xl font-bold flex items-center gap-2 text-white">
            <BookOpen className="text-brand-primary" /> Vocabulary Builder
          </h2>
          <p className="opacity-60 font-medium text-slate-400">Master specific terms for your level and goals.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={cn(
                "appearance-none pl-10 pr-8 py-3 rounded-xl border-2 font-bold focus:ring-2 focus:ring-brand-primary outline-none transition-all",
                "bg-slate-900 border-slate-800 text-white"
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
            className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-primary/40 flex items-center gap-2 disabled:opacity-50 transition-all"
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
                "p-6 rounded-3xl border border-dashed flex flex-col gap-4 bg-slate-900 border-slate-700 hover:border-brand-primary transition-all"
              )}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-mono text-brand-primary font-bold">{item.phonetic}</span>
                <button 
                  onClick={() => playAudio(item.word)}
                  className="p-2 hover:bg-brand-primary/20 rounded-full text-brand-primary transition-colors"
                >
                  <Volume2 size={20} />
                </button>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold mb-1 text-white">{item.word}</h3>
                <p className="text-sm opacity-80 leading-relaxed italic text-slate-400">{item.definition}</p>
              </div>
              <div className="mt-auto p-4 bg-brand-primary/10 rounded-2xl border border-brand-primary/20 shadow-inner">
                <p className="text-xs font-bold text-brand-primary uppercase mb-1">In a sentence:</p>
                <p className="text-sm font-medium leading-relaxed text-slate-200">"{item.example}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className={cn(
          "h-[400px] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center p-12 bg-slate-900/50 border-slate-800"
        )}>
          <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-6 ring-1 ring-brand-primary/20">
            <BookOpen size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-white">Build your glossary</h3>
          <p className="opacity-50 max-w-sm font-medium text-slate-400">Click the generate button above to get personalized vocabulary words for {selectedMonth}.</p>
        </div>
      )}
    </motion.div>
  );
}
