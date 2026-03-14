import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type Badge = Database['public']['Tables']['badges']['Row']

export const badgesService = {
  async getBadges() {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .order('min_points', { ascending: true })
    
    if (error) throw error
    return data
  },

  async getUserBadges(userId: string) {
    const { data, error } = await supabase
      .from('user_badges')
      .select('*, badges(*)')
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  },

  async createBadge(data: Database['public']['Tables']['badges']['Insert']) {
    const { data: badge, error } = await supabase
      .from('badges')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return badge
  }
}
