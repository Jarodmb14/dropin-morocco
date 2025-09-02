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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action: string
          admin_id: string
          at: string
          details: Json | null
          entity: string
          entity_id: string | null
          id: string
        }
        Insert: {
          action: string
          admin_id: string
          at?: string
          details?: Json | null
          entity: string
          entity_id?: string | null
          id?: string
        }
        Update: {
          action?: string
          admin_id?: string
          at?: string
          details?: Json | null
          entity?: string
          entity_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_actions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      checkins: {
        Row: {
          checked_at: string
          club_id: string
          id: string
          qr_id: string
          user_id: string
        }
        Insert: {
          checked_at?: string
          club_id: string
          id?: string
          qr_id: string
          user_id: string
        }
        Update: {
          checked_at?: string
          club_id?: string
          id?: string
          qr_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkins_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checkins_qr_id_fkey"
            columns: ["qr_id"]
            isOneToOne: false
            referencedRelation: "qr_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checkins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      club_capacity: {
        Row: {
          club_id: string
          day: string
          id: string
          max_checkins: number
        }
        Insert: {
          club_id: string
          day: string
          id?: string
          max_checkins: number
        }
        Update: {
          club_id?: string
          day?: string
          id?: string
          max_checkins?: number
        }
        Relationships: [
          {
            foreignKeyName: "club_capacity_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          address: string | null
          amenities: Json
          city: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          owner_id: string
          tier: Database["public"]["Enums"]["club_tier"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          amenities?: Json
          city: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          owner_id: string
          tier: Database["public"]["Enums"]["club_tier"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          amenities?: Json
          city?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          owner_id?: string
          tier?: Database["public"]["Enums"]["club_tier"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clubs_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          club_id: string | null
          id: string
          order_id: string
          product_id: string
          remaining_credits: number
        }
        Insert: {
          club_id?: string | null
          id?: string
          order_id: string
          product_id: string
          remaining_credits?: number
        }
        Update: {
          club_id?: string | null
          id?: string
          order_id?: string
          product_id?: string
          remaining_credits?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          status: Database["public"]["Enums"]["order_status"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["order_status"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["order_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_club: number
          amount_platform: number
          amount_total: number
          currency: string
          id: string
          order_id: string
          paid_at: string | null
          provider: string
          provider_ref: string | null
        }
        Insert: {
          amount_club: number
          amount_platform: number
          amount_total: number
          currency?: string
          id?: string
          order_id: string
          paid_at?: string | null
          provider: string
          provider_ref?: string | null
        }
        Update: {
          amount_club?: number
          amount_platform?: number
          amount_total?: number
          currency?: string
          id?: string
          order_id?: string
          paid_at?: string | null
          provider?: string
          provider_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          credits: number
          id: string
          is_active: boolean
          name: string
          price_mad: number
          tier_scope: Database["public"]["Enums"]["club_tier"][]
          type: Database["public"]["Enums"]["product_type"]
        }
        Insert: {
          created_at?: string
          credits?: number
          id?: string
          is_active?: boolean
          name: string
          price_mad: number
          tier_scope: Database["public"]["Enums"]["club_tier"][]
          type: Database["public"]["Enums"]["product_type"]
        }
        Update: {
          created_at?: string
          credits?: number
          id?: string
          is_active?: boolean
          name?: string
          price_mad?: number
          tier_scope?: Database["public"]["Enums"]["club_tier"][]
          type?: Database["public"]["Enums"]["product_type"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          country: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      qr_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string | null
          id: string
          order_item_id: string
          status: Database["public"]["Enums"]["qr_status"]
        }
        Insert: {
          code: string
          created_at?: string
          expires_at?: string | null
          id?: string
          order_item_id: string
          status?: Database["public"]["Enums"]["qr_status"]
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          order_item_id?: string
          status?: Database["public"]["Enums"]["qr_status"]
        }
        Relationships: [
          {
            foreignKeyName: "qr_codes_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      citext: {
        Args: { "": boolean } | { "": string } | { "": unknown }
        Returns: string
      }
      citext_hash: {
        Args: { "": string }
        Returns: number
      }
      citextin: {
        Args: { "": unknown }
        Returns: string
      }
      citextout: {
        Args: { "": string }
        Returns: unknown
      }
      citextrecv: {
        Args: { "": unknown }
        Returns: string
      }
      citextsend: {
        Args: { "": string }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_club_owner: {
        Args: { club: string }
        Returns: boolean
      }
      split_commission: {
        Args: { p_amount: number }
        Returns: {
          amount_club: number
          amount_platform: number
        }[]
      }
      use_qr_and_checkin: {
        Args: { p_club_id: string; p_qr_code: string }
        Returns: string
      }
    }
    Enums: {
      club_tier: "BASIC" | "STANDARD" | "PREMIUM" | "ULTRA_LUXE"
      order_status: "PENDING" | "PAID" | "CANCELLED" | "REFUNDED"
      product_type:
        | "SINGLE"
        | "PACK5"
        | "PACK10"
        | "PASS_STANDARD"
        | "PASS_PREMIUM"
      qr_status: "ACTIVE" | "USED" | "EXPIRED" | "CANCELLED"
      user_role: "CUSTOMER" | "CLUB_OWNER" | "ADMIN"
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
      club_tier: ["BASIC", "STANDARD", "PREMIUM", "ULTRA_LUXE"],
      order_status: ["PENDING", "PAID", "CANCELLED", "REFUNDED"],
      product_type: [
        "SINGLE",
        "PACK5",
        "PACK10",
        "PASS_STANDARD",
        "PASS_PREMIUM",
      ],
      qr_status: ["ACTIVE", "USED", "EXPIRED", "CANCELLED"],
      user_role: ["CUSTOMER", "CLUB_OWNER", "ADMIN"],
    },
  },
} as const
