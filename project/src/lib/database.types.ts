export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      access_codes: {
        Row: {
          code: string
          total_accesses: number
          remaining_accesses: number
          created_at: string
          last_used_at: string | null
          is_active: boolean
        }
        Insert: {
          code: string
          total_accesses: number
          remaining_accesses: number
          created_at?: string
          last_used_at?: string | null
          is_active?: boolean
        }
        Update: {
          remaining_accesses?: number
          last_used_at?: string
        }
      }
    }
  }
}