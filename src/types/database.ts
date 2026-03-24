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
      badges: {
        Row: {
          created_at: string | null
          icon_key: string | null
          id: string
          min_points: number
          name: string
        }
        Insert: {
          created_at?: string | null
          icon_key?: string | null
          id?: string
          min_points: number
          name: string
        }
        Update: {
          created_at?: string | null
          icon_key?: string | null
          id?: string
          min_points?: number
          name?: string
        }
        Relationships: []
      }
      challenges: {
        Row: {
          created_at: string
          description: string
          difficulty: Database["public"]["Enums"]["challenge_difficulty"]
          duration: string | null
          id: string
          is_deleted: boolean
          points: number
          requirements: string | null
          status: string | null
          title: string
          track: string
          track_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          difficulty: Database["public"]["Enums"]["challenge_difficulty"]
          duration?: string | null
          id?: string
          is_deleted?: boolean
          points?: number
          requirements?: string | null
          status?: string | null
          title: string
          track: string
          track_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          difficulty?: Database["public"]["Enums"]["challenge_difficulty"]
          duration?: string | null
          id?: string
          is_deleted?: boolean
          points?: number
          requirements?: string | null
          status?: string | null
          title?: string
          track?: string
          track_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenges_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      competitions: {
        Row: {
          actual_start_time: string | null
          created_at: string
          created_by: string | null
          host_id: string | null
          description: string | null
          end_date: string | null
          id: string
          prize: string | null
          prize_pool: number | null
          questions: Json | null
          scheduled_date: string | null
          start_date: string | null
          status: string | null
          time_per_question: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          host_id?: string | null
          actual_start_time?: string | null
          prize?: string | null
          prize_pool?: number | null
          questions?: Json | null
          scheduled_date?: string | null
          start_date?: string | null
          status?: string | null
          time_per_question?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          host_id?: string | null
          actual_start_time?: string | null
          prize?: string | null
          prize_pool?: number | null
          questions?: Json | null
          scheduled_date?: string | null
          start_date?: string | null
          status?: string | null
          time_per_question?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "competitions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          created_at: string | null
          date: string | null
          description: string | null
          event_link: string | null
          id: string
          location: string | null
          status: string | null
          time: string | null
          title: string
          type: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          event_link?: string | null
          id?: string
          location?: string | null
          status?: string | null
          time?: string | null
          title: string
          type?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          event_link?: string | null
          id?: string
          location?: string | null
          status?: string | null
          time?: string | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      point_rules: {
        Row: {
          active: boolean | null
          action: string
          created_at: string | null
          id: string
          points: number
        }
        Insert: {
          active?: boolean | null
          action: string
          created_at?: string | null
          id?: string
          points: number
        }
        Update: {
          active?: boolean | null
          action?: string
          created_at?: string | null
          id?: string
          points?: number
        }
        Relationships: []
      }
      leaderboard: {
        Row: {
          challenge_id: string
          id: string
          rank: number | null
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          id?: string
          rank?: number | null
          score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          id?: string
          rank?: number | null
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      points_log: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          reason: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          reason?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          reason?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "points_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          name: string | null
          points: number | null
          role: Database["public"]["Enums"]["user_role"] | null
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string | null
          username: string | null
          is_deleted: boolean | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          name?: string | null
          points?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          username?: string | null
          is_deleted?: boolean | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          name?: string | null
          points?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          username?: string | null
          is_deleted?: boolean | null
        }
        Relationships: []
      }
      room_participants: {
        Row: {
          id: string
          joined_at: string
          room_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          joined_at?: string
          room_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          joined_at?: string
          room_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          competition_id: string | null
          created_at: string
          id: string
          is_active: boolean | null
          max_participants: number | null
          room_name: string
        }
        Insert: {
          competition_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          room_name: string
        }
        Update: {
          competition_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          room_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          competition_id: string | null
          feedback: string | null
          id: string
          score: number | null
          submission_url: string
          submitted_at: string
          user_id: string | null
        }
        Insert: {
          competition_id?: string | null
          feedback?: string | null
          id?: string
          score?: number | null
          submission_url: string
          submitted_at?: string
          user_id?: string | null
        }
        Update: {
          competition_id?: string | null
          feedback?: string | null
          id?: string
          score?: number | null
          submission_url?: string
          submitted_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon_key: string | null
          id: string
          long_description: string | null
          name: string
          slug: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon_key?: string | null
          id?: string
          long_description?: string | null
          name: string
          slug: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon_key?: string | null
          id?: string
          long_description?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string | null
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string | null
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_points: {
        Args: { amount: number; reason?: string; user_id: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      challenge_difficulty: "Easy" | "Medium" | "Hard"
      user_role: "admin" | "mod" | "user"
      user_status: "active" | "inactive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type TablesInsert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"]
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T]

export interface ServiceResponse<T> {
  data: T | null
  error: string | null
}
