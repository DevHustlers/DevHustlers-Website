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
    await handleNext(finalVal);
    if (finalVal !== "NO_ANSWER_GIVEN") {
        toast.success("Solve Locked!");
    } else {
        toast.info("Round Expired. No Solve Input Recorded.");
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
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto shadow-[0_0_20px_rgba(var(--primary),0.3)]" />
          <p className="tracking-widest uppercase text-xs text-muted-foreground font-black font-mono animate-pulse">Syncing Match Uplink Data...</p>
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
          <div className="max-w-3xl mx-auto px-4 py-16 animate-in fade-in duration-1000">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-border text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-6 bg-accent/20">
                <span className="relative flex h-2 w-2">
                  <span className={`${competition.status === 'live' ? 'animate-ping' : ''} absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${competition.status === 'live' ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />
                </span>
                {competition.status === 'live' ? "Live Match" : "Challenge Module"}
              </div>
              <h1 className="text-4xl font-black text-foreground tracking-tight mb-4 tracking-tighter">{competition.title}</h1>
              <p className="text-muted-foreground text-[16px] max-w-lg mx-auto mb-8 leading-relaxed italic">{competition.description}</p>
              
              <div className="bg-accent/40 rounded-[2.5rem] p-10 mb-10 border border-border/80 backdrop-blur-xl shadow-2xl relative">
                <div className="flex flex-col items-center gap-6">
                  {competition.status !== 'live' ? (
                     <>
                       <div className="w-16 h-16 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center animate-[spin_20s_linear_infinite]">
                         <ClockIcon className="w-8 h-8 text-primary/40" />
                       </div>
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
                                    <span className="text-[10px] font-black uppercase tracking-widest font-mono">Enter as Player</span>
                                </button>
                                <button 
                                    onClick={() => updateHostMode(id!, false)}
                                    className={`p-6 rounded-2xl border-4 transition-all flex flex-col items-center gap-3 ${!hostState?.host_is_playing ? 'border-primary bg-primary/10' : 'border-border bg-background hover:bg-accent/50'}`}
                                >
                                    <EyeIcon className={`w-8 h-8 ${!hostState?.host_is_playing ? 'text-primary' : 'text-muted-foreground'}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest font-mono">Observe Only</span>
                                </button>
                            </div>

                            <button 
                                onClick={async () => {
                                    if (hostState?.host_is_playing) await joinCompetition(id!);
                                    const { error } = await startCompetitionSession(id!);
                                    if (error) toast.error(error);
                                    else toast.success("Match sequence initiated.");
                                }}
                                className="px-14 py-5 bg-foreground text-background font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl uppercase tracking-[0.2em] text-[13px] flex items-center justify-center gap-4"
                            >
                                <ZapIcon className="w-5 h-5 animate-pulse" /> START CHALLENGE
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
                          <p className="text-2xl font-black text-foreground tracking-tight uppercase font-mono">Grid is Active!</p>
                          <p className="text-sm text-muted-foreground mt-4 mb-12 max-w-xs mx-auto italic">Match is currently in progress. Enter now to stabilize standings.</p>
                          <button 
                            onClick={() => startMatch()}
                            className="px-14 py-6 bg-primary text-primary-foreground font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl uppercase tracking-[0.2em] text-[14px] font-mono"
                          >
                            JOIN MATCH
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-6 py-10">
                         <div className={`w-12 h-12 ${isAdmin && (!hostState || hostState.status === 'waiting') ? 'hidden' : 'border-4 border-primary/20 border-t-primary animate-spin rounded-full shadow-[0_0_15px_rgba(var(--primary),0.3)]'}`} />
                         <div className="text-center">
                           <p className="text-xl font-black text-foreground tracking-tighter mb-4">{isAdmin ? "Admin Authorization Verified" : "Match Presence Stable"}</p>
                           <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground animate-pulse font-black px-4 py-2 bg-accent/30 rounded-full border border-border/50">
                              {isAdmin ? "Staging Round Launch Terminal..." : `Preparing Round ${(currentIdx || 0) + 1}...`}
                           </p>

                           {isAdmin && (!hostState || hostState.status === 'waiting') && (
                               <button 
                                   onClick={() => hostStartQuestion(id!, 0, questions[0].time_limit || competition.time_per_question)}
                                   className="mt-12 px-16 py-6 bg-primary text-primary-foreground font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl uppercase tracking-[0.2em] text-[14px] flex items-center gap-5 font-mono"
                               >
                                   <ZapIcon className="w-5 h-5 font-mono" /> LAUNCH ROUND 1
                               </button>
                           )}
                         </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-px bg-border/60 border-2 border-border/80 max-w-md mx-auto mb-16 text-center shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm font-mono">
                <div className="bg-background/90 p-6"><p className="font-black text-2xl tabular-nums">{questions.length}</p><p className="text-[10px] uppercase font-mono text-muted-foreground tracking-widest font-black mt-1">Rounds</p></div>
                <div className="bg-background/90 p-6"><p className="font-black text-2xl tabular-nums">{timePerQuestion}s</p><p className="text-[10px] uppercase font-mono text-muted-foreground tracking-widest font-black mt-1">Countdown</p></div>
                <div className="bg-background/90 p-6"><p className="font-black text-2xl tabular-nums">{competition.prize || "pts"}</p><p className="text-[10px] uppercase font-mono text-muted-foreground tracking-widest font-black mt-1">Points</p></div>
              </div>
            </div>
          </div>
        )}

        {phase === "countdown" && (
           <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-40 animate-in fade-in zoom-in-95 duration-500">
              <div className="text-[180px] font-black text-primary font-mono tabular-nums animate-pulse drop-shadow-[0_0_60px_rgba(var(--primary),0.5)]">
                {countdownVal}
              </div>
              <p className="text-muted-foreground font-mono uppercase tracking-[0.6em] font-black text-sm border-t border-border/50 pt-6 mt-6">Starting Round Solve...</p>
           </div>
        )}

        {phase === "question" && (
          <div className="max-w-3xl mx-auto px-4 py-8 animate-in slide-in-from-bottom-10 duration-700">
             {(!hostState || hostState.status !== 'question_live') && !isPracticeMode ? (
                <div className="bg-accent/40 rounded-[3rem] p-32 border-2 border-border/50 text-center backdrop-blur-xl animate-pulse">
                    <ClockIcon className="w-16 h-16 text-primary/20 mx-auto mb-10" />
                    <p className="text-muted-foreground font-mono uppercase tracking-[0.3em] text-xs font-black">Awaiting solve ignition...</p>
                </div>
             ) : (
                <>
                <div className="flex items-center justify-between mb-10 font-mono">
                  <span className="text-[11px] text-muted-foreground uppercase tracking-[0.3em] font-black bg-accent/30 px-4 py-1.5 border-2 border-border/50 rounded-lg">ROUND_{currentIdx + 1}/{questions.length}</span>
                  <div className="flex items-center gap-8">
                    <span className="text-[15px] font-black tracking-tighter flex items-center gap-2 font-mono"><ZapIcon className="w-4 h-4 text-amber-500" />{submission?.score || 0} TOTAL PTS</span>
                    {!isPracticeMode && <span className={`text-2xl font-black tabular-nums transition-colors duration-300 flex items-center gap-2 font-mono ${(timeLeft || 0) <= 5 ? "text-red-500 animate-pulse" : "text-foreground"}`}><TimerIcon className="w-6 h-6 opacity-40 font-mono" />{timeLeft}s</span>}
                    {isPracticeMode && <span className="text-xl font-black text-primary uppercase tracking-widest font-mono italic">Independent Practice</span>}
                  </div>
                </div>
                {!isPracticeMode && <div className="w-full h-2 bg-border/40 mb-16 overflow-hidden rounded-full shadow-inner"><div className={`h-full transition-all duration-1000 linear ${ (timeLeft || 0) <= 5 ? "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.7)]" : "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"}`} style={{ width: `${timerPercent}%` }} /></div>}
                <h2 className="text-3xl sm:text-4xl font-black text-center mb-12 leading-tight px-4 tracking-tighter shadow-sm font-mono">{currentQuest.question}</h2>
                
                {!isFinalSubmission ? (
                    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
                      {currentQuest.type === 'text' ? (
                          <div className="space-y-8 max-w-2xl mx-auto">
                             <div className="relative group/ta">
                                <textarea 
                                    value={textValue}
                                    onChange={(e) => setTextValue(e.target.value)}
                                    placeholder="Input your solve sequence here..."
                                    className="w-full h-48 bg-background border-4 border-border focus:border-primary rounded-[2rem] p-8 text-xl font-bold transition-all resize-none shadow-xl outline-none font-mono"
                                />
                                <EditIcon className="absolute top-6 right-6 w-8 h-8 text-muted-foreground/30 group-focus-within/ta:text-primary transition-colors" />
                             </div>
                             <button 
                                onClick={() => textValue.trim() && handleSubmitSolve()}
                                className="w-full py-6 bg-foreground text-background font-black rounded-2xl hover:bg-primary hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[15px] disabled:opacity-50 disabled:cursor-not-allowed group/btn font-mono"
                                disabled={!textValue.trim()}
                             >
                                <SendIcon className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" /> LOCK SOLVE ANSWER
                             </button>
                          </div>
                      ) : (
                        <div className="space-y-10">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                              {(currentQuest.options || []).map((opt: string, i: number) => (
                              <button 
                                key={i} 
                                onClick={() => handleSelection(i.toString())} 
                                className={`p-10 border-4 text-left flex gap-8 transition-all hover:-translate-y-2 active:scale-[0.96] rounded-[2rem] shadow-xl relative overflow-hidden group ${selectedAnswer === i.toString() ? 'border-primary bg-primary/5 ring-4 ring-primary/20' : 'border-border bg-background hover:border-foreground/40'}`}
                              >
                                  <span className={`w-12 h-12 flex items-center justify-center border-4 font-black text-lg rounded-xl transition-all duration-300 ${selectedAnswer === i.toString() ? 'border-primary bg-primary text-white' : 'border-border'}`}>{String.fromCharCode(65 + i)}</span>
                                  <span className="font-black text-xl pt-2 z-10 leading-tight tracking-tight font-mono">{opt}</span>
                              </button>
                              ))}
                          </div>
                          
                          <button 
                             onClick={() => selectedAnswer !== null && handleSubmitSolve()}
                             className="w-full py-6 bg-foreground text-background font-black rounded-2xl hover:bg-primary hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[15px] disabled:opacity-30 disabled:cursor-not-allowed group translate-y-4 font-mono font-mono"
                             disabled={selectedAnswer === null}
                          >
                             PERMANENTLY LOCK SOLVE
                          </button>
                        </div>
                      )}
                    </div>
                ) : (
                    <div className="bg-foreground text-background rounded-[4rem] p-16 sm:p-24 border-4 border-foreground shadow-3xl animate-in scale-in duration-700 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-primary/20 overflow-hidden">
                           <div className="h-full bg-primary animate-timer-shimmer" style={{ width: '100%' }} />
                        </div>
                        
                        <div className="mb-12">
                           <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border-4 border-primary/20 animate-pulse">
                               <TimerIcon className="w-10 h-10 text-primary" />
                           </div>
                           <h3 className="text-4xl font-black mb-4 tracking-tighter uppercase italic text-white">Solve Transmitted</h3>
                           <p className="text-primary/60 text-[11px] uppercase tracking-[0.4em] font-mono font-black">
                              Uplink Secured. Standings Grid Awaits Verification.
                           </p>
                        </div>

                        <div className="bg-background/5 p-10 rounded-[2.5rem] border-2 border-primary/20 text-left max-w-xl mx-auto space-y-5">
                           <p className="text-[10px] font-mono text-primary/40 uppercase tracking-[0.3em] font-black italic text-center border-b border-primary/10 pb-4">Live Module Standings</p>
                           <div className="max-h-[200px] overflow-y-auto space-y-4 pr-4 custom-scrollbar">
                              {standings.length > 0 ? (
                                standings.slice(0, 5).map((p, i) => (
                                    <div key={i} className={`flex items-center justify-between py-1 ${p.isYou ? 'text-primary' : 'text-white/80'}`}>
                                       <div className="flex items-center gap-4">
                                          <span className="font-mono text-[11px] opacity-30">{i+1}</span>
                                          <span className="font-black tracking-tight text-sm font-mono truncate max-w-[120px]">{p.name}</span>
                                          {p.isYou && <span className="text-[7px] bg-primary text-white px-2 py-0.5 rounded-full uppercase font-black font-mono">YOU</span>}
                                       </div>
                                       <span className="font-black font-mono text-sm tabular-nums">{p.score}</span>
                                    </div>
                                ))
                              ) : (
                                participants.slice(0, 5).map((p, i) => (
                                    <div key={i} className={`flex items-center justify-between py-1 ${p.userId === user?.id ? 'text-primary' : 'text-white/60'}`}>
                                       <div className="flex items-center gap-4">
                                          <span className="font-mono text-[11px] opacity-30">{i+1}</span>
                                          <span className="font-black tracking-tight text-sm font-mono">{p.name}</span>
                                       </div>
                                       <span className="font-black font-mono text-sm">--</span>
                                    </div>
                                ))
                              )}
                           </div>
                        </div>

                        {isPracticeMode && (
                             <button
                                onClick={() => handlePracticeNext()}
                                className="mt-12 px-15 py-5 bg-primary text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-[14px] font-mono shadow-xl border-b-4 border-primary-foreground/20"
                             >
                                ACTIVATE NEXT PULSE
                             </button>
                        )}
                    </div>
                )}

                {!isPracticeMode && (
                  <div className="mt-24 pt-16 border-t-2 border-border/40 font-mono font-mono">
                    <p className="text-[13px] font-mono text-muted-foreground uppercase tracking-[0.4em] text-center mb-10 font-black">Round Solve Presence</p>
                    <div className="flex flex-wrap justify-center gap-5">
                       {sortedParticipants.map(p => (
                          <div key={p.userId} title={p.name} className="relative group">
                             <div className={`w-12 h-12 flex items-center justify-center border-4 text-[11px] font-black font-mono rounded-xl transition-all duration-500 ${p.hasSubmitted ? 'bg-emerald-500 border-emerald-500 text-white animate-in scale-in' : 'bg-background border-border/80 text-muted-foreground opacity-40'}`}>
                                {p.avatar}
                             </div>
                             {p.hasSubmitted && <CheckIcon className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-emerald-600 rounded-full border-2 border-emerald-500 shadow-xl" />}
                          </div>
                       ))}
                    </div>
                  </div>
                )}
                </>
             )}
          </div>
        )}

        {phase === "reveal" && (
          <div className="max-w-3xl mx-auto px-4 py-8 text-center animate-in fade-in zoom-in-95 duration-700">
            {currentQuest.type === 'mcq' ? (
                <>
                <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-16 shadow-2xl ${selectedAnswer?.toString() === currentQuest.correct_answer ? "bg-emerald-500/10 text-emerald-500 border-4 border-emerald-500/40" : "bg-red-500/10 text-red-500 border-4 border-red-500/40"}`}>
                    {selectedAnswer?.toString() === currentQuest.correct_answer ? <CheckIcon className="w-16 h-16" /> : <XIcon className="w-16 h-16" />}
                </div>
                <h2 className="text-6xl font-black mb-10 tracking-tighter italic uppercase">{selectedAnswer?.toString() === currentQuest.correct_answer ? "Solve Verified" : "Solve Denied"}</h2>
                <p className="text-muted-foreground mb-20 text-3xl font-bold tracking-tight">
                    Official Answer: <span className="text-foreground font-black underline underline-offset-[12px] decoration-primary px-6 py-2 bg-accent/30 rounded-2xl font-mono">{currentQuest.options[parseInt(currentQuest.correct_answer)]}</span>
                </p>
                </>
            ) : (
                <div className="py-20 space-y-12 animate-in fade-in slide-in-from-top-4">
                    <div className="w-32 h-32 bg-amber-500/10 text-amber-500 border-4 border-amber-500/40 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                        <AlertIcon className="w-16 h-16" />
                    </div>
                    <h2 className="text-6xl font-black tracking-tighter italic uppercase">Manual Verification Stage</h2>
                    <p className="text-muted-foreground text-2xl font-bold tracking-tight max-w-lg mx-auto leading-relaxed border-x-4 border-border/40 px-8 py-4 italic">
                        Subjective solves are being verified by the match authority. Standings will trigger in real-time.
                    </p>
                </div>
            )}

            <div className="space-y-6 text-left max-w-xl mx-auto mb-20 bg-background/40 dark:bg-accent/5 backdrop-blur-2xl p-8 sm:p-12 rounded-[3.5rem] border-4 border-border/80 dark:border-primary/20 shadow-3xl relative group">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-foreground dark:bg-primary text-background dark:text-white px-10 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl font-mono whitespace-nowrap z-20">
                   LIVE_MATCH_STANDINGS
                </div>
                
                {/* Neon Glow Accents for Dark Mode */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-[3.8rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="pt-4 divide-y divide-border/20 dark:divide-primary/10 max-h-[45vh] overflow-y-auto px-4 pr-6 -mx-4 custom-scrollbar relative z-10">
                    {standings.length > 0 ? standings.map((p, i) => (
                        <div key={i} className={`flex items-center justify-between py-6 group/row hover:bg-primary/5 px-6 -mx-6 transition-all duration-300 rounded-3xl ${p.isYou ? 'bg-primary/10' : ''}`}>
                           <div className="flex items-center gap-6">
                              <div className="w-8 flex justify-center">
                                 {i === 0 ? <CrownIcon className="w-7 h-7 text-amber-500 fill-amber-500/20 animate-bounce" /> : 
                                  i === 1 ? <MedalIcon className="w-6 h-6 text-zinc-400" /> : 
                                  i === 2 ? <MedalIcon className="w-6 h-6 text-amber-800" /> : 
                                  <span className="font-mono text-[14px] font-black text-muted-foreground/40">{i + 1}</span>}
                              </div>
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-widest text-foreground border-2 transition-all duration-500 ${i < 3 ? 'bg-background border-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]' : 'bg-accent/40 border-border group-hover/row:border-primary/40'}`}>
                                 {p.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                <span className={`font-black tracking-tighter text-xl sm:text-2xl flex items-center gap-3 transition-colors ${p.isYou ? 'text-primary' : 'text-foreground group-hover/row:text-primary/80'}`}>
                                    {p.name} 
                                    {p.isYou && <span className="text-[9px] bg-primary text-primary-foreground px-2 py-0.5 rounded-lg uppercase font-black font-mono tracking-widest shadow-lg">YOU</span>}
                                    {i === 0 && <StarIcon className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />}
                                </span>
                              </div>
                           </div>
                           <div className="flex items-center gap-8">
                             {lastRoundPoints[p.id] !== undefined && (
                                <div className="flex flex-col items-end scale-90 sm:scale-100">
                                    <span className={`text-[12px] font-black font-mono px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-in slide-in-from-right-4 duration-500 ${lastRoundPoints[p.id] > 0 ? 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20' : 'text-red-500 bg-red-500/10 border border-red-500/20'}`}>
                                        {lastRoundPoints[p.id] > 0 ? <TrendingUp className="w-3 h-3" /> : ''}
                                        {lastRoundPoints[p.id] > 0 ? '+' : ''}{lastRoundPoints[p.id]}
                                    </span>
                                </div>
                             )}
                             <span className={`font-black font-mono text-2xl sm:text-3xl tabular-nums tracking-tighter w-20 text-right transition-all group-hover/row:scale-110 ${p.isYou ? 'text-primary' : 'text-foreground'}`}>
                                {p.score.toLocaleString()}
                             </span>
                           </div>
                        </div>
                    )) : (
                        <div className="py-20 text-center">
                            <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest animate-pulse">Syncing Leaderboard Matrix...</p>
                        </div>
                    )}
                </div>
            </div>

            {isAdmin ? (
                <div className="flex flex-col items-center gap-10 py-10 animate-in slide-in-from-bottom-5">
                   <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center animate-bounce border-2 border-primary/20">
                        <ArrowIcon className="w-6 h-6 text-primary rotate-90" />
                   </div>
                   <button 
                      onClick={() => hostNextQuestion(id!, dbIndex + 1, dbIndex >= questions.length - 1)}
                      className="group relative px-16 py-6 bg-primary hover:bg-primary/90 text-white font-black rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(var(--primary),0.3)] uppercase tracking-[0.3em] text-[15px] font-mono border-b-8 border-primary-foreground/30 overflow-hidden"
                   >
                       <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                       {dbIndex >= questions.length - 1 ? "FINALIZE_MATCH" : "ACTIVATE_NEXT_PULSE"}
                   </button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-8 py-16 opacity-80 animate-pulse">
                    <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full mb-4 shadow-[0_0_30px_rgba(var(--primary),0.2)]" />
                    <p className="font-mono text-[13px] text-muted-foreground uppercase tracking-[0.4em] font-black italic">Awaiting match authority propulsion signal...</p>
                </div>
            )}
          </div>
        )}

        {phase === "results" && (
          <div className="max-w-5xl mx-auto px-4 py-12 text-center animate-in zoom-in-95 fade-in duration-1000">
            <div className="relative inline-block mb-12">
                <AwardIcon className="w-32 h-32 text-primary relative z-10" />
                <div className="absolute inset-0 bg-primary/30 blur-[100px] animate-pulse rounded-full" />
            </div>
            <h1 className="text-7xl font-black mb-8 tracking-tighter uppercase italic">CHALLENGE COMPLETE</h1>
            <p className="text-muted-foreground font-mono mb-20 uppercase tracking-[0.4em] text-[14px] font-black opacity-40 bg-accent/20 py-3 px-8 rounded-full border border-border/50 inline-block font-mono">Final match standings solidified.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-24 max-w-4xl mx-auto font-mono">
              <div className="bg-accent/30 rounded-[3.5rem] p-16 border-4 border-border relative overflow-hidden group/s">
                <div className="text-[13px] font-mono text-muted-foreground uppercase tracking-[0.3em] mb-4 font-black">Archive Score</div>
                <div className="text-7xl font-black text-foreground tabular-nums tracking-tighter font-mono">{finalScore}</div>
              </div>
              <div className="bg-foreground text-background rounded-[3.5rem] p-16 border-4 border-foreground relative overflow-hidden group/r">
                <div className="text-[13px] font-mono text-background/60 uppercase tracking-[0.3em] mb-4 font-black border-background/20 pb-4 border-b">Archive Rank</div>
                <div className="text-7xl font-black text-background tabular-nums tracking-tighter font-mono">#{finalRank || '-'}</div>
              </div>
            </div>

            <div className="flex flex-col gap-10 max-w-2xl mx-auto mb-32">
                <div className="space-y-6 text-left bg-background/60 p-14 rounded-[4rem] border-4 border-border/80 shadow-3xl relative backdrop-blur-md">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-10 py-3 rounded-2xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl flex items-center gap-4 italic whitespace-nowrap">
                       <TrophyIcon className="w-5 h-5 flex-shrink-0" /> Match Hall of Fame
                    </div>
                  <div className="pt-8">
                  {hallOfFame.length > 0 ? hallOfFame.map((p, i) => (
                    <div key={i} className={`flex items-center justify-between p-8 rounded-3xl border-4 transition-all mb-4 ${p.id === user?.id ? 'bg-primary text-primary-foreground border-primary shadow-2xl scale-[1.05]' : 'bg-background border-border/80 hover:border-primary/40'}`}>
                      <div className="flex items-center gap-8 font-mono">
                        <span className={`text-[15px] font-black w-10 ${p.id === user?.id ? 'text-primary-foreground/40' : 'text-muted-foreground opacity-50'}`}>{i+1 === 1 ? '🥇' : i+1 === 2 ? '🥈' : i+1 === 3 ? '🥉' : i+1}</span>
                        <span className="text-[20px] font-black flex items-center gap-5 tracking-tighter font-mono">
                            {p.name} 
                            {p.id === user?.id && <span className="text-[10px] bg-background text-foreground px-4 py-1.5 rounded-full uppercase font-black tracking-widest text-[10px]">YOU</span>}
                        </span>
                      </div>
                      <span className={`text-2xl font-black font-mono tracking-tighter ${p.id === user?.id ? 'text-primary-foreground' : 'text-primary'}`}>{p.score}</span>
                    </div>
                  )) : (
                     <div className="py-24 text-center opacity-30 animate-pulse space-y-4 font-mono font-mono"><TimerIcon className="w-12 h-12 mx-auto shadow-sm" /><p className="font-mono text-sm uppercase font-black tracking-widest">Compiling match archives...</p></div>
                  )}
                  </div>
                </div>
            </div>

            <button 
              onClick={() => navigate("/challenges")}
              className="px-20 py-10 bg-foreground text-background font-black rounded-[2.5rem] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-8 mx-auto shadow-2xl uppercase tracking-[0.2em] text-[18px] border-b-8 border-background/20 group font-mono"
            >
              COMMAND CENTER
              <ArrowIcon className="w-8 h-8 group-hover:translate-x-4 transition-transform duration-500" />
            </button>
          </div>
        )}
      </div>

      {isAdmin && !isPracticeMode && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-black/98 backdrop-blur-3xl border-4 border-primary/40 p-10 rounded-[3.5rem] shadow-2xl border-t-primary/30 flex items-center gap-14 animate-in slide-in-from-bottom-20 duration-1000">
           <div className="flex flex-col border-r-4 border-border/20 pr-14 font-mono">
              <span className="text-[12px] font-mono text-primary/70 uppercase tracking-[0.4em] mb-3 font-black italic">Match Control Authority</span>
              <span className="text-xl font-black text-white uppercase tabular-nums tracking-tighter flex items-center gap-4">
                 Stage {currentIdx + 1} <span className="opacity-10 text-3xl">/</span> {questions.length}
              </span>
           </div>
           
           <div className="flex items-center gap-8">
             {hostState?.status === 'waiting' && (
               <button 
                onClick={() => hostStartQuestion(id!, currentIdx, questions[currentIdx].time_limit || competition.time_per_question)}
                className="px-10 py-5 bg-primary text-primary-foreground font-black rounded-2xl text-[14px] uppercase shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 border-b-4 border-primary-foreground/20 font-mono"
               >
                 <ZapIcon className="w-6 h-6" /> Prepare Round Pulse
               </button>
             )}
             
             {hostState?.status === 'countdown' && (
               <div className="px-14 py-5 bg-primary/10 border-4 border-primary/40 rounded-3xl flex items-center gap-6 shadow-2xl">
                  <div className="w-5 h-5 rounded-full bg-primary animate-ping" />
                  <span className="text-[12px] font-mono text-primary uppercase font-black tracking-[0.4em]">Propelling Solve Grid...</span>
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
                className={`px-10 py-5 font-black rounded-2xl text-[14px] uppercase shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 border-b-4 font-mono ${Object.keys(submissionsStatus).length >= participants.length && participants.length > 0 ? 'bg-emerald-500 text-white border-white/20' : (Object.keys(submissionsStatus).length > 0 || (timeLeft || 0) === 0 ? 'bg-amber-500 text-white border-white/20' : 'bg-muted border-border text-muted-foreground')}`}
               >
                 <StarIcon className="w-6 h-6" /> TRIGGER OFFICIAL REVEAL
               </button>
             )}
             
             {hostState?.status === 'answer_revealed' && (
               <button 
                onClick={() => hostNextQuestion(id!, currentIdx + 1, currentIdx >= questions.length - 1)}
                className="px-10 py-5 bg-blue-500 text-white font-black rounded-2xl text-[14px] uppercase shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 border-b-4 border-white/20 font-mono"
               >
                 <ArrowIcon className="w-6 h-6" /> PUSH NEXT SEQUENCE
               </button>
             )}

             {hostState?.status === 'results' && (
               <div className="flex items-center gap-6 px-10 py-5 bg-emerald-500/10 rounded-3xl border-4 border-emerald-500/40 font-mono">
                   <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-xl" />
                   <span className="text-[12px] text-emerald-500 uppercase font-black tracking-[0.4em] italic leading-tight">Match Grid Solidified</span>
               </div>
             )}
           </div>

           <div className="flex items-center gap-5 pl-14 border-l-4 border-border/20 font-mono text-[12px] text-muted-foreground hidden xl:flex uppercase tracking-widest font-black leading-tight">
             UPLINK_ENCRYPTED_STABLE
           </div>
        </div>
      )}

      <Footer />
    </PageLayout>
  );
};

export default Competition;
