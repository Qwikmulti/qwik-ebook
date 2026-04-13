// ─── Database Types ────────────────────────────────────────────────────────

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  created_at: string;
  email_sent: boolean;
  email_sent_at: string | null;
}

export interface Ebook {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  uploaded_at: string;
  is_active: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

// ─── API Response Types ────────────────────────────────────────────────────

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface SubscribeResponse {
  subscriber: Subscriber;
  emailSent: boolean;
}

export interface StatsResponse {
  totalSubscribers: number;
  emailsSent: number;
  emailsPending: number;
  activeEbook: Ebook | null;
}

// ─── Form Types ────────────────────────────────────────────────────────────

export interface SubscribeFormData {
  name: string;
  email: string;
}

export interface AdminLoginFormData {
  email: string;
  password: string;
}

export interface EbookUploadFormData {
  title: string;
  file: File;
}

// ─── Supabase Database Schema Type ────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      subscribers: {
        Row: Subscriber;
        Insert: Omit<Subscriber, "id" | "created_at" | "email_sent" | "email_sent_at">;
        Update: Partial<Omit<Subscriber, "id">>;
      };
      ebooks: {
        Row: Ebook;
        Insert: Omit<Ebook, "id" | "uploaded_at">;
        Update: Partial<Omit<Ebook, "id">>;
      };
    };
  };
}

// ─── Component Prop Types ─────────────────────────────────────────────────

export interface TestimonialItem {
  id: number;
  name: string;
  country: string;
  flag: string;
  university: string;
  text: string;
  avatar: string;
  rating: number;
}

export interface FeatureCard {
  id: number;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
  wide?: boolean;
}

export interface PaginationState {
  page: number;
  perPage: number;
  total: number;
}
