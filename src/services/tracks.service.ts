import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type Track = Database['public']['Tables']['tracks']['Row']
export type TrackInsert = Database['public']['Tables']['tracks']['Insert']
export type TrackUpdate = Database['public']['Tables']['tracks']['Update']

export const tracksService = {
  async getTracks() {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  },

  async createTrack(data: TrackInsert) {
    const { data: track, error } = await supabase
      .from('tracks')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return track
  },

  async updateTrack(id: string, data: TrackUpdate) {
    const { data: track, error } = await supabase
      .from('tracks')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return track
  }
}
