# HavenSwap — Curated Home Exchange & Travel Platform

> **A modern, trust-anchored home exchange platform enabling non-reciprocal travel across India and globally through transparent, double-entry credit ledger technology.**

---

## 1. Product Overview & Vision

HavenSwap solves the central friction of traditional home exchange: **the requirement for direct reciprocal coordination**. 

In conventional home swaps, if a member in **Bhopal** wants to take a vacation in **Goa**, they must find a homeowner in Goa who simultaneously wants to travel to Bhopal on the exact same dates.

With **HavenSwap**:
1. The member in Bhopal lists their residence and hosts a verified club member, earning **nightly platform credits**.
2. Those accumulated credits are held in an **atomic escrow ledger** and can be redeemed at any time to stay at an oceanfront villa in **Goa**, a royal courtyard haveli in **Jaipur**, or an executive duplex penthouse in **Bengaluru**.
3. The Goa homeowner receives credits to use for their own subsequent journeys.
4. **Trust and Safety First:** Multi-tier verification (government ID verification, property authority verification, housing society compliance, and community reviews).
5. **Privacy by Default:** Physical residential addresses, building numbers, and host direct phone numbers are **strictly concealed** from public search. They are disclosed exclusively to confirmed guests once the host accepts the stay reservation.

---

## 2. Technology Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript (Strict Mode).
- **Styling:** Tailwind CSS with luxury travel tokens, Lucide icons, glassmorphism utilities, Plus Jakarta Sans typography.
- **Mapping:** Dynamic OpenStreetMap / Leaflet interactive map with custom credit price markers and privacy radius masking + Google Maps / Mapbox provider compatibility.
- **Database & Auth:** PostgreSQL through Supabase with Row-Level Security (RLS) policies and transaction-safe atomic stored procedures.
- **Dual-Engine Architecture:** Seamless dual-mode repository running out of the box with zero external barriers, while fully wired for instant live Supabase PostgreSQL connectivity.
- **Testing:** Vitest automated test suite covering credit calculations, booking overlap guards, double-spending prevention, and escrow payouts.

---

## 3. Database Entities & Migrations (28 Entities)

The PostgreSQL database schema is organized into 28 core normalized entities defined in `supabase/migrations/001_initial_schema.sql` and `supabase/migrations/002_functions_and_triggers.sql`:

1. `profiles` — User profile extensions to Supabase `auth.users`
2. `user_roles` — RBAC (`member`, `host`, `moderator`, `admin`)
3. `user_verifications` — Government identity records & encrypted vault references
4. `properties` — Home listings with privacy-shielded address fields
5. `property_images` — Photo gallery metadata and cover selectors
6. `property_amenities` — Join table between properties and amenities
7. `amenities` — Master catalog of home amenities
8. `property_availability` — Date availability calendar & conflict locks
9. `property_verifications` — Property authority (utility bills, registry deeds, RWA NOCs)
10. `bookings` — Stay state machine (`requested`, `accepted`, `confirmed`, `checked_in`, `completed`, `declined`, `cancelled`)
11. `booking_guests` — Guest party records
12. `credit_accounts` — User credit balance summary
13. `credit_transactions` — **Authoritative Immutable Ledger** (double-entry accounting)
14. `credit_reservations` — Atomic escrow holds during stay requests
15. `subscriptions` — Member subscription states
16. `subscription_plans` — Plan tiers (Free Explorer, Standard Member, Premium Concierge)
17. `payment_records` — Webhook-verified payment events (Razorpay / Stripe)
18. `conversations` — Booking-linked message threads
19. `conversation_members` — Thread participation & read states
20. `messages` — End-to-end booking messaging
21. `notifications` — In-app alerts for stays, verification, and ledger updates
22. `reviews` — Bilateral post-stay reviews and host responses
23. `user_reports` — Trust & safety abuse reports
24. `support_tickets` — Help desk tickets and dispute claims
25. `audit_logs` — Immutable administrative and security logs
26. `platform_settings` — Global configuration parameters
27. `legal_document_versions` — Version-controlled legal policies
28. `consent_records` — DPDP Act 2023 consent audit timestamps

---

## 4. Quickstart & Local Development

### Prerequisites
- **Node.js:** v18.18+ or v20+ (Node v24.17+ supported)
- **npm:** v9+ (or pnpm / yarn)
- **Git**

### Installation

```bash
# 1. Clone repository
git clone https://github.com/your-username/havenswap.git
cd havenswap

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Run automated test suite
npm test

# 5. Launch development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Live Supabase Setup Guide

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create a new project.
2. Choose your preferred region (e.g. `ap-south-1` Mumbai for India).

### Step 2: Apply Migrations
Navigate to the **SQL Editor** in your Supabase dashboard and run the migrations in order:
1. Run `supabase/migrations/001_initial_schema.sql` (Creates 28 entities, foreign keys, indexes).
2. Run `supabase/migrations/002_functions_and_triggers.sql` (Enables RLS policies, atomic booking and credit settlement procedures).
3. Run `supabase/seed.sql` (Seeds amenities, subscription plans, and legal document versions).

### Step 3: Configure Storage Buckets
In the Supabase **Storage** section, create two buckets:
1. `property-photos` (Public: Enabled)
   - Allow authenticated users to upload images up to 10MB.
2. `verification-vault` (Public: **DISABLED / STRICTLY PRIVATE**)
   - Only accessible via service-role keys and short-lived signed URLs for identity documents.

### Step 4: Add Supabase Credentials to `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 6. External Service Integration Guide

| Service | Purpose | Configuration Process | Status |
| :--- | :--- | :--- | :--- |
| **Supabase Auth & DB** | Authentication, PostgreSQL, Storage | Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local` | Dual-mode Active |
| **Leaflet / OpenStreetMap** | Interactive property maps & privacy radius | Ready out of the box with zero billing required | **Active & Live** |
| **Google Maps / Mapbox** | Optional commercial tiles | Provide `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local` | Compatible structure |
| **Razorpay** | Subscription billing in INR | Provide `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`; configure webhook endpoint at `/api/webhooks/razorpay` | Integration modal active |
| **Resend / SendGrid** | Transactional stay & escrow notifications | Provide `RESEND_API_KEY` and `EMAIL_FROM_ADDRESS` in `.env.local` | Structure ready |
| **DigiLocker / HyperVerge** | Indian government ID verification | Provide `IDENTITY_PROVIDER_CLIENT_ID` in `.env.local` | Manual review fallback active |

---

## 7. Testing Strategy & Execution

HavenSwap includes automated tests verifying the core financial and booking invariants:
- **Credit math:** Nightly multiplier + 5% platform safety escrow fee.
- **Double-spending prevention:** Booking requests fail immediately if available credits are insufficient.
- **Overlapping reservation lock:** Cannot double-book the same property on confirmed dates.
- **Host self-booking guard:** Hosts cannot book their own listings.
- **Atomic escrow release:** When a host declines a stay, reserved credits return immediately to the guest wallet.
- **Host settlement payout:** Completed stays credit host wallet and generate an immutable ledger entry.

To execute tests:
```bash
npm test
```

---

## 8. Security & DPDP Act 2023 Compliance Checklist

- [x] **No Hardcoded Secrets:** All secret keys use environment variables.
- [x] **Address Concealment:** Physical addresses and host phone numbers are hidden until reservation confirmation.
- [x] **Double-Entry Ledger:** Balances cannot be modified arbitrarily; all changes require an immutable transaction entry.
- [x] **Identity Vault Security:** Sensitive documents are kept in private buckets with short-lived signed URLs.
- [x] **No Aadhaar Storage:** In strict adherence to Indian Supreme Court & UIDAI guidelines, unmasked Aadhaar numbers are never collected.
- [x] **DPDP 2023 Consent:** Explicit consent recording on registration with data erasure workflows in user settings.
- [x] **Audit Trail:** All administrative decisions (approvals, credit adjustments, role updates) are recorded with actor IDs.

---

## 9. Launch Readiness & Operations Checklist for India

1. **Society / RWA Compatibility:** Members confirm residential bylaws permit non-commercial home exchange guests.
2. **GST Invoicing:** Automated GST tax invoices for subscription purchases once live payment keys are connected.
3. **Local Emergency Escalation:** Dedicated 24/7 care hotline during active member stays.
4. **Dispute Resolution:** 3-tier mediation (Direct messaging -> Platform mediation -> Escrow adjustment).

---

## 10. License

HavenSwap is distributed under the MIT License. See `LICENSE` for details.
