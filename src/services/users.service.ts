import { supabase } from '@/lib/supabase';
import type { Tables, TablesUpdate, ServiceResponse } from '@/types/database';

export const getUsers = async (includeDeleted: boolean = false): Promise<ServiceResponse<any[]>> => {
  try {
    let query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!includeDeleted) {
      query = query.eq('is_deleted', false);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    // Map counts - attendance count will be handled separately if needed
    const mapped = (data || []).map(p => ({
        ...p,
        attendance_count: p.streak_count || 0 // Use streak as placeholder for now, or just 0
    }));

    return { data: mapped, error: null };
  } catch (error: any) {
    console.error('Error in getUsers:', error.message);
    return { data: null, error: error.message };
  }
};

export const updateUserRoleAndPoints = async (
  id: string,
  updates: TablesUpdate<'profiles'>
): Promise<ServiceResponse<Tables<'profiles'>>> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in updateUserRoleAndPoints:', error.message);
    return { data: null, error: error.message };
  }
};

export const deleteUser = async (id: string): Promise<ServiceResponse<null>> => {
  try {
    // Call RPC to handle soft delete in profiles AND delete from auth.users (to allow re-signup)
    const { error } = await supabase
      .rpc('handle_user_deletion', { target_user_id: id });

    if (error) throw error;
    return { data: null, error: null };
  } catch (error: any) {
    console.error('Error in deleteUser:', error.message);
    return { data: null, error: error.message };
  }
};
