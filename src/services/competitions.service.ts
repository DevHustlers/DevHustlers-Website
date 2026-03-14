import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type Competition = Database['public']['Tables']['competitions']['Row']
export type CompetitionInsert = Database['public']['Tables']['competitions']['Insert']

export const competitionsService = {
  async getCompetitions() {
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .order('scheduled_date', { ascending: true })
    
    if (error) throw error
    return data
  },

  async createCompetition(data: CompetitionInsert) {
    const { data: competition, error } = await supabase
      .from('competitions')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return competition
  },

  async updateCompetitionStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('competitions')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}
