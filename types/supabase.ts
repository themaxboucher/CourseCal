export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      course_colors: {
        Row: {
          color: Database["public"]["Enums"]["color"]
          course: number
          created_at: string
          id: number
          user: string
        }
        Insert: {
          color: Database["public"]["Enums"]["color"]
          course: number
          created_at?: string
          id?: number
          user: string
        }
        Update: {
          color?: Database["public"]["Enums"]["color"]
          course?: number
          created_at?: string
          id?: number
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_colors_course_fkey"
            columns: ["course"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_colors_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: number
          subject: string
          title: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: number
          subject: string
          title: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: number
          subject?: string
          title?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          course: number | null
          course_code: string
          created_at: string
          days: Database["public"]["Enums"]["week_day"][]
          end_time: string
          id: number
          location: string | null
          recurrence: Database["public"]["Enums"]["recurrence"]
          start_time: string
          term: number | null
          type: Database["public"]["Enums"]["class_type"] | null
          user: string
        }
        Insert: {
          course?: number | null
          course_code: string
          created_at?: string
          days: Database["public"]["Enums"]["week_day"][]
          end_time: string
          id?: number
          location?: string | null
          recurrence?: Database["public"]["Enums"]["recurrence"]
          start_time: string
          term?: number | null
          type?: Database["public"]["Enums"]["class_type"] | null
          user: string
        }
        Update: {
          course?: number | null
          course_code?: string
          created_at?: string
          days?: Database["public"]["Enums"]["week_day"][]
          end_time?: string
          id?: number
          location?: string | null
          recurrence?: Database["public"]["Enums"]["recurrence"]
          start_time?: string
          term?: number | null
          type?: Database["public"]["Enums"]["class_type"] | null
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_course_fkey"
            columns: ["course"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_term_fkey"
            columns: ["term"]
            isOneToOne: false
            referencedRelation: "terms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          addressee: string
          created_at: string
          id: number
          requester: string
          responded_at: string | null
          status: Database["public"]["Enums"]["friendship_status"]
        }
        Insert: {
          addressee: string
          created_at?: string
          id?: number
          requester: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["friendship_status"]
        }
        Update: {
          addressee?: string
          created_at?: string
          id?: number
          requester?: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["friendship_status"]
        }
        Relationships: [
          {
            foreignKeyName: "friendships_addressee_fkey"
            columns: ["addressee"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_requester_fkey"
            columns: ["requester"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      terms: {
        Row: {
          created_at: string
          end_date: string
          id: number
          season: Database["public"]["Enums"]["season"]
          start_date: string
          year: number
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: number
          season: Database["public"]["Enums"]["season"]
          start_date: string
          year: number
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: number
          season?: Database["public"]["Enums"]["season"]
          start_date?: string
          year?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar: string | null
          created_at: string
          email: string
          has_been_welcomed: boolean
          has_completed_onboarding: boolean
          id: string
          major: string | null
          name: string | null
          referred_by: string | null
          username: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email: string
          has_been_welcomed?: boolean
          has_completed_onboarding?: boolean
          id: string
          major?: string | null
          name?: string | null
          referred_by?: string | null
          username: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string
          has_been_welcomed?: boolean
          has_completed_onboarding?: boolean
          id?: string
          major?: string | null
          name?: string | null
          referred_by?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      are_friends: { Args: { a: string; b: string }; Returns: boolean }
      generate_username: { Args: { p_email: string }; Returns: string }
      suggested_friends: {
        Args: { p_limit?: number; p_term: number }
        Returns: {
          avatar: string
          id: string
          major: string
          mutual_friends: number
          name: string
          shared_courses: number
          username: string
        }[]
      }
    }
    Enums: {
      class_type: "lecture" | "tutorial" | "lab" | "seminar"
      color:
        | "red"
        | "orange"
        | "yellow"
        | "green"
        | "cyan"
        | "blue"
        | "purple"
        | "pink"
      friendship_status: "pending" | "accepted"
      recurrence: "weekly" | "biweekly"
      season: "fall" | "winter" | "spring" | "summer"
      week_day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      class_type: ["lecture", "tutorial", "lab", "seminar"],
      color: [
        "red",
        "orange",
        "yellow",
        "green",
        "cyan",
        "blue",
        "purple",
        "pink",
      ],
      friendship_status: ["pending", "accepted"],
      recurrence: ["weekly", "biweekly"],
      season: ["fall", "winter", "spring", "summer"],
      week_day: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    },
  },
} as const
