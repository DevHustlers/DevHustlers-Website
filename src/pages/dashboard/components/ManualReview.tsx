import { useState, useEffect } from 'react';
import { getReviewableAnswers, reviewAnswer } from '@/services/competitions.service';
import { Check, X, MessageSquare, User } from 'lucide-react';
import { toast } from 'sonner';

export const ManualReview = () => {
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviewable();
  }, []);

  const fetchReviewable = async () => {
    setLoading(true);
    const { data, error } = await getReviewableAnswers();
    if (!error && data) setAnswers(data);
    setLoading(false);
  };

  const handleReview = async (id: string, isCorrect: boolean, points: number) => {
    const { error } = await reviewAnswer(id, isCorrect, points);
    if (!error) {
       toast.success("Review submitted");
       setAnswers(prev => prev.filter(a => a.id !== id));
    } else {
       toast.error(error);
    }
  };

  if (loading) return <div className="p-8 text-center font-mono">LOADING_ANSWERS_FOR_REVIEW...</div>;
  if (answers.length === 0) return <div className="p-8 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">No pending reviews</div>;

  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
      {answers.map((answer) => (
        <div key={answer.id} className="bg-background border border-border rounded-xl p-4 hover:border-primary/30 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-foreground">
                  {answer.submissions?.profiles?.full_name || answer.submissions?.profiles?.username || "Unknown"}
                </p>
                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                  Submission ID: {answer.submission_id.slice(0, 8)}
                </p>
              </div>
            </div>
            <div className="text-right">
                <span className="text-[10px] font-mono text-primary font-bold border border-primary/30 px-2 py-0.5 rounded">
                    MAX {answer.questions?.points} PTS
                </span>
            </div>
          </div>

          <div className="bg-accent/30 rounded-lg p-3 mb-4">
            <p className="text-[11px] text-muted-foreground font-mono uppercase mb-1">Question:</p>
            <p className="text-[13px] text-foreground font-medium mb-3">{answer.questions?.question}</p>
            <p className="text-[11px] text-muted-foreground font-mono uppercase mb-1">User Answer:</p>
            <div className="bg-background border border-border/50 rounded p-2 text-[13px] font-mono whitespace-pre-wrap">
              {answer.answer}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button 
              onClick={() => handleReview(answer.id, false, 0)}
              className="px-4 py-1.5 bg-red-500/10 text-red-500 text-[12px] font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" /> Reject
            </button>
            <button 
              onClick={() => handleReview(answer.id, true, answer.questions?.points)}
              className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 text-[12px] font-bold rounded-lg hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" /> Accept
            </button>
            <button className="p-1.5 text-muted-foreground hover:bg-accent rounded-lg transition-all" title="Add Feedback">
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
