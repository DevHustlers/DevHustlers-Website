import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { getEvents } from '@/services/events.service';
import type { Tables } from '@/types/database';

export const useRealtimeEvents = () => {
  const queryClient = useQueryClient();

  const { data: events = [], isLoading: loading, error } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await getEvents();
      if (error) throw new Error(error);
      return data || [];
    },
    staleTime: 60000,
  });

  useEffect(() => {
    const channel = supabase
      .channel('events-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
        },
        (payload) => {
          console.log('Realtime event received: event', payload.eventType);
          
          if (payload.eventType === 'INSERT') {
            const newEvent = payload.new as Tables<'events'>;
            queryClient.setQueryData(['events'], (old: Tables<'events'>[] | undefined) => {
              const list = old || [];
              if (list.some(e => e.id === newEvent.id)) return list;
              return [newEvent, ...list];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedEvent = payload.new as Tables<'events'>;
            queryClient.setQueryData(['events'], (old: Tables<'events'>[] | undefined) => {
              const list = old || [];
              return list.map(e => e.id === updatedEvent.id ? updatedEvent : e);
            });
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            queryClient.setQueryData(['events'], (old: Tables<'events'>[] | undefined) => {
              return (old || []).filter(e => e.id !== deletedId);
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
    events, 
    loading, 
    error: error instanceof Error ? error.message : null,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['events'] })
  };
};
