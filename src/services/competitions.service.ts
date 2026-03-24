import { supabase } from '@/lib/supabase';
import type { Tables, TablesInsert, TablesUpdate, ServiceResponse } from '@/types/database';

export const getCompetitions = async (limit: number = 20): Promise<ServiceResponse<Tables<'competitions'>[]>> => {
  try {
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
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
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getActiveCompetitions:', error.message);
    return { data: null, error: error.message };
  }
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

export const joinCompetition = async (competitionId: string): Promise<ServiceResponse<any>> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if already attempted
    const { data: existing } = await supabase
      .from('submissions')
      .select('id, completed_at')
      .eq('competition_id', competitionId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      return { data: existing, error: null };
    }

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
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in submitAnswer:', error.message);
    return { data: null, error: error.message };
  }
};

export const completeSubmission = async (submissionId: string, finalScore: number): Promise<ServiceResponse<any>> => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .update({
        submitted_at: new Date().toISOString(),
        score: finalScore
      })
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
      .select('*, questions(*), submissions(users(full_name))')
      .eq('is_reviewed', false)
      .order('created_at', { ascending: true });

    if (error) throw error;
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

export const hostStartQuestion = async (competitionId: string, index: number) => {
    // Use upsert to ensure entry exists
    return supabase
      .from('competition_states')
      .upsert({ 
          competition_id: competitionId, 
          current_question_index: index, 
          status: 'question_live',
          updated_at: new Date().toISOString()
      }, { onConflict: 'competition_id' })
      .select()
      .single();
};

export const hostRevealAnswer = async (competitionId: string) => 
  updateCompetitionState(competitionId, { status: 'answer_revealed' });

export const hostNextQuestion = async (competitionId: string, nextIndex: number, isLast: boolean) => {
    const status = isLast ? 'results' : 'waiting';
    return updateCompetitionState(competitionId, { 
      current_question_index: nextIndex, 
      status 
    });
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
    const { error: stateErr } = await hostStartQuestion(competitionId, 0);
    if (stateErr) throw stateErr;
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error starting session:', error.message);
    return { data: null, error: error.message };
  }
};
