import { supabase } from '@/lib/supabase';
import type { Tables, ServiceResponse } from '@/types/database';

export const awardPoints = async (
  userId: string,
  amount: number,
  reason: string
): Promise<ServiceResponse<void>> => {
  try {
    // 1. Call the award_points RPC
    // This RPC handles logging AND updating profiles. 
    // It also contains logic to prevent duplicate awards for the same reason
    // from the same user within 5 seconds.
    const { data: rpcData, error: funcError } = await supabase.rpc('award_points', {
      user_id: userId,
      amount,
      reason
    });
    
    // 2. If the RPC call succeeds, return success
    if (!funcError) {
      return { data: null, error: null };
    }
    
    // 3. Fallback: If RPC is not available or failed for non-duplicate reasons,
    // we should manually simulate the award if it's safe.
    // However, if the error is "Duplicate points award detected", we bubble it up.
    if (funcError.message?.includes('Duplicate')) {
      throw funcError;
    }
    
    // Manual fallback: Manually Update Points and Insert into logs
    const { error: logError } = await supabase
      .from('points_log')
      .insert({
        user_id: userId,
        amount,
        reason
      });

    if (logError) throw logError;

    // Manually fetch and update
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single();
    
    if (fetchError) throw fetchError;
    
    const newPoints = (profile.points || 0) + amount;
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ points: newPoints })
      .eq('id', userId);
      
    if (updateError) throw updateError;

    // 3. Check badge eligibility
    await checkBadgeEligibility(userId);

    return { data: null, error: null };
  } catch (error: any) {
    console.error('Error in awardPoints:', error.message);
    return { data: null, error: error.message };
  }
};

export const checkBadgeEligibility = async (
  userId: string
): Promise<ServiceResponse<void>> => {
  try {
    // Get user points
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;
    const userPoints = profile.points || 0;

    // Get all badges
    const { data: badges, error: badgesError } = await supabase
      .from('badges')
      .select('*');

    if (badgesError) throw badgesError;

    // Get existing user badges
    const { data: userBadges, error: userBadgesError } = await supabase
      .from('user_badges')
      .select('badge_id')
      .eq('user_id', userId);

    if (userBadgesError) throw userBadgesError;
    const existingBadgeIds = new Set(userBadges.map(ub => ub.badge_id));

    // Check which new badges are earned
    const newBadges = badges.filter(badge => 
      userPoints >= badge.min_points && !existingBadgeIds.has(badge.id)
    );

    if (newBadges.length > 0) {
      const inserts = newBadges.map(badge => ({
        user_id: userId,
        badge_id: badge.id
      }));

      const { error: insertError } = await supabase
        .from('user_badges')
        .insert(inserts);

      if (insertError) throw insertError;
    }

    return { data: null, error: null };
  } catch (error: any) {
    console.error('Error in checkBadgeEligibility:', error.message);
    return { data: null, error: error.message };
  }
};
