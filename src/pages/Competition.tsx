import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import {
  Trophy,
  Users,
  Timer,
  ArrowRight,
  Zap,
  CheckCircle2,
  XCircle,
  Award,
  Clock,
  Crown,
  Medal,
  Star,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";
import { useLanguage } from "@/i18n/LanguageContext";
import { getCompetitionById } from "@/services/competitions.service";
import { useCompetitionSession } from "@/hooks/useCompetitionSession";
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
  } = useCompetitionSession(id || "");

  useEffect(() => {
    const fetchCompetition = async () => {
      if (!id) return;
      const { data } = await getCompetitionById(id);
      if (data) setCompetition(data);
      setLoading(false);
    };
    fetchCompetition();
  }, [id]);

  const [phase, setPhase] = useState<Phase>("lobby");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [countdownVal, setCountdownVal] = useState(3);
  const [participants, setParticipants] = useState(DEFAULT_PARTICIPANTS);
  const [lobbyCount, setLobbyCount] = useState(1);

  const questions = dbQuestions.length > 0 ? dbQuestions : DEFAULT_QUESTIONS;
  const timePerQuestion = dbQuestion?.time_limit || competition?.time_per_question || 15;
  const maxParticipants = 100;

  useEffect(() => {
    if (isSessionCompleted) setPhase("results");
  }, [isSessionCompleted]);

  useEffect(() => {
    if (phase === "lobby") {
      const interval = setInterval(() => {
        setLobbyCount((prev) => Math.min(prev + Math.floor(Math.random() * 3) + 1, maxParticipants));
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [phase, maxParticipants]);

  useEffect(() => {
    if (phase === "countdown") {
      setCountdownVal(3);
      const interval = setInterval(() => {
        setCountdownVal((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setPhase("question");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "question" && timeLeft === 0 && !isSessionCompleted) {
        setPhase("reveal");
    }
  }, [phase, timeLeft, isSessionCompleted]);

  const [textAnswer, setTextAnswer] = useState("");

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null || phase !== "question") return;
    setSelectedAnswer(index);
    const q = questions[dbIndex];
    const isCorrect = index.toString() === q.correct_answer;
    const timeBonus = Math.floor((timeLeft || 0) * 7);
    const points = isCorrect ? (q.points || 100) + timeBonus : 0;
    setScore((prev) => prev + points);
    handleNext(index.toString());
    setTimeout(() => setPhase("reveal"), 800);
  };

  const handleTextSubmit = () => {
    if (!textAnswer.trim() || phase !== "question") return;
    setScore((prev) => prev + 0); // No points yet for manual review
    handleNext(textAnswer);
    setTimeout(() => {
        setPhase("reveal");
        setTextAnswer("");
    }, 800);
  };

  const nextPhase = () => {
    if (dbIndex + 1 >= questions.length) {
      setPhase("results");
    } else {
      setSelectedAnswer(null);
      setPhase("question");
    }
  };

  const startComp = async () => {
    await startSession();
    setPhase("countdown");
  };

  const sortedParticipants = [...participants].sort((a, b) => b.score - a.score);
  const yourRank = sortedParticipants.findIndex((p) => p.isYou) + 1;
  const question = questions[dbIndex] || DEFAULT_QUESTIONS[0];
  const timerPercent = ((timeLeft || 0) / timePerQuestion) * 100;

  if (loading || sessionLoading) {
    return (
      <PageLayout>
        <Navbar />
        <div className="pt-40 text-center font-mono animate-pulse">
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
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Live Competition
              </div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight mb-4">{competition.title}</h1>
              <p className="text-muted-foreground text-[15px] max-w-lg mx-auto mb-8">{competition.description}</p>
              <div className="grid grid-cols-3 gap-px bg-border border border-border max-w-md mx-auto mb-10 text-center">
                <div className="bg-background p-4"><p className="font-bold text-lg">{questions.length}</p><p className="text-[10px] uppercase font-mono text-muted-foreground">Questions</p></div>
                <div className="bg-background p-4"><p className="font-bold text-lg">{timePerQuestion}s</p><p className="text-[10px] uppercase font-mono text-muted-foreground">Time Limit</p></div>
                <div className="bg-background p-4"><p className="font-bold text-lg">{competition.prize || "pts"}</p><p className="text-[10px] uppercase font-mono text-muted-foreground">Prize</p></div>
              </div>
            </div>
            <div className="border border-border mb-8 p-5">
              <h3 className="text-[14px] font-bold mb-4">Waiting Room ({lobbyCount}/{maxParticipants})</h3>
              <div className="flex flex-wrap gap-2">
                {participants.map((p, i) => (
                  <div key={i} className={`w-10 h-10 flex items-center justify-center border text-[11px] font-bold font-mono ${p.isYou ? "bg-foreground text-background" : "bg-accent text-muted-foreground"}`}>{p.avatar}</div>
                ))}
              </div>
              <p className="text-[12px] text-muted-foreground mt-4 animate-pulse">Waiting for session to sync...</p>
            </div>
            <div className="text-center">
              <button onClick={startComp} className="px-8 py-3 bg-foreground text-background text-[14px] font-medium hover:bg-foreground/90 transition-all flex items-center gap-2 mx-auto">
                <Zap className="w-4 h-4" /> Start Competition
              </button>
            </div>
          </div>
        )}

        {phase === "countdown" && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center font-mono">
              <p className="text-[13px] text-muted-foreground uppercase tracking-widest mb-6">Get Ready!</p>
              <div className="w-32 h-32 border-2 border-foreground flex items-center justify-center mx-auto mb-6 text-6xl font-bold animate-bounce">{countdownVal}</div>
              <p className="text-muted-foreground">Question {dbIndex + 1} of {questions.length}</p>
            </div>
          </div>
        )}

        {phase === "question" && (
          <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6 font-mono">
              <span className="text-[11px] text-muted-foreground uppercase tracking-widest">Q{dbIndex + 1}/{questions.length}</span>
              <div className="flex items-center gap-4">
                <span className="text-[13px] font-bold"><Zap className="inline w-3.5 h-3.5 text-amber-500 mr-1" />{score} pts</span>
                <span className={`text-lg font-bold ${(timeLeft || 0) <= 5 ? "text-red-500 animate-pulse" : ""}`}><Timer className="inline w-4 h-4 mr-1" />{timeLeft}s</span>
              </div>
            </div>
            <div className="w-full h-1 bg-border mb-10 overflow-hidden"><div className={`h-full transition-all duration-1000 linear ${ (timeLeft || 0) <= 5 ? "bg-red-500" : "bg-emerald-500"}`} style={{ width: `${timerPercent}%` }} /></div>
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-10">{question.question}</h2>
            {/* Options or Text Input */}
            {question.type === "text" ? (
              <div className="space-y-4 animate-in fade-in duration-500">
                <textarea
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full h-40 bg-background border border-border rounded-xl p-4 text-[15px] focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                <button
                  onClick={handleTextSubmit}
                  disabled={!textAnswer.trim()}
                  className="w-full py-4 bg-foreground text-background font-bold rounded-xl hover:bg-foreground/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  Submit Answer <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(question.options || []).map((opt: string, i: number) => (
                  <button key={i} onClick={() => handleAnswer(i)} disabled={selectedAnswer !== null} className={`p-5 border text-left flex gap-4 transition-all ${selectedAnswer === i ? "border-foreground bg-accent" : "border-border hover:bg-accent/50 disabled:opacity-50"}`}>
                    <span className="w-8 h-8 flex items-center justify-center border font-bold text-[13px]">{String.fromCharCode(65 + i)}</span>
                    <span className="font-medium pt-1">{opt}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {phase === "reveal" && (
          <div className="max-w-3xl mx-auto px-4 py-8">
            <h2 className="text-lg font-bold text-center mb-8">{question.question}</h2>
            
            {question.type === "text" ? (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center mb-8 animate-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Manual Review Pending</h3>
                <p className="text-muted-foreground text-[14px] max-w-sm mx-auto">
                  Your answer has been submitted and will be reviewed by our judges soon. Points will be awarded after verification.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {(question.options || []).map((opt: string, i: number) => {
                  const isCorrect = i.toString() === question.correct_answer;
                  const isSelected = selectedAnswer === i;
                  return (
                    <div key={i} className={`p-5 border flex gap-4 ${isCorrect ? "border-emerald-500 bg-emerald-500/5" : isSelected ? "border-red-500 bg-red-500/5 opacity-80" : "border-border opacity-50"}`}>
                      <span className={`w-8 h-8 flex items-center justify-center border font-bold ${isCorrect ? "bg-emerald-500 text-white" : isSelected ? "bg-red-500 text-white" : ""}`}>
                        {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : isSelected ? <XCircle className="w-4 h-4" /> : String.fromCharCode(65 + i)}
                      </span>
                      <span className={isCorrect ? "text-emerald-500 font-bold" : isSelected ? "text-red-500" : ""}>{opt}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="text-center">
              <button onClick={nextPhase} className="px-8 py-3 bg-foreground text-background font-medium hover:bg-foreground/90 transition-all flex items-center gap-2 mx-auto uppercase tracking-wider text-[12px]">
                {dbIndex + 1 >= questions.length ? "Finish Competition" : "Next Question"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {phase === "results" && (
          <div className="max-w-3xl mx-auto px-4 py-12 text-center">
            <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-2">Competition Complete!</h1>
            <p className="text-muted-foreground mb-8">Final Stats for {competition.title}</p>
            <div className="border-2 border-foreground p-8 mb-10 flex justify-around font-mono">
              <div><p className="text-muted-foreground text-[10px] uppercase mb-1">Score</p><p className="text-4xl font-bold">{score}</p></div>
              <div><p className="text-muted-foreground text-[10px] uppercase mb-1">Rank</p><p className="text-4xl font-bold">#{yourRank}</p></div>
            </div>
            <div className="flex justify-center gap-4">
              <button onClick={() => navigate("/challenges")} className="px-8 py-3 border border-border text-muted-foreground hover:text-foreground">Exit</button>
              <button onClick={() => navigate("/leaderboard")} className="px-8 py-3 bg-foreground text-background flex items-center gap-2"><Trophy className="w-4 h-4" /> Leaderboard</button>
            </div>
          </div>
        )}
      </div>
      <SectionDivider />
      <Footer />
    </PageLayout>
  );
};

export default Competition;
