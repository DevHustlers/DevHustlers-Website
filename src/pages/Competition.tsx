import { useState, useEffect, useCallback, useMemo } from "react";
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
  ShieldAlert as AlertIcon,
  Edit3 as EditIcon,
  Send as SendIcon,
  Eye as EyeIcon,
  Gamepad2 as PlayIcon,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";
import { useLanguage } from "@/i18n/LanguageContext";
import { 
  getCompetitionById, 
  hostStartQuestion, 
  hostRevealAnswer, 
  hostNextQuestion, 
  startCompetitionSession, 
  hostTriggerQuestion,
  updateHostMode,
  checkIfAllParticipantsSubmitted,
  joinCompetition,
  getArchivedResults,
  getHallOfFame
} from "@/services/competitions.service";
import { useCompetitionSession } from "@/hooks/useCompetitionSession";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import GamifiedTimer from "@/components/GamifiedTimer";
import LiveLeaderboard from "@/components/LiveLeaderboard";
import type { Tables } from "@/types/database";

type CompetitionType = Tables<"competitions">;

const DEFAULT_QUESTIONS = [
  {
    id: "1",
    question: "Preparing match challenges...",
    options: ["...", "...", "...", "..."],
    correct_answer: "0",
    points: 100,
    type: "mcq"
  },
];

type Participant = {
    userId: string;
    name: string;
    avatar: string;
    isHost: boolean;
    isYou: boolean;
    hasSubmitted?: boolean;
    lastPoints?: number;
    score?: number;
};

type Phase = "lobby" | "countdown" | "question" | "reveal" | "results";

const Competition = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [competition, setCompetition] = useState<CompetitionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>("lobby");
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [isFinalSubmission, setIsFinalSubmission] = useState(false);
  const [textValue, setTextValue] = useState("");
  
  const [countdownVal, setCountdownVal] = useState(3);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [hostState, setHostState] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [submissionsStatus, setSubmissionsStatus] = useState<Record<string, boolean>>({});
  const [lastRoundPoints, setLastRoundPoints] = useState<Record<string, number>>({});
  
  const [archiveRankings, setArchiveRankings] = useState<any[]>([]);
  const [hallOfFame, setHallOfFame] = useState<any[]>([]);
  const [showXP, setShowXP] = useState<{ amount: number; isCorrect: boolean } | null>(null);
  const [streak, setStreak] = useState(0);

  const {
    questions: dbQuestions,
    currentIndex: dbIndex,
    submission,
    loading: sessionLoading,
    timeLeft,
    completed: isSessionCompleted,
    startSession,
    handleNext,
    setCurrentIndex,
    syncTimer,
    setTimeLeft
  } = useCompetitionSession(id || "");

  // 1. Initial Data Load
  useEffect(() => {
    const fetchCompetition = async () => {
      if (!id) return;
      const { data } = await getCompetitionById(id);
      if (data) {
          setCompetition(data);
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          setUser(currentUser);
          if (currentUser && (data.host_id === currentUser.id || data.created_by === currentUser.id)) {
              setIsAdmin(true);
          }
      }
      setLoading(false);
    };
    fetchCompetition();
  }, [id]);

  // 2. Real-time Listeners (Global State)
  useEffect(() => {
    if (!id || isPracticeMode) return;
    const channel = supabase
      .channel(`comp_state_sync_${id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'competitions', filter: `id=eq.${id}` }, (p) => {
          setCompetition(prev => prev ? { ...prev, status: p.new.status } : null);
          if (p.new.status === 'ended') fetchFinalResults();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'competition_states', filter: `competition_id=eq.${id}` }, (p) => {
          setHostState(p.new);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id, isPracticeMode]);

  useEffect(() => {
    if (!id || isPracticeMode) return;
    supabase.from('competition_states').select('*').eq('competition_id', id).maybeSingle().then(res => {
        if (res.data) setHostState(res.data);
    });
  }, [id, isPracticeMode]);

  // Real-time Standings Sync
  const fetchStandings = useCallback(() => {
    if (!id) return;
    supabase.from('submissions')
      .select(`
        user_id, 
        score, 
        profiles:user_id (
          full_name, 
          username,
          avatar_url
        )
      `)
      .eq('competition_id', id)
    .then(res => {
        if (res.data) {
            const mapped = res.data.map((s: any) => ({
                id: s.user_id,
                name: s.profiles?.full_name || s.profiles?.username || 'Competitor',
                score: s.score || 0,
                isYou: s.user_id === user?.id
            })).sort((a, b) => b.score - a.score);
            setStandings(mapped);
        }
    });
  }, [id, user]);

  const fetchFinalResults = useCallback(async () => {
     if (!id) return;
     const { data: arch } = await getArchivedResults(id);
     if (arch) {
         setArchiveRankings(arch.map(a => ({
             id: a.user_id,
             name: a.profiles?.full_name || a.profiles?.username || 'Pilot',
             score: a.total_points,
             rank: a.rank,
             isYou: a.user_id === user?.id
         })));
     }
     const { data: hof } = await getHallOfFame(id);
     if (hof) {
         setHallOfFame(hof.map(h => ({
             id: h.user_id,
             name: h.profiles?.full_name || h.profiles?.username || 'Hero',
             score: h.total_points,
             rank: h.rank,
             isYou: h.user_id === user?.id
         })));
     }
  }, [id, user]);

  useEffect(() => {
     if (!id || isPracticeMode) return;
     const subChannel = supabase
       .channel(`standings_sync_${id}`)
       .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'submissions', filter: `competition_id=eq.${id}` }, () => {
           fetchStandings();
       })
       .subscribe();
     return () => { supabase.removeChannel(subChannel); };
  }, [id, isPracticeMode, fetchStandings]);

  // Submission Status Real-time
  useEffect(() => {
     if (!id || !hostState || hostState.status !== 'question_live') return;
     const currentQuestionId = (dbQuestions[hostState.current_question_index] || {}).id;
     if (!currentQuestionId) return;

     const subChannel = supabase
       .channel(`subs_${id}_${currentQuestionId}`)
       .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'answers', filter: `question_id=eq.${currentQuestionId}` }, (p) => {
           setSubmissionsStatus(prev => ({ ...prev, [p.new.submission_id]: true }));
       })
       .subscribe();
     
     supabase.from('answers').select('submission_id').eq('question_id', currentQuestionId).then(res => {
         if (res.data) {
             const map: Record<string, boolean> = {};
             res.data.forEach(a => map[a.submission_id] = true);
             setSubmissionsStatus(map);
         }
     });

     return () => { supabase.removeChannel(subChannel); };
  }, [id, hostState, dbQuestions]);

  // Fetch points from last round (and listen for reviews)
  useEffect(() => {
     if (phase === 'reveal') {
         const currentQuestionId = (dbQuestions[dbIndex] || {}).id;
         if (!currentQuestionId) return;

         const fetchLastRound = async () => {
            const { data } = await supabase.from('answers').select('points_awarded, submissions(user_id)').eq('question_id', currentQuestionId);
            if (data) {
                const map: Record<string, number> = {};
                data.forEach((a: any) => map[a.submissions.user_id] = a.points_awarded || 0);
                setLastRoundPoints(map);
            }
         };

         fetchLastRound();

         // Listen for reviews in real-time (especially for text answers)
         const channel = supabase
           .channel(`last_round_points_${id}_${currentQuestionId}`)
           .on('postgres_changes', { 
               event: 'UPDATE', 
               schema: 'public', 
               table: 'answers', 
               filter: `question_id=eq.${currentQuestionId}` 
           }, () => {
               fetchLastRound();
           })
           .subscribe();

         return () => { supabase.removeChannel(channel); };
     }
  }, [id, phase, dbQuestions, dbIndex]);

  // 3. Presence (Lobby Tracking)
  useEffect(() => {
    if (!id || !user || isPracticeMode) return;
    const channel = supabase.channel(`presence_${id}`, { config: { presence: { key: user.id } } });
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const activeUsers: Participant[] = [];
        Object.values(state).forEach((presences: any) => {
            presences.forEach((p: any) => {
                activeUsers.push({
                    userId: p.id,
                    name: p.name || 'Competitor',
                    avatar: (p.name || 'C').substring(0, 2).toUpperCase(),
                    isHost: p.id === competition?.host_id,
                    isYou: p.id === user.id
                });
            });
        });
        setParticipants(activeUsers.filter((v, i, a) => a.findIndex(t => (t.userId === v.userId)) === i));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const { data: profile } = await supabase.from('profiles').select('full_name, username').eq('id', user.id).single();
          const name = profile?.full_name || profile?.username || 'Pilot';
          await channel.track({ id: user.id, name });
        }
      });
    return () => { channel.unsubscribe(); };
  }, [id, user, competition, isPracticeMode]);

  // 4. Timer Synchronization
  useEffect(() => {
    if (!hostState || hostState.status !== 'question_live' || isPracticeMode) return;
    syncTimer(hostState.question_started_at, hostState.duration);
  }, [hostState?.status, hostState?.current_question_index, hostState?.question_started_at, syncTimer, isPracticeMode]);

  // 5. State Machine Resolution
  useEffect(() => {
    if (loading || !competition || isPracticeMode) return;
    if (competition.status === 'ended') {
        setPhase('results');
        fetchFinalResults();
        return;
    }
    if (competition.status === 'draft' || competition.status === 'scheduled' || (hostState && hostState.status === 'waiting')) {
        setPhase('lobby');
        return;
    }
    if (!hostState) return;

    if (dbIndex !== hostState.current_question_index) {
        setCurrentIndex(hostState.current_question_index);
        setSelectedAnswer(null);
        setIsFinalSubmission(false);
        setTextValue("");
    }

    switch(hostState.status) {
        case 'countdown': setPhase('countdown'); break;
        case 'question_live': setPhase('question'); break;
        case 'answer_revealed': setPhase('reveal'); break;
        case 'results': setPhase('results'); break;
    }
  }, [loading, competition, hostState, dbIndex, setCurrentIndex, isPracticeMode, fetchFinalResults]);

  // 6. Logic Handlers
  useEffect(() => {
    if (phase !== "countdown") return;
    setCountdownVal(3);
    const interval = setInterval(() => {
      setCountdownVal((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (isAdmin && !isPracticeMode) hostTriggerQuestion(id!);
          if (isPracticeMode) setPhase('question');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, isAdmin, id, isPracticeMode]);

  const startMatch = () => {
    if (competition?.status === 'ended') {
      setIsPracticeMode(true);
      setPhase('question');
      startSession('practice');
    } else {
      startSession('live');
    }
  };

  useEffect(() => { if (submission) setIsJoined(true); }, [submission]);

  const handleSelection = (val: string) => {
    if (isFinalSubmission || phase !== "question") return;
    setSelectedAnswer(val);
  };

  const handleSubmitSolve = async () => {
    const finalVal = textValue || selectedAnswer || "NO_ANSWER_GIVEN";
    setIsFinalSubmission(true);
    const result = await handleNext(finalVal);
    
    if (result?.success) {
        if (result.is_correct) {
            setShowXP({ amount: result.points_awarded, isCorrect: true });
            setStreak(prev => prev + 1);
            toast.success("Answer Locked! Verification Pending.");
        } else {
            setShowXP({ amount: 0, isCorrect: false });
            setStreak(0);
            toast.error("Answer Locked.");
        }
        setTimeout(() => setShowXP(null), 3000);
    }
  };

  useEffect(() => {
    if (timeLeft === 0 && !isFinalSubmission && phase === "question" && !isPracticeMode) {
        handleSubmitSolve();
    }
  }, [timeLeft, isFinalSubmission, phase, isPracticeMode]);

  const handlePracticeNext = () => {
      if (dbIndex < questions.length - 1) {
          const next = dbIndex + 1;
          setCurrentIndex(next);
          setSelectedAnswer(null);
          setIsFinalSubmission(false);
          setTextValue("");
          setTimeLeft(questions[next].time_limit || 15);
      } else {
          setPhase('results');
          fetchFinalResults();
      }
  };

  const currentIdx = isPracticeMode ? dbIndex : (hostState?.current_question_index || 0);
  const questions = dbQuestions.length > 0 ? dbQuestions : DEFAULT_QUESTIONS;
  const currentQuest = questions[currentIdx] || questions[0];
  const timePerQuestion = isPracticeMode ? (currentQuest.time_limit || 15) : (hostState?.duration || 15);
  const timerPercent = ((timeLeft || 0) / timePerQuestion) * 100;

  // Standings state
  const [standings, setStandings] = useState<any[]>([]);

  useEffect(() => {
    if (phase === 'reveal' || phase === 'results' || phase === 'question') {
        fetchStandings();
    }
  }, [phase, fetchStandings]);

  const finalScore = archiveRankings.find(a => a.id === user?.id)?.score || submission?.score || 0;
  const finalRank = archiveRankings.find(a => a.id === user?.id)?.rank || standings.findIndex((p) => p.isYou) + 1;

  const sortedParticipants = useMemo(() => {
    return participants.map(p => {
        const foundSub = standings.find(s => s.id === p.userId);
        return {
            ...p,
            hasSubmitted: submissionsStatus[p.userId] || (foundSub && foundSub.score > 0),
            lastPoints: lastRoundPoints[p.userId] || 0
        };
    }).sort((a,b) => (a.isYou ? -1 : b.isYou ? 1 : 0));
  }, [participants, submissionsStatus, standings, lastRoundPoints]);

  if (loading || sessionLoading) {
    return (
      <PageLayout>
        <Navbar />
        <div className="pt-40 text-center font-mono space-y-6">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full mx-auto shadow-[0_0_20px_rgba(var(--primary),0.3)]" 
          />
          <p className="tracking-widest uppercase text-xs text-muted-foreground font-black font-mono animate-pulse">{t("comp.syncing")}</p>
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
      <AnimatePresence mode="wait">
        {phase === "lobby" && (
          <motion.div 
            key="lobby"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl mx-auto px-4 py-16"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-border text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-6 bg-accent/20">
                <span className="relative flex h-2 w-2">
                  <span className={`${competition.status === 'live' ? 'animate-ping' : ''} absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${competition.status === 'live' ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />
                </span>
                {competition.status === 'live' ? t("comp.status.live") : t("comp.status.module")}
              </div>
              <h1 className="text-4xl font-black text-foreground tracking-tight mb-4 tracking-tighter">{competition.title}</h1>
              <p className="text-muted-foreground text-[16px] max-w-lg mx-auto mb-8 leading-relaxed italic">{competition.description}</p>
              
              <div className="bg-accent/40 rounded-[2.5rem] p-10 mb-10 border border-border/80 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col items-center gap-6 relative z-10">
                  {competition.status !== 'live' ? (
                     <>
                       <motion.div 
                         animate={{ rotate: 360 }}
                         transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                         className="w-16 h-16 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center"
                       >
                         <ClockIcon className="w-8 h-8 text-primary/40" />
                       </motion.div>
                       <div className="text-center">
                         <p className="text-[18px] font-black text-foreground uppercase tracking-tight font-mono">
                            {isAdmin ? "Match Authority Online" : "Waiting for Match Encryption"}
                         </p>
                         <p className="text-[13px] text-muted-foreground mt-4 max-w-xs mx-auto leading-relaxed border-t border-border/50 pt-4 font-mono italic">
                            Match Status: **{competition.status.toUpperCase()}**
                            {isAdmin ? " — Select match strategy to begin." : " — Awaiting host authorization signal."}
                         </p>
                       </div>
                       
                       {isAdmin && (
                         <div className="flex flex-col gap-8 w-full max-w-sm mt-6">
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => updateHostMode(id!, true)}
                                    className={`p-6 rounded-2xl border-4 transition-all flex flex-col items-center gap-3 ${hostState?.host_is_playing ? 'border-primary bg-primary/10' : 'border-border bg-background hover:bg-accent/50'}`}
                                >
                                    <PlayIcon className={`w-8 h-8 ${hostState?.host_is_playing ? 'text-primary' : 'text-muted-foreground'}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest font-mono">{t("comp.strategy.player")}</span>
                                </button>
                                <button 
                                    onClick={() => updateHostMode(id!, false)}
                                    className={`p-6 rounded-2xl border-4 transition-all flex flex-col items-center gap-3 ${!hostState?.host_is_playing ? 'border-primary bg-primary/10' : 'border-border bg-background hover:bg-accent/50'}`}
                                >
                                    <EyeIcon className={`w-8 h-8 ${!hostState?.host_is_playing ? 'text-primary' : 'text-muted-foreground'}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest font-mono">{t("comp.strategy.observer")}</span>
                                </button>
                            </div>

                            <button 
                                onClick={async () => {
                                    if (hostState?.host_is_playing) await joinCompetition(id!);
                                    const { error } = await startCompetitionSession(id!);
                                    if (error) toast.error(error);
                                    else toast.success("Match sequence initiated.");
                                }}
                                className="px-14 py-5 bg-foreground text-background font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl uppercase tracking-[0.2em] text-[13px] flex items-center justify-center gap-4 group"
                            >
                                <ZapIcon className="w-5 h-5 group-hover:text-amber-500 transition-colors" /> START CHALLENGE
                            </button>
                         </div>
                       )}
                     </>
                  ) : (
                    !isJoined ? (
                      <div className="flex flex-col items-center gap-8 py-4">
                        <div className="relative">
                            <ZapIcon className="w-20 h-20 text-emerald-500 animate-pulse" />
                            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                        </div>
                         <div className="text-center px-4">
                          <p className="text-2xl font-black text-foreground tracking-tight uppercase font-mono">{t("comp.grid_active")}</p>
                          <p className="text-sm text-muted-foreground mt-4 mb-12 max-w-xs mx-auto italic">{t("comp.grid_desc")}</p>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => startMatch()}
                            className="px-14 py-6 bg-primary text-primary-foreground font-black rounded-2xl transition-all shadow-2xl uppercase tracking-[0.2em] text-[14px] font-mono"
                          >
                            {t("comp.join")}
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-6 py-10">
                         <div className={`w-12 h-12 border-4 border-primary/20 border-t-primary animate-spin rounded-full shadow-[0_0_15px_rgba(var(--primary),0.3)] ${isAdmin && (!hostState || hostState.status === 'waiting') ? 'hidden' : ''}`} />
                         <div className="text-center">
                           <p className="text-xl font-black text-foreground tracking-tighter mb-4">{isAdmin ? "Admin Authorization Verified" : "Match Presence Stable"}</p>
                           <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground animate-pulse font-black px-4 py-2 bg-accent/30 rounded-full border border-border/50">
                              {isAdmin ? "Staging Round Launch Terminal..." : `Preparing Round ${(currentIdx || 0) + 1}...`}
                           </p>

                           {isAdmin && (!hostState || hostState.status === 'waiting') && (
                               <motion.button 
                                   whileHover={{ scale: 1.05 }}
                                   whileTap={{ scale: 0.95 }}
                                   onClick={() => hostStartQuestion(id!, 0, questions[0].time_limit || competition.time_per_question)}
                                   className="mt-12 px-16 py-6 bg-primary text-primary-foreground font-black rounded-2xl transition-all shadow-2xl uppercase tracking-[0.2em] text-[14px] flex items-center gap-5 font-mono"
                               >
                                   <ZapIcon className="w-5 h-5 font-mono" /> LAUNCH ROUND 1
                               </motion.button>
                           )}
                         </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-px bg-border/60 border-2 border-border/80 max-w-md mx-auto mb-16 text-center shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm font-mono">
                <div className="bg-background/90 p-6"><p className="font-black text-2xl tabular-nums">{questions.length}</p><p className="text-[10px] uppercase font-mono text-muted-foreground tracking-widest font-black mt-1">{t("comp.rounds")}</p></div>
                <div className="bg-background/90 p-6"><p className="font-black text-2xl tabular-nums">{timePerQuestion}s</p><p className="text-[10px] uppercase font-mono text-muted-foreground tracking-widest font-black mt-1">{t("comp.countdown")}</p></div>
                <div className="bg-background/90 p-6"><p className="font-black text-2xl tabular-nums">{competition.prize || "pts"}</p><p className="text-[10px] uppercase font-mono text-muted-foreground tracking-widest font-black mt-1">{t("comp.points")}</p></div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "countdown" && (
           <motion.div 
             key="countdown"
             initial={{ opacity: 0, scale: 0.5 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 1.5 }}
             className="max-w-3xl mx-auto flex flex-col items-center justify-center py-40"
           >
              <motion.div 
                key={countdownVal}
                initial={{ opacity: 0, scale: 2 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[180px] font-black text-primary font-mono tabular-nums drop-shadow-[0_0_60px_rgba(var(--primary),0.5)]"
              >
                {countdownVal}
              </motion.div>
              <p className="text-muted-foreground font-mono uppercase tracking-[0.6em] font-black text-sm border-t border-border/50 pt-6 mt-6">{t("comp.starting_solve")}</p>
           </motion.div>
        )}

        {phase === "question" && (
          <motion.div 
            key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-3xl mx-auto px-4 py-8"
          >
             {(!hostState || hostState.status !== 'question_live') && !isPracticeMode ? (
                <div className="bg-accent/40 rounded-[3rem] p-32 border-2 border-border/50 text-center backdrop-blur-xl animate-pulse">
                    <ClockIcon className="w-16 h-16 text-primary/20 mx-auto mb-10" />
                    <p className="text-muted-foreground font-mono uppercase tracking-[0.3em] text-xs font-black">{t("comp.awaiting_ignition")}</p>
                </div>
             ) : (
                <>
                <div className="flex items-center justify-between mb-10 font-mono">
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] text-muted-foreground uppercase tracking-[0.3em] font-black bg-accent/30 px-4 py-1.5 border-2 border-border/50 rounded-lg">{t("comp.round")}_{currentIdx + 1}/{questions.length}</span>
                    {streak > 1 && (
                        <motion.span 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="text-[10px] font-black text-amber-500 flex items-center gap-1.5"
                        >
                            🔥 {t("comp.streak")} x{streak}
                        </motion.span>
                    )}
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[15px] font-black tracking-tighter flex items-center gap-2 font-mono"><ZapIcon className="w-4 h-4 text-primary" />{submission?.score || 0} {t("comp.total_xp")}</span>
                        {showXP && (
                            <motion.span 
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: -20, opacity: 1 }}
                                className={`text-xs font-black ${showXP.isCorrect ? 'text-emerald-500' : 'text-red-500'}`}
                            >
                                {showXP.isCorrect ? `+${showXP.amount} XP ✨` : t("comp.streak_reset") + ' 💀'}
                            </motion.span>
                        )}
                    </div>
                    {!isPracticeMode && (
                        <GamifiedTimer 
                          timeLeft={timeLeft || 0} 
                          totalTime={timePerQuestion} 
                          size={80} 
                          strokeWidth={6} 
                        />
                    )}
                    {isPracticeMode && <span className="text-xl font-black text-primary uppercase tracking-widest font-mono italic">{t("comp.practice_mode")}</span>}
                  </div>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-center mb-12 leading-tight px-4 tracking-tighter font-mono italic">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {currentQuest.question}
                  </motion.span>
                </h2>
                
                {!isFinalSubmission ? (
                    <div className="space-y-10">
                      {currentQuest.type === 'text' ? (
                          <div className="space-y-8 max-w-2xl mx-auto">
                             <div className="relative">
                                <textarea 
                                    value={textValue}
                                    onChange={(e) => setTextValue(e.target.value)}
                                    placeholder={t("comp.input_placeholder")}
                                    className="w-full h-48 bg-background border-4 border-border focus:border-primary rounded-[2rem] p-8 text-xl font-bold transition-all resize-none shadow-xl outline-none font-mono"
                                />
                                <EditIcon className="absolute top-6 right-6 w-8 h-8 text-muted-foreground/30 group-focus-within/ta:text-primary transition-colors" />
                             </div>
                             <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => textValue.trim() && handleSubmitSolve()}
                                className="w-full py-6 bg-foreground text-background font-black rounded-2xl transition-all shadow-2xl flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[15px] disabled:opacity-50 disabled:cursor-not-allowed group/btn font-mono"
                                disabled={!textValue.trim()}
                             >
                                <SendIcon className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" /> {t("comp.lock_solve")}
                             </motion.button>
                          </div>
                      ) : (
                        <div className="space-y-10">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                              {(currentQuest.options || []).map((opt: string, i: number) => (
                              <motion.button 
                                key={i}
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => handleSelection(i.toString())} 
                                className={`p-10 border-4 text-left flex gap-8 transition-all rounded-[2rem] shadow-xl relative overflow-hidden group ${selectedAnswer === i.toString() ? 'border-primary bg-primary/5 ring-4 ring-primary/20' : 'border-border bg-background hover:border-foreground/40'}`}
                              >
                                  <span className={`w-12 h-12 flex items-center justify-center border-4 font-black text-lg rounded-xl transition-all duration-300 ${selectedAnswer === i.toString() ? 'border-primary bg-primary text-white' : 'border-border'}`}>{String.fromCharCode(65 + i)}</span>
                                  <span className="font-black text-xl pt-2 z-10 leading-tight tracking-tight font-mono">{opt}</span>
                                  
                                  {/* Selection Glow */}
                                  {selectedAnswer === i.toString() && (
                                    <motion.div 
                                      layoutId="selection-glow"
                                      className="absolute inset-0 bg-primary/5 animate-pulse"
                                    />
                                  )}
                              </motion.button>
                              ))}
                          </div>
                          
                          <motion.button 
                             whileHover={{ scale: 1.02, backgroundColor: 'var(--primary)', color: 'white' }}
                             whileTap={{ scale: 0.98 }}
                             onClick={() => selectedAnswer !== null && handleSubmitSolve()}
                             className="w-full py-6 bg-foreground text-background font-black rounded-2xl transition-all shadow-2xl flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[15px] disabled:opacity-30 disabled:cursor-not-allowed group translate-y-4 font-mono"
                             disabled={selectedAnswer === null}
                          >
                             PERMANENTLY LOCK SOLVE
                          </motion.button>
                        </div>
                      )}
                    </div>
                ) : (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-foreground text-background rounded-[4rem] p-16 sm:p-20 border-4 border-foreground shadow-3xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 overflow-hidden">
                           <motion.div 
                             animate={{ x: ['-100%', '100%'] }}
                             transition={{ duration: 2, repeat: Infinity }}
                             className="h-full bg-primary w-1/2" 
                           />
                        </div>
                        
                        <div className="mb-12 text-center">
                           <motion.div 
                             animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                             transition={{ duration: 2, repeat: Infinity }}
                             className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border-4 border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                           >
                                <TimerIcon className="w-10 h-10 text-primary" />
                           </motion.div>
                           <h3 className="text-4xl font-black mb-4 tracking-tighter uppercase italic text-white">{t("comp.solve_transmitted")}</h3>
                           <p className="text-primary/60 text-[11px] uppercase tracking-[0.4em] font-mono font-black">
                               {t("comp.uplink_secured")}
                           </p>
                        </div>

                        <div className="bg-background/5 p-8 rounded-[2.5rem] border-2 border-primary/20 text-left max-w-xl mx-auto space-y-5">
                           <p className="text-[10px] font-mono text-primary/40 uppercase tracking-[0.3em] font-black italic text-center border-b border-primary/10 pb-4">{t("comp.matrix_standing")}</p>
                           <div className="px-4">
                              <LiveLeaderboard entries={standings} limit={5} />
                           </div>
                        </div>

                        {isPracticeMode && (
                             <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handlePracticeNext()}
                                className="mt-12 px-15 py-5 bg-primary text-white font-black rounded-2xl transition-all uppercase tracking-widest text-[14px] font-mono shadow-xl border-b-4 border-primary-foreground/20"
                             >
                                {t("comp.activate_next")}
                             </motion.button>
                        )}
                    </motion.div>
                )}

                {!isPracticeMode && (
                  <div className="mt-24 pt-16 border-t-2 border-border/40 font-mono">
                    <p className="text-[13px] font-mono text-muted-foreground uppercase tracking-[0.4em] text-center mb-10 font-black">Round Solve Presence</p>
                    <div className="flex flex-wrap justify-center gap-5">
                       {sortedParticipants.map(p => (
                          <motion.div 
                            layout
                            key={p.userId} 
                            className="relative"
                          >
                             <div className={`w-12 h-12 flex items-center justify-center border-4 text-[11px] font-black font-mono rounded-xl transition-all duration-500 ${p.hasSubmitted ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-background border-border/80 text-muted-foreground opacity-40'}`}>
                                {p.avatar}
                             </div>
                             {p.hasSubmitted && (
                               <motion.div
                                 initial={{ scale: 0 }}
                                 animate={{ scale: 1 }}
                                 className="absolute -top-1.5 -right-1.5"
                               >
                                 <CheckIcon className="w-5 h-5 bg-white text-emerald-600 rounded-full border-2 border-emerald-500 shadow-xl" />
                               </motion.div>
                             )}
                          </motion.div>
                       ))}
                    </div>
                  </div>
                )}
                </>
             )}
          </motion.div>
        )}

        {phase === "reveal" && (
          <motion.div 
            key="reveal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="max-w-3xl mx-auto px-4 py-8 text-center"
          >
            {currentQuest.type === 'mcq' ? (
                <>
                <motion.div 
                  initial={{ rotate: -20, scale: 0.5 }}
                  animate={{ rotate: 0, scale: 1 }}
                  className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-16 shadow-2xl ${selectedAnswer?.toString() === currentQuest.correct_answer ? "bg-emerald-500/10 text-emerald-500 border-4 border-emerald-500/40" : "bg-red-500/10 text-red-500 border-4 border-red-500/40"}`}
                >
                    {selectedAnswer?.toString() === currentQuest.correct_answer ? <CheckIcon className="w-16 h-16" /> : <XIcon className="w-16 h-16" />}
                </motion.div>
                <h2 className="text-6xl font-black mb-10 tracking-tighter italic uppercase">{selectedAnswer?.toString() === currentQuest.correct_answer ? t("comp.solve_verified") : t("comp.solve_denied")}</h2>
                <div className="mb-20">
                    <p className="text-muted-foreground text-sm uppercase font-mono tracking-widest mb-4 font-black">{t("comp.official_answer")}</p>
                    <span className="text-3xl font-black border-4 border-primary px-10 py-4 bg-accent/30 rounded-3xl font-mono inline-block shadow-[0_0_40px_rgba(var(--primary),0.1)]">
                        {currentQuest.options[parseInt(currentQuest.correct_answer)]}
                    </span>
                </div>
                </>
            ) : (
                <div className="py-20 space-y-12">
                    <div className="w-32 h-32 bg-amber-500/10 text-amber-500 border-4 border-amber-500/40 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                        <AlertIcon className="w-16 h-16" />
                    </div>
                    <h2 className="text-6xl font-black tracking-tighter italic uppercase">{t("comp.manual_verification")}</h2>
                    <p className="text-muted-foreground text-2xl font-bold tracking-tight max-w-lg mx-auto leading-relaxed italic">
                        {t("comp.manual_verification_desc")}
                    </p>
                </div>
            )}

            <div className="max-w-xl mx-auto mb-20">
                <div className="bg-foreground text-background px-10 py-3.5 rounded-t-2xl font-black text-[10px] uppercase tracking-[0.4em] font-mono inline-block translate-y-1">
                   LIVE_MATCH_STANDINGS
                </div>
                <div className="bg-background/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border-4 border-border/80 shadow-3xl text-left">
                    <LiveLeaderboard entries={standings.map(s => ({ ...s, lastPoints: lastRoundPoints[s.id] }))} />
                </div>
            </div>

            {isAdmin && (
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="flex flex-col items-center gap-10 py-10"
                >
                   <button 
                      onClick={() => hostNextQuestion(id!, dbIndex + 1, dbIndex >= questions.length - 1)}
                      className="group relative px-16 py-7 bg-primary hover:bg-primary/90 text-white font-black rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(var(--primary),0.3)] uppercase tracking-[0.3em] text-[15px] font-mono border-b-8 border-primary-foreground/30 overflow-hidden"
                   >
                       <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20" />
                       <span className="relative z-10 flex items-center gap-4">
                           NEXT ROUND <ArrowIcon className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                       </span>
                   </button>
                </motion.div>
            )}
          </motion.div>
        )}
        {phase === "results" && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-5xl mx-auto px-4 py-12 text-center"
          >
            <div className="relative inline-block mb-12">
                <AwardIcon className="w-32 h-32 text-primary relative z-10" />
                <div className="absolute inset-0 bg-primary/30 blur-[100px] animate-pulse rounded-full" />
            </div>
            <h1 className="text-7xl font-black mb-8 tracking-tighter uppercase italic">{t("comp.complete")}</h1>
            <p className="text-muted-foreground font-mono mb-20 uppercase tracking-[0.4em] text-[14px] font-black opacity-40 bg-accent/20 py-3 px-8 rounded-full border border-border/50 inline-block">{t("comp.standings_solidified")}</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-24 max-w-4xl mx-auto">
              <div className="bg-accent/30 rounded-[3.5rem] p-16 border-4 border-border relative overflow-hidden group/s">
                <div className="text-[13px] font-mono text-muted-foreground uppercase tracking-[0.3em] mb-4 font-black">{t("comp.archive_score")}</div>
                <div className="text-7xl font-black text-foreground tabular-nums tracking-tighter font-mono">{finalScore}</div>
              </div>
              <div className="bg-foreground text-background rounded-[3.5rem] p-16 border-4 border-foreground relative overflow-hidden group/r">
                <div className="text-[13px] font-mono text-background/60 uppercase tracking-[0.3em] mb-4 font-black border-background/20 pb-4 border-b">{t("comp.archive_rank")}</div>
                <div className="text-7xl font-black text-background tabular-nums tracking-tighter font-mono">#{finalRank || '-'}</div>
              </div>
            </div>

            <div className="flex flex-col gap-10 max-w-2xl mx-auto mb-32">
                <div className="space-y-6 text-left bg-background/60 p-14 rounded-[4rem] border-4 border-border/80 shadow-3xl relative backdrop-blur-md">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-10 py-3 rounded-2xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl flex items-center gap-4 italic whitespace-nowrap">
                       <TrophyIcon className="w-5 h-5 flex-shrink-0" /> {t("comp.hall_of_fame")}
                    </div>
                  <div className="pt-8">
                  {hallOfFame.length > 0 ? (
                    <LiveLeaderboard entries={hallOfFame} limit={5} />
                  ) : (
                     <div className="py-24 text-center opacity-30 animate-pulse space-y-4"><TimerIcon className="w-12 h-12 mx-auto" /><p className="font-mono text-sm uppercase font-black tracking-widest">{t("comp.compiling_archives")}</p></div>
                  )}
                  </div>
                </div>
            </div>

            <button 
              onClick={() => navigate("/challenges")}
              className="px-20 py-10 bg-foreground text-background font-black rounded-[2.5rem] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-8 mx-auto shadow-2xl uppercase tracking-[0.2em] text-[18px] border-b-8 border-background/20 group font-mono"
            >
              {t("comp.command_center")} <ArrowIcon className="w-8 h-8 group-hover:translate-x-4 transition-transform duration-500" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {isAdmin && !isPracticeMode && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-black/95 backdrop-blur-3xl border-4 border-primary/40 p-8 rounded-[3rem] shadow-2xl flex items-center gap-10 animate-in slide-in-from-bottom-20 duration-1000">
           <div className="flex flex-col border-r-2 border-border/20 pr-10 font-mono">
              <span className="text-[10px] font-mono text-primary/70 uppercase tracking-[0.4em] mb-2 font-black italic">{t("comp.authority_module")}</span>
              <span className="text-lg font-black text-white uppercase tabular-nums tracking-tighter">
                 Stage {currentIdx + 1} / {questions.length}
              </span>
           </div>
           
           <div className="flex items-center gap-6">
             {hostState?.status === 'waiting' && (
                <button 
                onClick={() => hostStartQuestion(id!, currentIdx, questions[currentIdx].time_limit || competition.time_per_question)}
                className="px-8 py-4 bg-primary text-primary-foreground font-black rounded-xl text-xs uppercase shadow-xl hover:scale-105 transition-all flex items-center gap-3 border-b-4 border-black/20"
               >
                 <ZapIcon className="w-5 h-5" /> {t("comp.prepare_pulse")}
               </button>
             )}
             
             {hostState?.status === 'countdown' && (
               <div className="px-8 py-4 bg-primary/10 border-2 border-primary/40 rounded-xl flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-primary animate-ping" />
                  <span className="text-[10px] text-primary uppercase font-extrabold tracking-widest">{t("comp.propelling")}</span>
               </div>
             )}

             {hostState?.status === 'question_live' && (
               <button 
                onClick={async () => {
                    const allDone = await checkIfAllParticipantsSubmitted(id!, currentQuest.id);
                    if (!allDone && (timeLeft || 0) > 0) {
                        toast.warning("Challengers still solving. Reveal sequence locked.");
                        return;
                    }
                    hostRevealAnswer(id!);
                }}
                className={`px-8 py-4 font-black rounded-xl text-xs uppercase shadow-xl hover:scale-105 transition-all flex items-center gap-3 border-b-4 ${Object.keys(submissionsStatus).length >= participants.length && participants.length > 0 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}
               >
                 <StarIcon className="w-5 h-5" /> {t("comp.trigger_reveal")}
               </button>
             )}
             
             {hostState?.status === 'answer_revealed' && (
               <button 
                onClick={() => hostNextQuestion(id!, currentIdx + 1, currentIdx >= questions.length - 1)}
                className="px-8 py-4 bg-blue-600 text-white font-black rounded-xl text-xs uppercase shadow-xl hover:scale-105 transition-all flex items-center gap-3 border-b-4 border-black/20"
               >
                 <ArrowIcon className="w-5 h-5" /> {t("comp.next_sequence")}
               </button>
             )}
           </div>

           <div className="flex items-center gap-5 pl-10 border-l-2 border-border/20 text-[10px] text-muted-foreground hidden xl:flex uppercase tracking-[0.2em] font-black italic">
             {t("comp.uplink_stable")}
           </div>
        </div>
      )}

      <Footer />
    </PageLayout>
  );
};

export default Competition;
