import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

export const useRealtimeDashboard = () => {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial fetch
    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('points', { ascending: false })
      
      if (!error && data) {
        setProfiles(data)
      }
      setLoading(false)
    }

    fetchProfiles()

    // Subscribe to changes in the profiles table
    const subscription = supabase
      .channel('public:profiles')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, and DELETE
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('Change received!', payload)
          
          if (payload.eventType === 'INSERT') {
            setProfiles((prev) => [payload.new as Profile, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setProfiles((prev) => 
              prev.map((p) => p.id === (payload.new as Profile).id ? (payload.new as Profile) : p)
            )
          } else if (payload.eventType === 'DELETE') {
            setProfiles((prev) => 
              prev.filter((p) => p.id === payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  return { profiles, loading }
}
