import { useState, useEffect } from 'react';
import { getReviewableAnswers, reviewAnswer } from '@/services/competitions.service';
import { Check, X, MessageSquare, User, Info, Trophy } from 'lucide-react';
import { toast } from 'sonner';

export const ManualReview = () => {
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [customPoints, setCustomPoints] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchReviewable();
  }, []);

  const fetchReviewable = async () => {
    setLoading(true);
    const { data, error } = await getReviewableAnswers();
    if (!error && data) {
        setAnswers(data);
        const map: Record<string, number> = {};
        data.forEach((a: any) => map[a.id] = a.questions?.points || 100);
        setCustomPoints(map);
    }
    setLoading(false);
  };

  const handleReview = async (id: string, isCorrect: boolean, pointsOverride?: number) => {
    const p = pointsOverride !== undefined ? pointsOverride : (isCorrect ? customPoints[id] : 0);
    const { error } = await reviewAnswer(id, isCorrect, p);
    if (!error) {
       toast.success(`Review completed: ${p} pts awarded.`);
       setAnswers(prev => prev.filter(a => a.id !== id));
    } else {
       toast.error(error);
    }
  };

  if (loading) return (
     <div className="p-20 text-center animate-pulse">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6" />
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-black">Decrypting Submission Queue...</p>
     </div>
  );

  if (answers.length === 0) return (
    <div className="p-20 text-center border-4 border-dashed border-border/40 rounded-[3rem] bg-accent/5">
        <Info className="w-12 h-12 text-muted-foreground/30 mx-auto mb-6" />
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground font-black">Zero pending reviews in match buffer</p>
    </div>
  );

  return (
    <div className="space-y-6 max-h-[85vh] overflow-y-auto pr-4 font-mono">
      {answers.map((answer) => (
        <div key={answer.id} className="bg-background/60 backdrop-blur-xl border-4 border-border rounded-[2.5rem] p-8 hover:border-primary/40 transition-all shadow-xl group/card relative overflow-hidden">
          <div className="flex items-start justify-between mb-8 border-b-2 border-border/40 pb-6">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-foreground text-background flex items-center justify-center font-black text-lg shadow-lg">
                {(answer.submissions?.profiles?.full_name || answer.submissions?.profiles?.username || "P").substring(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="text-[17px] font-black text-foreground tracking-tighter">
                  {answer.submissions?.profiles?.full_name || answer.submissions?.profiles?.username || "DevHustler"}
                </p>
                <div className="flex items-center gap-3 mt-1">
                   <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest border border-border/60 px-2 py-0.5 rounded-md">ID: {answer.id.slice(0, 8)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-4 py-1.5 rounded-full border border-primary/30">
                    Target: {answer.questions?.points} PTS
                </span>
            </div>
          </div>

          <div className="space-y-8 mb-10">
            <div className="relative pl-8 border-l-4 border-primary/20">
               <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.4em] mb-4">Challenge Round Quest:</p>
               <p className="text-[16px] text-foreground font-black leading-relaxed tracking-tight">{answer.questions?.question}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-accent/30 rounded-[2rem] p-6 border-2 border-border/50 relative">
                   <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-2">User Solve Answer:</p>
                   <div className="text-[14px] font-black text-foreground leading-relaxed whitespace-pre-wrap italic">
                      "{answer.answer}"
                   </div>
                </div>

                <div className="bg-emerald-500/5 rounded-[2rem] p-6 border-2 border-emerald-500/20 relative">
                   <p className="text-[9px] text-emerald-600/60 font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-2">Model Target Sequence:</p>
                   <div className="text-[14px] font-black text-foreground leading-relaxed whitespace-pre-wrap">
                      {answer.questions?.model_answer || answer.questions?.correct_answer || "N/A (Subjective Solve)"}
                   </div>
                </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-6 border-t-2 border-border/40">
            <div className="flex items-center gap-4 bg-background border-2 border-border rounded-2xl px-6 py-3 shadow-inner">
               <Trophy className="w-4 h-4 text-amber-500" />
               <span className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-4">Assign Points:</span>
               <input 
                  type="number"
                  value={customPoints[answer.id] ?? 0}
                  onChange={(e) => setCustomPoints(prev => ({ ...prev, [answer.id]: parseInt(e.target.value) || 0 }))}
                  className="w-20 bg-transparent text-center font-black text-lg focus:outline-none focus:text-primary transition-colors"
               />
            </div>

            <div className="flex items-center gap-4">
               <button 
                  onClick={() => handleReview(answer.id, false, 0)}
                  className="px-10 py-4 border-4 border-border text-muted-foreground hover:bg-red-500 hover:text-white hover:border-red-500 rounded-2xl text-[12px] font-black transition-all flex items-center gap-3 uppercase tracking-widest active:scale-95"
               >
                  <X className="w-5 h-5" /> Deny Solve
               </button>
               <button 
                  onClick={() => handleReview(answer.id, true)}
                  className="px-10 py-4 bg-foreground text-background border-b-4 border-background/20 hover:bg-emerald-500 hover:text-white rounded-2xl text-[12px] font-black transition-all flex items-center gap-3 uppercase tracking-widest active:scale-95 shadow-xl"
               >
                  <Check className="w-5 h-5" /> Verify Solve
               </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
