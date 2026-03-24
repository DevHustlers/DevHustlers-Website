import { useState, useEffect } from 'react';
import { joinEvent, leaveEvent, getAttendeesCount, isUserAttending } from '@/services/events.service';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useEventAttendance = (eventId: string) => {
  const [attending, setAttending] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      const [{ data: status }, { data: countData }] = await Promise.all([
        isUserAttending(eventId),
        getAttendeesCount(eventId),
      ]);
      setAttending(!!status);
      setCount(countData || 0);
      setLoading(false);
    };
    fetchStatus();

    // Real-time subscription to attendee changes
    const channel = supabase
      .channel(`event-attendees-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_attendees',
          filter: `event_id=eq.${eventId}`,
        },
        async () => {
          const { data } = await getAttendeesCount(eventId);
          if (data !== null) {
            setCount(data);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  const toggleAttendance = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please log in to join events");
      return;
    }

    if (attending) {
      const { error } = await leaveEvent(eventId);
      if (!error) {
        setAttending(false);
        setCount((prev) => Math.max(0, prev - 1));
        toast.success("No longer attending");
      } else {
        toast.error(error);
      }
    } else {
      const { error } = await joinEvent(eventId);
      if (!error) {
        setAttending(true);
        setCount((prev) => prev + 1);
        toast.success("Attending! See you there.");
      } else {
        toast.error(error);
      }
    }
  };

  return { attending, count, loading, toggleAttendance };
};
