import { describe, it, expect, beforeEach } from "vitest";
import { calculateNights, calculateTotalCredits } from "../src/lib/utils";
import { repository } from "../src/lib/db/repository";

describe("Credit Calculation Utilities", () => {
  it("calculates nights correctly between dates", () => {
    expect(calculateNights("2026-11-10", "2026-11-13")).toBe(3);
    expect(calculateNights("2026-12-01", "2026-12-02")).toBe(1);
    expect(calculateNights("2026-10-01", "2026-10-01")).toBe(1); // Min 1 night
  });

  it("calculates total credits with platform protection fee (5%, min 10 pts)", () => {
    // 75 pts * 3 nights = 225 base. 5% of 225 = 11.25 -> 11 pts. Total = 236 pts.
    const res1 = calculateTotalCredits(75, "2026-11-10", "2026-11-13");
    expect(res1.nights).toBe(3);
    expect(res1.platformFeeCredits).toBe(11);
    expect(res1.totalCredits).toBe(236);

    // 50 pts * 1 night = 50 base. 5% of 50 = 2.5 -> min 10 pts applied! Total = 60 pts.
    const res2 = calculateTotalCredits(50, "2026-11-10", "2026-11-11");
    expect(res2.nights).toBe(1);
    expect(res2.platformFeeCredits).toBe(10);
    expect(res2.totalCredits).toBe(60);
  });
});

describe("Transaction-Safe Booking & Escrow Operations", () => {
  it("creates an atomic booking request and holds credits in escrow", async () => {
    const guestId = "user-traveler-arjun";
    const propertyId = "prop-goa-candolim"; // 110 pts/night, host is Alisha
    const accountBefore = await repository.getCreditAccount(guestId);
    const initialAvailable = accountBefore.available_balance;

    expect(initialAvailable).toBeGreaterThanOrEqual(200);

    const checkIn = "2026-11-20";
    const checkOut = "2026-11-23"; // 3 nights -> 330 base + 17 fee = 347 pts
    const res = await repository.createBookingRequest({
      guestId,
      propertyId,
      checkIn,
      checkOut,
      guestCount: 2,
      hostNotes: "Looking forward to working remotely by Candolim beach!",
    });

    expect(res.success).toBe(true);
    expect(res.booking).toBeDefined();
    expect(res.booking?.status).toBe("requested");

    const accountAfter = await repository.getCreditAccount(guestId);
    // Reserved escrow balance must have increased
    expect(accountAfter.reserved_balance).toBeGreaterThan(0);
    expect(accountAfter.available_balance).toBe(initialAvailable - res.booking!.total_credits);
  });

  it("rejects booking when guest has insufficient credits", async () => {
    // Request a 20-night stay which exceeds available balance
    const res = await repository.createBookingRequest({
      guestId: "user-traveler-arjun",
      propertyId: "prop-goa-candolim",
      checkIn: "2026-12-01",
      checkOut: "2026-12-21", // 20 nights * 110 = 2200 pts
      guestCount: 2,
    });

    expect(res.success).toBe(false);
    expect(res.error).toMatch(/insufficient credits balance/i);
  });

  it("prevents host from booking their own property", async () => {
    const res = await repository.createBookingRequest({
      guestId: "user-goa-alisha", // Alisha owns Candolim villa
      propertyId: "prop-goa-candolim",
      checkIn: "2026-11-20",
      checkOut: "2026-11-23",
      guestCount: 1,
    });

    expect(res.success).toBe(false);
    expect(res.error).toMatch(/cannot (book|request stay at) their own property/i);
  });

  it("handles host acceptance and stay completion credit payout", async () => {
    // Create a 2-night stay at Bhopal lake villa (Rajesh) by Arjun
    const guestId = "user-traveler-arjun";
    const propertyId = "prop-bhopal-lakeview"; // 75 pts/night

    // Ensure Arjun has enough credits for this test
    await repository.adminCreditAdjustment({
      userId: guestId,
      amount: 300,
      reason: "Test setup credits",
      adminId: "user-admin-sarah",
    });

    const bookRes = await repository.createBookingRequest({
      guestId,
      propertyId,
      checkIn: "2027-01-10",
      checkOut: "2027-01-12",
      guestCount: 2,
    });
    expect(bookRes.success).toBe(true);
    const bookingId = bookRes.booking!.id;

    // Host (Rajesh) accepts the booking
    const acceptRes = await repository.respondToBooking({
      bookingId,
      hostId: "user-bhopal-rajesh",
      action: "accept",
    });
    expect(acceptRes.success).toBe(true);
    expect(acceptRes.status).toBe("confirmed");

    // Settle stay upon completion
    const hostAccountBefore = await repository.getCreditAccount("user-bhopal-rajesh");
    const initialHostBalance = hostAccountBefore.available_balance;

    const settleRes = await repository.settleBooking(bookingId);
    expect(settleRes.success).toBe(true);
    expect(settleRes.hostEarned).toBe(150); // 75 * 2 nights

    const hostAccountAfter = await repository.getCreditAccount("user-bhopal-rajesh");
    expect(hostAccountAfter.available_balance).toBe(initialHostBalance + 150);
  });

  it("refunds escrow credits to guest if host declines request", async () => {
    const guestId = "user-traveler-arjun";
    const propertyId = "prop-bhopal-lakeview";

    await repository.adminCreditAdjustment({
      userId: guestId,
      amount: 250,
      reason: "Test decline balance",
      adminId: "user-admin-sarah",
    });

    const accountBeforeBooking = await repository.getCreditAccount(guestId);
    const initialGuestBalance = accountBeforeBooking.available_balance;

    const bookRes = await repository.createBookingRequest({
      guestId,
      propertyId,
      checkIn: "2027-02-15",
      checkOut: "2027-02-17",
      guestCount: 1,
    });
    expect(bookRes.success).toBe(true);
    const bookingId = bookRes.booking!.id;

    // Host declines
    const declineRes = await repository.respondToBooking({
      bookingId,
      hostId: "user-bhopal-rajesh",
      action: "decline",
    });
    expect(declineRes.success).toBe(true);
    expect(declineRes.status).toBe("declined");

    // Escrow must be fully released back to guest available balance
    const guestAccountAfterDecline = await repository.getCreditAccount(guestId);
    expect(guestAccountAfterDecline.available_balance).toBe(initialGuestBalance);
  });
});
