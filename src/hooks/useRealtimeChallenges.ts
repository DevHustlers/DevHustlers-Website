import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { getChallenges } from '@/services/challenges.service';
import type { Tables } from '@/types/database';

export const useRealtimeChallenges = () => {
  const queryClient = useQueryClient();

  const { data: challenges = [], isLoading: loading, error } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      const { data, error } = await getChallenges();
      if (error) throw new Error(error);
      return data || [];
    },
    staleTime: 60000,
  });

  useEffect(() => {
    const channel = supabase
      .channel('challenges-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'challenges',
        },
        (payload) => {
          console.log('Realtime event received: challenge', payload.eventType);
          
          if (payload.eventType === 'INSERT') {
            const newChallenge = payload.new as Tables<'challenges'>;
            if (!newChallenge.is_deleted) {
              queryClient.setQueryData(['challenges'], (old: Tables<'challenges'>[] | undefined) => {
                const list = old || [];
                if (list.some(c => c.id === newChallenge.id)) return list;
                return [newChallenge, ...list];
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedChallenge = payload.new as Tables<'challenges'>;
            queryClient.setQueryData(['challenges'], (old: Tables<'challenges'>[] | undefined) => {
              const list = old || [];
              if (updatedChallenge.is_deleted) {
                return list.filter(c => c.id !== updatedChallenge.id);
              }
              return list.map(c => c.id === updatedChallenge.id ? updatedChallenge : c);
            });
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            queryClient.setQueryData(['challenges'], (old: Tables<'challenges'>[] | undefined) => {
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
    challenges, 
    loading, 
    error: error instanceof Error ? error.message : null,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['challenges'] })
  };
};
