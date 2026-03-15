import { z } from 'zod';

export const platformSettingsSchema = z.object({
  community_name: z.string().min(1, 'Community name is required').max(100),
  default_language: z.string().min(2).max(5),
  timezone: z.string().min(1),
  max_points_per_day: z.number().int().min(0),
  challenge_duration: z.number().int().min(1),
  points_expiry: z.number().int().min(1),
  enable_streak_bonuses: z.boolean(),
  enable_2fa: z.boolean(),
  enable_email_verification: z.boolean(),
  enable_account_approval: z.boolean(),
  session_timeout: z.number().int().min(5),
  enable_email_notifications: z.boolean(),
  enable_challenge_reminders: z.boolean(),
  enable_leaderboard_updates: z.boolean(),
  enable_new_event_alerts: z.boolean(),
  discord_link: z.string().url().or(z.literal('')),
  twitter_link: z.string().url().or(z.literal('')),
  github_link: z.string().url().or(z.literal('')),
  linkedin_link: z.string().url().or(z.literal('')),
  enable_leaderboard: z.boolean(),
  enable_badges: z.boolean(),
  enable_streaks: z.boolean(),
  enable_referrals: z.boolean(),
});

export type PlatformSettingsInput = z.infer<typeof platformSettingsSchema>;
