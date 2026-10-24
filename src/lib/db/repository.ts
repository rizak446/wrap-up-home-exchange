import {
  INITIAL_PROPERTIES,
  INITIAL_USERS,
  INITIAL_CREDIT_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  MASTER_AMENITIES,
} from "@/lib/data/mock-db";
import {
  Property,
  UserProfile,
  CreditAccount,
  CreditTransaction,
  Booking,
  ReviewItem,
  NotificationItem,
  ConversationItem,
  MessageItem,
  VerificationRequest,
  SupportTicket,
  AuditLog,
  PropertyStatus,
  BookingStatus,
} from "@/types";
import { calculateNights, calculateTotalCredits } from "@/lib/utils";

// In-Memory Global Persistence Store for Seamless Dev & Test Run
// In Node.js server lifecycle, this retains changes during user session
declare global {
  // eslint-disable-next-line no-var
  var __HAVEN_DB__: {
    properties: Property[];
    users: UserProfile[];
    creditAccounts: Record<string, CreditAccount>;
    creditTransactions: CreditTransaction[];
    bookings: Booking[];
    reviews: ReviewItem[];
    notifications: NotificationItem[];
    conversations: ConversationItem[];
    messages: Record<string, MessageItem[]>;
    verifications: VerificationRequest[];
    tickets: SupportTicket[];
    auditLogs: AuditLog[];
  } | undefined;
}

function getStore() {
  if (!global.__HAVEN_DB__) {
    global.__HAVEN_DB__ = {
      properties: [...INITIAL_PROPERTIES],
      users: [...INITIAL_USERS],
      creditAccounts: JSON.parse(JSON.stringify(INITIAL_CREDIT_ACCOUNTS)),
      creditTransactions: [...INITIAL_TRANSACTIONS],
      bookings: [...INITIAL_BOOKINGS],
      reviews: [...INITIAL_REVIEWS],
      notifications: [...INITIAL_NOTIFICATIONS],
      conversations: [
        {
          id: "conv-1",
          booking_id: "book-sample-1",
          property_id: "prop-jaipur-haveli",
          property: INITIAL_PROPERTIES[2],
          other_user: INITIAL_USERS[2], // Vikram
          last_message: "Looking forward to your arrival! Ring the courtyard bell.",
          last_message_at: "2026-09-09T18:00:00Z",
          unread_count: 0,
        },
      ],
      messages: {
        "conv-1": [
          {
            id: "msg-1",
            conversation_id: "conv-1",
            sender_id: "user-traveler-arjun",
            content: "Hello Vikram, we are arriving on the 10th around 3 PM by train.",
            is_read: true,
            created_at: "2026-09-08T10:00:00Z",
          },
          {
            id: "msg-2",
            conversation_id: "conv-1",
            sender_id: "user-jaipur-vikram",
            content: "Looking forward to your arrival! Ring the courtyard bell.",
            is_read: true,
            created_at: "2026-09-09T18:00:00Z",
          },
        ],
      },
      verifications: [
        {
          id: "ver-1",
          user_id: "user-traveler-arjun",
          user: INITIAL_USERS[4],
          document_type: "passport",
          document_ref: "vault/docs/arjun_passport_hash.enc",
          status: "verified",
          review_notes: "Identity verified via standard government travel document format.",
          reviewed_at: "2026-05-18T10:00:00Z",
          created_at: "2026-05-18T09:00:00Z",
        },
      ],
      tickets: [],
      auditLogs: [...INITIAL_AUDIT_LOGS],
    };
  }
  return global.__HAVEN_DB__;
}

export const repository = {
  // ===================== PROPERTIES =====================
  async getProperties(filters?: {
    city?: string;
    guests?: number;
    minCredits?: number;
    maxCredits?: number;
    propertyType?: string;
    verifiedOnly?: boolean;
    sort?: "relevance" | "price_asc" | "price_desc" | "newest";
  }): Promise<Property[]> {
    const store = getStore();
    let results = store.properties.filter((p) => p.status === "published");

    if (filters?.city && filters.city.trim() !== "") {
      const q = filters.city.toLowerCase().trim();
      results = results.filter(
        (p) =>
          p.city.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.neighbourhood.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q)
      );
    }

    if (filters?.guests && filters.guests > 1) {
      results = results.filter((p) => p.max_guests >= (filters.guests || 1));
    }

    if (filters?.minCredits !== undefined) {
      results = results.filter((p) => p.credits_per_night >= filters.minCredits!);
    }

    if (filters?.maxCredits !== undefined) {
      results = results.filter((p) => p.credits_per_night <= filters.maxCredits!);
    }

    if (filters?.propertyType && filters.propertyType !== "all") {
      results = results.filter((p) => p.property_type === filters.propertyType);
    }

    if (filters?.verifiedOnly) {
      results = results.filter((p) => p.verification_status === "verified");
    }

    if (filters?.sort === "price_asc") {
      results.sort((a, b) => a.credits_per_night - b.credits_per_night);
    } else if (filters?.sort === "price_desc") {
      results.sort((a, b) => b.credits_per_night - a.credits_per_night);
    } else if (filters?.sort === "newest") {
      results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return results;
  },

  async getAllPropertiesForAdmin(): Promise<Property[]> {
    const store = getStore();
    return store.properties;
  },

  async getPropertyById(id: string): Promise<Property | null> {
    const store = getStore();
    const prop = store.properties.find((p) => p.id === id);
    if (!prop) return null;

    // Attach host
    const host = store.users.find((u) => u.id === prop.host_id);
    return { ...prop, host };
  },

  async getPropertiesByHost(hostId: string): Promise<Property[]> {
    const store = getStore();
    return store.properties.filter((p) => p.host_id === hostId);
  },

  async createProperty(data: Partial<Property>, hostId: string): Promise<Property> {
    const store = getStore();
    const host = store.users.find((u) => u.id === hostId);

    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      host_id: hostId,
      host,
      title: data.title || "Untitled Home",
      description: data.description || "",
      property_type: data.property_type || "apartment",
      bedrooms: Number(data.bedrooms) || 1,
      beds: Number(data.beds) || 1,
      bathrooms: Number(data.bathrooms) || 1,
      max_guests: Number(data.max_guests) || 2,
      square_feet: data.square_feet ? Number(data.square_feet) : undefined,
      floor_number: data.floor_number ? Number(data.floor_number) : undefined,
      country: data.country || "India",
      state: data.state || "",
      city: data.city || "",
      neighbourhood: data.neighbourhood || "",
      postal_code: data.postal_code || "",
      exact_address: data.exact_address || "",
      latitude: data.latitude || 20.5937,
      longitude: data.longitude || 78.9629,
      credits_per_night: Number(data.credits_per_night) || 50,
      min_stay_nights: Number(data.min_stay_nights) || 1,
      max_stay_nights: Number(data.max_stay_nights) || 30,
      advance_booking_days: Number(data.advance_booking_days) || 90,
      house_rules: data.house_rules || "",
      check_in_start: data.check_in_start || "14:00",
      check_out_end: data.check_out_end || "11:00",
      cleaning_expectations: data.cleaning_expectations || "",
      pet_policy: data.pet_policy || "not_allowed",
      smoking_policy: data.smoking_policy || "forbidden",
      status: "pending_review",
      verification_status: "pending",
      images: data.images && data.images.length > 0 ? data.images : [
        {
          id: `img-${Date.now()}`,
          property_id: `prop-${Date.now()}`,
          image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
          caption: "Living space",
          display_order: 1,
          is_cover: true,
        }
      ],
      amenities: data.amenities || [MASTER_AMENITIES[0], MASTER_AMENITIES[1]],
      rating: 5.0,
      review_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    store.properties.unshift(newProperty);

    // Audit log
    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      actor_id: hostId,
      actor_name: host?.full_name || "Host",
      target_entity: "property",
      target_id: newProperty.id,
      action: "PROPERTY_CREATED",
      metadata: { title: newProperty.title, city: newProperty.city },
      created_at: new Date().toISOString(),
    });

    return newProperty;
  },

  async updatePropertyStatus(
    id: string,
    status: PropertyStatus,
    adminId: string,
    notes?: string
  ): Promise<Property | null> {
    const store = getStore();
    const prop = store.properties.find((p) => p.id === id);
    if (!prop) return null;

    prop.status = status;
    if (status === "published") {
      prop.verification_status = "verified";
    }
    prop.updated_at = new Date().toISOString();

    const admin = store.users.find((u) => u.id === adminId);

    // Audit log
    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      actor_id: adminId,
      actor_name: admin?.full_name || "Admin",
      target_entity: "property",
      target_id: id,
      action: `PROPERTY_STATUS_${status.toUpperCase()}`,
      metadata: { notes },
      created_at: new Date().toISOString(),
    });

    // Notify host
    store.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: prop.host_id,
      title: status === "published" ? "Listing Published! 🎉" : "Listing Status Update",
      message:
        status === "published"
          ? `Your home "${prop.title}" is now live and can receive booking requests.`
          : `Your listing "${prop.title}" status is now ${status}. ${notes ? `Note: ${notes}` : ""}`,
      category: "system",
      link_url: `/homes/${prop.id}`,
      is_read: false,
      created_at: new Date().toISOString(),
    });

    return prop;
  },

  // ===================== USERS & AUTH =====================
  async getUser(id: string): Promise<UserProfile | null> {
    const store = getStore();
    return store.users.find((u) => u.id === id) || null;
  },

  async getAllUsers(): Promise<UserProfile[]> {
    const store = getStore();
    return store.users;
  },

  async updateUserRole(userId: string, role: UserProfile["role"], adminId: string): Promise<void> {
    const store = getStore();
    const user = store.users.find((u) => u.id === userId);
    if (!user) return;
    user.role = role;

    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      actor_id: adminId,
      target_entity: "user",
      target_id: userId,
      action: `USER_ROLE_UPDATED_TO_${role.toUpperCase()}`,
      created_at: new Date().toISOString(),
    });
  },

  // ===================== CREDIT LEDGER & WALLET =====================
  async getCreditAccount(userId: string): Promise<CreditAccount> {
    const store = getStore();
    if (!store.creditAccounts[userId]) {
      // Create fresh default account with 150 points
      store.creditAccounts[userId] = {
        id: `acc-${userId}`,
        user_id: userId,
        available_balance: 150,
        pending_balance: 0,
        reserved_balance: 0,
        lifetime_earned: 150,
        lifetime_spent: 0,
        updated_at: new Date().toISOString(),
      };
      // Log initial welcome bonus
      store.creditTransactions.unshift({
        id: `tx-${Date.now()}`,
        user_id: userId,
        transaction_type: "welcome_bonus",
        amount: 150,
        balance_after: 150,
        status: "completed",
        description: "Welcome bonus upon registration",
        reference_code: `WEL-${Math.floor(10000000 + Math.random() * 90000000)}`,
        created_at: new Date().toISOString(),
      });
    }
    return store.creditAccounts[userId];
  },

  async getCreditTransactions(userId: string): Promise<CreditTransaction[]> {
    const store = getStore();
    return store.creditTransactions.filter((tx) => tx.user_id === userId);
  },

  async getAllCreditTransactions(): Promise<CreditTransaction[]> {
    const store = getStore();
    return store.creditTransactions;
  },

  async adminCreditAdjustment(params: {
    userId: string;
    amount: number;
    reason: string;
    adminId: string;
  }): Promise<{ success: boolean; newBalance?: number; error?: string }> {
    const store = getStore();
    const account = await this.getCreditAccount(params.userId);

    if (account.available_balance + params.amount < 0) {
      return { success: false, error: "Resulting balance cannot be negative" };
    }

    account.available_balance += params.amount;
    if (params.amount > 0) {
      account.lifetime_earned += params.amount;
    } else {
      account.lifetime_spent += Math.abs(params.amount);
    }
    account.updated_at = new Date().toISOString();

    const tx: CreditTransaction = {
      id: `tx-${Date.now()}`,
      user_id: params.userId,
      transaction_type: "admin_adjustment",
      amount: params.amount,
      balance_after: account.available_balance,
      status: "completed",
      description: `Administrative adjustment: ${params.reason}`,
      reference_code: `ADM-${Math.floor(10000000 + Math.random() * 90000000)}`,
      created_at: new Date().toISOString(),
    };
    store.creditTransactions.unshift(tx);

    const admin = store.users.find((u) => u.id === params.adminId);
    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      actor_id: params.adminId,
      actor_name: admin?.full_name || "Admin",
      target_entity: "credit_account",
      target_id: params.userId,
      action: "ADMIN_CREDIT_ADJUSTMENT",
      metadata: { amount: params.amount, reason: params.reason },
      created_at: new Date().toISOString(),
    });

    store.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: params.userId,
      title: "Credit Balance Adjusted",
      message: `Your credit wallet was adjusted by ${params.amount > 0 ? "+" : ""}${params.amount} pts. Reason: ${params.reason}`,
      category: "credit_update",
      link_url: "/dashboard/wallet",
      is_read: false,
      created_at: new Date().toISOString(),
    });

    return { success: true, newBalance: account.available_balance };
  },

  // ===================== BOOKINGS (TRANSACTION-SAFE) =====================
  async createBookingRequest(params: {
    guestId: string;
    propertyId: string;
    checkIn: string;
    checkOut: string;
    guestCount: number;
    hostNotes?: string;
  }): Promise<{ success: boolean; booking?: Booking; error?: string }> {
    const store = getStore();

    // 1. Fetch property
    const prop = store.properties.find((p) => p.id === params.propertyId);
    if (!prop) return { success: false, error: "Property not found" };

    if (prop.host_id === params.guestId) {
      return { success: false, error: "Hosts cannot request stay at their own property" };
    }

    if (prop.status !== "published") {
      return { success: false, error: "Property is not published or active" };
    }

    // 2. Validate dates & nights
    const nights = calculateNights(params.checkIn, params.checkOut);
    if (nights < prop.min_stay_nights) {
      return { success: false, error: `Minimum stay requirement is ${prop.min_stay_nights} nights` };
    }
    if (nights > prop.max_stay_nights) {
      return { success: false, error: `Maximum stay limit is ${prop.max_stay_nights} nights` };
    }

    // 3. Overlap check against confirmed or checked-in bookings
    const overlapping = store.bookings.some(
      (b) =>
        b.property_id === params.propertyId &&
        ["confirmed", "checked_in"].includes(b.status) &&
        b.check_in < params.checkOut &&
        b.check_out > params.checkIn
    );

    if (overlapping) {
      return { success: false, error: "The selected dates overlap with an existing confirmed reservation" };
    }

    // 4. Calculate total credits and fee
    const { totalCredits, platformFeeCredits } = calculateTotalCredits(
      prop.credits_per_night,
      params.checkIn,
      params.checkOut
    );

    // 5. Check and deduct credits in escrow
    const guestAccount = await this.getCreditAccount(params.guestId);
    if (guestAccount.available_balance < totalCredits) {
      return {
        success: false,
        error: `Insufficient credits balance. You need ${totalCredits} pts, but have ${guestAccount.available_balance} pts available.`,
      };
    }

    // Deduct available, hold in reserved escrow
    guestAccount.available_balance -= totalCredits;
    guestAccount.reserved_balance += totalCredits;
    guestAccount.updated_at = new Date().toISOString();

    // 6. Create booking
    const guest = store.users.find((u) => u.id === params.guestId);
    const host = store.users.find((u) => u.id === prop.host_id);

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      guest_id: params.guestId,
      guest,
      host_id: prop.host_id,
      host,
      property_id: params.propertyId,
      property: prop,
      check_in: params.checkIn,
      check_out: params.checkOut,
      nights,
      credits_per_night: prop.credits_per_night,
      total_credits: totalCredits,
      platform_fee_credits: platformFeeCredits,
      guest_count: params.guestCount,
      status: "requested",
      cancellation_policy_version: "standard_v1",
      host_notes: params.hostNotes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    store.bookings.unshift(newBooking);

    // 7. Append Escrow Ledger Entry
    store.creditTransactions.unshift({
      id: `tx-${Date.now()}`,
      user_id: params.guestId,
      booking_id: newBooking.id,
      transaction_type: "booking_reservation",
      amount: -totalCredits,
      balance_after: guestAccount.available_balance,
      status: "completed",
      description: `Escrow hold for reservation at "${prop.title}" (${nights} nights)`,
      reference_code: `RES-${Math.floor(10000000 + Math.random() * 90000000)}`,
      created_at: new Date().toISOString(),
    });

    // 8. Create or connect conversation
    let conv = store.conversations.find(
      (c) =>
        c.property_id === params.propertyId &&
        ((c.other_user?.id === prop.host_id) || (c.booking_id === newBooking.id))
    );
    if (!conv) {
      conv = {
        id: `conv-${Date.now()}`,
        booking_id: newBooking.id,
        property_id: params.propertyId,
        property: prop,
        other_user: host,
        last_message: params.hostNotes || "Requested a stay reservation",
        last_message_at: new Date().toISOString(),
        unread_count: 1,
      };
      store.conversations.unshift(conv);
      store.messages[conv.id] = [
        {
          id: `msg-${Date.now()}`,
          conversation_id: conv.id,
          sender_id: params.guestId,
          sender: guest,
          content: params.hostNotes || `Hello! I would love to request a stay from ${params.checkIn} to ${params.checkOut}.`,
          is_read: false,
          created_at: new Date().toISOString(),
        },
      ];
    }

    // 9. In-app notification to Host
    store.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: prop.host_id,
      title: "New Stay Request Received! 🏡",
      message: `${guest?.full_name || "A member"} requested to stay at "${prop.title}" from ${params.checkIn} to ${params.checkOut}.`,
      category: "booking_request",
      link_url: "/dashboard/hosting",
      is_read: false,
      created_at: new Date().toISOString(),
    });

    return { success: true, booking: newBooking };
  },

  async respondToBooking(params: {
    bookingId: string;
    hostId: string;
    action: "accept" | "decline";
  }): Promise<{ success: boolean; status?: BookingStatus; error?: string }> {
    const store = getStore();
    const booking = store.bookings.find((b) => b.id === params.bookingId);
    if (!booking) return { success: false, error: "Booking not found" };

    if (booking.host_id !== params.hostId) {
      return { success: false, error: "Unauthorized: You are not the host for this booking" };
    }

    if (booking.status !== "requested") {
      return { success: false, error: `Booking is already in status: ${booking.status}` };
    }

    if (params.action === "accept") {
      booking.status = "confirmed";
      booking.updated_at = new Date().toISOString();

      // Notify Guest that stay is confirmed and exact address is now unlocked
      store.notifications.unshift({
        id: `notif-${Date.now()}`,
        user_id: booking.guest_id,
        title: "Stay Request Confirmed! 🎉",
        message: `Your stay at "${booking.property?.title}" has been accepted! You can now view the exact address, arrival instructions, and coordinates.`,
        category: "booking_confirmed",
        link_url: "/dashboard/trips",
        is_read: false,
        created_at: new Date().toISOString(),
      });

      return { success: true, status: "confirmed" };
    } else {
      // Host declined: release escrow back to guest available balance
      booking.status = "declined";
      booking.updated_at = new Date().toISOString();

      const guestAccount = await this.getCreditAccount(booking.guest_id);
      guestAccount.available_balance += booking.total_credits;
      guestAccount.reserved_balance = Math.max(0, guestAccount.reserved_balance - booking.total_credits);
      guestAccount.updated_at = new Date().toISOString();

      // Reversal ledger entry
      store.creditTransactions.unshift({
        id: `tx-${Date.now()}`,
        user_id: booking.guest_id,
        booking_id: booking.id,
        transaction_type: "booking_cancellation_reversal",
        amount: booking.total_credits,
        balance_after: guestAccount.available_balance,
        status: "completed",
        description: `Release reserved credits for declined booking at "${booking.property?.title}"`,
        reference_code: `REL-${Math.floor(10000000 + Math.random() * 90000000)}`,
        created_at: new Date().toISOString(),
      });

      // Notify Guest
      store.notifications.unshift({
        id: `notif-${Date.now()}`,
        user_id: booking.guest_id,
        title: "Stay Request Declined",
        message: `The host was unable to accept your request. All ${booking.total_credits} credits have been released back to your wallet.`,
        category: "booking_declined",
        link_url: "/dashboard/trips",
        is_read: false,
        created_at: new Date().toISOString(),
      });

      return { success: true, status: "declined" };
    }
  },

  async settleBooking(bookingId: string): Promise<{ success: boolean; hostEarned?: number; error?: string }> {
    const store = getStore();
    const booking = store.bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: "Booking not found" };

    if (!["confirmed", "checked_in"].includes(booking.status)) {
      return { success: false, error: "Only confirmed bookings can be settled upon completion" };
    }

    const hostEarnings = booking.credits_per_night * booking.nights;

    // 1. Release reserved escrow from guest account
    const guestAccount = await this.getCreditAccount(booking.guest_id);
    guestAccount.reserved_balance = Math.max(0, guestAccount.reserved_balance - booking.total_credits);
    guestAccount.lifetime_spent += booking.total_credits;
    guestAccount.updated_at = new Date().toISOString();

    // 2. Award earnings to host account
    const hostAccount = await this.getCreditAccount(booking.host_id);
    hostAccount.available_balance += hostEarnings;
    hostAccount.lifetime_earned += hostEarnings;
    hostAccount.updated_at = new Date().toISOString();

    // 3. Mark completed
    booking.status = "completed";
    booking.updated_at = new Date().toISOString();

    // 4. Append Hosting Reward Transaction
    store.creditTransactions.unshift({
      id: `tx-${Date.now()}`,
      user_id: booking.host_id,
      booking_id: booking.id,
      transaction_type: "hosting_reward",
      amount: hostEarnings,
      balance_after: hostAccount.available_balance,
      status: "completed",
      description: `Hosting reward for completed stay at "${booking.property?.title}" (${booking.nights} nights)`,
      reference_code: `HST-${Math.floor(10000000 + Math.random() * 90000000)}`,
      created_at: new Date().toISOString(),
    });

    // 5. Notify both parties
    store.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: booking.host_id,
      title: "Stay Completed! Credits Earned 🎉",
      message: `You earned ${hostEarnings} credits for hosting ${booking.guest?.full_name || "a member"}!`,
      category: "stay_completed",
      link_url: "/dashboard/wallet",
      is_read: false,
      created_at: new Date().toISOString(),
    });

    store.notifications.unshift({
      id: `notif-${Date.now() + 1}`,
      user_id: booking.guest_id,
      title: "Stay Completed — Review Your Experience ⭐",
      message: `We hope you loved your stay in ${booking.property?.city}! Please share a review to help verified community members.`,
      category: "stay_completed",
      link_url: "/dashboard/trips",
      is_read: false,
      created_at: new Date().toISOString(),
    });

    return { success: true, hostEarned: hostEarnings };
  },

  async cancelBooking(params: {
    bookingId: string;
    userId: string;
    reason: string;
  }): Promise<{ success: boolean; refundedCredits?: number; error?: string }> {
    const store = getStore();
    const booking = store.bookings.find((b) => b.id === params.bookingId);
    if (!booking) return { success: false, error: "Booking not found" };

    if (!["requested", "confirmed"].includes(booking.status)) {
      return { success: false, error: "This booking can no longer be cancelled" };
    }

    const isGuest = booking.guest_id === params.userId;
    const isHost = booking.host_id === params.userId;
    if (!isGuest && !isHost) {
      return { success: false, error: "Unauthorized: You are not a party to this booking" };
    }

    // Refund policy tier:
    // If cancelled when requested or by host: 100% full refund
    // If cancelled by guest when confirmed:
    // > 7 days: 100%
    // 3-7 days: 75%
    // < 72 hours: 50%
    let refundRatio = 1.0;
    if (isGuest && booking.status === "confirmed") {
      const now = new Date();
      const checkInDate = new Date(booking.check_in);
      const daysUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
      if (daysUntilCheckIn >= 7) {
        refundRatio = 1.0;
      } else if (daysUntilCheckIn >= 3) {
        refundRatio = 0.75;
      } else {
        refundRatio = 0.5;
      }
    }

    const refundedCredits = Math.round(booking.total_credits * refundRatio);
    const guestAccount = await this.getCreditAccount(booking.guest_id);

    guestAccount.available_balance += refundedCredits;
    guestAccount.reserved_balance = Math.max(0, guestAccount.reserved_balance - booking.total_credits);
    guestAccount.updated_at = new Date().toISOString();

    booking.status = "cancelled";
    booking.cancellation_reason = params.reason;
    booking.updated_at = new Date().toISOString();

    // Ledger reversal
    store.creditTransactions.unshift({
      id: `tx-${Date.now()}`,
      user_id: booking.guest_id,
      booking_id: booking.id,
      transaction_type: "booking_cancellation_reversal",
      amount: refundedCredits,
      balance_after: guestAccount.available_balance,
      status: "completed",
      description: `Cancellation refund (${Math.round(refundRatio * 100)}%) for stay at "${booking.property?.title}"`,
      reference_code: `REF-${Math.floor(10000000 + Math.random() * 90000000)}`,
      created_at: new Date().toISOString(),
    });

    return { success: true, refundedCredits };
  },

  async getBookingsByGuest(guestId: string): Promise<Booking[]> {
    const store = getStore();
    return store.bookings.filter((b) => b.guest_id === guestId);
  },

  async getBookingsByHost(hostId: string): Promise<Booking[]> {
    const store = getStore();
    return store.bookings.filter((b) => b.host_id === hostId);
  },

  async getAllBookings(): Promise<Booking[]> {
    const store = getStore();
    return store.bookings;
  },

  // ===================== REVIEWS =====================
  async getReviewsForProperty(propertyId: string): Promise<ReviewItem[]> {
    const store = getStore();
    return store.reviews.filter((r) => r.property_id === propertyId);
  },

  async submitReview(params: {
    bookingId: string;
    propertyId: string;
    reviewerId: string;
    rating: number;
    content: string;
  }): Promise<{ success: boolean; review?: ReviewItem; error?: string }> {
    const store = getStore();
    const booking = store.bookings.find((b) => b.id === params.bookingId);
    if (!booking) return { success: false, error: "Booking not found" };

    if (booking.status !== "completed") {
      return { success: false, error: "Reviews can only be submitted for completed stays" };
    }

    const existing = store.reviews.find(
      (r) => r.booking_id === params.bookingId && r.reviewer_id === params.reviewerId
    );
    if (existing) {
      return { success: false, error: "You have already reviewed this stay" };
    }

    const reviewer = store.users.find((u) => u.id === params.reviewerId);
    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      booking_id: params.bookingId,
      property_id: params.propertyId,
      reviewer_id: params.reviewerId,
      reviewer,
      reviewee_id: booking.host_id,
      rating: params.rating,
      content: params.content,
      created_at: new Date().toISOString(),
    };

    store.reviews.unshift(newReview);

    // Update property average rating
    const propReviews = store.reviews.filter((r) => r.property_id === params.propertyId);
    const avg = propReviews.reduce((sum, r) => sum + r.rating, 0) / propReviews.length;
    const prop = store.properties.find((p) => p.id === params.propertyId);
    if (prop) {
      prop.rating = Number(avg.toFixed(2));
      prop.review_count = propReviews.length;
    }

    return { success: true, review: newReview };
  },

  // ===================== MESSAGING =====================
  async getConversations(userId: string): Promise<ConversationItem[]> {
    const store = getStore();
    return store.conversations;
  },

  async getMessages(conversationId: string): Promise<MessageItem[]> {
    const store = getStore();
    return store.messages[conversationId] || [];
  },

  async sendMessage(conversationId: string, senderId: string, content: string): Promise<MessageItem> {
    const store = getStore();
    const sender = store.users.find((u) => u.id === senderId);

    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: senderId,
      sender,
      content,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    if (!store.messages[conversationId]) {
      store.messages[conversationId] = [];
    }
    store.messages[conversationId].push(newMsg);

    const conv = store.conversations.find((c) => c.id === conversationId);
    if (conv) {
      conv.last_message = content;
      conv.last_message_at = newMsg.created_at;
    }

    return newMsg;
  },

  // ===================== NOTIFICATIONS =====================
  async getNotifications(userId: string): Promise<NotificationItem[]> {
    const store = getStore();
    return store.notifications.filter((n) => n.user_id === userId);
  },

  async markNotificationRead(id: string): Promise<void> {
    const store = getStore();
    const n = store.notifications.find((item) => item.id === id);
    if (n) n.is_read = true;
  },

  // ===================== VERIFICATIONS =====================
  async submitVerification(params: {
    userId: string;
    documentType: VerificationRequest["document_type"];
    documentRef: string;
  }): Promise<VerificationRequest> {
    const store = getStore();
    const user = store.users.find((u) => u.id === params.userId);

    const req: VerificationRequest = {
      id: `ver-${Date.now()}`,
      user_id: params.userId,
      user,
      document_type: params.documentType,
      document_ref: params.documentRef,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    store.verifications.unshift(req);
    return req;
  },

  async getAllVerifications(): Promise<VerificationRequest[]> {
    const store = getStore();
    return store.verifications;
  },

  async adminReviewVerification(params: {
    verificationId: string;
    status: VerificationRequest["status"];
    reviewNotes: string;
    adminId: string;
  }): Promise<void> {
    const store = getStore();
    const ver = store.verifications.find((v) => v.id === params.verificationId);
    if (!ver) return;

    ver.status = params.status;
    ver.review_notes = params.reviewNotes;
    ver.reviewed_at = new Date().toISOString();

    const user = store.users.find((u) => u.id === ver.user_id);
    if (user && params.status === "verified") {
      user.identity_verified = true;
    }

    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      actor_id: params.adminId,
      target_entity: "verification",
      target_id: params.verificationId,
      action: `VERIFICATION_${params.status.toUpperCase()}`,
      metadata: { reviewNotes: params.reviewNotes },
      created_at: new Date().toISOString(),
    });

    store.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: ver.user_id,
      title: params.status === "verified" ? "Identity Verified! 🛡️" : "Verification Update",
      message:
        params.status === "verified"
          ? "Congratulations! Your identity document has been verified. You now have the Verified Member badge."
          : `Verification status updated: ${params.status}. Reason: ${params.reviewNotes}`,
      category: "verification_update",
      link_url: "/dashboard/verification",
      is_read: false,
      created_at: new Date().toISOString(),
    });
  },

  // ===================== ADMIN KPIS & AUDIT =====================
  async getAdminKPIs() {
    const store = getStore();
    const totalUsers = store.users.length;
    const verifiedMembers = store.users.filter((u) => u.identity_verified).length;
    const activeListings = store.properties.filter((p) => p.status === "published").length;
    const pendingListings = store.properties.filter((p) => p.status === "pending_review").length;
    const pendingVerifications = store.verifications.filter((v) => v.status === "pending").length;
    const totalBookings = store.bookings.length;
    const totalTransactions = store.creditTransactions.length;

    return {
      totalUsers,
      verifiedMembers,
      activeListings,
      pendingListings,
      pendingVerifications,
      totalBookings,
      totalTransactions,
    };
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const store = getStore();
    return store.auditLogs;
  },
};
