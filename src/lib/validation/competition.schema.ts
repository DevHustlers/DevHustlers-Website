import { z } from "zod";

export const competitionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().optional().or(z.literal("")),
  prize: z.string().optional().or(z.literal("")),
  status: z.enum(["upcoming", "live", "completed", "draft", "scheduled", "ended"]),
  time_per_question: z.number().min(5, "Time per question must be at least 5 seconds").default(15),
  scheduled_date: z.string().nullable().optional(),
  questions: z.array(z.any()).optional().default([]),
  host_id: z.string().uuid("Host selection is required"),
});

export type CompetitionSchema = z.infer<typeof competitionSchema>;
