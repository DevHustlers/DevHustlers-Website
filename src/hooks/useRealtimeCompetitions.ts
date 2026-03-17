import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { getCompetitions } from '@/services/competitions.service';
import type { Tables } from '@/types/database';

export const useRealtimeCompetitions = () => {
  const queryClient = useQueryClient();

  const { data: competitions = [], isLoading: loading, error } = useQuery({
    queryKey: ['competitions'],
    queryFn: async () => {
      const { data, error } = await getCompetitions();
      if (error) throw new Error(error);
      return data || [];
    },
    staleTime: 60000,
  });

  useEffect(() => {
    const channel = supabase
      .channel('competitions-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'competitions',
        },
        (payload) => {
          console.log('Realtime event received: competition', payload.eventType);
          
          if (payload.eventType === 'INSERT') {
            const newComp = payload.new as Tables<'competitions'>;
            queryClient.setQueryData(['competitions'], (old: Tables<'competitions'>[] | undefined) => {
              const list = old || [];
              if (list.some(c => c.id === newComp.id)) return list;
              return [newComp, ...list];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedComp = payload.new as Tables<'competitions'>;
            queryClient.setQueryData(['competitions'], (old: Tables<'competitions'>[] | undefined) => {
              const list = old || [];
              return list.map(c => c.id === updatedComp.id ? updatedComp : c);
            });
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            queryClient.setQueryData(['competitions'], (old: Tables<'competitions'>[] | undefined) => {
              return (old || []).filter(c => c.id !== deletedId);
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
    competitions, 
    loading, 
    error: error instanceof Error ? error.message : null,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['competitions'] })
  };
};
