import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import {
  Trophy as TrophyIcon,
  Users as UsersIcon,
  Timer as TimerIcon,
  ArrowRight as ArrowIcon,
  Zap as ZapIcon,
  CheckCircle2 as CheckIcon,
  XCircle as XIcon,
  Award as AwardIcon,
  Clock as ClockIcon,
  Crown as CrownIcon,
  Medal as MedalIcon,
  Star as StarIcon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";
import { useLanguage } from "@/i18n/LanguageContext";
import { getCompetitionById, hostStartQuestion, hostRevealAnswer, hostNextQuestion, startCompetitionSession } from "@/services/competitions.service";
import { useCompetitionSession } from "@/hooks/useCompetitionSession";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { Tables } from "@/types/database";

type CompetitionType = Tables<"competitions">;

const DEFAULT_QUESTIONS = [
  {
    id: "1",
    question: "Loading competition questions...",
    options: ["...", "...", "...", "..."],
    correct_answer: "0",
    points: 100,
  },
];

const DEFAULT_PARTICIPANTS = [
  { name: "You", avatar: "YO", score: 0, isYou: true },
];

type Phase = "lobby" | "countdown" | "question" | "reveal" | "results";

const Competition = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [competition, setCompetition] = useState<CompetitionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>("lobby");
  const [timeToStart, setTimeToStart] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [countdownVal, setCountdownVal] = useState(3);
  const [participants, setParticipants] = useState(DEFAULT_PARTICIPANTS);
  const [lobbyCount, setLobbyCount] = useState(1);
  const [textAnswer, setTextAnswer] = useState("");
  const [hostState, setHostState] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isJoined, setIsJoined] = useState(false);

  const {
    questions: dbQuestions,
    currentQuestion: dbQuestion,
    currentIndex: dbIndex,
    submission,
    loading: sessionLoading,
    timeLeft,
    completed: isSessionCompleted,
    startSession,
    handleNext,
    setCurrentIndex,
  } = useCompetitionSession(id || "");

  useEffect(() => {
    if (!competition?.scheduled_date || competition.status === 'live') {
        setTimeToStart(null);
        return;
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const sched = new Date(competition.scheduled_date!).getTime();
      const diff = sched - now;

      if (diff <= 0) {
        setTimeToStart("Starting soon...");
        clearInterval(timer);
      } else {
        const hh = Math.floor(diff / (1000 * 60 * 60));
        const mm = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const ss = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeToStart(`${hh > 0 ? `${hh}h ` : ""}${mm}m ${ss}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [competition]);

  useEffect(() => {
    const fetchCompetition = async () => {
      if (!id) return;
      const { data } = await getCompetitionById(id);
      if (data) {
          setCompetition(data);
          // Check if current user is host OR creator
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          setUser(currentUser);
          if (currentUser && (data.host_id === currentUser.id || data.created_by === currentUser.id)) {
              setIsAdmin(true);
          }
      }
      setLoading(false);
    };
    fetchCompetition();

    if (!id) return;
    const channel = supabase
      .channel(`comp_status_${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'competitions',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          const newStatus = payload.new.status;
          setCompetition((prev) => (prev ? { ...prev, status: newStatus } : null));

          if (newStatus === 'live' && phase === 'lobby') {
            toast.info("Competition session is active!");
            startSession().then(() => setPhase('countdown'));
          } else if (newStatus === 'ended') {
            setPhase('results');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, phase, submission, startSession]);

  useEffect(() => {
    if (!id) return;
    
    // Initial Host State
    import("@/services/competitions.service").then(s => {
        s.getCompetitionState(id).then(res => setHostState(res.data));
    });

    const hostChan = supabase
      .channel(`host_state_${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'competition_states',
          filter: `competition_id=eq.${id}`,
        },
        (payload) => {
          setHostState(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(hostChan);
    };
  }, [id]);

  useEffect(() => {
    if (!hostState || loading || !isJoined) return;

    // Sync current question index from host
    if (dbIndex !== hostState.current_question_index) {
        setCurrentIndex(hostState.current_question_index);
        setSelectedAnswer(null); // Reset local selection for new question
    }

    // Sync phase to host state
    if (hostState.status === 'question_live') {
        if (phase !== 'question') setPhase('question');
    } else if (hostState.status === 'answer_revealed') {
        if (phase !== 'reveal') setPhase("reveal");
    } else if (hostState.status === 'results') {
        if (phase !== 'results') setPhase("results");
    } else if (hostState.status === 'waiting') {
        if (phase !== 'lobby') setPhase('lobby');
    }
  }, [hostState, phase, loading, isJoined, dbIndex, setCurrentIndex]);

  useEffect(() => {
    if (loading || !competition) return;

    if (competition.status === 'live' && phase === 'lobby' && !isSessionCompleted && isJoined) {
        const goLive = async () => {
          await startSession();
          // We WAIT for host state for question-specific phases
        }
        goLive();
    }
  }, [competition, loading, phase, isSessionCompleted, startSession, isJoined]);

  useEffect(() => {
    if (isSessionCompleted) setPhase("results");
  }, [isSessionCompleted]);

  useEffect(() => {
    if (phase === "lobby") {
      const interval = setInterval(() => {
        setLobbyCount((prev) => Math.min(prev + Math.floor(Math.random() * 3) + 1, 100));
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Automatic state changes are disabled. Everything is Host-driven.

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null || phase !== "question") return;
    setSelectedAnswer(index);
    const q = hostQuest;
    if (!q) return;
    const isCorrect = index.toString() === q.correct_answer;
    const timeBonus = Math.floor((timeLeft || 0) * 7);
    const points = isCorrect ? (q.points || 100) + timeBonus : 0;
    setScore((prev) => prev + points);
    handleNext(index.toString());
    // We stay in "question" phase locally until hostState changes or we show a local wait
  };

  const handleTextSubmit = () => {
    if (!textAnswer.trim() || phase !== "question") return;
    handleNext(textAnswer);
    setTextAnswer("");
  };

  const nextPhase = () => {
    if (isAdmin) {
       // Admin triggers next via host control
    }
  };

  const currentHostIndex = hostState?.current_question_index || 0;
  const questions = dbQuestions.length > 0 ? dbQuestions : DEFAULT_QUESTIONS;
  const hostQuest = questions[currentHostIndex] || questions[0];
  const timePerQuestion = hostQuest?.time_limit || competition?.time_per_question || 15;
  const timerPercent = ((timeLeft || 0) / timePerQuestion) * 100;
  const sortedParticipants = [...participants].sort((a, b) => b.score - a.score);
  const yourRank = sortedParticipants.findIndex((p) => p.isYou) + 1;
  const question = hostQuest;

  if (loading || sessionLoading) {
    return (
      <PageLayout>
        <Navbar />
        <div className="pt-40 text-center font-mono animate-pulse text-foreground">
          INITIALIZING_COMPETITION_PROTOCOL...
        </div>
        <Footer />
      </PageLayout>
    );
  }

  if (!competition) return <Navigate to="/challenges" replace />;

  return (
    <PageLayout>
      <Navbar />
      <div className="min-h-[80vh] pt-20">
        {phase === "lobby" && (
          <div className="max-w-3xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-border text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-6">
                <span className="relative flex h-2 w-2">
                  <span className={`${competition.status === 'live' ? 'animate-ping' : ''} absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${competition.status === 'live' ? 'bg-emerald-500' : 'bg-muted'}`} />
                </span>
                {competition.status === 'live' ? "Live Session" : "Waitroom"}
              </div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight mb-4">{competition.title}</h1>
              <p className="text-muted-foreground text-[15px] max-w-lg mx-auto mb-8">{competition.description}</p>
              
              <div className="bg-accent/30 rounded-2xl p-8 mb-8 border border-border/50 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                  {competition.status !== 'live' ? (
                     <>
                       <div className="w-16 h-16 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center">
                         <ClockIcon className="w-8 h-8 text-primary/60" />
                       </div>
                       <div className="text-center">
                         <p className="text-[16px] font-bold text-foreground">Waiting for the protocol to begin...</p>
                         {timeToStart && (
                           <p className="text-[24px] font-mono font-bold text-primary mt-2 tabular-nums">
                             Starts in: {timeToStart}
                           </p>
                         )}
                         <p className="text-[13px] text-muted-foreground mt-1">The host will start the competition shortly.</p>
                       </div>
                       
                       {isAdmin && (
                         <button 
                           onClick={async () => {
                             const { error } = await startCompetitionSession(id!);
                             if (error) {
                               toast.error(error);
                             } else {
                               toast.success("Competition started successfully! You are the host.");
                             }
                           }}
                           className="px-8 py-3 bg-foreground text-background font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-foreground/20 uppercase tracking-widest text-[12px] flex items-center gap-2"
                         >
                           <ZapIcon className="w-4 h-4" /> Start Competition Session
                         </button>
                       )}
                     </>
                  ) : (
                    !isJoined ? (
                      <div className="flex flex-col items-center gap-6">
                        <ZapIcon className="w-16 h-16 text-emerald-500 animate-pulse" />
                        <div className="text-center">
                          <p className="text-xl font-bold text-foreground">Competition is LIVE!</p>
                          <p className="text-sm text-muted-foreground mt-2 mb-6">Initialize your session to synchronize with the host.</p>
                          <button 
                            onClick={() => setIsJoined(true)}
                            className="px-10 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-[13px]"
                          >
                            Join Session NOW
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4 py-8">
                         <div className="w-12 h-12 border-4 border-primary/20 border-t-primary animate-spin rounded-full" />
                         <div className="text-center">
                           <p className="text-lg font-bold text-foreground mb-1">{isAdmin ? "Session Host Terminal" : "Connected to Host"}</p>
                           <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground animate-pulse">
                              {isAdmin ? "Use the command bar below to start Question 1" : `Waiting for Host to transmit question ${(currentHostIndex || 0) + 1}...`}
                           </p>
                         </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-px bg-border border border-border max-w-md mx-auto mb-10 text-center">
                <div className="bg-background p-4"><p className="font-bold text-lg">{questions.length}</p><p className="text-[10px] uppercase font-mono text-muted-foreground">Questions</p></div>
                <div className="bg-background p-4"><p className="font-bold text-lg">{timePerQuestion}s</p><p className="text-[10px] uppercase font-mono text-muted-foreground">Time Limit</p></div>
                <div className="bg-background p-4"><p className="font-bold text-lg">{competition.prize || "pts"}</p><p className="text-[10px] uppercase font-mono text-muted-foreground">Prize</p></div>
              </div>
            </div>
            
            <div className="border border-border p-5">
              <h3 className="text-[14px] font-bold mb-4 flex items-center gap-2">
                <UsersIcon className="w-4 h-4" /> Participants Pool ({lobbyCount}/100)
              </h3>
              <div className="flex flex-wrap gap-2">
                {participants.map((p, i) => (
                  <div key={i} className={`w-10 h-10 flex items-center justify-center border text-[11px] font-bold font-mono transition-all duration-500 ${p.isYou ? "bg-foreground text-background scale-110 shadow-lg" : "bg-accent text-muted-foreground opacity-50"}`}>{p.avatar}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {phase === "question" && (
          <div className="max-w-3xl mx-auto px-4 py-8">
             {!hostState || hostState.status !== 'question_live' ? (
                <div className="bg-accent/40 rounded-2xl p-20 border border-border/50 text-center backdrop-blur-sm animate-pulse">
                    <ClockIcon className="w-12 h-12 text-primary/30 mx-auto mb-6" />
                    <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Waiting for host to release question...</p>
                </div>
             ) : (
                <>
                <div className="flex items-center justify-between mb-6 font-mono">
                  <span className="text-[11px] text-muted-foreground uppercase tracking-widest">Q{currentHostIndex + 1}/{questions.length}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-[13px] font-bold"><ZapIcon className="inline w-3.5 h-3.5 text-amber-500 mr-1" />{score} pts</span>
                    <span className={`text-lg font-bold ${(timeLeft || 0) <= 5 ? "text-red-500 animate-pulse" : ""}`}><TimerIcon className="inline w-4 h-4 mr-1" />{timeLeft}s</span>
                  </div>
                </div>
                <div className="w-full h-1 bg-border mb-10 overflow-hidden"><div className={`h-full transition-all duration-1000 linear ${ (timeLeft || 0) <= 5 ? "bg-red-500" : "bg-emerald-500"}`} style={{ width: `${timerPercent}%` }} /></div>
                <h2 className="text-xl sm:text-2xl font-bold text-center mb-10">{question.question}</h2>
                
                {selectedAnswer === null ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(question.options || []).map((opt: string, i: number) => (
                        <button key={i} onClick={() => handleAnswer(i)} className={`p-5 border text-left flex gap-4 transition-all border-border hover:bg-accent/50 hover:border-primary/50`}>
                            <span className="w-8 h-8 flex items-center justify-center border font-bold text-[13px]">{String.fromCharCode(65 + i)}</span>
                            <span className="font-medium pt-1">{opt}</span>
                        </button>
                        ))}
                    </div>
                ) : (
                    <div className="bg-accent/20 rounded-2xl p-16 border border-border/50 text-center backdrop-blur-sm">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ClockIcon className="w-6 h-6 text-primary animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-1">Answer Locked</h3>
                        <p className="text-muted-foreground text-sm uppercase tracking-widest font-mono">Waiting for correct answer reveal...</p>
                    </div>
                )}
                </>
             )}
          </div>
        )}

        {phase === "reveal" && (
          <div className="max-w-3xl mx-auto px-4 py-8 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 ${selectedAnswer?.toString() === question.correct_answer ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
               {selectedAnswer?.toString() === question.correct_answer ? <CheckIcon className="w-10 h-10" /> : <XIcon className="w-10 h-10" />}
            </div>

            <h2 className="text-3xl font-bold mb-4">{selectedAnswer?.toString() === question.correct_answer ? "PRECISION_VERIFIED" : "SYSTEM_MISMATCH"}</h2>
            <p className="text-muted-foreground mb-10 text-lg">
                The correct answer is: <span className="text-foreground font-black underline underline-offset-4 decoration-primary/50">{question.options[parseInt(question.correct_answer)]}</span>
            </p>

            <div className="bg-accent/40 rounded-xl p-8 border border-border/60 max-w-sm mx-auto mb-10">
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Sync Leaderboard Ranking</p>
                <p className="text-3xl font-bold text-primary tabular-nums">#{yourRank} OVERALL</p>
            </div>

            {isAdmin ? (
                <div className="flex flex-col items-center gap-2 py-4">
                   <div className="animate-bounce"><ArrowIcon className="w-5 h-5 text-primary rotate-90" /></div>
                   <p className="font-mono text-[10px] text-primary/60 uppercase">Use host terminal below to proceed</p>
                </div>
            ) : (
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest animate-pulse">Waiting for host to continue protocol...</p>
            )}
          </div>
        )}

        {phase === "results" && (
          <div className="max-w-3xl mx-auto px-4 py-12 text-center">
            <AwardIcon className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-2">MISSION_COMPLETE</h1>
            <p className="text-muted-foreground font-mono mb-10 uppercase tracking-widest text-[11px]">Final metadata synchronized and verified</p>
            
            <div className="grid grid-cols-2 gap-4 mb-12">
              <div className="bg-accent/40 rounded-2xl p-8 border border-border/50 text-center shadow-inner">
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Total Performance</div>
                <div className="text-4xl font-bold text-foreground tabular-nums">{score}</div>
              </div>
              <div className="bg-accent/40 rounded-2xl p-8 border border-border/50 text-center shadow-inner">
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Final Clearance</div>
                <div className="text-4xl font-bold text-primary tabular-nums">#{yourRank}</div>
              </div>
            </div>

            <div className="space-y-3 text-left max-w-md mx-auto mb-16">
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4 px-2">Global Ranking Data</div>
              {sortedParticipants.map((p, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${p.isYou ? 'bg-primary/5 border-primary/40 shadow-xl' : 'bg-background/40 border-border/40'}`}>
                  <div className="flex items-center gap-4">
                    <span className="w-6 text-[11px] font-mono text-muted-foreground">{i + 1}.</span>
                    <span className="text-[14px] font-bold text-foreground">
                        {p.name} 
                        {p.isYou && <span className="text-[10px] text-primary ml-1">(YOU)</span>}
                        {competition?.host_id === user?.id && p.isYou && <span className="text-[10px] text-emerald-500 ml-1">(HOST)</span>}
                    </span>
                  </div>
                  <span className="text-[14px] font-mono font-black text-primary">{p.score}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => navigate("/challenges")}
              className="px-10 py-5 bg-foreground text-background font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto shadow-2xl uppercase tracking-widest text-[13px]"
            >
              Back to OperationsHub
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-black/95 backdrop-blur-md border border-primary/40 p-5 rounded-2xl shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-5">
           <div className="flex flex-col border-r border-border/50 pr-6">
              <span className="text-[10px] font-mono text-primary/70 uppercase tracking-widest mb-1">Session Host</span>
              <span className="text-sm font-bold text-white uppercase tabular-nums tracking-tighter">Quest {currentHostIndex + 1}/{questions.length}</span>
           </div>
           
           <div className="flex items-center gap-3">
             {hostState?.status === 'waiting' && (
               <button 
                onClick={() => hostStartQuestion(id!, currentHostIndex)}
                className="px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-[12px] uppercase shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
               >
                 <ZapIcon className="w-3.5 h-3.5" /> Start Question
               </button>
             )}
             
             {hostState?.status === 'question_live' && (
               <button 
                onClick={() => hostRevealAnswer(id!)}
                className="px-5 py-2.5 bg-amber-500 text-white font-bold rounded-xl text-[12px] uppercase shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
               >
                 <StarIcon className="w-3.5 h-3.5" /> Reveal Answer
               </button>
             )}
             
             {hostState?.status === 'answer_revealed' && (
               <button 
                onClick={() => hostNextQuestion(id!, currentHostIndex + 1, currentHostIndex >= questions.length - 1)}
                className="px-5 py-2.5 bg-blue-500 text-white font-bold rounded-xl text-[12px] uppercase shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
               >
                 <ArrowIcon className="w-3.5 h-3.5" /> Next Question
               </button>
             )}

             {hostState?.status === 'results' && (
               <span className="text-xs font-mono text-muted-foreground uppercase px-4 italic">Session Finished</span>
             )}
           </div>

           <div className="flex items-center gap-2 pl-6 border-l border-border/50 font-mono text-[10px] text-muted-foreground hidden lg:flex">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             ACTIVE_TRANSMISSION
           </div>
        </div>
      )}

      <Footer />
    </PageLayout>
  );
};

export default Competition;
