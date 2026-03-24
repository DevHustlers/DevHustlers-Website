export interface CompetitionQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  timeLimit: number;
  type: "mcq" | "text" | "code";
  points?: number;
}

export interface CompetitionData {
  id: string;
  title: string;
  description: string;
  status: "draft" | "scheduled" | "live" | "ended";
  scheduledDate: string;
  timePerQuestion: number;
  prize: string;
  questions: CompetitionQuestion[];
  participants: number;
  host_id?: string;
}
