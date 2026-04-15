import { useState, useEffect, useCallback } from 'react';
import { 
  getCompetitionQuestions, 
  joinCompetition, 
  completeSubmission 
} from '@/services/competitions.service';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useCompetitionSession = (competitionId: string) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  // Initialize Session
  useEffect(() => {
    const initSession = async () => {
      if (!competitionId) return;
      setLoading(true);
      try {
        const { data: qData } = await getCompetitionQuestions(competitionId);
        if (qData) setQuestions(qData);

        const { data: sub } = await joinCompetition(competitionId);
        if (sub) {
            setSubmission(sub);
            setCompleted(sub.completed_at !== null);
        }
      } catch (err) {
        console.error("Session init error:", err);
      } finally {
        setLoading(false);
      }
    };
    initSession();
  }, [competitionId]);

  const startSession = useCallback(async (entryType: 'live' | 'practice' = 'live') => {
    if (submission) {
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
      const { data: sub, error: subErr } = await joinCompetition(competitionId, entryType);
      if (subErr) {
        if (sub) {
            setSubmission(sub);
            setCompleted(sub.completed_at !== null);
        } else {
            toast.error(subErr);
        }
        return;
      }
      setSubmission(sub);

      const { data: qData, error: qErr } = await getCompetitionQuestions(competitionId);
      if (qErr) throw new Error(qErr);
      setQuestions(qData || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [competitionId, submission]);

  // Synchronize Timer with Backend Timestamp
  const syncTimer = useCallback((startedAt: string | null, duration: number) => {
    if (!startedAt) {
      setTimeLeft(duration);
      return;
    }

    const start = new Date(startedAt).getTime();
    const now = new Date().getTime();
    const elapsed = Math.floor((now - start) / 1000);
    const remaining = Math.max(0, duration - elapsed);
    
    setTimeLeft(remaining);
  }, []);

  const handleNext = useCallback(async (answer: string) => {
    if (!submission || completed) return;

    const currentQuestion = questions[currentIndex];
    const startTime = Date.now();
    
    // SERVER-SIDE SCORING VIA RPC
    const { data: result, error: rpcErr } = await supabase.rpc('process_answer', {
        p_submission_id: submission.id,
        p_question_id: currentQuestion.id,
        p_answer: answer,
        p_time_left: timeLeft || 0
    });

    if (rpcErr) {
        console.error("RPC Error:", rpcErr);
        toast.error("Match link interrupted. Retrying solve sequence...");
        return;
    }

    // Broadcast score change to others via Presence or Broadcast
    const channel = supabase.channel(`comp_realtime_${competitionId}`);
    channel.send({
      type: 'broadcast',
      event: 'score_update',
      payload: { 
        user_id: submission.user_id, 
        new_score: result.total_score,
        is_correct: result.is_correct
      }
    });

    return result; // Return result for UI animation (XP popup)
  }, [submission, questions, currentIndex, completed, timeLeft, competitionId]);

  // Local tick for smoothness
  useEffect(() => {
    if (timeLeft === null || timeLeft < 0 || completed) return;

    const interval = setInterval(() => {
        setTimeLeft(prev => {
            if (prev === null) return null;
            if (prev <= 0) {
                clearInterval(interval);
                return 0;
            }
            return prev - 1;
        });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, completed]);

  return {
    questions,
    currentQuestion: questions[currentIndex],
    currentIndex,
    submission,
    loading,
    timeLeft,
    completed,
    startSession: (type?: 'live' | 'practice') => startSession(type),
    handleNext,
    setCurrentIndex,
    syncTimer,
    setTimeLeft
  };
};
