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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_answers: {
        Row: {
          answer: string
          created_at: string
          id: string
          question_id: string
          score: number | null
          session_id: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          question_id: string
          score?: number | null
          session_id: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          question_id?: string
          score?: number | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_answers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "audit_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_results: {
        Row: {
          business_impact: string
          confidence: number
          created_at: string
          diagnosis: string
          diagnosis_title: string
          evidence: Json
          follow_up_score: number | null
          id: string
          lead_generation_score: number | null
          market_score: number | null
          offer_score: number | null
          one_sentence_diagnosis: string
          positioning_score: number | null
          sales_score: number | null
          secondary_observation: string | null
          session_id: string
          severity: string
        }
        Insert: {
          business_impact: string
          confidence: number
          created_at?: string
          diagnosis: string
          diagnosis_title: string
          evidence?: Json
          follow_up_score?: number | null
          id?: string
          lead_generation_score?: number | null
          market_score?: number | null
          offer_score?: number | null
          one_sentence_diagnosis: string
          positioning_score?: number | null
          sales_score?: number | null
          secondary_observation?: string | null
          session_id: string
          severity: string
        }
        Update: {
          business_impact?: string
          confidence?: number
          created_at?: string
          diagnosis?: string
          diagnosis_title?: string
          evidence?: Json
          follow_up_score?: number | null
          id?: string
          lead_generation_score?: number | null
          market_score?: number | null
          offer_score?: number | null
          one_sentence_diagnosis?: string
          positioning_score?: number | null
          sales_score?: number | null
          secondary_observation?: string | null
          session_id?: string
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_results_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "audit_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_sessions: {
        Row: {
          access_token_hash: string
          booked: boolean
          completed_at: string | null
          confidence: number | null
          created_at: string
          current_step: number
          diagnosis_title: string | null
          email: string
          id: string
          name: string
          phone: string
          primary_diagnosis: string | null
          severity: string | null
        }
        Insert: {
          access_token_hash: string
          booked?: boolean
          completed_at?: string | null
          confidence?: number | null
          created_at?: string
          current_step?: number
          diagnosis_title?: string | null
          email: string
          id?: string
          name: string
          phone: string
          primary_diagnosis?: string | null
          severity?: string | null
        }
        Update: {
          access_token_hash?: string
          booked?: boolean
          completed_at?: string | null
          confidence?: number | null
          created_at?: string
          current_step?: number
          diagnosis_title?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string
          primary_diagnosis?: string | null
          severity?: string | null
        }
        Relationships: []
      }
      booking_funnel_events: {
        Row: {
          created_at: string
          id: string
          session: string
          step: string
        }
        Insert: {
          created_at?: string
          id?: string
          session: string
          step: string
        }
        Update: {
          created_at?: string
          id?: string
          session?: string
          step?: string
        }
        Relationships: []
      }
      client_reviews: {
        Row: {
          body: string
          created_at: string
          id: string
          name: string
          photo_path: string | null
          rating: number
          role: string
          screenshot_path: string | null
          status: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          name: string
          photo_path?: string | null
          rating: number
          role?: string
          screenshot_path?: string | null
          status?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          name?: string
          photo_path?: string | null
          rating?: number
          role?: string
          screenshot_path?: string | null
          status?: string
        }
        Relationships: []
      }
      clinic_enquiries: {
        Row: {
          created_at: string
          details: Json
          email: string
          id: string
          kind: string
          name: string
          status: string
          whatsapp: string
        }
        Insert: {
          created_at?: string
          details?: Json
          email: string
          id?: string
          kind: string
          name: string
          status?: string
          whatsapp: string
        }
        Update: {
          created_at?: string
          details?: Json
          email?: string
          id?: string
          kind?: string
          name?: string
          status?: string
          whatsapp?: string
        }
        Relationships: []
      }
      clinic_payments: {
        Row: {
          amount_minor: number
          created_at: string
          currency: string
          id: string
          paid_at: string
          provider: string
          provider_payment_id: string
        }
        Insert: {
          amount_minor: number
          created_at?: string
          currency: string
          id?: string
          paid_at: string
          provider: string
          provider_payment_id: string
        }
        Update: {
          amount_minor?: number
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string
          provider?: string
          provider_payment_id?: string
        }
        Relationships: []
      }
      payment_proofs: {
        Row: {
          content_type: string
          created_at: string
          email: string
          file_path: string
          id: string
          name: string
          provider: string
          reviewed_at: string | null
          status: string
        }
        Insert: {
          content_type: string
          created_at?: string
          email: string
          file_path: string
          id?: string
          name: string
          provider: string
          reviewed_at?: string | null
          status?: string
        }
        Update: {
          content_type?: string
          created_at?: string
          email?: string
          file_path?: string
          id?: string
          name?: string
          provider?: string
          reviewed_at?: string | null
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
