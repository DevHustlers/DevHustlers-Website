import { supabase } from '@/lib/supabase';
import type { Tables, TablesInsert, TablesUpdate, ServiceResponse } from '@/types/database';

export const getCompetitions = async (limit: number = 50): Promise<ServiceResponse<any[]>> => {
  try {
    const { data, error } = await supabase
      .from('competitions')
      .select('*, participants:submissions(count)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    // Map the count from the join result
    const mapped = (data || []).map(c => ({
        ...c,
        participants_count: c.participants?.[0]?.count || 0
    }));

    return { data: mapped, error: null };
  } catch (error: any) {
    console.error('Error in getCompetitions:', error.message);
    return { data: null, error: error.message };
  }
};

export const getCompetitionById = async (id: string): Promise<ServiceResponse<Tables<'competitions'>>> => {
  try {
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getCompetitionById:', error.message);
    return { data: null, error: error.message };
  }
};

export const getLiveCompetitions = async (): Promise<ServiceResponse<Tables<'competitions'>[]>> => {
  try {
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .eq('status', 'live')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getLiveCompetitions:', error.message);
    return { data: null, error: error.message };
  }
};

export const getActiveCompetitions = async (): Promise<ServiceResponse<Tables<'competitions'>[]>> => {
  try {
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .in('status', ['active', 'scheduled', 'live', 'ended'])
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getActiveCompetitions:', error.message);
    return { data: null, error: error.message };
  }
};

export const finalizeCompetitionResults = async (competitionId: string) => {
  try {
    // 1. Fetch all submissions sorted by score
    const { data: subs } = await supabase
      .from('submissions')
      .select('user_id, score')
      .eq('competition_id', competitionId)
      .order('score', { ascending: false });

    if (!subs) return;
    
    // 1.5 ⭐ Finalize all unawarded points in DB
    await supabase.rpc('finalize_competition_points', { p_competition_id: competitionId });

    // 2. Prepare archival data
    const archiveRows = subs.map((s, idx) => ({
      competition_id: competitionId,
      user_id: s.user_id,
      rank: idx + 1,
      total_points: s.score || 0
    }));

    // 3. Insert into archived_results
    await supabase.from('archived_results').insert(archiveRows);

    // 4. Insert top 3 into hall_of_fame
    const top3 = archiveRows.slice(0, 3);
    if (top3.length > 0) {
      await supabase.from('hall_of_fame').insert(top3);
    }

    // 5. Broadcast finalization
    const channel = supabase.channel(`comp_events_${competitionId}`);
    await channel.send({
      type: 'broadcast',
      event: 'competition_ended',
      payload: { competitionId, rankings: archiveRows }
    });

    return { success: true };
  } catch (error) {
    console.error("Finalization error:", error);
    return { error };
  }
};

export const hostNextQuestion = async (competitionId: string, nextIndex: number, isLast: boolean) => {
    if (isLast) {
        // End the entire competition
        await supabase
          .from('competitions')
          .update({ status: 'ended', end_date: new Date().toISOString() })
          .eq('id', competitionId);
        
        await updateCompetitionState(competitionId, { 
            current_question_index: nextIndex, 
            status: 'results' 
        });

        // Finalize results for archive and hall of fame
        return finalizeCompetitionResults(competitionId);
    }

    return updateCompetitionState(competitionId, { 
      current_question_index: nextIndex, 
      status: 'countdown' 
    });
};

export const getArchivedResults = async (competitionId: string) => {
  return supabase.from('archived_results').select('*, profiles:user_id(*)').eq('competition_id', competitionId).order('rank', { ascending: true });
};

export const getHallOfFame = async (competitionId: string) => {
  return supabase.from('hall_of_fame').select('*, profiles:user_id(*)').eq('competition_id', competitionId).order('rank', { ascending: true });
};

import { competitionSchema } from '@/lib/validation/competition.schema';

export const createCompetition = async (
  data: TablesInsert<'competitions'>
): Promise<ServiceResponse<Tables<'competitions'>>> => {
  try {
    const sanitizedData = {
      ...data,
      title: data.title?.trim(),
      description: data.description?.trim(),
    };

    const validation = competitionSchema.safeParse(sanitizedData);
    if (!validation.success) {
      return { data: null, error: validation.error.errors[0].message };
    }

    if (sanitizedData.status === 'live') {
      const { data: liveComps } = await supabase
        .from('competitions')
        .select('id')
        .eq('status', 'live')
        .maybeSingle();

      if (liveComps) {
        return { data: null, error: 'A competition is already live. Only one live competition is allowed at a time.' };
      }
    }

    const { data: result, error } = await supabase
      .from('competitions')
      .insert(sanitizedData)
      .select()
      .single();

    if (error) throw error;

    // Sync questions table if provided in jsonb
    if (sanitizedData.questions && Array.isArray(sanitizedData.questions)) {
      const qRows = sanitizedData.questions.map((q: any, i: number) => ({
        competition_id: result.id,
        question: q.question,
        options: q.options,
        correct_answer: q.correctIndex?.toString(),
        model_answer: q.modelAnswer || q.correctAnswer || q.correctIndex?.toString(),
        type: q.type || 'mcq',
        time_limit: q.timeLimit || result.time_per_question,
        points: q.points || 100,
        order_index: i,
        requires_manual_review: q.type === 'text' || q.requires_manual_review === true
      }));
      await supabase.from('questions').insert(qRows);
    }

    return { data: result, error: null };
  } catch (error: any) {
    console.error('Error in createCompetition:', error.message);
    return { data: null, error: error.message };
  }
};

export const updateCompetition = async (
  id: string,
  data: TablesUpdate<'competitions'>
): Promise<ServiceResponse<Tables<'competitions'>>> => {
  try {
    const sanitizedData = {
      ...data,
      title: data.title?.trim(),
      description: data.description?.trim(),
    };

    const validation = competitionSchema.partial().safeParse(sanitizedData);
    if (!validation.success) {
      return { data: null, error: validation.error.errors[0].message };
    }

    if (sanitizedData.status === 'live') {
      const { data: liveComps } = await supabase
        .from('competitions')
        .select('id')
        .eq('status', 'live')
        .neq('id', id)
        .maybeSingle();

      if (liveComps) {
        return { data: null, error: 'A competition is already live. Only one live competition is allowed at a time.' };
      }
    }

    const { data: result, error } = await supabase
      .from('competitions')
      .update(sanitizedData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Sync questions table if provided
    if (sanitizedData.questions && Array.isArray(sanitizedData.questions)) {
      // Delete old and insert new (simplest sync)
      await supabase.from('questions').delete().eq('competition_id', id);
      const qRows = sanitizedData.questions.map((q: any, i: number) => ({
        competition_id: id,
        question: q.question,
        options: q.options,
        correct_answer: q.correctIndex?.toString(),
        model_answer: q.modelAnswer || q.correctAnswer || q.correctIndex?.toString(),
        type: q.type || 'mcq',
        time_limit: q.timeLimit || result.time_per_question,
        points: q.points || 100,
        order_index: i,
        requires_manual_review: q.type === 'text' || q.requires_manual_review === true
      }));
      await supabase.from('questions').insert(qRows);
    }

    return { data: result, error: null };
  } catch (error: any) {
    console.error('Error in updateCompetition:', error.message);
    return { data: null, error: error.message };
  }
};
export const deleteCompetition = async (id: string): Promise<ServiceResponse<null>> => {
  try {
    const { error } = await supabase.from('competitions').delete().eq('id', id);
    if (error) throw error;
    return { data: null, error: null };
  } catch (error: any) {
    console.error('Error in deleteCompetition:', error.message);
    return { data: null, error: error.message };
  }
};
export const getCompetitionQuestions = async (competitionId: string): Promise<ServiceResponse<any[]>> => {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('competition_id', competitionId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getCompetitionQuestions:', error.message);
    return { data: null, error: error.message };
  }
};

export const startCompetition = async (id: string): Promise<ServiceResponse<any>> => {
  return updateCompetition(id, { 
    status: 'live',
    start_date: new Date().toISOString()
  } as any);
};

export const endCompetition = async (id: string): Promise<ServiceResponse<any>> => {
  return updateCompetition(id, { 
    status: 'ended',
    end_date: new Date().toISOString()
  } as any);
};

export const joinCompetition = async (competitionId: string, entryType: 'live' | 'practice' = 'live'): Promise<ServiceResponse<any>> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // 1. Check for restriction in competition_entries
    const { data: existingEntry } = await supabase
      .from('competition_entries')
      .select('id, entry_type')
      .eq('competition_id', competitionId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingEntry) {
      return { data: null, error: `Unauthorized re-entry terminal. Session access solidified as [${existingEntry.entry_type.toUpperCase()}].` };
    }

    // 2. Check if already joined in submissions (for legacy or fallback)
    const { data: existingSub } = await supabase
      .from('submissions')
      .select('id, completed_at')
      .eq('competition_id', competitionId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingSub) {
      // Create migration entry if missing
      await supabase.from('competition_entries').insert({
        competition_id: competitionId,
        user_id: user.id,
        entry_type: entryType
      });
      return { data: existingSub, error: null };
    }

    // 3. Insert new entry restriction
    const { error: entryErr } = await supabase
      .from('competition_entries')
      .insert({
        competition_id: competitionId,
        user_id: user.id,
        entry_type: entryType
      });
    
    if (entryErr) throw entryErr;

    // 4. Create main submission record
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        competition_id: competitionId,
        user_id: user.id,
        submission_url: 'competition_session',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in joinCompetition:', error.message);
    return { data: null, error: error.message };
  }
};

export const submitAnswer = async (payload: {
  submission_id: string;
  question_id: string;
  answer: string;
  is_correct?: boolean;
  points_awarded?: number;
}): Promise<ServiceResponse<any>> => {
  try {
    const { data, error } = await supabase
      .from('answers')
      .upsert({
        ...payload,
        is_reviewed: payload.is_correct !== undefined
      })
      .select()
      .single();

    if (error) throw error;
    
    // Trigger streak update on submission
    const { data: sub } = await supabase.from('submissions').select('user_id').eq('id', payload.submission_id).single();
    if (sub?.user_id) {
        await supabase.rpc('update_user_streak', { user_id: sub.user_id });
    }

    return { data, error: null };
  } catch (error: any) {
    console.error('Error in submitAnswer:', error.message);
    return { data: null, error: error.message };
  }
};

export const completeSubmission = async (submissionId: string, finalScore?: number): Promise<ServiceResponse<any>> => {
  try {
    const updateData: any = {
      completed_at: new Date().toISOString()
    };
    
    // Only include score if explicitly passed and valid
    if (finalScore !== undefined && finalScore >= 0) {
      updateData.score = finalScore;
    }

    const { data, error } = await supabase
      .from('submissions')
      .update(updateData)
      .eq('id', submissionId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in completeSubmission:', error.message);
    return { data: null, error: error.message };
  }
};

export const getReviewableAnswers = async (): Promise<ServiceResponse<any[]>> => {
  try {
    const { data, error } = await supabase
      .from('answers')
      .select('*, questions(*), submissions(user_id, profiles:user_id(full_name, username))')
      .eq('is_reviewed', false)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { data, error: null };

    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getReviewableAnswers:', error.message);
    return { data: null, error: error.message };
  }
};

export const reviewAnswer = async (
  answerId: string, 
  isCorrect: boolean, 
  points: number, 
  feedback?: string
): Promise<ServiceResponse<any>> => {
  try {
    // 1. Update the answer
    const { data: answer, error: answerErr } = await supabase
      .from('answers')
      .update({
        is_correct: isCorrect,
        points_awarded: points,
        feedback,
        is_reviewed: true
      })
      .eq('id', answerId)
      .select('submission_id')
      .single();

    if (answerErr) throw answerErr;

    // 2. Recalculate submission score
    const { data: allAnswers } = await supabase
      .from('answers')
      .select('points_awarded')
      .eq('submission_id', answer?.submission_id);

    const newTotal = (allAnswers || []).reduce((sum, a) => sum + (a.points_awarded || 0), 0);

    await supabase
      .from('submissions')
      .update({ score: newTotal })
      .eq('id', answer?.submission_id);

    return { data: answer, error: null };
  } catch (error: any) {
    console.error('Error in reviewAnswer:', error.message);
    return { data: null, error: error.message };
  }
};

export const getCompetitionState = async (competitionId: string): Promise<ServiceResponse<any>> => {
  try {
    const { data, error } = await supabase
      .from('competition_states')
      .select('*')
      .eq('competition_id', competitionId)
      .maybeSingle();
    
    if (!data && !error) {
       const { data: newData, error: createErr } = await supabase
         .from('competition_states')
         .insert({ competition_id: competitionId, status: 'waiting', current_question_index: 0 })
         .select()
         .single();
       if (createErr) throw createErr;
       return { data: newData, error: null };
    }

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getCompetitionState:', error.message);
    return { data: null, error: error.message };
  }
};

export const updateCompetitionState = async (competitionId: string, updates: any): Promise<ServiceResponse<any>> => {
  try {
    const { data, error } = await supabase
      .from('competition_states')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('competition_id', competitionId)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in updateCompetitionState:', error.message);
    return { data: null, error: error.message };
  }
};

export const hostStartQuestion = async (competitionId: string, index: number, duration: number = 15) => {
    return supabase
      .from('competition_states')
      .upsert({ 
          competition_id: competitionId, 
          current_question_index: index, 
          status: 'countdown',
          duration: duration,
          updated_at: new Date().toISOString()
      }, { onConflict: 'competition_id' })
      .select()
      .single();
};

export const hostTriggerQuestion = async (competitionId: string) => 
  updateCompetitionState(competitionId, { 
    status: 'question_live',
    question_started_at: new Date().toISOString()
  });

export const checkIfAllParticipantsSubmitted = async (competitionId: string, questionId: string) => {
    const { data: participants } = await supabase
        .from('submissions')
        .select('id')
        .eq('competition_id', competitionId);
    
    if (!participants || participants.length === 0) return true;

    const { data: answers } = await supabase
        .from('answers')
        .select('submission_id')
        .eq('question_id', questionId)
        .in('submission_id', participants.map(p => p.id));
    
    return (answers?.length === participants.length);
};

export const hostRevealAnswer = async (competitionId: string) => {
  try {
    // 1. Get current question info from state
    const { data: state } = await supabase.from('competition_states').select('current_question_index').eq('competition_id', competitionId).single();
    if (!state) throw new Error('Match Terminal: State Uplink Offline');

    const { data: question } = await supabase
        .from('questions')
        .select('*')
        .eq('competition_id', competitionId)
        .order('order_index', { ascending: true })
        .range(state.current_question_index, state.current_question_index)
        .single();
    
    if (question) {
        // Query ALL answers for this question that haven't been awarded to profile yet
        const { data: answers } = await supabase.from('answers')
            .select('*, submissions(user_id)')
            .eq('question_id', question.id)
            .eq('is_awarded', false);

        const { data: comp } = await supabase.from('competitions').select('status, title').eq('id', competitionId).single();
        const multiplier = comp?.status === 'ended' ? 0.5 : 1.0;

        if (answers && answers.length > 0) {
            await Promise.all(answers.map(async (ans: any) => {
                let isCorrect = ans.is_correct;
                let pts = ans.points_awarded || 0;

                // For MCQs, we can recalculate correctness if needed, or trust the RPC
                if (question.type === 'mcq' && isCorrect === null) {
                    isCorrect = ans.answer === question.correct_answer;
                    pts = isCorrect ? (question.points || 100) : 0;
                }
                
                const finalPoints = Math.floor(pts * multiplier);

                // 2. Award Points to Profile (Commit to Main Leaderboard)
                if (finalPoints > 0 && ans.submissions?.user_id) {
                    await supabase.rpc('award_points', { 
                        user_id: ans.submissions.user_id, 
                        amount: finalPoints, 
                        reason: `Challenge: ${comp?.title || 'Solaris Match'} Stage ${state.current_question_index + 1}`
                    });
                    await supabase.rpc('update_user_streak', { user_id: ans.submissions.user_id });
                }

                // 3. Mark as Reviewed and Awarded
                await supabase.from('answers').update({ 
                    is_correct: isCorrect, 
                    points_awarded: finalPoints,
                    is_reviewed: true,
                    is_awarded: true
                }).eq('id', ans.id);
                
                // 4. Sync Submission Score total
                const { data: allAns } = await supabase.from('answers').select('points_awarded').eq('submission_id', ans.submission_id);
                const total = (allAns || []).reduce((sum, a) => sum + (a.points_awarded || 0), 0);
                await supabase.from('submissions').update({ score: total }).eq('id', ans.submission_id);
            }));
        }
    }

    return updateCompetitionState(competitionId, { status: 'answer_revealed' });
  } catch (error: any) {
    console.error('Error revealing answer:', error.message);
    return { data: null, error: error.message };
  }
};

export const updateHostMode = async (competitionId: string, isPlaying: boolean) => {
    return supabase
      .from('competition_states')
      .update({ host_is_playing: isPlaying })
      .eq('competition_id', competitionId);
};

export const startCompetitionSession = async (competitionId: string): Promise<ServiceResponse<any>> => {
  try {
    const { data, error } = await supabase
      .from('competitions')
      .update({ 
        status: 'live', 
        actual_start_time: new Date().toISOString() 
      })
      .eq('id', competitionId)
      .select()
      .single();
    if (error) throw error;
    
    // Explicitly initialize session state if not already there
    const { error: stateErr } = await hostStartQuestion(competitionId, 0, data.time_per_question || 15);
    if (stateErr) throw stateErr;
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error starting session:', error.message);
    return { data: null, error: error.message };
  }
};
