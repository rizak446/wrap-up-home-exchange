export type UserRole = 'member' | 'host' | 'moderator' | 'admin';

export type VerificationStatus =
  | 'not_started'
  | 'pending'
  | 'under_review'
  | 'verified'
  | 'rejected'
  | 'expired';

export type PropertyStatus =
  | 'draft'
  | 'pending_verification'
  | 'pending_review'
  | 'published'
  | 'rejected'
  | 'suspended'
  | 'archived';

export type BookingStatus =
  | 'requested'
  | 'accepted'
  | 'confirmed'
  | 'checked_in'
  | 'completed'
  | 'declined'
  | 'cancelled'
  | 'expired'
  | 'disputed';

export type TransactionType =
  | 'welcome_bonus'
  | 'hosting_reward'
  | 'booking_reservation'
  | 'booking_settlement'
  | 'booking_cancellation_reversal'
  | 'admin_adjustment'
  | 'promotional_reward'
  | 'expiry';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  country: string;
  city: string;
  bio?: string;
  avatar_url?: string;
  document_type?: string;
  document_number?: string;
  document_url?: string;
  identity_verified: boolean;
  property_verified: boolean;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Amenity {
  id: string;
  slug: string;
  name: string;
  category: string;
  icon: string;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  caption?: string;
  display_order: number;
  is_cover: boolean;
}

export interface Property {
  id: string;
  host_id: string;
  host?: UserProfile;
  title: string;
  description: string;
  property_type: 'apartment' | 'villa' | 'independent_house' | 'penthouse' | 'studio' | 'cottage';
  bedrooms: number;
  beds: number;
  bathrooms: number;
  max_guests: number;
  square_feet?: number;
  floor_number?: number;
  country: string;
  state: string;
  city: string;
  neighbourhood: string;
  postal_code?: string;
  exact_address: string; // Shielded from public view!
  latitude: number;
  longitude: number;
  credits_per_night: number;
  min_stay_nights: number;
  max_stay_nights: number;
  advance_booking_days: number;
  house_rules?: string;
  check_in_start: string;
  check_out_end: string;
  cleaning_expectations?: string;
  pet_policy: 'allowed' | 'not_allowed' | 'on_request';
  smoking_policy: 'forbidden' | 'allowed_outdoors' | 'permitted';
  status: PropertyStatus;
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  images: PropertyImage[];
  amenities: Amenity[];
  rating?: number;
  review_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  guest_id: string;
  guest?: UserProfile;
  host_id: string;
  host?: UserProfile;
  property_id: string;
  property?: Property;
  check_in: string;
  check_out: string;
  nights: number;
  credits_per_night: number;
  total_credits: number;
  platform_fee_credits: number;
  guest_count: number;
  status: BookingStatus;
  cancellation_policy_version: string;
  host_notes?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface CreditAccount {
  id: string;
  user_id: string;
  available_balance: number;
  pending_balance: number;
  reserved_balance: number;
  lifetime_earned: number;
  lifetime_spent: number;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  booking_id?: string;
  transaction_type: TransactionType;
  amount: number;
  balance_after: number;
  status: 'pending' | 'completed' | 'reversed' | 'failed';
  description: string;
  reference_code: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  category: 'booking_request' | 'booking_confirmed' | 'booking_declined' | 'stay_completed' | 'credit_update' | 'verification_update' | 'message_received' | 'membership_update' | 'system';
  link_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface MessageItem {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender?: UserProfile;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface ConversationItem {
  id: string;
  booking_id?: string;
  property_id: string;
  property?: Property;
  other_user?: UserProfile;
  last_message?: string;
  last_message_at: string;
  unread_count: number;
}

export interface ReviewItem {
  id: string;
  booking_id: string;
  property_id: string;
  reviewer_id: string;
  reviewer?: UserProfile;
  reviewee_id: string;
  rating: number;
  content: string;
  host_response?: string;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  price_monthly_inr: number;
  price_annual_inr: number;
  listing_limit: number;
  monthly_booking_requests: number;
  features: string[];
  is_active: boolean;
}

export interface VerificationRequest {
  id: string;
  user_id: string;
  user?: UserProfile;
  document_type: 'passport' | 'driving_license' | 'voter_id' | 'digilocker';
  document_ref: string;
  status: VerificationStatus;
  review_notes?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  user?: UserProfile;
  booking_id?: string;
  category: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  actor_name?: string;
  target_entity: string;
  target_id: string;
  action: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}
