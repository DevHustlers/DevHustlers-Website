import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type Event = Database['public']['Tables']['events']['Row']
export type EventInsert = Database['public']['Tables']['events']['Insert']

export const eventsService = {
  async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
    
    if (error) throw error
    return data
  },

  async createEvent(data: EventInsert) {
    const { data: event, error } = await supabase
      .from('events')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return event
  },

  async updateEvent(id: string, data: Partial<EventInsert>) {
    const { data: event, error } = await supabase
      .from('events')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return event
  }
}
