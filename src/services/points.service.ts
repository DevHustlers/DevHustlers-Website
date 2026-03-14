import { supabase } from '@/lib/supabase'

export const pointsService = {
  async awardPoints(userId: string, amount: number, reason: string = '') {
    const { error } = await supabase.rpc('award_points', {
      user_id: userId,
      amount: amount,
      reason: reason
    })
    
    if (error) throw error
    return { success: true }
  },

  async getPointLogs(userId?: string) {
    let query = supabase.from('points_log').select('*, profiles(full_name)')
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}
