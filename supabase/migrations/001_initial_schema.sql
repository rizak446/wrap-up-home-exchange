-- HavenSwap Database Schema (PostgreSQL for Supabase)
-- Initial Schema Migration: 28 Core Entities with Constraints, Foreign Keys & Indexes

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    country TEXT NOT NULL DEFAULT 'India',
    city TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    identity_verified BOOLEAN NOT NULL DEFAULT FALSE,
    property_verified BOOLEAN NOT NULL DEFAULT FALSE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'host', 'moderator', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. USER ROLES
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('member', 'host', 'moderator', 'admin')),
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    granted_by UUID REFERENCES public.profiles(id),
    UNIQUE (user_id, role)
);

-- 3. USER VERIFICATIONS (Identity verification records)
CREATE TABLE IF NOT EXISTS public.user_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('passport', 'driving_license', 'voter_id', 'digilocker')),
    document_ref TEXT NOT NULL, -- Private storage object key (NOT public URL)
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('not_started', 'pending', 'under_review', 'verified', 'rejected', 'expired')),
    reviewer_id UUID REFERENCES public.profiles(id),
    review_notes TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. AMENITIES MASTER
CREATE TABLE IF NOT EXISTS public.amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT NOT NULL
);

-- 5. PROPERTIES (Home listings)
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'villa', 'independent_house', 'penthouse', 'studio', 'cottage')),
    bedrooms INTEGER NOT NULL CHECK (bedrooms >= 0),
    beds INTEGER NOT NULL CHECK (beds >= 1),
    bathrooms NUMERIC(3,1) NOT NULL CHECK (bathrooms >= 0.5),
    max_guests INTEGER NOT NULL CHECK (max_guests >= 1),
    square_feet INTEGER,
    floor_number INTEGER,
    country TEXT NOT NULL DEFAULT 'India',
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    neighbourhood TEXT NOT NULL,
    postal_code TEXT,
    exact_address TEXT NOT NULL, -- PROTECTED: Revealed only to confirmed guests
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    credits_per_night INTEGER NOT NULL CHECK (credits_per_night >= 10),
    min_stay_nights INTEGER NOT NULL DEFAULT 1 CHECK (min_stay_nights >= 1),
    max_stay_nights INTEGER NOT NULL DEFAULT 30 CHECK (max_stay_nights >= min_stay_nights),
    advance_booking_days INTEGER NOT NULL DEFAULT 180,
    house_rules TEXT,
    check_in_start TEXT NOT NULL DEFAULT '14:00',
    check_out_end TEXT NOT NULL DEFAULT '11:00',
    cleaning_expectations TEXT,
    pet_policy TEXT NOT NULL DEFAULT 'not_allowed' CHECK (pet_policy IN ('allowed', 'not_allowed', 'on_request')),
    smoking_policy TEXT NOT NULL DEFAULT 'forbidden' CHECK (smoking_policy IN ('forbidden', 'allowed_outdoors', 'permitted')),
    status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('draft', 'pending_verification', 'pending_review', 'published', 'rejected', 'suspended', 'archived')),
    verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PROPERTY IMAGES
CREATE TABLE IF NOT EXISTS public.property_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_cover BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PROPERTY AMENITIES
CREATE TABLE IF NOT EXISTS public.property_amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    amenity_id UUID NOT NULL REFERENCES public.amenities(id) ON DELETE CASCADE,
    UNIQUE (property_id, amenity_id)
);

-- 8. PROPERTY AVAILABILITY CALENDAR
CREATE TABLE IF NOT EXISTS public.property_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    calendar_date DATE NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    is_blocked_by_host BOOLEAN NOT NULL DEFAULT FALSE,
    booking_id UUID,
    UNIQUE (property_id, calendar_date)
);

-- 9. PROPERTY VERIFICATIONS
CREATE TABLE IF NOT EXISTS public.property_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    verification_type TEXT NOT NULL CHECK (verification_type IN ('utility_bill', 'society_noc', 'registry_deed', 'video_walkthrough')),
    proof_ref TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewer_id UUID REFERENCES public.profiles(id),
    review_notes TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. BOOKINGS
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_id UUID NOT NULL REFERENCES public.profiles(id),
    host_id UUID NOT NULL REFERENCES public.profiles(id),
    property_id UUID NOT NULL REFERENCES public.properties(id),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    nights INTEGER NOT NULL CHECK (nights >= 1),
    credits_per_night INTEGER NOT NULL CHECK (credits_per_night >= 1),
    total_credits INTEGER NOT NULL CHECK (total_credits >= 1),
    platform_fee_credits INTEGER NOT NULL DEFAULT 10,
    guest_count INTEGER NOT NULL CHECK (guest_count >= 1),
    status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN (
        'requested', 'accepted', 'confirmed', 'checked_in', 'completed',
        'declined', 'cancelled', 'expired', 'disputed'
    )),
    cancellation_policy_version TEXT NOT NULL DEFAULT 'standard_v1',
    host_notes TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (check_out > check_in)
);

-- 11. BOOKING GUESTS
CREATE TABLE IF NOT EXISTS public.booking_guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    guest_email TEXT,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE
);

-- 12. CREDIT ACCOUNTS (Cached balance summary with constraints)
CREATE TABLE IF NOT EXISTS public.credit_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    available_balance INTEGER NOT NULL DEFAULT 150 CHECK (available_balance >= 0),
    pending_balance INTEGER NOT NULL DEFAULT 0 CHECK (pending_balance >= 0),
    reserved_balance INTEGER NOT NULL DEFAULT 0 CHECK (reserved_balance >= 0),
    lifetime_earned INTEGER NOT NULL DEFAULT 150,
    lifetime_spent INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. CREDIT TRANSACTIONS (Authoritative Immutable Ledger)
CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id),
    transaction_type TEXT NOT NULL CHECK (transaction_type IN (
        'welcome_bonus', 'hosting_reward', 'booking_reservation',
        'booking_settlement', 'booking_cancellation_reversal',
        'admin_adjustment', 'promotional_reward', 'expiry'
    )),
    amount INTEGER NOT NULL, -- Positive for credits added, negative for credits deducted
    balance_after INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'reversed', 'failed')),
    description TEXT NOT NULL,
    reference_code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. CREDIT RESERVATIONS (Escrow Hold during stay request)
CREATE TABLE IF NOT EXISTS public.credit_reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL CHECK (amount > 0),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'released', 'settled', 'expired')),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. SUBSCRIPTION PLANS
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    price_monthly_inr INTEGER NOT NULL DEFAULT 0,
    price_annual_inr INTEGER NOT NULL DEFAULT 0,
    listing_limit INTEGER NOT NULL DEFAULT 1,
    monthly_booking_requests INTEGER NOT NULL DEFAULT 3,
    features JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 16. SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'past_due', 'canceled')),
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. PAYMENT RECORDS
CREATE TABLE IF NOT EXISTS public.payment_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    subscription_id UUID REFERENCES public.subscriptions(id),
    provider TEXT NOT NULL CHECK (provider IN ('razorpay', 'stripe')),
    provider_payment_id TEXT,
    provider_order_id TEXT,
    amount_inr INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'captured', 'failed', 'refunded')),
    webhook_idempotency_key TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id),
    property_id UUID NOT NULL REFERENCES public.properties(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. CONVERSATION MEMBERS
CREATE TABLE IF NOT EXISTS public.conversation_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (conversation_id, user_id)
);

-- 20. MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 21. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'booking_request', 'booking_confirmed', 'booking_declined',
        'stay_completed', 'credit_update', 'verification_update',
        'message_received', 'membership_update', 'system'
    )),
    link_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 22. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id),
    property_id UUID NOT NULL REFERENCES public.properties(id),
    reviewer_id UUID NOT NULL REFERENCES public.profiles(id),
    reviewee_id UUID NOT NULL REFERENCES public.profiles(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    host_response TEXT,
    moderation_status TEXT NOT NULL DEFAULT 'published' CHECK (moderation_status IN ('published', 'flagged', 'hidden')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (booking_id, reviewer_id)
);

-- 23. USER REPORTS
CREATE TABLE IF NOT EXISTS public.user_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id),
    reported_user_id UUID REFERENCES public.profiles(id),
    reported_property_id UUID REFERENCES public.properties(id),
    category TEXT NOT NULL CHECK (category IN ('inaccurate_listing', 'unauthorized_listing', 'harassment', 'safety_concern', 'fraud', 'other')),
    details TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'dismissed')),
    resolution_notes TEXT,
    resolved_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 24. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    booking_id UUID REFERENCES public.bookings(id),
    category TEXT NOT NULL CHECK (category IN ('booking_issue', 'credit_dispute', 'damage_claim', 'verification', 'account', 'technical')),
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    assigned_to UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 25. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id),
    target_entity TEXT NOT NULL,
    target_id TEXT NOT NULL,
    action TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 26. PLATFORM SETTINGS
CREATE TABLE IF NOT EXISTS public.platform_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES public.profiles(id)
);

-- 27. LEGAL DOCUMENT VERSIONS
CREATE TABLE IF NOT EXISTS public.legal_document_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_type TEXT NOT NULL CHECK (document_type IN ('terms', 'privacy_policy', 'cancellation_policy', 'home_exchange_agreement', 'host_responsibilities')),
    version TEXT NOT NULL,
    title TEXT NOT NULL,
    content_markdown TEXT NOT NULL,
    effective_date DATE NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (document_type, version)
);

-- 28. CONSENT RECORDS (DPDP Act 2023 & GDPR Compliance)
CREATE TABLE IF NOT EXISTS public.consent_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    version TEXT NOT NULL,
    agreed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address TEXT
);

-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_coords ON public.properties(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_bookings_guest ON public.bookings(guest_id);
CREATE INDEX IF NOT EXISTS idx_bookings_host ON public.bookings(host_id);
CREATE INDEX IF NOT EXISTS idx_bookings_property_dates ON public.bookings(property_id, check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_credit_trans_user ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at);
