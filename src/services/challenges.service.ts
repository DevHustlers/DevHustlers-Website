import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type Challenge = Database['public']['Tables']['challenges']['Row']
export type ChallengeInsert = Database['public']['Tables']['challenges']['Insert']

export const challengesService = {
  async getChallengesByTrack(trackId: string) {
    const { data, error } = await supabase
      .from('challenges')
      .select('*, tracks(*)')
      .eq('track_id', trackId)
      .order('points', { ascending: true })
    
    if (error) throw error
    return data
  },

  async createChallenge(data: ChallengeInsert) {
    const { data: challenge, error } = await supabase
      .from('challenges')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return challenge
  },

  async getAllChallenges() {
    const { data, error } = await supabase
      .from('challenges')
      .select('*, tracks(name)')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}
