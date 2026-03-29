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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          annual_revenue_band: string | null
          balance_date: string | null
          company_number: string | null
          created_at: string
          employee_count: number | null
          entity_type: string
          gst_filing_frequency: string | null
          gst_number: string | null
          id: string
          industry: string | null
          name: string
          nzbn: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          annual_revenue_band?: string | null
          balance_date?: string | null
          company_number?: string | null
          created_at?: string
          employee_count?: number | null
          entity_type?: string
          gst_filing_frequency?: string | null
          gst_number?: string | null
          id?: string
          industry?: string | null
          name: string
          nzbn?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          annual_revenue_band?: string | null
          balance_date?: string | null
          company_number?: string | null
          created_at?: string
          employee_count?: number | null
          entity_type?: string
          gst_filing_frequency?: string | null
          gst_number?: string | null
          id?: string
          industry?: string | null
          name?: string
          nzbn?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "companies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_deadlines: {
        Row: {
          company_id: string
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string
          id: string
          reminder_sent_at: string | null
          status: string
          title: string
          type: string
        }
        Insert: {
          company_id: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          reminder_sent_at?: string | null
          status?: string
          title: string
          type: string
        }
        Update: {
          company_id?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          reminder_sent_at?: string | null
          status?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_deadlines_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          company_id: string
          content: string | null
          created_at: string
          file_url: string | null
          id: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          company_id: string
          content?: string | null
          created_at?: string
          file_url?: string | null
          id?: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          content?: string | null
          created_at?: string
          file_url?: string | null
          id?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      flight_alerts: {
        Row: {
          created_at: string
          destination: string
          id: string
          is_active: boolean | null
          origin: string
          target_price: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          destination: string
          id?: string
          is_active?: boolean | null
          origin?: string
          target_price?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          destination?: string
          id?: string
          is_active?: boolean | null
          origin?: string
          target_price?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flight_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      flight_prices: {
        Row: {
          airline: string | null
          currency: string
          departure_date: string
          destination: string
          id: string
          is_direct: boolean | null
          origin: string
          price: number
          scraped_at: string
        }
        Insert: {
          airline?: string | null
          currency?: string
          departure_date: string
          destination: string
          id?: string
          is_direct?: boolean | null
          origin: string
          price: number
          scraped_at?: string
        }
        Update: {
          airline?: string | null
          currency?: string
          departure_date?: string
          destination?: string
          id?: string
          is_direct?: boolean | null
          origin?: string
          price?: number
          scraped_at?: string
        }
        Relationships: []
      }
      gp_practices: {
        Row: {
          accepting_new_patients: boolean | null
          address: string
          city: string
          created_at: string
          enrolled_population: number | null
          fee_adult: number | null
          fee_child: number | null
          fee_csc: number | null
          healthpoint_url: string | null
          id: string
          languages_spoken: string[] | null
          last_scraped_at: string | null
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          region: string
          suburb: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          accepting_new_patients?: boolean | null
          address: string
          city: string
          created_at?: string
          enrolled_population?: number | null
          fee_adult?: number | null
          fee_child?: number | null
          fee_csc?: number | null
          healthpoint_url?: string | null
          id?: string
          languages_spoken?: string[] | null
          last_scraped_at?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          region: string
          suburb?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          accepting_new_patients?: boolean | null
          address?: string
          city?: string
          created_at?: string
          enrolled_population?: number | null
          fee_adult?: number | null
          fee_child?: number | null
          fee_csc?: number | null
          healthpoint_url?: string | null
          id?: string
          languages_spoken?: string[] | null
          last_scraped_at?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          region?: string
          suburb?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      job_listings: {
        Row: {
          company_id: string | null
          created_at: string
          description: string
          description_zh: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          job_type: string
          languages_required: string[] | null
          location: string
          poster_id: string
          salary_max: number | null
          salary_min: number | null
          salary_type: string | null
          title: string
          title_zh: string | null
          updated_at: string
          visa_sponsorship: boolean | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          description: string
          description_zh?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: string
          languages_required?: string[] | null
          location: string
          poster_id: string
          salary_max?: number | null
          salary_min?: number | null
          salary_type?: string | null
          title: string
          title_zh?: string | null
          updated_at?: string
          visa_sponsorship?: boolean | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          description?: string
          description_zh?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: string
          languages_required?: string[] | null
          location?: string
          poster_id?: string
          salary_max?: number | null
          salary_min?: number | null
          salary_type?: string | null
          title?: string
          title_zh?: string | null
          updated_at?: string
          visa_sponsorship?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "job_listings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_listings_poster_id_fkey"
            columns: ["poster_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_documents: {
        Row: {
          applicable_entity_types: string[] | null
          category: string | null
          content: string
          content_zh: string | null
          created_at: string
          effective_date: string | null
          embedding: string | null
          expiry_date: string | null
          id: string
          last_verified_at: string | null
          source: string
          source_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          applicable_entity_types?: string[] | null
          category?: string | null
          content: string
          content_zh?: string | null
          created_at?: string
          effective_date?: string | null
          embedding?: string | null
          expiry_date?: string | null
          id?: string
          last_verified_at?: string | null
          source: string
          source_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          applicable_entity_types?: string[] | null
          category?: string | null
          content?: string
          content_zh?: string | null
          created_at?: string
          effective_date?: string | null
          embedding?: string | null
          expiry_date?: string | null
          id?: string
          last_verified_at?: string | null
          source?: string
          source_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          sources: Json | null
          tokens_used: number | null
          tool_calls: Json | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          sources?: Json | null
          tokens_used?: number | null
          tool_calls?: Json | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          sources?: Json | null
          tokens_used?: number | null
          tool_calls?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          preferred_language: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          preferred_language?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_language?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
