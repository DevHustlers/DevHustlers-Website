export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'mod' | 'user'
          status: 'active' | 'inactive'
          points: number
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'mod' | 'user'
          status?: 'active' | 'inactive'
          points?: number
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'mod' | 'user'
          status?: 'active' | 'inactive'
          points?: number
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tracks: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          icon_key: string | null
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          icon_key?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          icon_key?: string | null
          created_at?: string
        }
      }
      challenges: {
        Row: {
          id: string
          track_id: string | null
          title: string
          description: string | null
          duration: string | null
          points: number
          difficulty: 'Easy' | 'Medium' | 'Hard'
          status: string | null
          requirements: string | null
          created_at: string
        }
        Insert: {
          id?: string
          track_id?: string | null
          title: string
          description?: string | null
          duration?: string | null
          points?: number
          difficulty?: 'Easy' | 'Medium' | 'Hard'
          status?: string | null
          requirements?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          track_id?: string | null
          title?: string
          description?: string | null
          duration?: string | null
          points?: number
          difficulty?: 'Easy' | 'Medium' | 'Hard'
          status?: string | null
          requirements?: string | null
          created_at?: string
        }
      }
      competitions: {
        Row: {
          id: string
          title: string
          description: string | null
          prize: string | null
          status: string | null
          time_per_question: number | null
          scheduled_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          prize?: string | null
          status?: string | null
          time_per_question?: number | null
          scheduled_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          prize?: string | null
          status?: string | null
          time_per_question?: number | null
          scheduled_date?: string | null
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          location: string | null
          time: string | null
          date: string | null
          capacity: number | null
          type: string | null
          event_link: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          location?: string | null
          time?: string | null
          date?: string | null
          capacity?: number | null
          type?: string | null
          event_link?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          location?: string | null
          time?: string | null
          date?: string | null
          capacity?: number | null
          type?: string | null
          event_link?: string | null
          created_at?: string
        }
      }
      badges: {
        Row: {
          id: string
          name: string
          min_points: number
          icon_key: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          min_points: number
          icon_key?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          min_points?: number
          icon_key?: string | null
          created_at?: string
        }
      }
      user_badges: {
        Row: {
          user_id: string
          badge_id: string
          earned_at: string
        }
        Insert: {
          user_id: string
          badge_id: string
          earned_at?: string
        }
        Update: {
          user_id?: string
          badge_id?: string
          earned_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_points: {
        Args: {
          user_id: string
          amount: number
          reason?: string
        }
        Returns: void
      }
    }
    Enums: {
      user_role: 'admin' | 'mod' | 'user'
      user_status: 'active' | 'inactive'
      challenge_difficulty: 'Easy' | 'Medium' | 'Hard'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
