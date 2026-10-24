-- HavenSwap Seed Data
-- Comprehensive realistic data for local development and Supabase deployment
-- Featured cities: Bhopal, Goa, Jaipur, Bengaluru

-- AMENITIES MASTER
INSERT INTO public.amenities (slug, name, category, icon) VALUES
('wifi', 'High-Speed Wi-Fi', 'essential', 'Wifi'),
('air_conditioning', 'Air Conditioning', 'essential', 'AirVent'),
('dedicated_workspace', 'Dedicated Workspace', 'work', 'Briefcase'),
('swimming_pool', 'Private Swimming Pool', 'luxury', 'Waves'),
('kitchen', 'Chef Kitchen', 'dining', 'Utensils'),
('washing_machine', 'Washing Machine', 'essential', 'Shirt'),
('free_parking', 'Free On-Premises Parking', 'parking', 'Car'),
('power_backup', '100% Inverter / Power Backup', 'essential', 'Zap'),
('lake_view', 'Panoramic Lake View', 'view', 'Compass'),
('beach_access', 'Direct Beach Access', 'view', 'Palmtree'),
('terrace_garden', 'Rooftop Terrace Garden', 'outdoor', 'Flower2'),
('pet_friendly', 'Pet Friendly', 'rules', 'Dog')
ON CONFLICT (slug) DO NOTHING;

-- SUBSCRIPTION PLANS
INSERT INTO public.subscription_plans (name, slug, price_monthly_inr, price_annual_inr, listing_limit, monthly_booking_requests, features, is_active) VALUES
('Free Explorer', 'free', 0, 0, 1, 2, '["Browse all verified homes", "1 active home listing", "Basic messaging", "Standard support"]'::jsonb, true),
('Standard Member', 'standard', 799, 7990, 2, 8, '["Verified Member Badge", "Up to 2 active home listings", "Direct host-guest messaging", "5% bonus credits on hosting", "Priority customer care"]'::jsonb, true),
('Premium Concierge', 'premium', 1499, 14990, 5, 999, '["Elite Verification Status", "Unlimited booking requests", "Dedicated travel concierge", "Emergency stay rebooking guarantee", "10% bonus credits on hosting", "Early access to new curated homes"]'::jsonb, true)
ON CONFLICT (slug) DO NOTHING;

-- LEGAL DOCUMENT VERSIONS
INSERT INTO public.legal_document_versions (document_type, version, title, content_markdown, effective_date, is_current) VALUES
('terms', 'v1.0', 'HavenSwap Platform Terms of Service', '# HavenSwap Terms of Service\n\nEffective Date: October 2026\n\nWelcome to HavenSwap. By creating an account, browsing listings, or exchanging stays, you agree to these Terms.\n\n1. Community Standards: Members exchange access to primary or authorized secondary residences in good faith.\n2. Non-Reciprocal Credits: Credits are non-negotiable platform utility units without fiat cash value and cannot be redeemed for fiat currency.\n3. Exact Address Privacy: The physical address of any listing is shielded until a reservation request is mutually accepted.\n4. Liability & Insurance: Hosts and guests must verify local housing society bylaws and possess adequate homeowners/renters insurance.', '2026-10-01', true),
('privacy_policy', 'v1.0', 'HavenSwap Privacy & Data Protection Policy (DPDP Act 2023 Compliant)', '# HavenSwap Privacy Policy\n\nComplying with India Digital Personal Data Protection Act (DPDP) 2023.\n\n1. Purpose Limitation: Personal data including name, email, and location is collected solely for platform account management and stay facilitation.\n2. Identity Verification: Identification documents submitted for member verification are stored in encrypted private buckets with strict role-based access. Documents are never exposed on public URLs.\n3. Consent & Erasure: You may request data export or account erasure at any time via your Account Settings.\n4. No Sale of Data: We never sell or monetize member data to advertisers.', '2026-10-01', true),
('cancellation_policy', 'v1.0', 'HavenSwap Fair Exchange Cancellation Policy', '# Cancellation & Refund Policy\n\n1. Flexible Tier: Cancel up to 7 days before check-in for a 100% refund of reserved credits.\n2. Moderate Tier: Cancel between 3 and 7 days prior to check-in for a 75% refund of reserved credits.\n3. Strict Tier: Cancel within 72 hours of check-in for a 50% refund, with remaining credits awarded to the host as compensation for blocked calendar dates.\n4. Force Majeure: In the event of documented natural disasters or verified travel emergencies, Platform Support will mediate a fair full refund.', '2026-10-01', true)
ON CONFLICT (document_type, version) DO NOTHING;
