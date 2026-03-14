import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export const usersService = {
  async getUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async updateUserRoleAndPoints(id: string, updates: ProfileUpdate) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteUser(id: string) {
    // Note: This usually requires a service role or a specific edge function if deleting from auth.users
    // For now, we delete from public.profiles (though RLS might prevent this unless admin)
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
