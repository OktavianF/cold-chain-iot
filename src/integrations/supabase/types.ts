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
      alerts: {
        Row: {
          acknowledged: boolean | null
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          created_at: string | null
          id: string
          message: string
          sensor_id: number | null
          severity: string
          threshold: number | null
          value: number | null
        }
        Insert: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type: string
          created_at?: string | null
          id?: string
          message: string
          sensor_id?: number | null
          severity: string
          threshold?: number | null
          value?: number | null
        }
        Update: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          created_at?: string | null
          id?: string
          message?: string
          sensor_id?: number | null
          severity?: string
          threshold?: number | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_acknowledged_by_fkey"
            columns: ["acknowledged_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_sensor_id_fkey"
            columns: ["sensor_id"]
            isOneToOne: false
            referencedRelation: "sensor_data"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts_new: {
        Row: {
          created_at: string | null
          id: number
          message: string
          sensor_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          message: string
          sensor_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          message?: string
          sensor_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_new_sensor_id_fkey"
            columns: ["sensor_id"]
            isOneToOne: false
            referencedRelation: "sensor_data_new"
            referencedColumns: ["id"]
          },
        ]
      }
      data_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          sensor_data_id: number | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          sensor_data_id?: number | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          sensor_data_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_logs_sensor_data_id_fkey"
            columns: ["sensor_data_id"]
            isOneToOne: false
            referencedRelation: "sensor_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      devices: {
        Row: {
          created_at: string | null
          device_id: string
          id: string
          is_active: boolean | null
          location: string | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_id: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_id?: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          alert_id: string | null
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          alert_id?: string | null
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          alert_id?: string | null
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "alerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sensor_data: {
        Row: {
          ammonia: number
          humidity: number
          id: number
          temperature: number
          timestamp: string | null
        }
        Insert: {
          ammonia: number
          humidity: number
          id?: number
          temperature: number
          timestamp?: string | null
        }
        Update: {
          ammonia?: number
          humidity?: number
          id?: number
          temperature?: number
          timestamp?: string | null
        }
        Relationships: []
      }
      sensor_data_new: {
        Row: {
          ammonia: number
          humidity: number
          id: number
          temperature: number
          timestamp: string | null
        }
        Insert: {
          ammonia: number
          humidity: number
          id?: number
          temperature: number
          timestamp?: string | null
        }
        Update: {
          ammonia?: number
          humidity?: number
          id?: number
          temperature?: number
          timestamp?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          ammonia_critical: number
          ammonia_warning: number
          email_notifications: boolean | null
          id: number
          max_humidity: number
          min_humidity: number
          push_notifications: boolean | null
          temperature_critical: number
          temperature_warning: number
          updated_at: string | null
        }
        Insert: {
          ammonia_critical?: number
          ammonia_warning?: number
          email_notifications?: boolean | null
          id?: number
          max_humidity?: number
          min_humidity?: number
          push_notifications?: boolean | null
          temperature_critical?: number
          temperature_warning?: number
          updated_at?: string | null
        }
        Update: {
          ammonia_critical?: number
          ammonia_warning?: number
          email_notifications?: boolean | null
          id?: number
          max_humidity?: number
          min_humidity?: number
          push_notifications?: boolean | null
          temperature_critical?: number
          temperature_warning?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          alert_frequency: number | null
          ammonia_threshold_critical: number | null
          ammonia_threshold_warning: number | null
          created_at: string | null
          email_notifications: boolean | null
          humidity_threshold_max: number | null
          humidity_threshold_min: number | null
          id: string
          push_notifications: boolean | null
          temperature_threshold_critical: number | null
          temperature_threshold_warning: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          alert_frequency?: number | null
          ammonia_threshold_critical?: number | null
          ammonia_threshold_warning?: number | null
          created_at?: string | null
          email_notifications?: boolean | null
          humidity_threshold_max?: number | null
          humidity_threshold_min?: number | null
          id?: string
          push_notifications?: boolean | null
          temperature_threshold_critical?: number | null
          temperature_threshold_warning?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          alert_frequency?: number | null
          ammonia_threshold_critical?: number | null
          ammonia_threshold_warning?: number | null
          created_at?: string | null
          email_notifications?: boolean | null
          humidity_threshold_max?: number | null
          humidity_threshold_min?: number | null
          id?: string
          push_notifications?: boolean | null
          temperature_threshold_critical?: number | null
          temperature_threshold_warning?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      users_new: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          password: string
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
          password: string
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          password?: string
          username?: string
        }
        Relationships: []
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
