import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock, Users, Trophy, ArrowRight, CheckCircle2, XCircle,
  Timer, Zap, Crown, Medal, Star, ChevronRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";

// Mock competition data
const MOCK_COMPETITION = {
  id: "comp-1",
  title: "Frontend Mastery Showdown",
  description: "Test your frontend knowledge in this live quiz competition. Answer quickly and accurately to climb the leaderboard!",
  totalQuestions: 5,
  timePerQuestion: 15,
  participants: 128,
  prize: "500 pts + Gold Badge",
};

const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "Which CSS property is used to create a flexible box layout?",
    options: ["display: grid", "display: flex", "display: block", "display: inline"],
    correctIndex: 1,
  },
  {
    id: 2,
    question: "What does the 'useEffect' hook do in React?",
    options: [
      "Manages component state",
      "Creates a new component",
      "Performs side effects after render",
      "Optimizes re-renders",
    ],
    correctIndex: 2,
  },
  {
    id: 3,
    question: "Which HTTP method is idempotent?",
    options: ["POST", "PATCH", "PUT", "All of the above"],
    correctIndex: 2,
  },
  {
    id: 4,
    question: "What is the output of typeof null in JavaScript?",
    options: ['"null"', '"undefined"', '"object"', '"boolean"'],
    correctIndex: 2,
  },
  {
    id: 5,
    question: "Which of these is NOT a valid React hook?",
    options: ["useReducer", "useContext", "useForceUpdate", "useCallback"],
    correctIndex: 2,
  },
];

const MOCK_PARTICIPANTS = [
  { name: "You", avatar: "YO", score: 0, isYou: true },
  { name: "Sarah Chen", avatar: "SC", score: 0, isYou: false },
  { name: "Ahmed Hassan", avatar: "AH", score: 0, isYou: false },
  { name: "Maria Rodriguez", avatar: "MR", score: 0, isYou: false },
  { name: "James Park", avatar: "JP", score: 0, isYou: false },
  { name: "Fatima Al-Sayed", avatar: "FA", score: 0, isYou: false },
  { name: "Liam O'Brien", avatar: "LO", score: 0, isYou: false },
  { name: "Yuki Tanaka", avatar: "YT", score: 0, isYou: false },
];

type Phase = "lobby" | "countdown" | "question" | "reveal" | "results";

const Competition = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("lobby");
  const [currentQ, setCurrentQ] = useState(0);
  const [timer, setTimer] = useState(MOCK_COMPETITION.timePerQuestion);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [countdownVal, setCountdownVal] = useState(3);
  const [participants, setParticipants] = useState(MOCK_PARTICIPANTS);
  const [lobbyCount, setLobbyCount] = useState(87);

  // Simulate lobby participants joining
  useEffect(() => {
    if (phase !== "lobby") return;
    const interval = setInterval(() => {
      setLobbyCount((prev) => Math.min(prev + Math.floor(Math.random() * 3) + 1, MOCK_COMPETITION.participants));
    }, 1500);
    return () => clearInterval(interval);
  }, [phase]);

  // Countdown phase
  useEffect(() => {
    if (phase !== "countdown") return;
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
  }, [phase]);

  // Question timer
  useEffect(() => {
    if (phase !== "question") return;
    setTimer(MOCK_COMPETITION.timePerQuestion);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, currentQ]);

  const handleTimeUp = useCallback(() => {
    if (selectedAnswer === null) {
      setAnswers((prev) => [...prev, null]);
    }
    // Simulate other participants' scores
    setParticipants((prev) =>
      prev.map((p) => ({
        ...p,
        score: p.isYou
          ? p.score
          : p.score + (Math.random() > 0.35 ? Math.floor(Math.random() * 80) + 50 : 0),
      }))
    );
    setPhase("reveal");
  }, [selectedAnswer]);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null || phase !== "question") return;
    setSelectedAnswer(index);
    const isCorrect = index === MOCK_QUESTIONS[currentQ].correctIndex;
    const timeBonus = Math.floor(timer * 7);
    const points = isCorrect ? 100 + timeBonus : 0;
    setScore((prev) => prev + points);
    setAnswers((prev) => [...prev, index]);
    // Update your score in participants
    setParticipants((prev) =>
      prev.map((p) =>
        p.isYou ? { ...p, score: p.score + points } : {
          ...p,
          score: p.score + (Math.random() > 0.35 ? Math.floor(Math.random() * 80) + 50 : 0),
        }
      )
    );
    setTimeout(() => setPhase("reveal"), 800);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= MOCK_QUESTIONS.length) {
      setPhase("results");
    } else {
      setCurrentQ((prev) => prev + 1);
      setSelectedAnswer(null);
      setPhase("question");
    }
  };

  const startCompetition = () => {
    setPhase("countdown");
  };

  const sortedParticipants = [...participants].sort((a, b) => b.score - a.score);
  const yourRank = sortedParticipants.findIndex((p) => p.isYou) + 1;
  const question = MOCK_QUESTIONS[currentQ];
  const timerPercent = (timer / MOCK_COMPETITION.timePerQuestion) * 100;

  return (
    <PageLayout>
      <Navbar />

      <div className="min-h-[80vh] pt-20">
        {/* LOBBY */}
        {phase === "lobby" && (
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-border text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Live Competition
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
                {MOCK_COMPETITION.title}
              </h1>
              <p className="text-muted-foreground text-[15px] max-w-lg mx-auto mb-8">
                {MOCK_COMPETITION.description}
              </p>

              <div className="grid grid-cols-3 gap-px bg-border border border-border max-w-md mx-auto mb-10">
                <div className="bg-background p-4 text-center">
                  <p className="font-mono font-bold text-foreground text-lg">{MOCK_COMPETITION.totalQuestions}</p>
                  <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Questions</p>
                </div>
                <div className="bg-background p-4 text-center">
                  <p className="font-mono font-bold text-foreground text-lg">{MOCK_COMPETITION.timePerQuestion}s</p>
                  <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Per Question</p>
                </div>
                <div className="bg-background p-4 text-center">
                  <p className="font-mono font-bold text-foreground text-lg">{MOCK_COMPETITION.prize}</p>
                  <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Prize</p>
                </div>
              </div>
            </div>

            {/* Waiting room */}
            <div className="border border-border mb-8">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h3 className="text-[14px] font-bold text-foreground">Waiting Room</h3>
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span className="font-mono font-bold text-foreground">{lobbyCount}</span> / {MOCK_COMPETITION.participants}
                </div>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-4">
                  {MOCK_PARTICIPANTS.slice(0, 8).map((p, i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 flex items-center justify-center border text-[11px] font-bold font-mono ${
                        p.isYou
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-accent text-muted-foreground"
                      }`}
                    >
                      {p.avatar}
                    </div>
                  ))}
                  {lobbyCount > 8 && (
                    <div className="w-10 h-10 flex items-center justify-center border border-border text-[10px] font-mono text-muted-foreground">
                      +{lobbyCount - 8}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Waiting for host to start...
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startCompetition}
                className="inline-flex items-center gap-3 px-8 py-3 bg-foreground text-background text-[14px] font-medium hover:bg-foreground/90 transition-colors"
              >
                <Zap className="w-4 h-4" /> Start Competition
              </button>
            </div>
          </div>
        )}

        {/* COUNTDOWN */}
        {phase === "countdown" && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <p className="text-[13px] text-muted-foreground font-mono uppercase tracking-widest mb-6">Get Ready!</p>
              <div className="w-32 h-32 border-2 border-foreground flex items-center justify-center mx-auto mb-6">
                <span className="text-6xl font-bold text-foreground font-mono animate-pulse">{countdownVal}</span>
              </div>
              <p className="text-[14px] text-muted-foreground">
                Question {currentQ + 1} of {MOCK_QUESTIONS.length}
              </p>
            </div>
          </div>
        )}

        {/* QUESTION */}
        {phase === "question" && (
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
            {/* Header bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
                  Q{currentQ + 1}/{MOCK_QUESTIONS.length}
                </span>
                <div className="flex items-center gap-1.5 text-[13px] font-mono">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-bold text-foreground">{score}</span>
                  <span className="text-muted-foreground">pts</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Timer className={`w-4 h-4 ${timer <= 5 ? "text-red-500" : "text-muted-foreground"}`} />
                <span className={`font-mono font-bold text-lg ${timer <= 5 ? "text-red-500" : "text-foreground"}`}>
                  {timer}s
                </span>
              </div>
            </div>

            {/* Timer bar */}
            <div className="w-full h-1 bg-border mb-10">
              <div
                className={`h-full transition-all duration-1000 ease-linear ${
                  timer <= 5 ? "bg-red-500" : timer <= 10 ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${timerPercent}%` }}
              />
            </div>

            {/* Question */}
            <div className="text-center mb-10">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
                {question.question}
              </h2>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.options.map((option, i) => {
                const labels = ["A", "B", "C", "D"];
                const isSelected = selectedAnswer === i;
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={selectedAnswer !== null}
                    className={`p-5 border text-left transition-all flex items-start gap-4 group ${
                      isSelected
                        ? "border-foreground bg-accent"
                        : "border-border hover:border-foreground/40 hover:bg-accent/30"
                    } ${selectedAnswer !== null && !isSelected ? "opacity-50" : ""}`}
                  >
                    <span className={`w-8 h-8 shrink-0 flex items-center justify-center border font-mono font-bold text-[13px] ${
                      isSelected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground group-hover:border-foreground/40"
                    }`}>
                      {labels[i]}
                    </span>
                    <span className={`text-[14px] font-medium pt-1 ${
                      isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    }`}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Participants answering */}
            <div className="mt-8 flex items-center justify-center gap-2 text-[12px] text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span>{Math.floor(lobbyCount * 0.7 + Math.random() * lobbyCount * 0.2)} answering...</span>
            </div>
          </div>
        )}

        {/* REVEAL */}
        {phase === "reveal" && (
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
                Q{currentQ + 1}/{MOCK_QUESTIONS.length} — Results
              </span>
              <div className="flex items-center gap-1.5 text-[13px] font-mono">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-bold text-foreground">{score}</span>
                <span className="text-muted-foreground">pts</span>
              </div>
            </div>

            <SectionDivider />

            <div className="text-center my-8">
              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
                {question.question}
              </h2>
            </div>

            {/* Options with correct/incorrect */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {question.options.map((option, i) => {
                const labels = ["A", "B", "C", "D"];
                const isCorrect = i === question.correctIndex;
                const wasSelected = selectedAnswer === i;
                const wasWrong = wasSelected && !isCorrect;

                return (
                  <div
                    key={i}
                    className={`p-5 border flex items-start gap-4 ${
                      isCorrect
                        ? "border-emerald-500 bg-emerald-500/5"
                        : wasWrong
                        ? "border-red-500 bg-red-500/5"
                        : "border-border opacity-50"
                    }`}
                  >
                    <span className={`w-8 h-8 shrink-0 flex items-center justify-center border font-mono font-bold text-[13px] ${
                      isCorrect
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : wasWrong
                        ? "border-red-500 bg-red-500 text-white"
                        : "border-border text-muted-foreground"
                    }`}>
                      {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : wasWrong ? <XCircle className="w-4 h-4" /> : labels[i]}
                    </span>
                    <span className={`text-[14px] font-medium pt-1 ${
                      isCorrect ? "text-emerald-500" : wasWrong ? "text-red-500" : "text-muted-foreground"
                    }`}>
                      {option}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Result message */}
            <div className="text-center mb-8">
              {selectedAnswer === question.correctIndex ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 border border-emerald-500/30 bg-emerald-500/5 text-emerald-500 text-[14px] font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Correct! +{100 + Math.floor((answers.length > 0 ? timer : 0) * 7)} pts
                </div>
              ) : selectedAnswer === null ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 border border-border text-muted-foreground text-[14px] font-medium">
                  <Clock className="w-4 h-4" /> Time's up! No answer selected
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 border border-red-500/30 bg-red-500/5 text-red-500 text-[14px] font-medium">
                  <XCircle className="w-4 h-4" /> Incorrect! +0 pts
                </div>
              )}
            </div>

            {/* Quick standings */}
            <div className="border border-border mb-8">
              <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-[13px] font-bold text-foreground">Current Standings</h3>
                <span className="text-[11px] font-mono text-muted-foreground">Your rank: #{yourRank}</span>
              </div>
              <div className="divide-y divide-border">
                {sortedParticipants.slice(0, 5).map((p, i) => (
                  <div key={i} className={`px-5 py-3 flex items-center justify-between ${p.isYou ? "bg-accent/50" : ""}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-mono font-bold text-muted-foreground w-6">{i + 1}</span>
                      <div className={`w-7 h-7 flex items-center justify-center border text-[10px] font-bold font-mono ${
                        p.isYou ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground"
                      }`}>
                        {p.avatar}
                      </div>
                      <span className={`text-[13px] font-medium ${p.isYou ? "text-foreground" : "text-muted-foreground"}`}>
                        {p.name} {p.isYou && "(You)"}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[13px] text-foreground">{p.score}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={nextQuestion}
                className="inline-flex items-center gap-3 px-8 py-3 bg-foreground text-background text-[14px] font-medium hover:bg-foreground/90 transition-colors"
              >
                {currentQ + 1 >= MOCK_QUESTIONS.length ? (
                  <>
                    <Trophy className="w-4 h-4" /> See Final Results
                  </>
                ) : (
                  <>
                    Next Question <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {phase === "results" && (
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12">
            <div className="text-center mb-12">
              <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
                Competition Complete!
              </h1>
              <p className="text-muted-foreground text-[15px]">
                {MOCK_COMPETITION.title} — Final Results
              </p>
            </div>

            {/* Your result card */}
            <div className="border-2 border-foreground p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Your Result</p>
                  <p className="text-3xl font-bold text-foreground font-mono">{score} <span className="text-[14px] text-muted-foreground font-normal">points</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Rank</p>
                  <p className="text-3xl font-bold text-foreground font-mono">#{yourRank}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center gap-6 text-[13px] text-muted-foreground">
                <span>
                  <span className="font-mono font-bold text-emerald-500">{answers.filter((a, i) => a === MOCK_QUESTIONS[i].correctIndex).length}</span> / {MOCK_QUESTIONS.length} correct
                </span>
                <span>
                  Accuracy: <span className="font-mono font-bold text-foreground">{Math.round((answers.filter((a, i) => a === MOCK_QUESTIONS[i].correctIndex).length / MOCK_QUESTIONS.length) * 100)}%</span>
                </span>
              </div>
            </div>

            {/* Top 3 podium */}
            <div className="grid grid-cols-3 gap-px bg-border border border-border mb-8">
              {sortedParticipants.slice(0, 3).map((p, i) => {
                const medals = [
                  { icon: Crown, color: "text-amber-500", label: "1st Place" },
                  { icon: Medal, color: "text-zinc-400", label: "2nd Place" },
                  { icon: Medal, color: "text-amber-700", label: "3rd Place" },
                ];
                const m = medals[i];
                return (
                  <div key={i} className={`bg-background p-6 text-center ${p.isYou ? "bg-accent/30" : ""}`}>
                    <m.icon className={`w-8 h-8 ${m.color} mx-auto mb-3`} />
                    <div className={`w-12 h-12 mx-auto flex items-center justify-center border font-mono font-bold text-[14px] mb-3 ${
                      p.isYou ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground bg-accent"
                    }`}>
                      {p.avatar}
                    </div>
                    <p className="text-[14px] font-bold text-foreground mb-1">
                      {p.name} {p.isYou && "🎉"}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono">{m.label}</p>
                    <p className="font-mono font-bold text-foreground text-lg mt-2">{p.score}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">points</p>
                  </div>
                );
              })}
            </div>

            {/* Full leaderboard */}
            <div className="border border-border mb-8">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="text-[14px] font-bold text-foreground">Full Leaderboard</h3>
              </div>
              <div className="divide-y divide-border">
                {sortedParticipants.map((p, i) => (
                  <div key={i} className={`px-5 py-4 flex items-center justify-between ${p.isYou ? "bg-accent/30" : ""}`}>
                    <div className="flex items-center gap-4">
                      <span className={`text-[14px] font-mono font-bold w-8 ${
                        i === 0 ? "text-amber-500" : i === 1 ? "text-zinc-400" : i === 2 ? "text-amber-700" : "text-muted-foreground"
                      }`}>
                        #{i + 1}
                      </span>
                      <div className={`w-9 h-9 flex items-center justify-center border text-[11px] font-bold font-mono ${
                        p.isYou ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground bg-accent"
                      }`}>
                        {p.avatar}
                      </div>
                      <div>
                        <p className={`text-[14px] font-medium ${p.isYou ? "text-foreground" : "text-muted-foreground"}`}>
                          {p.name} {p.isYou && "(You)"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono font-bold text-foreground text-[15px]">{p.score}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => navigate("/challenges")}
                className="inline-flex items-center gap-2 px-6 py-3 border border-border text-[14px] font-medium text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
              >
                Back to Challenges
              </button>
              <button
                onClick={() => navigate("/leaderboard")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-[14px] font-medium hover:bg-foreground/90 transition-colors"
              >
                <Trophy className="w-4 h-4" /> View Leaderboard
              </button>
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
