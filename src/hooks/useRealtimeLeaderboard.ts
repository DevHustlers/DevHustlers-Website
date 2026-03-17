import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { getLeaderboard, type LeaderboardUser } from '@/services/leaderboard.service';
import type { Tables } from '@/types/database';

export const useRealtimeLeaderboard = (limit: number = 20) => {
  const queryClient = useQueryClient();

  const { data: leaderboard = [], isLoading: loading, error } = useQuery({
    queryKey: ['leaderboard', limit],
    queryFn: async () => {
      const { data, error } = await getLeaderboard(limit);
      if (error) throw new Error(error);
      return data || [];
    },
    staleTime: 30000,
  });

  useEffect(() => {
    const channel = supabase
      .channel('leaderboard-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          console.log('Realtime event received: leaderboard-profile', payload.eventType);
          
          if (payload.eventType === 'INSERT') {
            const newUser = payload.new as Tables<'profiles'>;
            queryClient.setQueryData(['leaderboard', limit], (old: LeaderboardUser[] | undefined) => {
              const list = old || [];
              if (list.some(u => u.id === newUser.id)) return list;
              // Add and sort
              const newList = [...list, { ...newUser, rank: 0 } as LeaderboardUser]
                .sort((a, b) => (b.points || 0) - (a.points || 0))
                .slice(0, limit);
              
              // Re-rank
              return newList.map((u, i) => ({ ...u, rank: i + 1 }));
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedUser = payload.new as Tables<'profiles'>;
            queryClient.setQueryData(['leaderboard', limit], (old: LeaderboardUser[] | undefined) => {
              const list = old || [];
              const updatedList = list.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u)
                .sort((a, b) => (b.points || 0) - (a.points || 0));
              
              return updatedList.map((u, i) => ({ ...u, rank: i + 1 }));
            });
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            queryClient.setQueryData(['leaderboard', limit], (old: LeaderboardUser[] | undefined) => {
              const list = (old || []).filter(u => u.id !== deletedId);
              return list.map((u, i) => ({ ...u, rank: i + 1 }));
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, limit]);

  return { 
    leaderboard, 
    loading, 
    error: error instanceof Error ? error.message : null,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['leaderboard', limit] })
  };
};
