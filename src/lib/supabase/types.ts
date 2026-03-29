export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          preferred_language: string;
          avatar_url: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          preferred_language?: string;
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          preferred_language?: string;
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      companies: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          nzbn: string | null;
          company_number: string | null;
          gst_number: string | null;
          entity_type: string;
          gst_filing_frequency: string | null;
          balance_date: string | null;
          industry: string | null;
          employee_count: number | null;
          annual_revenue_band: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          nzbn?: string | null;
          company_number?: string | null;
          gst_number?: string | null;
          entity_type?: string;
          gst_filing_frequency?: string | null;
          balance_date?: string | null;
          industry?: string | null;
          employee_count?: number | null;
          annual_revenue_band?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          name?: string;
          nzbn?: string | null;
          company_number?: string | null;
          gst_number?: string | null;
          entity_type?: string;
          gst_filing_frequency?: string | null;
          balance_date?: string | null;
          industry?: string | null;
          employee_count?: number | null;
          annual_revenue_band?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          plan: string;
          status: string;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          plan?: string;
          status?: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          plan?: string;
          status?: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          company_id: string | null;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_id?: string | null;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          company_id?: string | null;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: string;
          content: string;
          sources: Json | null;
          tool_calls: Json | null;
          tokens_used: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: string;
          content: string;
          sources?: Json | null;
          tool_calls?: Json | null;
          tokens_used?: number | null;
          created_at?: string;
        };
        Update: {
          conversation_id?: string;
          role?: string;
          content?: string;
          sources?: Json | null;
          tool_calls?: Json | null;
          tokens_used?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      compliance_deadlines: {
        Row: {
          id: string;
          company_id: string;
          type: string;
          title: string;
          description: string | null;
          due_date: string;
          status: string;
          reminder_sent_at: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          type: string;
          title: string;
          description?: string | null;
          due_date: string;
          status?: string;
          reminder_sent_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          company_id?: string;
          type?: string;
          title?: string;
          description?: string | null;
          due_date?: string;
          status?: string;
          reminder_sent_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          company_id: string;
          type: string;
          title: string;
          content: string | null;
          file_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          type: string;
          title: string;
          content?: string | null;
          file_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          company_id?: string;
          type?: string;
          title?: string;
          content?: string | null;
          file_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      knowledge_documents: {
        Row: {
          id: string;
          source: string;
          source_url: string | null;
          title: string;
          content: string;
          content_zh: string | null;
          category: string | null;
          applicable_entity_types: string[] | null;
          effective_date: string | null;
          expiry_date: string | null;
          last_verified_at: string | null;
          embedding: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          source: string;
          source_url?: string | null;
          title: string;
          content: string;
          content_zh?: string | null;
          category?: string | null;
          applicable_entity_types?: string[] | null;
          effective_date?: string | null;
          expiry_date?: string | null;
          last_verified_at?: string | null;
          embedding?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          source?: string;
          source_url?: string | null;
          title?: string;
          content?: string;
          content_zh?: string | null;
          category?: string | null;
          applicable_entity_types?: string[] | null;
          effective_date?: string | null;
          expiry_date?: string | null;
          last_verified_at?: string | null;
          embedding?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      job_listings: {
        Row: {
          id: string;
          company_id: string | null;
          poster_id: string;
          title: string;
          title_zh: string | null;
          description: string;
          description_zh: string | null;
          job_type: string;
          location: string;
          salary_min: number | null;
          salary_max: number | null;
          salary_type: string | null;
          languages_required: string[] | null;
          visa_sponsorship: boolean | null;
          is_active: boolean | null;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id?: string | null;
          poster_id: string;
          title: string;
          title_zh?: string | null;
          description: string;
          description_zh?: string | null;
          job_type?: string;
          location: string;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_type?: string | null;
          languages_required?: string[] | null;
          visa_sponsorship?: boolean | null;
          is_active?: boolean | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          company_id?: string | null;
          poster_id?: string;
          title?: string;
          title_zh?: string | null;
          description?: string;
          description_zh?: string | null;
          job_type?: string;
          location?: string;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_type?: string | null;
          languages_required?: string[] | null;
          visa_sponsorship?: boolean | null;
          is_active?: boolean | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      gp_practices: {
        Row: {
          id: string;
          name: string;
          address: string;
          suburb: string | null;
          city: string;
          region: string;
          latitude: number | null;
          longitude: number | null;
          phone: string | null;
          website: string | null;
          healthpoint_url: string | null;
          languages_spoken: string[] | null;
          accepting_new_patients: boolean | null;
          fee_adult: number | null;
          fee_child: number | null;
          fee_csc: number | null;
          enrolled_population: number | null;
          last_scraped_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          suburb?: string | null;
          city: string;
          region: string;
          latitude?: number | null;
          longitude?: number | null;
          phone?: string | null;
          website?: string | null;
          healthpoint_url?: string | null;
          languages_spoken?: string[] | null;
          accepting_new_patients?: boolean | null;
          fee_adult?: number | null;
          fee_child?: number | null;
          fee_csc?: number | null;
          enrolled_population?: number | null;
          last_scraped_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          address?: string;
          suburb?: string | null;
          city?: string;
          region?: string;
          latitude?: number | null;
          longitude?: number | null;
          phone?: string | null;
          website?: string | null;
          healthpoint_url?: string | null;
          languages_spoken?: string[] | null;
          accepting_new_patients?: boolean | null;
          fee_adult?: number | null;
          fee_child?: number | null;
          fee_csc?: number | null;
          enrolled_population?: number | null;
          last_scraped_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      flight_alerts: {
        Row: {
          id: string;
          user_id: string;
          origin: string;
          destination: string;
          target_price: number | null;
          is_active: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          origin?: string;
          destination: string;
          target_price?: number | null;
          is_active?: boolean | null;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          origin?: string;
          destination?: string;
          target_price?: number | null;
          is_active?: boolean | null;
          created_at?: string;
        };
        Relationships: [];
      };
      flight_prices: {
        Row: {
          id: string;
          origin: string;
          destination: string;
          departure_date: string;
          airline: string | null;
          price: number;
          currency: string;
          is_direct: boolean | null;
          scraped_at: string;
        };
        Insert: {
          id?: string;
          origin: string;
          destination: string;
          departure_date: string;
          airline?: string | null;
          price: number;
          currency?: string;
          is_direct?: boolean | null;
          scraped_at?: string;
        };
        Update: {
          origin?: string;
          destination?: string;
          departure_date?: string;
          airline?: string | null;
          price?: number;
          currency?: string;
          is_direct?: boolean | null;
          scraped_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
