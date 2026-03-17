import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { getTracks } from '@/services/tracks.service';
import type { Tables } from '@/types/database';

export const useRealtimeTracks = () => {
  const queryClient = useQueryClient();

  const { data: tracks = [], isLoading: loading, error } = useQuery({
    queryKey: ['tracks'],
    queryFn: async () => {
      const { data, error } = await getTracks();
      if (error) throw new Error(error);
      return data || [];
    },
    staleTime: 300000, // Tracks change rarely
  });

  useEffect(() => {
    const channel = supabase
      .channel('tracks-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tracks',
        },
        (payload) => {
          console.log('Realtime event received: track', payload.eventType);
          
          if (payload.eventType === 'INSERT') {
            const newTrack = payload.new as Tables<'tracks'>;
            queryClient.setQueryData(['tracks'], (old: Tables<'tracks'>[] | undefined) => {
              const list = old || [];
              if (list.some(t => t.id === newTrack.id)) return list;
              return [...list, newTrack];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedTrack = payload.new as Tables<'tracks'>;
            queryClient.setQueryData(['tracks'], (old: Tables<'tracks'>[] | undefined) => {
              const list = old || [];
              return list.map(t => t.id === updatedTrack.id ? updatedTrack : t);
            });
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            queryClient.setQueryData(['tracks'], (old: Tables<'tracks'>[] | undefined) => {
              return (old || []).filter(t => t.id !== deletedId);
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { 
    tracks, 
    loading, 
    error: error instanceof Error ? error.message : null,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['tracks'] })
  };
};
