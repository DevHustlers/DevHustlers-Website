import { useState, useEffect, useCallback } from 'react';
import { 
  getCompetitionQuestions, 
  joinCompetition, 
  submitAnswer, 
  completeSubmission 
} from '@/services/competitions.service';
import { toast } from 'sonner';

export const useCompetitionSession = (competitionId: string) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  const startSession = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Join competition (create submission)
      const { data: sub, error: subErr } = await joinCompetition(competitionId);
      if (subErr) {
        toast.error(subErr);
        if (sub) {
            setSubmission(sub);
            setCompleted(!!sub.completed_at);
        }
        setLoading(false);
        return;
      }
      setSubmission(sub);

      // 2. Fetch questions
      const { data: qData, error: qErr } = await getCompetitionQuestions(competitionId);
      if (qErr) throw new Error(qErr);
      setQuestions(qData || []);

      // 3. Set timer if question has one
      if (qData?.[0]?.time_limit) {
        setTimeLeft(qData[0].time_limit);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [competitionId]);

  const handleNext = useCallback(async (answer: string) => {
    if (!submission || completed) return;

    const currentQuestion = questions[currentIndex];
    
    // Auto-check MCQ
    let isCorrect = undefined;
    let points = 0;
    if (currentQuestion.type === 'mcq') {
      isCorrect = answer === currentQuestion.correct_answer;
      points = isCorrect ? currentQuestion.points : 0;
    }

    // Submit answer
    await submitAnswer({
      submission_id: submission.id,
      question_id: currentQuestion.id,
      answer,
      is_correct: isCorrect,
      points_awarded: points
    });

    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setTimeLeft(questions[nextIdx].time_limit || null);
    } else {
       // Finish
       const totalScore = 0; // In real app, re-fetch or calc locally
       await completeSubmission(submission.id, totalScore);
       setCompleted(true);
       toast.success("Competition completed!");
    }
  }, [submission, questions, currentIndex, completed]);

  // Timer Effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || completed) {
        if (timeLeft === 0 && !completed) {
            toast.warning("Time's up for this question!");
            handleNext(""); // Auto-submit empty
        }
        return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, completed, handleNext]);

  return {
    questions,
    currentQuestion: questions[currentIndex],
    currentIndex,
    submission,
    loading,
    timeLeft,
    completed,
    startSession,
    handleNext
  };
};
