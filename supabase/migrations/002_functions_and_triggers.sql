-- HavenSwap Database Functions, Triggers, and Row-Level-Security (RLS) Policies

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- 2. PROPERTIES POLICIES
CREATE POLICY "Published properties are viewable by everyone"
ON public.properties FOR SELECT
USING (status = 'published' OR auth.uid() = host_id);

CREATE POLICY "Hosts can insert their own properties"
ON public.properties FOR INSERT
WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their own properties"
ON public.properties FOR UPDATE
USING (auth.uid() = host_id);

-- 3. BOOKINGS POLICIES
CREATE POLICY "Users can view bookings where they are guest or host"
ON public.bookings FOR SELECT
USING (auth.uid() = guest_id OR auth.uid() = host_id);

CREATE POLICY "Guests can create booking requests"
ON public.bookings FOR INSERT
WITH CHECK (auth.uid() = guest_id);

-- 4. CREDIT ACCOUNTS & TRANSACTIONS POLICIES
CREATE POLICY "Users can view own credit account"
ON public.credit_accounts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view own credit transactions"
ON public.credit_transactions FOR SELECT
USING (auth.uid() = user_id);

-- 5. MESSAGES POLICIES
CREATE POLICY "Conversation members can view messages"
ON public.messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.conversation_members cm
    WHERE cm.conversation_id = messages.conversation_id
    AND cm.user_id = auth.uid()
  )
);

CREATE POLICY "Conversation members can send messages"
ON public.messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.conversation_members cm
    WHERE cm.conversation_id = messages.conversation_id
    AND cm.user_id = auth.uid()
  )
);

-- ======================================================================
-- ATOMIC STORED PROCEDURES (TRANSACTION-SAFE)
-- ======================================================================

-- Function 1: Request Booking with Atomic Escrow Hold
CREATE OR REPLACE FUNCTION public.fn_request_booking(
    p_guest_id UUID,
    p_property_id UUID,
    p_check_in DATE,
    p_check_out DATE,
    p_guest_count INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_property RECORD;
    v_account RECORD;
    v_nights INTEGER;
    v_total_credits INTEGER;
    v_platform_fee INTEGER;
    v_booking_id UUID;
    v_overlap_count INTEGER;
BEGIN
    -- 1. Fetch property details
    SELECT * INTO v_property FROM public.properties WHERE id = p_property_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Property not found');
    END IF;

    IF v_property.host_id = p_guest_id THEN
        RETURN jsonb_build_object('success', false, 'error', 'Hosts cannot book their own property');
    END IF;

    IF v_property.status != 'published' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Property is not published or active');
    END IF;

    -- 2. Validate dates and calculate nights
    v_nights := (p_check_out - p_check_in);
    IF v_nights < v_property.min_stay_nights THEN
        RETURN jsonb_build_object('success', false, 'error', format('Minimum stay is %s nights', v_property.min_stay_nights));
    END IF;

    -- 3. Check for overlapping confirmed or checked-in bookings
    SELECT COUNT(*) INTO v_overlap_count
    FROM public.bookings
    WHERE property_id = p_property_id
      AND status IN ('confirmed', 'checked_in')
      AND (check_in < p_check_out AND check_out > p_check_in);

    IF v_overlap_count > 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'These dates are already reserved');
    END IF;

    -- 4. Calculate total credits (Nightly credits + 5% platform safety fee, min 10 pts)
    v_platform_fee := GREATEST(10, ROUND(v_property.credits_per_night * v_nights * 0.05));
    v_total_credits := (v_property.credits_per_night * v_nights) + v_platform_fee;

    -- 5. Lock and check guest credit account
    SELECT * INTO v_account
    FROM public.credit_accounts
    WHERE user_id = p_guest_id
    FOR UPDATE;

    IF NOT FOUND OR v_account.available_balance < v_total_credits THEN
        RETURN jsonb_build_object('success', false, 'error', 'Insufficient credits balance');
    END IF;

    -- 6. Insert booking record
    INSERT INTO public.bookings (
        guest_id, host_id, property_id, check_in, check_out,
        nights, credits_per_night, total_credits, platform_fee_credits,
        guest_count, status
    ) VALUES (
        p_guest_id, v_property.host_id, p_property_id, p_check_in, p_check_out,
        v_nights, v_property.credits_per_night, v_total_credits, v_platform_fee,
        p_guest_count, 'requested'
    ) RETURNING id INTO v_booking_id;

    -- 7. Deduct from available and add to reserved (Escrow Hold)
    UPDATE public.credit_accounts
    SET available_balance = available_balance - v_total_credits,
        reserved_balance = reserved_balance + v_total_credits,
        updated_at = NOW()
    WHERE user_id = p_guest_id;

    -- 8. Record Escrow Reservation
    INSERT INTO public.credit_reservations (
        booking_id, user_id, amount, status, expires_at
    ) VALUES (
        v_booking_id, p_guest_id, v_total_credits, 'active', NOW() + INTERVAL '72 hours'
    );

    -- 9. Append to Immutable Credit Ledger
    INSERT INTO public.credit_transactions (
        user_id, booking_id, transaction_type, amount,
        balance_after, status, description, reference_code
    ) VALUES (
        p_guest_id, v_booking_id, 'booking_reservation', -v_total_credits,
        v_account.available_balance - v_total_credits, 'completed',
        format('Escrow reserve for stay at %s (%s nights)', v_property.title, v_nights),
        'RES-' || substr(md5(random()::text || clock_timestamp()::text), 1, 12)
    );

    -- 10. Send In-App Notification to Host
    INSERT INTO public.notifications (
        user_id, title, message, category, link_url
    ) VALUES (
        v_property.host_id,
        'New Booking Request!',
        format('A member requested to stay at "%s" from %s to %s.', v_property.title, p_check_in, p_check_out),
        'booking_request',
        '/dashboard/hosting'
    );

    RETURN jsonb_build_object(
        'success', true,
        'booking_id', v_booking_id,
        'total_credits', v_total_credits,
        'nights', v_nights
    );
END;
$$;

-- Function 2: Respond to Booking (Host Accept/Decline)
CREATE OR REPLACE FUNCTION public.fn_respond_to_booking(
    p_booking_id UUID,
    p_host_id UUID,
    p_action TEXT -- 'accept' or 'decline'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_booking RECORD;
    v_res RECORD;
    v_account RECORD;
BEGIN
    SELECT * INTO v_booking FROM public.bookings WHERE id = p_booking_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Booking not found');
    END IF;

    IF v_booking.host_id != p_host_id THEN
        RETURN jsonb_build_object('success', false, 'error', 'Unauthorized: You are not the host');
    END IF;

    IF v_booking.status != 'requested' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Booking request is no longer pending');
    END IF;

    IF p_action = 'accept' THEN
        UPDATE public.bookings SET status = 'confirmed', updated_at = NOW() WHERE id = p_booking_id;
        
        -- Notify Guest
        INSERT INTO public.notifications (user_id, title, message, category, link_url)
        VALUES (
            v_booking.guest_id,
            'Stay Request Confirmed! 🎉',
            'Your host has accepted your stay request! You can now view the exact property address and access instructions.',
            'booking_confirmed',
            '/dashboard/trips'
        );

        RETURN jsonb_build_object('success', true, 'status', 'confirmed');

    ELSIF p_action = 'decline' THEN
        UPDATE public.bookings SET status = 'declined', updated_at = NOW() WHERE id = p_booking_id;

        -- Release Escrow Credits back to Guest
        SELECT * INTO v_res FROM public.credit_reservations WHERE booking_id = p_booking_id AND status = 'active';
        IF FOUND THEN
            UPDATE public.credit_reservations SET status = 'released' WHERE id = v_res.id;

            UPDATE public.credit_accounts
            SET available_balance = available_balance + v_res.amount,
                reserved_balance = reserved_balance - v_res.amount,
                updated_at = NOW()
            WHERE user_id = v_booking.guest_id;

            -- Ledger entry for reversal
            SELECT * INTO v_account FROM public.credit_accounts WHERE user_id = v_booking.guest_id;
            INSERT INTO public.credit_transactions (
                user_id, booking_id, transaction_type, amount,
                balance_after, status, description, reference_code
            ) VALUES (
                v_booking.guest_id, p_booking_id, 'booking_cancellation_reversal', v_res.amount,
                v_account.available_balance, 'completed',
                'Release reserved credits for declined booking request',
                'REL-' || substr(md5(random()::text || clock_timestamp()::text), 1, 12)
            );
        END IF;

        -- Notify Guest
        INSERT INTO public.notifications (user_id, title, message, category, link_url)
        VALUES (
            v_booking.guest_id,
            'Booking Request Declined',
            'The host was unable to accommodate your request. All reserved credits have been returned to your wallet.',
            'booking_declined',
            '/dashboard/trips'
        );

        RETURN jsonb_build_object('success', true, 'status', 'declined');
    ELSE
        RETURN jsonb_build_object('success', false, 'error', 'Invalid action');
    END IF;
END;
$$;

-- Function 3: Settle Completed Stay (Transfer Credits to Host)
CREATE OR REPLACE FUNCTION public.fn_settle_booking(
    p_booking_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_booking RECORD;
    v_res RECORD;
    v_host_account RECORD;
    v_host_earnings INTEGER;
BEGIN
    SELECT * INTO v_booking FROM public.bookings WHERE id = p_booking_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Booking not found');
    END IF;

    IF v_booking.status != 'confirmed' AND v_booking.status != 'checked_in' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Booking is not in a completed/confirmable state');
    END IF;

    -- Host earns nightly credits (excluding platform fee)
    v_host_earnings := v_booking.credits_per_night * v_booking.nights;

    -- 1. Settle reservation
    UPDATE public.credit_reservations
    SET status = 'settled'
    WHERE booking_id = p_booking_id AND status = 'active';

    -- 2. Deduct from guest reserved balance
    UPDATE public.credit_accounts
    SET reserved_balance = reserved_balance - v_booking.total_credits,
        lifetime_spent = lifetime_spent + v_booking.total_credits,
        updated_at = NOW()
    WHERE user_id = v_booking.guest_id;

    -- 3. Award credits to host account
    UPDATE public.credit_accounts
    SET available_balance = available_balance + v_host_earnings,
        lifetime_earned = lifetime_earned + v_host_earnings,
        updated_at = NOW()
    WHERE user_id = v_booking.host_id;

    -- 4. Mark booking completed
    UPDATE public.bookings SET status = 'completed', updated_at = NOW() WHERE id = p_booking_id;

    -- 5. Record Host Reward Ledger Transaction
    SELECT * INTO v_host_account FROM public.credit_accounts WHERE user_id = v_booking.host_id;
    INSERT INTO public.credit_transactions (
        user_id, booking_id, transaction_type, amount,
        balance_after, status, description, reference_code
    ) VALUES (
        v_booking.host_id, p_booking_id, 'hosting_reward', v_host_earnings,
        v_host_account.available_balance, 'completed',
        format('Hosting reward for completed stay (%s nights)', v_booking.nights),
        'HST-' || substr(md5(random()::text || clock_timestamp()::text), 1, 12)
    );

    -- 6. Notifications for both parties
    INSERT INTO public.notifications (user_id, title, message, category, link_url)
    VALUES
    (v_booking.host_id, 'Stay Completed! Credits Earned', format('You earned %s credits for hosting!', v_host_earnings), 'stay_completed', '/dashboard/wallet'),
    (v_booking.guest_id, 'Stay Completed — Leave a Review', 'We hope you enjoyed your stay! Please leave a review for your host.', 'stay_completed', '/dashboard/trips');

    RETURN jsonb_build_object('success', true, 'status', 'completed', 'host_earned', v_host_earnings);
END;
$$;
