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
      audit_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          entity_id: string | null
          id: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          entity_id?: string | null
          id?: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          entity_id?: string | null
          id?: string
        }
        Relationships: []
      }
      generation_jobs: {
        Row: {
          created_at: string
          id: string
          kind: string
          progress: Json
          project_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          progress?: Json
          project_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          progress?: Json
          project_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "generation_jobs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          ai_generated: boolean
          alt_text_ar: string
          attribution: string
          id: string
          license: string
          project_id: string | null
          review_status: string
          source_url: string
          storage_path: string
        }
        Insert: {
          ai_generated?: boolean
          alt_text_ar?: string
          attribution?: string
          id?: string
          license?: string
          project_id?: string | null
          review_status?: string
          source_url?: string
          storage_path: string
        }
        Update: {
          ai_generated?: boolean
          alt_text_ar?: string
          attribution?: string
          id?: string
          license?: string
          project_id?: string | null
          review_status?: string
          source_url?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      presentations: {
        Row: {
          id: string
          review_status: string
          student_id: string
          version: number
        }
        Insert: {
          id?: string
          review_status?: string
          student_id: string
          version?: number
        }
        Update: {
          id?: string
          review_status?: string
          student_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "presentations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          id: string
          preferences: Json
        }
        Insert: {
          created_at?: string
          display_name?: string
          id: string
          preferences?: Json
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          preferences?: Json
        }
        Relationships: []
      }
      projects: {
        Row: {
          academic_year: string
          created_at: string
          geographic_focus: string
          grade: string
          group_code: string
          hero_key: string
          hero_path: string | null
          historical_period: string
          id: string
          illustrative: boolean
          instructions: string
          published_at: string | null
          published_data: Json | null
          school: string
          slug: string
          status: string
          summary_ar: string
          theme_family: string
          title_ar: string
          title_en: string
          topic: string
          updated_at: string
          visibility: string
        }
        Insert: {
          academic_year?: string
          created_at?: string
          geographic_focus?: string
          grade?: string
          group_code: string
          hero_key?: string
          hero_path?: string | null
          historical_period?: string
          id?: string
          illustrative?: boolean
          instructions?: string
          published_at?: string | null
          published_data?: Json | null
          school?: string
          slug?: string
          status?: string
          summary_ar?: string
          theme_family?: string
          title_ar: string
          title_en?: string
          topic: string
          updated_at?: string
          visibility?: string
        }
        Update: {
          academic_year?: string
          created_at?: string
          geographic_focus?: string
          grade?: string
          group_code?: string
          hero_key?: string
          hero_path?: string | null
          historical_period?: string
          id?: string
          illustrative?: boolean
          instructions?: string
          published_at?: string | null
          published_data?: Json | null
          school?: string
          slug?: string
          status?: string
          summary_ar?: string
          theme_family?: string
          title_ar?: string
          title_en?: string
          topic?: string
          updated_at?: string
          visibility?: string
        }
        Relationships: []
      }
      slides: {
        Row: {
          ai_generated: boolean
          body_ar: string
          id: string
          image_attribution: string
          image_license: string
          image_path: string | null
          image_position: string
          image_review: string
          image_source_url: string
          image_subject: string
          layout: string
          presentation_id: string
          review_status: string
          slide_order: number
          speaker_notes_ar: string
          title_ar: string
          versions: Json
        }
        Insert: {
          ai_generated?: boolean
          body_ar?: string
          id?: string
          image_attribution?: string
          image_license?: string
          image_path?: string | null
          image_position?: string
          image_review?: string
          image_source_url?: string
          image_subject?: string
          layout?: string
          presentation_id: string
          review_status?: string
          slide_order?: number
          speaker_notes_ar?: string
          title_ar?: string
          versions?: Json
        }
        Update: {
          ai_generated?: boolean
          body_ar?: string
          id?: string
          image_attribution?: string
          image_license?: string
          image_path?: string | null
          image_position?: string
          image_review?: string
          image_source_url?: string
          image_subject?: string
          layout?: string
          presentation_id?: string
          review_status?: string
          slide_order?: number
          speaker_notes_ar?: string
          title_ar?: string
          versions?: Json
        }
        Relationships: [
          {
            foreignKeyName: "slides_presentation_id_fkey"
            columns: ["presentation_id"]
            isOneToOne: false
            referencedRelation: "presentations"
            referencedColumns: ["id"]
          },
        ]
      }
      source_references: {
        Row: {
          id: string
          project_id: string
          title: string
          url: string
          verified: boolean
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          url: string
          verified?: boolean
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          url?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "source_references_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          display_order: number
          id: string
          name_ar: string
          name_original: string
          portrait_path: string | null
          portrait_visibility: string
          project_id: string
          public_display_name: string
          requested_slide_count: number
          slug: string
          subtopic_ar: string
        }
        Insert: {
          display_order?: number
          id?: string
          name_ar: string
          name_original: string
          portrait_path?: string | null
          portrait_visibility?: string
          project_id: string
          public_display_name: string
          requested_slide_count?: number
          slug?: string
          subtopic_ar: string
        }
        Update: {
          display_order?: number
          id?: string
          name_ar?: string
          name_original?: string
          portrait_path?: string | null
          portrait_visibility?: string
          project_id?: string
          public_display_name?: string
          requested_slide_count?: number
          slug?: string
          subtopic_ar?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      themes: {
        Row: {
          configuration: Json
          family: string
          id: string
          name: string
        }
        Insert: {
          configuration?: Json
          family: string
          id: string
          name: string
        }
        Update: {
          configuration?: Json
          family?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      public_project: { Args: { project_slug: string }; Returns: Json }
    }
    Enums: {
      app_role: "admin"
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
    Enums: {
      app_role: ["admin"],
    },
  },
} as const
